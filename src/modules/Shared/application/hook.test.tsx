import { renderHook } from "@testing-library/react";
import { useToken } from "./hooks";

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, any> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: any) => (store[key] = value),
    removeItem: (key: string) => delete store[key],
    clear: () => (store = {}),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock addEventListener and removeEventListener
const addEventListenerSpy = jest.spyOn(window, "addEventListener");
const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

describe("useToken", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    addEventListenerSpy.mockClear();
    removeEventListenerSpy.mockClear();
  });

  it("should initialize with the token from localStorage", () => {
    mockLocalStorage.setItem("token", "test-token");

    const { result } = renderHook(() => useToken());

    expect(result.current).toBe("test-token");
  });

  it("should clean up the event listener on unmount", () => {
    const { unmount } = renderHook(() => useToken());

    expect(addEventListenerSpy).toHaveBeenCalledWith("storage", expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("storage", expect.any(Function));
  });
});
