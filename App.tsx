
import React, { useState } from 'react';
import ComputerManagement from './components/ComputerManagement';
import AvailabilitySearch from './components/AvailabilitySearch';
import ReservationList from './components/ReservationList';
import { Monitor, Calendar, BookOpen, Library } from 'lucide-react';

type View = 'computers' | 'booking' | 'reservations';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('booking');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar / Navegação */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6 flex items-center gap-3">
          <Library className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold tracking-tight">Biblioteca Digital</h1>
        </div>
        
        <nav className="mt-6 px-4 space-y-2">
          <button
            onClick={() => setActiveView('booking')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeView === 'booking' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Novo Agendamento</span>
          </button>
          
          <button
            onClick={() => setActiveView('reservations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeView === 'reservations' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Ver Reservas</span>
          </button>

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Administração</p>
          </div>

          <button
            onClick={() => setActiveView('computers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeView === 'computers' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Monitor className="w-5 h-5" />
            <span>Gerenciar PCs</span>
          </button>
        </nav>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {activeView === 'computers' && <ComputerManagement />}
          {activeView === 'booking' && <AvailabilitySearch />}
          {activeView === 'reservations' && <ReservationList />}
        </div>
      </main>
    </div>
  );
};

export default App;
