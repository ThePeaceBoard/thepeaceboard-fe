'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import '../style/CountdownTimer.css'; // Import the CSS for styling

gsap.registerPlugin(ScrollToPlugin);

interface CountdownTimerProps {
  targetDate: Date | string;
}

type TimeLeft = {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const parsedTargetDate: Date =
    typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();
    const difference = parsedTargetDate.getTime() - now.getTime();
    let timeLeft: TimeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div ref={containerRef} className="flex self-end countdown-timer">
      <div className="flex flex-row pr-9 pl-9">
        <div className="launching-section block pr-10 content-center">
          <p className="label tracking-wider h-fit">LAUNCHING</p>
          <p className="launch-date">{parsedTargetDate.toLocaleDateString()}</p>
        </div>
        <div className="time-left">
          {Object.keys(timeLeft).length > 0 ? (
            Object.keys(timeLeft).map((interval, idx) => (
              <div className="time-unit" key={idx}>
                <p className="time-value">
                  {timeLeft[interval as keyof TimeLeft]}
                </p>
                <p className="time-label">{interval}</p>
              </div>
            ))
          ) : (
            <div className="time-unit">
              <p className="time-value">0</p>
              <p className="time-label">Time's Up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
