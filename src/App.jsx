import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [isSession, setIsSession] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const [timer, setTimer] = useState(sessionLength * 60);
  const [timeInterval, setTimeInterval] = useState(null);

  const [alarmColor, setAlarmColor] = useState({ color: "white" });
  const audioRef = useRef(null);

  const startStop = () => {
    if (isRunning) {
      clearInterval(timeInterval);
      setIsRunning(!isRunning);
    } else {
      beginCountDown();
      setIsRunning(!isRunning);
    }
  };

  const beginCountDown = () => {
    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);
    setTimeInterval(interval);
  };

  const decrementTimer = () => {
    setTimer((prev) => prev - 1);
  };

  const warning = (timer) => {
    if (timer < 61) {
      setAlarmColor({ color: "#a50d0d" });
    } else {
      setAlarmColor({ color: "white" });
    }
  };

  const buzzer = (timer) => {
    if (timer === 0) {
      audioRef.current.play();
    }
  };

  const switchTimer = (newTimer) => {
    setTimer(newTimer);
    setIsSession(!isSession);
    setAlarmColor({ color: "white" });
  };

  const resetTimer = () => {
    clearInterval(timeInterval);
    setBreakLength(5);
    setSessionLength(25);
    setIsSession(true);
    setIsRunning(false);
    setTimer(1500);
    setAlarmColor({ color: "white" });
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  useEffect(() => {
    if (timer <= 0) {
      clearInterval(timeInterval);
      if (isSession) {
        switchTimer(breakLength * 60);
      } else {
        switchTimer(sessionLength * 60);
      }
      beginCountDown();
    }
  
    warning(timer);
    buzzer(timer);
  }, [timer]);

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
      setTimer((sessionLength - 1) * 60);
      setSessionLength((prev) => prev - 1);
    }
  };

  const sessionIncrement = () => {
    if (sessionLength < 60 && !isRunning) {
      setTimer((sessionLength + 1) * 60);
      setSessionLength((prev) => prev + 1);
    }
  };

  const getDisplayTime = (seconds) => {
    let minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    let secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
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
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={breakIncrement}>
            <i className="fa fa-arrow-up fa-2x"></i>
          </button>
        </div>
        <div className="session">
          <div id="session-label">Session Length</div>
          <button id="session-decrement" onClick={sessionDecrement}>
            <i className="fa fa-arrow-down fa-2x"></i>
          </button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={sessionIncrement}>
            <i className="fa fa-arrow-up fa-2x"></i>
          </button>
        </div>
      </div>

      <div className="timer" style={alarmColor}>
        <div className="timer-wrapper">
          <div id="timer-label">{isSession ? "Session" : "Break"}</div>
          <div id="time-left">{getDisplayTime(timer)}</div>
        </div>
      </div>

      <div className="button-manage">
        <button id="start_stop" onClick={startStop}>
          <i
            className={isRunning ? "fa fa-pause fa-2x" : "fa fa-play fa-2x"}
          ></i>
        </button>
        <button id="reset" onClick={resetTimer}>
          <i className="fas fa-refresh fa-2x"></i>
        </button>
      </div>
      <audio
        id="beep"
        preload="auto"
        ref={audioRef}
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
}

export default App;
