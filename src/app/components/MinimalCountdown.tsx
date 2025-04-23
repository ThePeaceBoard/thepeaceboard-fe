'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import '../styles/CountdownTimer.css';

gsap.registerPlugin(ScrollToPlugin);

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

interface MinimalCountdownProps {
  targetDate: Date | string;
}

const MinimalCountdown: React.FC<MinimalCountdownProps> = ({ targetDate }) => {
  const parsedTargetDate = new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState<Partial<TimeLeft>>(calculateTimeLeft());
  const containerRef = useRef<HTMLDivElement>(null);

  function calculateTimeLeft(): Partial<TimeLeft> {
    const now = new Date();
    const difference = parsedTargetDate.getTime() - now.getTime();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        mins: Math.floor((difference / (1000 * 60)) % 60),
        secs: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div ref={containerRef} className="flex self-end countdown-timer-minimal">
      <div className="flex flex-row pr-9 pl-9">
        <div className="time-left-mini">
          {Object.keys(timeLeft).length > 0 ? (
            Object.keys(timeLeft).map((interval, idx) => (
              <div className="time-unit-mini" key={idx}>
                <p className="time-value-mini">{timeLeft[interval as keyof TimeLeft]}</p>
                <p className="time-label-mini">{interval}</p>
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

export default MinimalCountdown; 