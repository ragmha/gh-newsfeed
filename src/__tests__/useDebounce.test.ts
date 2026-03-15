import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("debounces value updates", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 100 } },
    );

    expect(result.current).toBe("a");

    // Update value
    rerender({ value: "b", delay: 100 });

    // Should still be old value before timeout
    expect(result.current).toBe("a");

    // Wait for debounce to settle
    await act(async () => {
      await new Promise((r) => setTimeout(r, 150));
    });

    expect(result.current).toBe("b");
  });

  it("cancels pending update when value changes again", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: "first" } },
    );

    rerender({ value: "second" });

    // Change again before debounce fires
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    rerender({ value: "third" });

    // Wait for debounce
    await act(async () => {
      await new Promise((r) => setTimeout(r, 150));
    });

    // Should skip "second" and go straight to "third"
    expect(result.current).toBe("third");
  });
});
