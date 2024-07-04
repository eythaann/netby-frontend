import { z } from "zod";
import { BaseUrlByService, Service } from "../domain";

type _Result<T, E> = { ok: T } | { err: E };

export class Result<T, E> {
  constructor(private inner: _Result<T, E>) {}

  public isOk() {
    return "ok" in this.inner;
  }

  public isErr() {
    return "err" in this.inner;
  }

  public unwrap(): T {
    if ("err" in this.inner) {
      throw new Error("Trying to unwrap an error");
    }
    return this.inner.ok;
  }
}

export function Ok<T, E>(...arg: [T]) {
  return new Result<T, E>({ ok: arg[0] });
}

export function Err<T, E>(err: E) {
  return new Result<T, E>({ err });
}

export enum AppFetchFrom {
  Json = "json",
  Text = "text",
  Void = "void",
}


export interface AppFetchOptions<T = any> {
  service: Service;
  path: string;
  method?: string;
  token?: string;
  body?: any;
  headers?: Record<string, string>;
  schema?: z.Schema<T>;
  responseType?: `${AppFetchFrom}`;
}

export async function appFetch<T>(opt: AppFetchOptions<T>): Promise<Result<T, any>> {
  const {
    service,
    path,
    method = "GET",
    body,
    headers = {},
    schema,
    responseType: from = AppFetchFrom.Json,
  } = opt;

  let cleanPath = path.startsWith("/") ? path : `/${path}`;
  let url = `${BaseUrlByService[service]}${cleanPath}`;

  try {
    let response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.ok) {
      if (from === AppFetchFrom.Void) {
        return Ok(undefined as T);
      }

      if (from === AppFetchFrom.Text) {
        return Ok(schema ? schema.parse(await response.text() as T) : await response.text() as T);
      }

      return Ok(schema ? schema.parse(await response.json()) : await response.json());
    }

    return Err(await response.text());
  } catch (error) {
    console.error("Critical error", error);
    return Err(error);
  }
}
