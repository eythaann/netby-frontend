import { Err, Ok, Result } from "./utils";

describe("Result", () => {
  describe("Ok", () => {
    it("should create an Ok result", () => {
      const result = Ok<number, string>(10);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect(result.unwrap()).toBe(10);
    });
  });

  describe("Err", () => {
    it("should create an Err result", () => {
      const result = Err<number, string>("error message");
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      expect(() => result.unwrap()).toThrowError("Trying to unwrap an error");
    });
  });

  describe("Result class", () => {
    it("should handle Ok and Err correctly", () => {
      const okResult = new Result<number, string>({ ok: 10 });
      const errResult = new Result<number, string>({ err: "error message" });

      expect(okResult.isOk()).toBe(true);
      expect(okResult.isErr()).toBe(false);
      expect(okResult.unwrap()).toBe(10);

      expect(errResult.isOk()).toBe(false);
      expect(errResult.isErr()).toBe(true);
      expect(() => errResult.unwrap()).toThrowError("Trying to unwrap an error");
    });
  });
});