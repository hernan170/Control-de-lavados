import React from 'react';
import { db } from '../firebase.config.js';
import { doc, deleteDoc } from 'firebase/firestore';
import { Trash2, Calendar, Clock, Gauge, MessageCircle } from 'lucide-react';
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

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-slate-200">
        <div className="text-slate-300 mb-2 flex justify-center"><MessageCircle size={48} /></div>
        <p className="text-slate-400 font-medium">No hay lavados registrados aún</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="p-5">Vehículo</th>
              <th className="p-5">Fecha y Hora</th>
              <th className="p-5">Kilometraje</th>
              <th className="p-5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence>
              {datos.map((l) => (
                <motion.tr 
                  key={l.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="p-5">
                    <div className="font-bold text-slate-700">{l.marca} {l.modelo} <span className="text-slate-300 font-normal">({l.anio})</span></div>
                    <div className="text-blue-600 font-black text-sm tracking-tighter">{l.patente}</div>
                    {l.observaciones && (
                      <div className="mt-2 text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100 flex gap-2 items-start">
                        <MessageCircle size={14} className="text-slate-300 shrink-0" />
                        {l.observaciones}
                      </div>
                    )}
                  </td>
                  <td className="p-5 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><Calendar size={14} className="text-slate-400"/> {l.fecha}</div>
                    <div className="flex items-center gap-2 mt-1 text-slate-400 text-xs"><Clock size={14}/> {l.horario} hs</div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Gauge size={16} className="text-slate-300" />
                      {Number(l.kilometros).toLocaleString()} km
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <button 
                      onClick={() => eliminar(l.id)} 
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
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