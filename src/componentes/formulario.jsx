import React, { useState, useEffect } from 'react';
import { db } from '../firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { PlusCircle, Car, Hash, Phone, Calendar, Gauge, Activity } from 'lucide-react';
import Swal from 'sweetalert2';

const Formulario = ({ onSave }) => {
  const [formData, setFormData] = useState(() => {
    const borrador = localStorage.getItem('borrador_lavado');
    return borrador ? JSON.parse(borrador) : {
      patente: '', marca: '', modelo: '', anio: '', km: '', telefono: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('borrador_lavado', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patente || !formData.marca) {
      Swal.fire('Error', 'Patente y Marca son obligatorios', 'error');
      return;
    }

    try {
      await addDoc(collection(db, "lavados"), {
        ...formData,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'Pendiente',
        createdAt: serverTimestamp()
      });

      const limpio = { patente: '', marca: '', modelo: '', anio: '', km: '', telefono: '' };
      setFormData(limpio);
      localStorage.removeItem('borrador_lavado');
      onSave();
      Swal.fire({ icon: 'success', title: '¡Vehículo Registrado!', showConfirmButton: false, timer: 1500 });
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con Firebase', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
      <h2 className="font-black text-slate-800 uppercase text-[10px] tracking-[0.15em] flex items-center gap-2 mb-6">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <PlusCircle size={14} className="text-white" />
        </div>
        Nuevo Ingreso
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <Hash className="absolute left-4 top-3.5 text-slate-400" size={14} />
          <input name="patente" placeholder="PATENTE" className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all" value={formData.patente} onChange={handleChange} />
        </div>
        <div className="relative">
          <Car className="absolute left-4 top-3.5 text-slate-400" size={14} />
          <input name="marca" placeholder="MARCA" className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all" value={formData.marca} onChange={handleChange} />
        </div>
      </div>

      <div className="relative">
        <Activity className="absolute left-4 top-3.5 text-slate-400" size={14} />
        <input name="modelo" placeholder="MODELO (EJ: RANGER, HILUX...)" className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all" value={formData.modelo} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <Calendar className="absolute left-4 top-3.5 text-slate-400" size={14} />
          <input name="anio" type="number" placeholder="AÑO" className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all" value={formData.anio} onChange={handleChange} />
        </div>
        <div className="relative">
          <Gauge className="absolute left-4 top-3.5 text-slate-400" size={14} />
          <input name="km" type="number" placeholder="KM" className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all" value={formData.km} onChange={handleChange} />
        </div>
      </div>

      <div className="relative">
        <Phone className="absolute left-4 top-3.5 text-slate-400" size={14} />
        <input name="telefono" placeholder="WHATSAPP (EJ: 1122334455)" className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all" value={formData.telefono} onChange={handleChange} />
      </div>

      <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
        Registrar Vehículo
      </button>
    </form>
  );
};

export default Formulario;