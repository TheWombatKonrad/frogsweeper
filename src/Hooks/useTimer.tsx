import { useCallback, useEffect, useState } from "react";

function useTimer() {
  const [seconds, setSeconds] = useState<number>(0);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [startingTime, setStartingTime] = useState<Date>();
  const [timeoutId, setTimeoutId] = useState<any>();

  const passTime = useCallback(() => {
    const timeoutId = setTimeout(() => {
      const secondsPassed = Math.round(
        Math.abs(getCurrentTime() - startingTime!.getTime()) / 1000
      );
      setSeconds(secondsPassed > 999 ? 999 : secondsPassed);
    }, 1000);

    setTimeoutId(timeoutId);
  }, [startingTime]);

  useEffect(() => {
    if (timerStarted) {
      passTime();
    }
  }, [seconds, timerStarted, passTime]);

  const getCurrentTime = () => {
    const currentTime = new Date();
    return currentTime.getTime();
  };

  const startTimer = () => {
    setTimerStarted(true);
    setStartingTime(new Date());
  };

  const stopTimer = () => {
    setTimerStarted(false);
    clearTimeout(timeoutId);
  };

  const resetTimer = () => {
    setSeconds(0);
  };

  return { seconds, startTimer, stopTimer, resetTimer } as const;
}

export default useTimer;
