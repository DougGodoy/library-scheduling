
import React, { useState } from 'react';
import { Search, Calendar, User, CheckCircle, AlertCircle, Loader2, Monitor } from 'lucide-react';
import { Computer, Reservation } from '../types';

const AvailabilitySearch: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState('');
  const [userName, setUserName] = useState('');
  const [availableComputers, setAvailableComputers] = useState<Computer[]>([]);
  const [searching, setSearching] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!selectedTime) {
      setError("Selecione uma data e horário.");
      return;
    }
    
    setSearching(true);
    setError(null);
    setSuccess(null);
    
    setTimeout(() => {
      const allComputers: Computer[] = JSON.parse(localStorage.getItem('library_computers') || '[]');
      const allReservations: Reservation[] = JSON.parse(localStorage.getItem('library_reservations') || '[]');
      
      const bookedIds = allReservations
        .filter(res => res.dateTime === selectedTime)
        .map(res => res.computer.id);
        
      const free = allComputers.filter(c => !bookedIds.includes(c.id));
      setAvailableComputers(free);
      setSearching(false);
      
      if (free.length === 0) {
        setError("Nenhum computador disponível para este horário.");
      }
    }, 600);
  };

  const handleReserve = (computer: Computer) => {
    if (!userName.trim()) {
      setError("Por favor, informe seu nome para reservar.");
      return;
    }

    setBookingId(computer.id);
    setError(null);

    setTimeout(() => {
      const allReservations: Reservation[] = JSON.parse(localStorage.getItem('library_reservations') || '[]');
      
      const isAlreadyBooked = allReservations.some(
        res => res.computer.id === computer.id && res.dateTime === selectedTime
      );

      if (isAlreadyBooked) {
        setError("Este computador acabou de ser reservado por outra pessoa!");
        setBookingId(null);
        handleSearch();
        return;
      }

      const newReservation: Reservation = {
        id: Date.now(),
        computer,
        userName,
        dateTime: selectedTime
      };

      const updated = [...allReservations, newReservation];
      localStorage.setItem('library_reservations', JSON.stringify(updated));
      
      setSuccess(`Agendado com sucesso! ${computer.name} reservado para ${userName}.`);
      setAvailableComputers(prev => prev.filter(c => c.id !== computer.id));
      setBookingId(null);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Buscar Disponibilidade</h2>
        <p className="text-slate-500">Encontre PCs livres no dia e hora desejados.</p>
      </header>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Data e Horário</label>
            <input
              type="datetime-local"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Seu Nome</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching || !selectedTime}
            className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span>Buscar Disponíveis</span>
          </button>
        </div>
      </section>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableComputers.map((comp) => (
          <div key={comp.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-blue-200 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Monitor className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Disponível</span>
            </div>
            <h3 className="font-bold text-lg text-slate-800">{comp.name}</h3>
            <p className="text-sm text-slate-500 mb-6">{comp.description}</p>
            <button
              onClick={() => handleReserve(comp)}
              disabled={bookingId !== null}
              className="w-full py-2.5 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold transition-all disabled:opacity-50"
            >
              Reservar Agora
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilitySearch;
