import React, { useState, useEffect } from 'react';
import { db } from './firebase.config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, Search, TrendingUp, Calendar as CalendarIcon, 
  Download, ListFilter, X, Loader2 
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

import Formulario from './componentes/Formulario'; 
import TablaLavados from './componentes/TablaLavados';


import './App.css'; 

function App() {
  const [lavados, setLavados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargandoInicial, setCargandoInicial] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "lavados"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLavados(docs);
      setCargandoInicial(false);
    }, (error) => {
      console.error("Error Firebase:", error);
      setCargandoInicial(false);
    });
    return () => unsub();
  }, []);

  const datosFiltrados = lavados.filter(l => {
    const termino = busqueda.toLowerCase();
    const coincide = 
      l.patente?.toLowerCase().includes(termino) ||
      l.marca?.toLowerCase().includes(termino) ||
      l.modelo?.toLowerCase().includes(termino) ||
      l.anio?.toString().includes(termino);

    if (busqueda !== "") return coincide;
    const fechaLavado = new Date(l.fecha + "T12:00:00");
    const hoy = new Date();
    const difDias = (hoy - fechaLavado) / (1000 * 60 * 60 * 24);
    return coincide && difDias <= 30;
  });

  const hoyString = new Date().toLocaleDateString('en-CA');
  const lavadosHoy = lavados.filter(l => l.fecha === hoyString).length;

  const descargarExcelYEnviar = () => {
    if (datosFiltrados.length === 0) {
      Swal.fire({ icon: 'info', title: 'Sin datos para exportar' });
      return;
    }

    const reporte = datosFiltrados.map(l => ({
      FECHA: l.fecha,
      HORA: l.horario,
      PATENTE: l.patente?.toUpperCase(),
      VEHICULO: `${l.marca} ${l.modelo}`,
      KM: l.kilometros || 0,
      OBSERVACIONES: l.observaciones || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(reporte);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Servicios");
    const nombreArchivo = `WashControl_${hoyString}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);

    Swal.fire({ 
      icon: 'success', 
      title: '¡Excel bajado!', 
      text: 'Adjúntalo ahora en WhatsApp',
      confirmButtonColor: '#25D366',
      confirmButtonText: 'Abrir WhatsApp'
    }).then(() => {
      const mensaje = `*WASH CONTROL - REPORTE*%0A📊 Servicios: *${reporte.length}*%0A📅 Fecha: ${hoyString}%0A%0A_El archivo se descargó en tu dispositivo._`;
      window.open(`https://wa.me/?text=${mensaje}`, '_blank');
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* HEADER FIJO */}
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white"><Car size={24} /></div>
            <h1 className="text-xl font-black italic uppercase text-slate-800">Wash<span className="text-blue-600">Control</span></h1>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar patente, marca..." 
              className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="absolute right-2 top-1.5 p-1 bg-slate-200 rounded-lg">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow max-w-7xl mx-auto p-4 lg:p-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
            <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><TrendingUp /></div>
            <div><p className="text-slate-400 text-[10px] font-bold uppercase">Total</p><h3 className="text-2xl font-black">{lavados.length}</h3></div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
            <div className="bg-green-100 p-4 rounded-2xl text-green-600"><CalendarIcon /></div>
            <div><p className="text-slate-400 text-[10px] font-bold uppercase">Hoy</p><h3 className="text-2xl font-black text-green-600">{lavadosHoy}</h3></div>
          </div>
          <button onClick={descargarExcelYEnviar} className="bg-blue-600 hover:bg-blue-700 transition-all p-6 rounded-3xl shadow-lg flex flex-col justify-center items-center text-white font-bold active:scale-95 group">
            <Download className="mb-1 group-hover:bounce" /><span className="uppercase text-sm">Reporte a WhatsApp</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4"><Formulario /></div>
          
          <div className="lg:col-span-8">
            <div className="mb-4 flex items-center gap-2 px-2">
              <ListFilter size={16} className="text-slate-400" />
              <h2 className="font-bold text-slate-700 uppercase tracking-widest text-xs">
                {busqueda ? `Resultados: ${datosFiltrados.length}` : 'Últimos 30 días'}
              </h2>
            </div>

            {cargandoInicial ? (
              <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-slate-100">
                <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
                <p className="text-slate-400 text-xs font-bold uppercase">Sincronizando...</p>
              </div>
            ) : (
              /* --- RECUADRO CON SCROLL OPTIMIZADO --- */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                   <TablaLavados datos={datosFiltrados} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER  */}
      <footer className="bg-white border-t border-slate-200 p-6 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
        &copy; {new Date().getFullYear()} WashControl - Gestión de Lavados
      </footer>
    </div>
  );
}

export default App;