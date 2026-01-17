import React from 'react';
import { db } from '../firebase.config.js';
import { doc, deleteDoc } from 'firebase/firestore';
import { Trash2, Calendar, Clock, Gauge, MessageCircle, Car } from 'lucide-react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const TablaLavados = ({ datos }) => {
  
  const playDelete = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/261/261-preview.mp3');
    audio.volume = 0.1;
    audio.play();
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar registro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "lavados", id));
        playDelete();
        Toast.fire({ icon: 'success', title: 'Registro eliminado' });
      } catch (error) {
        Toast.fire({ icon: 'error', title: 'Error al eliminar' });
      }
    }
  };

  // Función para embellecer la fecha (Ej: 17 ene. 2026)
  const formatearFecha = (f) => {
    if (!f) return "-";
    const opciones = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(f + "T12:00:00").toLocaleDateString('es-AR', opciones);
  };

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-slate-200">
        <div className="text-slate-200 mb-4 flex justify-center">
            <MessageCircle size={64} strokeWidth={1} />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No hay servicios en este periodo</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="p-5">Vehículo / Patente</th>
              <th className="p-5">Fecha y Hora</th>
              <th className="p-5">Estado / Km</th>
              <th className="p-5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode='popLayout'>
              {datos.map((l) => (
                <motion.tr 
                  key={l.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="hover:bg-blue-50/40 transition-colors group"
                >
                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                        <div className="font-black text-slate-700 leading-tight">
                            {l.marca} {l.modelo}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider shadow-sm">
                                {l.patente}
                            </span>
                            <span className="text-slate-400 text-[11px] font-medium uppercase">AÑO {l.anio}</span>
                        </div>
                    </div>
                    {l.observaciones && (
                      <div className="mt-3 text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100 flex gap-2 items-start shadow-sm">
                        <MessageCircle size={12} className="text-blue-400 shrink-0 mt-0.5" />
                        {l.observaciones}
                      </div>
                    )}
                  </td>

                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                            <Calendar size={14} className="text-blue-500"/> 
                            {formatearFecha(l.fecha)}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                            <Clock size={14} className="text-slate-300"/> 
                            {l.horario} HS
                        </div>
                    </div>
                  </td>

                  <td className="p-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                      <Gauge size={14} className="text-blue-500" />
                      <span className="text-slate-600 font-bold text-xs">
                        {l.kilometros ? Number(l.kilometros).toLocaleString() : '0'} <span className="font-normal text-slate-400">km</span>
                      </span>
                    </div>
                  </td>

                  <td className="p-5 text-center">
                    <button 
                      onClick={() => eliminar(l.id)} 
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                      title="Eliminar Registro"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaLavados;