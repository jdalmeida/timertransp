"use client"
import TranspItem from "@/components/TranspItem";
import { useEffect, useState } from "react";

interface Carrier {
  name: string;
  departureTime: string; // Hora de saída no formato 'HH:mm'
}

// Lista de transportadoras e horários de saída
const carriers: Carrier[] = [
  { name: 'Fritz Rápido', departureTime: '11:45' },
  { name: 'TW', departureTime: '17:00' },
  { name: 'São Miguel', departureTime: '18:30' },
  { name: 'City', departureTime: '18:45' },
  { name: 'Fritz', departureTime: '19:30' },
  { name: 'Leomar', departureTime: '20:00' },
  { name: 'Santa Cruz', departureTime: '20:30' },
];

const convertToDate = (time: string, now: Date): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(now);
  date.setHours(hours, minutes, 0, 0); // Define o horário da transportadora
  return date;
};

// Função para encontrar a próxima transportadora
const findNextCarrier = (carriers: Carrier[], now: Date): Carrier | null => {
  const futureCarriers = carriers
    .map(carrier => ({ 
      ...carrier, 
      departureDate: convertToDate(carrier.departureTime, now) 
    }))
    .filter(carrier => carrier.departureDate > now); // Filtra transportadoras cujo horário de saída é no futuro

  if (futureCarriers.length === 0) return null;

  // Encontra a transportadora com o horário de saída mais próximo
  return futureCarriers.reduce((prev, curr) => 
    curr.departureDate < prev.departureDate ? curr : prev
  );
};

const calculateTimeDifference = (departureDate: Date, now: Date): string => {
  const diff = departureDate.getTime() - now.getTime(); // Diferença em milissegundos
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor(diff / 1000 / 60 / 60);
  
  if (hours <= 0 && minutes <= 0) return "Já saiu"; // Caso já tenha passado do horário

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export default function Home() {
  const [now, setNow] = useState(new Date());
  const [nextCarrier, setNextCarrier] = useState<Carrier | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
      setNextCarrier(findNextCarrier(carriers, now)); 
      
      if (nextCarrier){
        const timeRemaining = calculateTimeDifference(convertToDate(nextCarrier.departureTime, now), now);
        setTimeLeft(timeRemaining);
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [nextCarrier, now]);

  return (
    <div className="p-4 flex flex-row gap-4">
      <div className="w-3/4">
        {nextCarrier ? (
          <div className="text-white flex flex-col gap-10 justify-center items-center p-4 bg-red-500 h-full rounded">
              <h2 className="text-3xl font-bold">Próxima transportadora:</h2>
              <p className="text-9xl font-black">{nextCarrier.name}</p>
              <p className="text-9xl font-bold">
                <h2 className="text-3xl font-bold">Sai em:</h2>
                {timeLeft}
              </p>
            </div>
          ) : (
            <div className="p-4 bg-gray-100 rounded">
              <p className="text-xl">Nenhuma transportadora a caminho.</p>
            </div>
        )}
      </div>
      <div className="w-1/4">
        {
          carriers.map(carrier => (
            <TranspItem key={carrier.name} nomeTransp={carrier.name} horarioCorte={carrier.departureTime}/>
          ))
        }
        <span className="w-full flex justify-center text-3xl font-mono font-extrabold text-white">
          {
            now.toLocaleTimeString()
          }
        </span>
      </div>
    </div>
  );
}
