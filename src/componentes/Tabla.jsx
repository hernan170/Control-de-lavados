import React from 'react';
import { Car, Trash2, MessageCircle, Gauge } from 'lucide-react';

const TablaLavados = ({ datos = [], calcularDias, onEliminar, onCambiarEstado }) => {
  
  const getStyle = (e) => {
    if (e === 'Lavando') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (e === 'Terminado') return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const enviarWhatsApp = (telefono, marca, patente) => {
    const numLimpio = String(telefono).replace(/\D/g, '');
    const mensaje = encodeURIComponent(`¡Hola! Te informamos que tu ${marca} (Patente: ${patente}) ya está listo. 🧼`);
    window.open(`https://api.whatsapp.com/send?phone=${numLimpio}&text=${mensaje}`, '_blank');
  };

  return (
    <div className="w-full px-4 pb-4">
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-4">
            <th className="px-4 py-2">Vehículo / Año</th>
            <th className="px-4 py-2 text-center">Estado</th>
            <th className="px-4 py-2 text-center">Kilometraje</th>
            <th className="px-4 py-2 text-right">Visita</th>
            <th className="px-4 py-2 text-right">Acción</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((l) => {
            const dias = calcularDias(l.fecha);
            const est = l.estado || 'Pendiente';
            return (
              <tr key={l.id} className="bg-white hover:bg-slate-50 transition-all shadow-sm group">
                <td className="px-4 py-4 rounded-l-2xl border-y border-l border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><Car size={18} /></div>
                    <div className="flex flex-col">
                      <span className="text-base font-black text-slate-800 leading-none">{l.patente}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {l.marca} {l.modelo} {l.anio ? `(${l.anio})` : ''}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 border-y border-slate-50 text-center">
                  <select value={est} onChange={(e) => onCambiarEstado(l.id, e.target.value)} className={`text-[10px] font-black uppercase px-2 py-1.5 rounded-xl border outline-none cursor-pointer ${getStyle(est)}`}>
                    <option value="Pendiente">⏳ Pendiente</option>
                    <option value="Lavando">🧼 Lavando</option>
                    <option value="Terminado">✅ Terminado</option>
                  </select>
                </td>
                <td className="px-4 py-4 border-y border-slate-50 text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-600 font-bold text-xs">
                    <Gauge size={12} className="text-blue-500" />
                    {Number(l.km).toLocaleString()} <span className="text-[8px] text-slate-400">KM</span>
                  </div>
                </td>
                <td className="px-4 py-4 border-y border-slate-50 text-right">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-800 text-sm">{l.fecha?.split('-').reverse().join('/')}</span>
                    <span className={`text-[10px] font-bold ${dias >= 14 ? 'text-orange-500 animate-pulse' : 'text-blue-500'}`}>Hace {dias} días</span>
                  </div>
                </td>
                <td className="px-4 py-4 rounded-r-2xl border-y border-r border-slate-50 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => enviarWhatsApp(l.telefono, l.marca, l.patente)} className="p-2 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-sm"><MessageCircle size={16} /></button>
                    <button onClick={() => onEliminar(l.id)} className="p-2 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default TablaLavados;