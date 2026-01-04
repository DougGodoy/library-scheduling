
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Monitor, Loader2 } from 'lucide-react';
import { Computer } from '../types';

const ComputerManagement: React.FC = () => {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchComputers = async () => {
      setLoading(true);
      try {
        const saved = localStorage.getItem('library_computers');
        const data = saved ? JSON.parse(saved) : [];
        setComputers(data);
      } catch (err) {
        console.error("Falha ao buscar dados", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComputers();
  }, []);

  const handleAddComputer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const newComputer: Computer = {
        id: Date.now(),
        name,
        description,
        available: true
      };
      const updated = [...computers, newComputer];
      localStorage.setItem('library_computers', JSON.stringify(updated));
      setComputers(updated);
      setName('');
      setDescription('');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este computador?')) return;
    
    const updated = computers.filter(c => c.id !== id);
    localStorage.setItem('library_computers', JSON.stringify(updated));
    setComputers(updated);
    
    const savedRes = localStorage.getItem('library_reservations');
    if (savedRes) {
      const reservations = JSON.parse(savedRes);
      const filteredRes = reservations.filter((r: any) => r.computer.id !== id);
      localStorage.setItem('library_reservations', JSON.stringify(filteredRes));
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Gestão de Computadores</h2>
        <p className="text-slate-500">Cadastre ou remova as estações de trabalho da biblioteca.</p>
      </header>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleAddComputer} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Nome do PC</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Estação 01"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Descrição/Configuração</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Hall de entrada, i5 16GB"
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                <span>Adicionar</span>
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : computers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Monitor className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Nenhum computador cadastrado ainda.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase">Nome</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase">Descrição</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {computers.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{comp.name}</td>
                  <td className="px-6 py-4 text-slate-600">{comp.description || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(comp.id)}
                      className="text-red-400 hover:text-red-600 p-2 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default ComputerManagement;
