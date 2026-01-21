import React, { useState, useEffect } from 'react';
import { db } from './firebase.config';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Search, BarChart3, Download, Car, Clock, ShieldCheck, Activity, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

import Formulario from "./componentes/formulario";
import TablaLavados from "./componentes/Tabla";

// Sonidos para feedback de usuario
const SOUNDS = {
  success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  done: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  excel: 'https://assets.mixkit.co/active_storage/sfx/1487/1487-preview.mp3'
};

function App() {
  const [lavados, setLavados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [horaActual, setHoraActual] = useState(new Date().toLocaleTimeString());

  // Función para reproducir sonidos
  const playSound = (type) => {
    const audio = new Audio(SOUNDS[type]);
    audio.play().catch(() => {}); // El navegador puede bloquearlo si no hay interacción previa
  };

  useEffect(() => {
    // Reloj del footer
    const timer = setInterval(() => setHoraActual(new Date().toLocaleTimeString()), 1000);
    
    // Conexión en tiempo real con Firebase
    const q = query(collection(db, "lavados"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLavados(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    
    return () => { unsubscribe(); clearInterval(timer); };
  }, []);

  const calcularDias = (fecha) => {
    if (!fecha) return 0;
    return Math.floor((new Date() - new Date(fecha + "T12:00:00")) / (1000 * 60 * 60 * 24));
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await updateDoc(doc(db, "lavados", id), { estado: nuevoEstado });
      if (nuevoEstado === 'Terminado') playSound('done');
      Swal.fire({
        toast: true, position: 'top-end', icon: 'success',
        title: `Estado: ${nuevoEstado}`, showConfirmButton: false, timer: 1500
      });
    } catch (e) { Swal.fire('Error', 'No se pudo actualizar', 'error'); }
  };

  const eliminarRegistro = async (id) => {
    const res = await Swal.fire({
      title: '¿ELIMINAR?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'SÍ, BORRAR'
    });
    if (res.isConfirmed) await deleteDoc(doc(db, "lavados", id));
  };

  // FILTRADO INTEGRAL (Patente, Marca, Modelo, Año, KM)
  const lavadosFiltrados = lavados.filter(l => {
    const term = busqueda.toLowerCase();
    return (
      l.patente?.toLowerCase().includes(term) || 
      l.marca?.toLowerCase().includes(term) ||
      l.modelo?.toLowerCase().includes(term) ||
      String(l.km).includes(term) ||
      String(l.anio).includes(term)
    );
  });

  const descargarExcel = () => {
    if (lavadosFiltrados.length === 0) return;
    playSound('excel');
    const datos = lavadosFiltrados.map(l => ({
      Fecha: l.fecha, Patente: l.patente, Marca: l.marca, Modelo: l.modelo, Año: l.anio, KM: l.km, Estado: l.estado || 'Pendiente'
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lavados");
    XLSX.writeFile(wb, `WashControl_Reporte_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const obtenerDatosGrafico = () => {
    const dias = [...Array(7)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    return dias.map(f => ({ 
      dia: f.split('-')[2]+'/'+f.split('-')[1], 
      cantidad: lavados.filter(l => l.fecha === f).length 
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 pb-20 font-sans flex flex-col items-center">
      <header className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">WASH<span className="text-blue-600">CONTROL</span></h1>
        <div className="flex w-full max-w-xl gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Patente, marca, año o km..." 
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl shadow-sm outline-none font-bold" 
              value={busqueda} 
              onChange={e => setBusqueda(e.target.value)} 
            />
          </div>
          <button onClick={descargarExcel} className="bg-green-600 text-white p-3 rounded-2xl hover:bg-green-700 shadow-lg active:scale-90 transition-all">
            <Download size={22} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-4 space-y-6">
          <Formulario onSave={() => playSound('success')} />
          
          {/* GRÁFICO CON PARCHE PARA EL ERROR DE WIDTH/HEIGHT */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 mb-4 uppercase text-[10px] tracking-widest flex items-center gap-2">
              <BarChart3 size={14} /> Rendimiento Semanal
            </h3>
            <div style={{ width: '100%', height: 160, minWidth: 0 }}> 
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={obtenerDatosGrafico()} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                  <Bar dataKey="cantidad" radius={[4, 4, 4, 4]}>
                    {obtenerDatosGrafico().map((e, i) => (
                      <Cell key={i} fill={i === 6 ? '#2563eb' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-[650px] overflow-hidden">
          <div className="p-6 border-b border-slate-50 font-black text-slate-800 uppercase text-xs tracking-widest flex items-center gap-2">
            <Car size={16} className="text-blue-600" /> Panel de Control en Vivo
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <TablaLavados 
              datos={lavadosFiltrados} 
              calcularDias={calcularDias} 
              onEliminar={eliminarRegistro} 
              onCambiarEstado={actualizarEstado} 
            />
          </div>
        </div>
      </main>

      {/* FOOTER INFORMATIVO CON ESTADO ACTIVO Y HORA */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-100 px-6 py-2 flex justify-between items-center text-[9px] font-black text-slate-500 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-green-600 uppercase">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            SISTEMA ACTIVO
          </div>
          <div className="hidden md:flex items-center gap-4 border-l border-slate-200 pl-4">
             <div className="flex flex-col">
                <span className="text-slate-400 text-[7px] uppercase">Hoy</span>
                <span className="text-blue-600">{lavados.filter(l => l.fecha === new Date().toISOString().split('T')[0]).length} UNI.</span>
             </div>
             <div className="flex flex-col">
                <span className="text-slate-400 text-[7px] uppercase">En Proceso</span>
                <span className="text-orange-500">{lavados.filter(l => l.estado === 'Lavando').length} VEH.</span>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 text-red-500 bg-red-50 px-2 py-1 rounded-md uppercase tracking-tighter">
            <Users size={10} /> {lavados.filter(l => calcularDias(l.fecha) >= 20).length} AUSENTES (+20d)
          </div>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4 uppercase">
            <Clock size={10} /> {horaActual}
            <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded text-[8px]">V 2.4.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;