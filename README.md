# 🧼 WashControl Platform & Analytics Engine

Plataforma integral de gestión operativa y motor de analítica multicanal para **WashControl**. Esta arquitectura utiliza un modelo de **Monorepo Modular** desacoplado, alimentando tres capas de visualización diferenciadas (Operativa, Ejecutiva y Control de Calidad) desde un único Data Warehouse centralizado en Google Cloud Platform.

---

## 🏛️ Arquitectura del Sistema

```text
                        [ FUENTES DE DATOS ]
                 Sistemas Operativos / Tickets / Lavados
                                │
                                ▼
                    [ DATA WAREHOUSE CENTRAL ]
                      Google BigQuery (GCP)
                    (dataset: washcontrol_analytics)
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
         ▼                      ▼                      ▼
  [ REACT / NODE ]       [ LOOKER STUDIO ]        [ POWER BI ]
 Dashboard Operativo     Dashboard Ejecutivo   Control Estadístico
    (Pareto/RCA)            (NPS & Canales)       (Media, Mediana, Varianza)
📁 Estructura del Monorepo
Plaintext
washcontrol/
├── apps/
│   └── analytics-dashboard/   # App React + Recharts (Pareto RCA)
├── services/
│   ├── api/                   # API Node.js/Express (Adaptador BigQuery)
│   └── rca-worker/            # Worker Python para algoritmos analíticos pesados
├── data/
│   ├── bigquery/              # Schemas DDL, vistas SQL y consultas de análisis
│   └── k8s/                   # Manifiestos de despliegue para Kubernetes
├── docker-compose.yml         # Orquestación de contenedores locales
└── README.md                  # Documentación general de arquitectura
🚀 Inicio Rápido (Entorno Local)
Requisitos
Node.js v18+ / npm

Docker y Docker Compose (opcional)

Cuenta con acceso a GCP Proyecto taller-506901

Ejecución de Servicios
Iniciar Backend API (Puerto 8080):

Bash
cd services/api
npm install
npm run dev
Iniciar Frontend Dashboard (Puerto 5173):

Bash
cd apps/analytics-dashboard
npm install
npm run dev
Ejecución vía Docker Compose:

Bash
docker-compose up --build
📊 Capas de Visualización
Dashboard Operativo (React / Recharts): Visualización en tiempo real del Análisis de Causa Raíz (RCA) mediante diagramas de Pareto (80/20).

Dashboard Ejecutivo (Looker Studio): Seguimiento de satisfacción de clientes (NPS) y segmentación por canales (WhatsApp, Web, Teléfono).

Dashboard Estadístico (Power BI): Métricas de dispersión, control de calidad y estabilidad del servicio (Media, Mediana, Moda y Varianza).
