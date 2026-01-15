import React, { useState, useEffect } from 'react';
import { db } from './firebase.config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Car, Search, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';

// Componentes
import Formulario from './componentes/formulario';
import TablaLavados from './componentes/TablaLavados';

function App() {
  const [lavados, setLavados] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  // 1. Escuchar datos de Firebase en tiempo real
  useEffect(() => {
    const q = query(collection(db, "lavados"), orderBy("createdAt", "desc"));
    
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLavados(docs);
    });

    return () => unsub();
  }, []);

  // 2. Lógica de filtrado por patente o modelo
  const datosFiltrados = lavados.filter(l => 
    l.patente?.toLowerCase().includes(busqueda.toLowerCase()) ||
    l.marca?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 3. Estadísticas simples
  const hoy = new Date().toISOString().split('T')[0];
  const lavadosHoy = lavados.filter(l => l.fecha === hoy).length;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* HEADER / NAVBAR */}
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Car size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-slate-800 uppercase italic">
              Wash<span className="text-blue-600">Control</span>
            </h1>
          </div>
          
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar patente..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* DASHBOARD DE ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4"
          >
            <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><TrendingUp /></div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Lavados</p>
              <h3 className="text-2xl font-black text-slate-800">{lavados.length}</h3>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4"
          >
            <div className="bg-green-100 p-4 rounded-2xl text-green-600"><CalendarIcon /></div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Lavados de Hoy</p>
              <h3 className="text-2xl font-black text-slate-800">{lavadosHoy}</h3>
            </div>
          </motion.div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Columna Izquierda: Formulario */}
          <div className="lg:col-span-4">
            <Formulario />
          </div>

          {/* Columna Derecha: Tabla */}
          <div className="lg:col-span-8">
            <div className="mb-4 flex justify-between items-center px-2">
              <h2 className="font-bold text-slate-700 uppercase tracking-widest text-sm">Historial de Servicios</h2>
              <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-full font-bold">LIVE</span>
            </div>
            <TablaLavados datos={datosFiltrados} />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-8 text-slate-400 text-xs font-medium">
        WashControl v2.0 - Sistema de Gestión de Lavados Profesional
      </footer>
    </div>
  );
}

export default App;