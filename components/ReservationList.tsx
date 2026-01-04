
import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, User, Monitor, XCircle, Loader2 } from 'lucide-react';
import { Reservation } from '../types';

const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    setTimeout(() => {
      const saved = localStorage.getItem('library_reservations');
      const data = saved ? JSON.parse(saved) : [];
      setReservations(data);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = (id: number) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;
    
    const updated = reservations.filter(r => r.id !== id);
    localStorage.setItem('library_reservations', JSON.stringify(updated));
    setReservations(updated);
  };

  const formatDateTime = (dtStr: string) => {
    const d = new Date(dtStr);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Histórico de Reservas</h2>
        <p className="text-slate-500">Gerencie todos os agendamentos ativos da biblioteca.</p>
      </header>

      {loading ? (
        <div className="bg-white p-12 flex justify-center rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : reservations.length === 0 ? (
        <div className="bg-white p-16 text-center text-slate-400 rounded-xl border border-slate-200">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-10" />
          <p className="text-lg">Nenhuma reserva encontrada.</p>
          <p className="text-sm">Os novos agendamentos aparecerão aqui após serem realizados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reservations.map((res) => (
            <div key={res.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1 flex items-center gap-5">
                <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{res.computer.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <User className="w-4 h-4" /> {res.userName}
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                      <Calendar className="w-4 h-4" /> {formatDateTime(res.dateTime)}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleCancel(res.id)}
                className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-red-500 hover:bg-red-50 font-medium transition-all"
              >
                <XCircle className="w-5 h-5" /> Cancelar Reserva
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationList;
