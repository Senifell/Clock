import React, { useState, useEffect } from "react";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTimer } from 'react-timer-hook';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [isSession, setIsSession] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const getExpiryTimestamp = (minutes) => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + minutes * 60);
    return time;
  };

  const {
    seconds,
    minutes,
    resume: startTimer,
    pause: pauseTimer,
    restart: restartTimer,
  } = useTimer({
    expiryTimestamp: getExpiryTimestamp(sessionLength),
    onExpire: () => {
      setIsSession(prev => !prev);
      const newExpiry = isSession ? getExpiryTimestamp(breakLength) : getExpiryTimestamp(sessionLength);
      restartTimer(newExpiry); 
    },
  });

  useEffect(() => {
    if (isRunning) {
      startTimer();
    } else {
      pauseTimer();
    }
  }, [isRunning, startTimer, pauseTimer]);

  const breakDecrement = () => {
    if (breakLength > 1 && !isRunning && isSession) {
      setBreakLength((prev) => prev - 1);
    }
  };

  const breakIncrement = () => {
    if (breakLength < 60 && !isRunning && isSession) {
      setBreakLength((prev) => prev + 1);
    }
  };

  const sessionDecrement = () => {
    if (sessionLength > 1 && !isRunning) {
      restartTimer(getExpiryTimestamp(sessionLength - 1)); 
      setSessionLength((prev) => prev - 1);
    }
  };

  const sessionIncrement = () => {
    if (sessionLength < 60 && !isRunning) {
      restartTimer(getExpiryTimestamp(sessionLength + 1)); 
      setSessionLength((prev) => prev + 1);
    }
  };

  const startStop = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setIsSession(true);
    setIsRunning(false);
    restartTimer(getExpiryTimestamp(25));
  };

  const getDisplayTime = (minutes, seconds) => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="container">
      <h2 className="title">25 + 5 Clock</h2>
      <div className="settings">
        <div className="break">
          <div id="break-label">Break Length</div>
          <button id="break-decrement" onClick={breakDecrement}>
            <i className="fa fa-arrow-down fa-2x"></i>
          </button>
          <span>{breakLength}</span>
          <button id="break-increment" onClick={breakIncrement}>
            <i className="fa fa-arrow-up fa-2x"></i>
          </button>
        </div>
        <div className="session">
          <div id="session-label">Session Length</div>
          <button id="session-decrement" onClick={sessionDecrement}>
            <i className="fa fa-arrow-down fa-2x"></i>
          </button>
          <span>{sessionLength}</span>
          <button id="session-increment" onClick={sessionIncrement}>
            <i className="fa fa-arrow-up fa-2x"></i>
          </button>
        </div>
      </div>

      <div className="timer">
        <div className="timer-wrapper">
          <div id="timer-label">{isSession ? 'Session' : 'Break'}</div>
          <div id="time-left">{getDisplayTime(minutes, seconds)}</div>
        </div>
      </div>

      <div className="button-manage">
        <button id="start_stop" onClick={startStop}>
          <i className={isRunning ? "fa fa-pause fa-2x" : "fa fa-play fa-2x"}></i>
        </button>
        <button id="reset" onClick={reset}>
          <i className="fas fa-refresh fa-2x"></i>
        </button>
      </div>
    </div>
  );
}

export default App;
