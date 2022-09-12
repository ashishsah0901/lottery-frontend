import React from "react";
import CountDown from "react-countdown";

interface Props {
  expiration: number;
}

interface TimerParams {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const CountDownTimer = ({ expiration }: Props) => {
  const renderer = ({ hours, minutes, seconds, completed }: TimerParams) => {
    if (completed) {
      return (
        <div>
          <h2 className="text-white text-xl text-center animate-bounce">Ticket Sales have now CLOSED for this draw.</h2>
          <div className="flex space-x-6">
            <div className="flex-1">
              <div className="countdownButton animate-pulse">{hours}</div>
              <div className="countdownLabel">hours</div>
            </div>
            <div className="flex-1">
              <div className="countdownButton animate-pulse">{minutes}</div>
              <div className="countdownLabel">minutes</div>
            </div>
            <div className="flex-1">
              <div className="countdownButton animate-pulse">{seconds}</div>
              <div className="countdownLabel">seconds</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h3 className="text-white text-sm mb-2 italic">Time Remaining</h3>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="countdownButton">{hours}</div>
              <div className="countdownLabel">hours</div>
            </div>
            <div className="flex-1">
              <div className="countdownButton">{minutes}</div>
              <div className="countdownLabel">minutes</div>
            </div>
            <div className="flex-1">
              <div className="countdownButton">{seconds}</div>
              <div className="countdownLabel">seconds</div>
            </div>
          </div>
        </div>
      );
    }
  };
  return (
    <div>
      <CountDown date={new Date(expiration * 1000)} renderer={renderer} />
    </div>
  );
};

export default CountDownTimer;
