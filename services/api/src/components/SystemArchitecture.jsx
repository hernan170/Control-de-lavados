import React from 'react';
import { Server, Cpu, Database, Globe, ArrowDown } from 'lucide-react';

export default function SystemArchitecture() {
  return (
    <div className="p-8 bg-slate-900 text-slate-100 min-h-screen flex flex-col items-center justify-center font-sans">
      <div className="max-w-4xl w-full bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-2xl">
        
        <h2 className="text-2xl font-bold text-center mb-2 text-cyan-400">Arquitectura del Sistema Backend</h2>
        <p className="text-slate-400 text-center text-sm mb-8">Flujo de orquestación, procesamiento analítico y almacenamiento en la nube.</p>

        <div className="flex flex-col items-center gap-4">
          
          {/* Bloque 1: Cliente / Entrada */}
          <div className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-4 flex items-center gap-4 shadow-md">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">Entrada / API Gateway</h3>
              <p className="text-xs text-slate-400">Peticiones HTTP externas o internas hacia la aplicación.</p>
            </div>
          </div>

          <ArrowDown className="text-slate-500 animate-bounce" size={20} />

          {/* Bloque 2: Backend Node.js */}
          <div className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-4 flex items-center gap-4 shadow-md">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Server size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">Backend Node.js (Express)</h3>
              <p className="text-xs text-slate-400">Orquestación de tareas, distribución de rutas y control de puertos (Port 8080 / 3000).</p>
            </div>
          </div>

          <ArrowDown className="text-slate-500 animate-bounce" size={20} />

          {/* Bloque 3: Worker en Kubernetes */}
          <div className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-4 flex items-center gap-4 shadow-md">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Cpu size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">Python Worker (Kubernetes / Minikube)</h3>
              <p className="text-xs text-slate-400">Procesamiento pesado en bucle continuo, análisis de Pareto (80/20) y RCA con Pandas.</p>
            </div>
          </div>

          <ArrowDown className="text-slate-500 animate-bounce" size={20} />

          {/* Bloque 4: BigQuery */}
          <div className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-4 flex items-center gap-4 shadow-md">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-lg">
              <Database size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">Google BigQuery / Cloud Storage</h3>
              <p className="text-xs text-slate-400">Persistencia y consulta de métricas analíticas listas para dashboards (<code>washcontrol_analytics</code>).</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
