"use client";

import { useEffect, useState } from "react";

interface TranspItemProps {
  nomeTransp: string;
  horarioCorte: string;
}

export default function TranspItem({
  nomeTransp,
  horarioCorte,
}: TranspItemProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [timeRemaining, setTimeRemaining] = useState<number>();
  const [alertEmitted, setAlertEmitted] = useState<{ [key: string]: boolean }>({
    "60": false,
    "30": false,
    "15": false,
  });

  const playAlertSound = () => {
    const audio = new Audio("/alert.mp3");
    audio.play();
  };

  const calculateTimeRemaining = (departureTime: string): number => {
    const [hours, minutes] = departureTime.split(":").map(Number);
    const departure = new Date();
    departure.setHours(hours, minutes, 0, 0);

    const diffMs = departure.getTime() - currentTime.getTime();
    return Math.round(diffMs / 60000); // Retorna o tempo restante em minutos
  };
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${remainingMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timeRemaining = calculateTimeRemaining(horarioCorte);
    setTimeRemaining(timeRemaining);
    if (timeRemaining === 60 && !alertEmitted["60"]) {
      playAlertSound();
      alert(`Faltam 60 minutos para a saída da ${nomeTransp}`);
      setAlertEmitted((prev) => ({ ...prev, "60": true }));
    } else if (timeRemaining === 30 && !alertEmitted["30"]) {
      playAlertSound();
      alert(`Faltam 30 minutos para a saída da ${nomeTransp}`);
      setAlertEmitted((prev) => ({ ...prev, "30": true }));
    } else if (timeRemaining === 15 && !alertEmitted["15"]) {
      playAlertSound();
      alert(`Faltam 15 minutos para a saída da ${nomeTransp}`);
      setAlertEmitted((prev) => ({ ...prev, "15": true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime, alertEmitted, horarioCorte, nomeTransp]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
      <h1 className="text-2xl font-semibold text-gray-800">{nomeTransp}</h1>
      {timeRemaining !== undefined && timeRemaining >= 0 ? (
        <h2 className="text-xl text-green-600 mt-2">
          {formatTime(timeRemaining)} para a saída
        </h2>
      ) : (
        <h2 className="text-xl text-red-500 mt-2">A transportadora já saiu.</h2>
      )}
    </div>
  );
}
