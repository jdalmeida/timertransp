import TranspItem from "@/components/TranspItem";

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
  return (
    <div>
      {
        carriers.map(carrier => (
          <TranspItem key={carrier.name} nomeTransp={carrier.name} horarioCorte={carrier.departureTime}/>
        ))
      }
    </div>
  );
}
