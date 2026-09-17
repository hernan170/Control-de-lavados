import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function ParetoChart() {
  const [data, setData] = useState([]);
  const [rawResponse, setRawResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:8080/api/metrics/pareto')
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((resData) => {
        setRawResponse(resData);

        let chartData = [];
        if (Array.isArray(resData)) {
          chartData = resData;
        } else if (resData && Array.isArray(resData.data)) {
          chartData = resData.data;
        } else if (resData && Array.isArray(resData.metrics)) {
          chartData = resData.metrics;
        }

        const formattedData = chartData.map((item) => ({
          motivo: item.motivo || item.categoria || item.causa || 'Sin nombre',
          total_casos: Number(item.total_casos || item.casos || item.count || 0),
          porcentaje_acumulado: Number(item.porcentaje_acumulado || item.pct_acumulado || 0)
        }));

        setData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#38bdf8' }}>
        <h3>⏳ Cargando métricas desde BigQuery...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '1.5rem', color: '#f87171', border: '1px solid #ef4444', borderRadius: '8px', backgroundColor: '#1e1b4b', margin: '1rem 0' }}>
        <h3 style={{ fontWeight: 'bold' }}>❌ No se pudo conectar con el Backend (Port 8080)</h3>
        <p style={{ marginTop: '0.5rem' }}>{error}</p>
        <button onClick={fetchData} style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Reintentar conexión
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155', boxSizing: 'border-box' }}>
      <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        📊 Análisis de Pareto / RCA - BigQuery Analytics
      </h2>
      <div style={{ width: '100%', height: 400, minHeight: 400 }}>
        <ResponsiveContainer width="100%" height={400} minWidth={100} minHeight={400}>
          <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="motivo" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
            <YAxis yAxisId="left" orientation="left" stroke="#38bdf8" label={{ value: 'Total Casos', angle: -90, position: 'insideLeft', fill: '#38bdf8' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" domain={[0, 100]} unit="%" label={{ value: '% Acumulado', angle: 90, position: 'insideRight', fill: '#f43f5e' }} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
            <Legend />
            <Bar yAxisId="left" dataKey="total_casos" name="Total Casos" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="porcentaje_acumulado" name="% Acumulado" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#f43f5e' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
