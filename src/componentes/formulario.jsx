import React, { useState } from 'react';
import { db } from '../firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Phone, Gauge, PlusCircle, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';

const Formulario = ({ onSave }) => { // RECIBE FUNCION DE SONIDO
  const [formData, setFormData] = useState({ patente: '', marca: '', modelo: '', anio: '', km: '', telefono: '', fecha: new Date().toISOString().split('T')[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({ title: 'Guardando...', didOpen: () => Swal.showLoading() });
    try {
      await addDoc(collection(db, "lavados"), { 
        ...formData, 
        patente: formData.patente.toUpperCase(), 
        km: Number(formData.km), 
        estado: "Pendiente",
        createdAt: serverTimestamp() 
      });
      if (onSave) onSave(); // DISPARA SONIDO EXITOSO
      Swal.fire({ icon: 'success', title: 'REGISTRADO', confirmButtonColor: '#2563eb', customClass: { popup: 'rounded-[2rem]' }});
      setFormData({ patente: '', marca: '', modelo: '', anio: '', km: '', telefono: '', fecha: new Date().toISOString().split('T')[0] });
    } catch (err) { Swal.fire('Error', 'No se pudo guardar', 'error'); }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
      <h2 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-tighter"><PlusCircle className="text-blue-600" /> Nuevo Ingreso</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="PATENTE" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold uppercase outline-none focus:ring-2 focus:ring-blue-500" value={formData.patente} onChange={e => setFormData({...formData, patente: e.target.value})} />
        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="Marca" className="p-4 bg-slate-50 rounded-2xl border-none font-semibold outline-none" value={formData.marca} onChange={e => setFormData({...formData, marca: e.target.value})} />
          <input required placeholder="Modelo" className="p-4 bg-slate-50 rounded-2xl border-none font-semibold outline-none" value={formData.modelo} onChange={e => setFormData({...formData, modelo: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative"><Calendar className="absolute left-4 top-4 text-slate-400" size={16} /><input type="number" placeholder="Año" className="w-full pl-10 p-4 bg-slate-50 rounded-2xl border-none font-semibold outline-none" value={formData.anio} onChange={e => setFormData({...formData, anio: e.target.value})} /></div>
          <div className="relative"><Gauge className="absolute left-4 top-4 text-blue-500" size={16} /><input required type="number" placeholder="KM" className="w-full pl-10 p-4 bg-slate-100 rounded-2xl border-none font-bold text-blue-600 outline-none" value={formData.km} onChange={e => setFormData({...formData, km: e.target.value})} /></div>
        </div>
        <div className="relative"><Phone className="absolute left-4 top-4 text-slate-400" size={18} /><input required placeholder="WhatsApp" className="w-full pl-12 p-4 bg-slate-50 rounded-2xl border-none font-semibold outline-none" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} /></div>
        <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl uppercase shadow-lg hover:bg-blue-700 transition-all">Registrar Lavado</button>
      </form>
    </div>
  );
};
export default Formulario;