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
  const [onTime, setOnTime] = useState<boolean>(false);

  const playAlertSound = () => {
    const audio = new Audio("/audio.mp3");
    audio.volume = 2;
    audio.play().catch((error) => console.error("Erro ao tocar o áudio:", error));
  };

  // Função para formatar o tempo restante em HH:MM
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${remainingMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Função para calcular o tempo restante
  const calculateTimeRemaining = (departureTime: string): number => {
    const [hours, minutes] = departureTime.split(":").map(Number);
    const departure = new Date();
    departure.setHours(hours, minutes, 0, 0);

    const diffMs = departure.getTime() - new Date().getTime(); // Comparando com o tempo atual
    return Math.round(diffMs / 60000); // Retorna o tempo restante em minutos
  };

  useEffect(() => {
    // Atualiza o tempo restante e o tempo atual a cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      const timeRemaining = calculateTimeRemaining(horarioCorte);
      setTimeRemaining(timeRemaining);
    }, 60000); // Atualiza a cada minuto (60000ms = 1 minuto)

    // Calcular imediatamente na primeira renderização
    setTimeRemaining(calculateTimeRemaining(horarioCorte));

    return () => clearInterval(timer);
  }, [horarioCorte]);

  // Efeito para verificar se precisa tocar o áudio
  useEffect(() => {
    if (timeRemaining === 60 || timeRemaining === 30 || timeRemaining === 15) {
      setTimeout(() => {
        playAlertSound();
        setOnTime(true);
        setTimeout(()=> setOnTime(false), 20000)
      }, 100);
    }
  }, [timeRemaining]);

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">{nomeTransp} | {horarioCorte}</h1>
        {timeRemaining !== undefined && timeRemaining >= 0 ? (
          <h2 className="text-xl text-green-600 mt-2">
            {formatTime(timeRemaining)} para a saída
          </h2>
        ) : (
          <h2 className="text-xl text-red-500 mt-2">A transportadora já saiu.</h2>
        )}
      </div>
        {onTime && (
          <div className={`h-[99dvh] absolute z-[-${horarioCorte.replace(':', '')}] left-0 top-0 w-[96%] mx-auto p-2 bg-red-600 rounded-xl`}>
            <div className="h-full bg-white shadow-lg flex flex-col animate-pulse justify-center items-center rounded-lg p-6">
              <h1 className="text-9xl font-black text-black">
                {nomeTransp}
              </h1>
              <h1 className="text-4xl font-black text-red-600">
                Faltam {formatTime(timeRemaining!)} para a transportadora sair!
              </h1>
            </div>
            <p className="hidden">{currentTime.toLocaleTimeString()}</p>
          </div>
        )}
      </>
  );
}