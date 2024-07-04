import { useEffect, useState } from "react";
import { AppFetchOptions, Err, Result, appFetch } from "./utils";

export function useToken() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    let listener = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  return token;
}

export function useFetch<T = unknown, E = unknown>(opt: AppFetchOptions) {
  const [result, setResult] = useState<Result<T, E> | null>(null);
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    setLoading(true);
    appFetch<T>(opt)
      .then(setResult)
      .catch((err) => {
        console.error(err);
        setResult(Err(err));
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  return { result, loading, refresh: () => setVersion((prev) => prev + 1) };
}
