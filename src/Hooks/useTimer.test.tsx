import { renderHook, waitFor } from "@testing-library/react";
import { describe, it } from "vitest";
import useTimer from "./useTimer";
import { act } from "react";

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("Returns a default value", () => {
    //Arrange
    const { result } = renderHook(() => useTimer());

    //Assert
    expect(result.current.seconds).toBe(0);
  });

  it("Starting the timer triggers seconds to increase", async () => {
    //Arrange
    const { result } = renderHook(() => useTimer());

    expect(result.current.seconds).toBe(0);

    //Act
    await act(async () => {
      result.current.startTimer();
      vi.advanceTimersByTimeAsync(2000);
    });

    //Assert
    waitFor(() => {
      expect(result.current.seconds).toBe(2);
    });
  });

  it("Stopping the timer stops seconds from increasing", async () => {
    //Arrange
    const { result } = renderHook(() => useTimer());

    await act(async () => {
      result.current.startTimer();
      vi.advanceTimersByTimeAsync(2000);
    });

    expect(result.current.seconds).toBe(2);

    //Act
    await act(async () => {
      result.current.stopTimer();
      vi.advanceTimersByTimeAsync(2000);
    });

    //Assert
    expect(result.current.seconds).toBe(2);
  });

  it("Resetting the timer sets it to the default value", async () => {
    //Arrange
    const { result } = renderHook(() => useTimer());

    await act(async () => {
      result.current.startTimer();
      vi.advanceTimersByTimeAsync(2000);
    });

    expect(result.current.seconds).toBe(2);

    //Act
    await act(async () => {
      result.current.stopTimer();
      result.current.resetTimer();
      vi.advanceTimersByTimeAsync(2000);
    });

    //Assert
    expect(result.current.seconds).toBe(0);
  });

  it("If more than 999 seconds has passed, the timer returns 999 seconds", async () => {
    //Arrange
    const { result } = renderHook(() => useTimer());

    //Act
    await act(async () => {
      result.current.startTimer();
      vi.advanceTimersByTimeAsync(1200000);
    });

    //Assert
    expect(result.current.seconds).toBe(999);
  });
});
