import React, { useState } from 'react';
import { db } from '../firebase.config.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PlusCircle, Calendar, Clock, Gauge, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const Formulario = () => {
  const [cargando, setCargando] = useState(false);

  const getHoy = () => new Date().toLocaleDateString('en-CA');
  const getHora = () => new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  const [form, setForm] = useState({
    patente: '', marca: '', modelo: '', anio: '', 
    kilometros: '', fecha: getHoy(), horario: getHora(), observaciones: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cargando) return;
    
    setCargando(true);
    try {
      await addDoc(collection(db, "lavados"), {
        ...form,
        patente: form.patente.toUpperCase().trim(),
        kilometros: Number(form.kilometros) || 0,
        createdAt: serverTimestamp()
      });
      
      setForm({ 
        patente: '', marca: '', modelo: '', anio: '', 
        kilometros: '', fecha: getHoy(), horario: getHora(), observaciones: '' 
      });
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: '¡Guardado!',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({ icon: 'error', title: 'Error al conectar con la base' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200"
    >
      <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-800 uppercase italic">
        <PlusCircle size={24} className="text-blue-600" /> Nuevo Lavado
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* PATENTE */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Patente</label>
          <input 
            type="text" placeholder="ABC 123" required
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl uppercase font-black text-lg focus:border-blue-500 outline-none"
            value={form.patente} 
            onChange={e => setForm({...form, patente: e.target.value})}
          />
        </div>

        {/* MARCA Y MODELO */}
        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="Marca" required className="p-3 bg-slate-50 border rounded-xl text-sm"
            value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} />
          <input type="text" placeholder="Modelo" required className="p-3 bg-slate-50 border rounded-xl text-sm"
            value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})} />
        </div>

        {/* AÑO Y KM */}
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Año" required className="p-3 bg-slate-50 border rounded-xl text-sm"
            value={form.anio} onChange={e => setForm({...form, anio: e.target.value})} />
          <div className="relative">
            <Gauge className="absolute left-3 top-3 text-slate-400" size={16} />
            <input type="number" placeholder="Kms" required className="w-full p-3 pl-10 bg-slate-50 border rounded-xl text-sm"
              value={form.kilometros} onChange={e => setForm({...form, kilometros: e.target.value})} />
          </div>
        </div>

        {/* FECHA Y HORA */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
            <input type="date" required className="w-full p-3 pl-10 bg-slate-50 border rounded-xl text-sm"
              value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
          </div>
          <div className="relative">
            <Clock className="absolute left-3 top-3 text-slate-400" size={16} />
            <input type="time" required className="w-full p-3 pl-10 bg-slate-50 border rounded-xl text-sm"
              value={form.horario} onChange={e => setForm({...form, horario: e.target.value})} />
          </div>
        </div>

        {/* NOTAS */}
        <textarea 
          placeholder="¿Algún detalle?"
          className="w-full p-3 bg-slate-50 border rounded-xl text-sm min-h-[80px] outline-none"
          value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})}
        />

        {/* BOTÓN CON SPINNER */}
        <button 
          type="submit" 
          disabled={cargando}
          className={`w-full flex justify-center items-center gap-2 font-black py-4 rounded-2xl transition-all uppercase tracking-widest ${
            cargando ? 'bg-slate-400 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg active:scale-95'
          }`}
        >
          {cargando ? (
            <>
              <Loader2 className="animate-spin" size={20} /> 
              <span>Guardando...</span>
            </>
          ) : 'Guardar Registro'}
        </button>
      </form>
    </motion.div>
  );
};

export default Formulario;