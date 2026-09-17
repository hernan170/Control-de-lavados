const express = require('express');
const cors = require('cors');
const { Storage } = require('@google-cloud/storage');
const { BigQuery } = require('@google-cloud/bigquery');

const app = express();

// Permitir peticiones desde el frontend (Vite en puerto 5173)
app.use(cors());
app.use(express.json());

const storage = new Storage();
const bigquery = new BigQuery({
  projectId: process.env.PROJECT_ID || 'taller-506901',
  location: process.env.GCP_REGION || 'us-central1',
  keyFilename:'./key.json'
});

const DATASET_ID = process.env.DATASET_ID || 'washcontrol_analytics';
const TABLE_ID = process.env.TABLE_ID || 'pareto_rca_metrics';

app.get('/api/metrics/pareto', async (req, res) => {
  try {
    const query = `SELECT motivo, total_casos, porcentaje_acumulado, es_causa_raiz_80_20 
                   FROM \`${process.env.PROJECT_ID || 'taller-506901'}.${DATASET_ID}.${TABLE_ID}\``;

    const [rows] = await bigquery.query({ query });
    res.json({
      status: 'success',
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error al consultar BigQuery:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener métricas de Pareto',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend de orquestación corriendo en http://localhost:${PORT}`);
});
