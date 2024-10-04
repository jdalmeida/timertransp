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

  const playAlertSound = () => {
    const audio = new Audio("/audio.mp3");
    audio.play().catch((error) => console.error("Erro ao tocar o áudio:", error));
  };

  // Função para calcular o tempo restante
  const calculateTimeRemaining = (departureTime: string): number => {
    const [hours, minutes] = departureTime.split(":").map(Number);
    const departure = new Date();
    departure.setHours(hours, minutes, 0, 0);

    const diffMs = departure.getTime() - currentTime.getTime();
    return Math.round(diffMs / 60000); // Retorna o tempo restante em minutos
  };

  // Função para formatar o tempo restante em HH:MM
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${remainingMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Atualiza a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Atualiza a cada minuto
    const timeRemaining = calculateTimeRemaining(horarioCorte);
    setTimeRemaining(timeRemaining);
    return () => clearInterval(timer);
  }, [horarioCorte]);

  // Efeito para verificar se precisa tocar o áudio
  useEffect(() => {
    if (timeRemaining === 60) {
      setTimeout(() => playAlertSound(), 100);
    } else if (timeRemaining === 30) {
      setTimeout(() => playAlertSound(), 100);
    } else if (timeRemaining === 15) {
      setTimeout(() => playAlertSound(), 100);
    }
  }, [timeRemaining]);

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
