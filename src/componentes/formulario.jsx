import React, { useState } from 'react';
import { db } from '../firebase.config.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PlusCircle, MessageSquare, Car, Calendar, Clock } from 'lucide-react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const Formulario = () => {
  const [form, setForm] = useState({
    patente: '', marca: '', modelo: '', anio: '', 
    kilometros: '', fecha: '', horario: '', observaciones: ''
  });

  const playSuccess = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.volume = 0.2;
    audio.play();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "lavados"), {
        ...form,
        createdAt: serverTimestamp()
      });
      
      playSuccess();
      setForm({ patente: '', marca: '', modelo: '', anio: '', kilometros: '', fecha: '', horario: '', observaciones: '' });
      
      Toast.fire({
        icon: 'success',
        title: '¡Registrado con éxito!'
      });
      
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: 'Error al guardar'
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 sticky top-4"
    >
      <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-800 uppercase italic">
        <PlusCircle size={24} className="text-blue-600" /> Nuevo Lavado
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Identificación</label>
          <input 
            type="text" placeholder="PATENTE (ej: AA123BB)" required
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl uppercase font-black text-lg focus:border-blue-500 focus:bg-white outline-none transition-all"
            value={form.patente} onChange={e => setForm({...form, patente: e.target.value.toUpperCase()})}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="Marca" required className="p-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-400"
            value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} />
          <input type="text" placeholder="Modelo" required className="p-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-400"
            value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Año" required className="p-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-400"
            value={form.anio} onChange={e => setForm({...form, anio: e.target.value})} />
          <input type="number" placeholder="Kilómetros" required className="p-3 bg-slate-50 border rounded-xl text-sm outline-none focus:border-blue-400"
            value={form.kilometros} onChange={e => setForm({...form, kilometros: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
            <input type="date" required className="w-full p-3 pl-10 bg-slate-50 border rounded-xl text-sm outline-none"
              value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
          </div>
          <div className="relative">
            <Clock className="absolute left-3 top-3 text-slate-400" size={16} />
            <input type="time" required className="w-full p-3 pl-10 bg-slate-50 border rounded-xl text-sm outline-none"
              value={form.horario} onChange={e => setForm({...form, horario: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Notas adicionales</label>
          <textarea 
            placeholder="¿Algún detalle especial?"
            className="w-full p-3 bg-slate-50 border rounded-xl text-sm min-h-[100px] outline-none focus:border-blue-400"
            value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})}
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95 uppercase tracking-wider">
          Guardar Registro
        </button>
      </form>
    </motion.div>
  );
};

export default Formulario;