import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase.config';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Search, BarChart3, Download, Car, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

import Formulario from "./componentes/formulario";
import TablaLavados from "./componentes/Tabla";

const SOUNDS = {
  success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  done: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  excel: 'https://assets.mixkit.co/active_storage/sfx/1487/1487-preview.mp3'
};

function App() {
  const [lavados, setLavados] = useState(() => {
    const saved = localStorage.getItem('lavados_cache');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [busqueda, setBusqueda] = useState('');
  const [horaActual, setHoraActual] = useState(new Date().toLocaleTimeString());
  const [isLoaded, setIsLoaded] = useState(false);

  // Configuración de Notificaciones Toast
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 500);
    const timer = setInterval(() => setHoraActual(new Date().toLocaleTimeString()), 1000);
    
    const q = query(collection(db, "lavados"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const datosFirebase = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setLavados(datosFirebase);
      localStorage.setItem('lavados_cache', JSON.stringify(datosFirebase));
    });
    
    return () => { unsubscribe(); clearInterval(timer); clearTimeout(timeout); };
  }, []);

  const playSound = (type) => {
    const audio = new Audio(SOUNDS[type]);
    audio.play().catch(() => {});
  };

  // Cálculo de días sincronizado con la fecha actual
  const calcularDias = (fecha) => {
    if (!fecha) return 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaLavado = new Date(fecha + "T12:00:00");
    fechaLavado.setHours(0, 0, 0, 0);
    const diferencia = hoy - fechaLavado;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  };

  const obtenerDatosGrafico = () => {
    const dias = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    return dias.map(f => ({
      dia: f.split('-')[2] + '/' + f.split('-')[1],
      cantidad: lavados.filter(l => l.fecha === f).length
    }));
  };

  const descargarExcel = () => {
    if (lavadosFiltrados.length === 0) return;
    playSound('excel');
    const datos = lavadosFiltrados.map(l => ({
      Fecha: l.fecha, Patente: l.patente, Marca: l.marca, Modelo: l.modelo,
      KM: l.km, Estado: l.estado || 'Pendiente',
      "Días": calcularDias(l.fecha)
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lavados");
    XLSX.writeFile(wb, `Reporte_WashControl.xlsx`);
  };

  const lavadosFiltrados = lavados.filter(l => {
    const term = busqueda.toLowerCase();
    return (
      l.patente?.toLowerCase().includes(term) || 
      l.marca?.toLowerCase().includes(term) ||
      l.modelo?.toLowerCase().includes(term) ||
      String(l.km).includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 pb-20 flex flex-col items-center font-sans text-slate-900">
      <header className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">WASH<span className="text-blue-600">CONTROL</span></h1>
        <div className="flex w-full max-w-xl gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Patente, marca o km..." 
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl shadow-sm outline-none font-bold" 
              value={busqueda} 
              onChange={e => setBusqueda(e.target.value)} 
            />
          </div>
          <button onClick={descargarExcel} className="bg-green-600 text-white p-3 rounded-2xl hover:bg-green-700 active:scale-95 transition-all">
            <Download size={22} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-4 space-y-6">
          <Formulario onSave={() => {
            playSound('success');
            Toast.fire({ icon: 'success', title: 'Vehículo Registrado' });
          }} />
          
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 mb-6 uppercase text-[10px] tracking-widest flex items-center gap-2">
              <BarChart3 size={14} className="text-blue-600" /> Actividad Semanal
            </h3>
            
            <div className="w-full min-h-[180px] flex items-center justify-center"> 
              {isLoaded ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={obtenerDatosGrafico()} margin={{ top: 0, right: 10, left: -30, bottom: 0 }}>
                    <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#cbd5e1'}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '15px', border: 'none'}} />
                    <Bar dataKey="cantidad" radius={[6, 6, 6, 6]} barSize={22}>
                      {obtenerDatosGrafico().map((entry, index) => (
                        <Cell key={index} fill={index === 6 ? '#2563eb' : '#e2e8f0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-[10px] font-bold text-slate-300 animate-pulse">PREPARANDO GRÁFICOS...</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-[650px] overflow-hidden">
          <div className="p-6 border-b border-slate-50 font-black text-slate-800 uppercase text-xs tracking-widest">Panel de Gestión</div>
          <div className="flex-1 overflow-y-auto">
            <TablaLavados 
              datos={lavadosFiltrados} 
              calcularDias={calcularDias} 
              onEliminar={async (id) => {
                const res = await Swal.fire({ title: '¿ELIMINAR?', icon: 'warning', showCancelButton: true });
                if (res.isConfirmed) {
                  await deleteDoc(doc(db, "lavados", id));
                  Toast.fire({ icon: 'success', title: 'Eliminado' });
                }
              }} 
              onCambiarEstado={async (id, st) => {
                await updateDoc(doc(db, "lavados", id), { estado: st });
                if (st === 'Terminado') {
                  playSound('done');
                  Toast.fire({ icon: 'success', title: 'Lavado Terminado' });
                } else {
                  Toast.fire({ icon: 'info', title: `Estado: ${st}` });
                }
              }} 
            />
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-3 flex justify-between items-center text-[9px] font-black text-slate-400 z-50 uppercase tracking-widest">
        <div className="flex items-center gap-2 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Sincronizado
        </div>
        <div className="flex items-center gap-4">
          <Clock size={12} /> {horaActual}
          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">v 3.8</span>
        </div>
      </footer>
    </div>
  );
}

export default App;