"use client"
import TranspItem from "@/components/TranspItem";
import { useEffect, useState } from "react";

interface Carrier {
  name: string;
  departureTime: string; // Hora de saída no formato 'HH:mm'
}

// Lista de transportadoras e horários de saída
const carriers: Carrier[] = [
  { name: 'TW', departureTime: '17:00' },
  { name: 'São Miguel', departureTime: '18:30' },
  { name: 'Fritz', departureTime: '18:45' },
  { name: 'Santa Cruz', departureTime: '20:30' },
  { name: 'Leomar', departureTime: '20:00' },
];

export default function Home() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="p-4">
      {
        carriers.map(carrier => (
          <TranspItem key={carrier.name} nomeTransp={carrier.name} horarioCorte={carrier.departureTime}/>
        ))
      }
      <span className="w-full flex justify-center text-3xl font-mono font-extrabold">
        {
          now.toLocaleTimeString()
        }
      </span>
    </div>
  );
}
