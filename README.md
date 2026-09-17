<<<<<<< HEAD
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
=======
# 🧼 WASH CONTROL v3.7
### Sistema Profesional de Gestión y Monitoreo de Lavaderos

**WASH CONTROL** es una solución integral para la digitalización de lavaderos de vehículos. Este sistema permite gestionar el flujo operativo de flotas, desde el ingreso por patente hasta el análisis de métricas semanales y exportación de reportes, bajo un entorno seguro y de alta velocidad.

🚀 **Acceso a la App:** [https://washcontrol.netlify.app/](https://washcontrol.netlify.app/)

---

## ✨ Características Principales
- 📝 **Registro Inteligente:** Formulario optimizado con persistencia en **LocalStorage** para evitar pérdida de datos por cierre accidental.
- 🔍 **Buscador Universal:** Filtrado avanzado en tiempo real por **Patente, Marca, Modelo o Kilometraje**.
- 📊 **Dashboard Estadístico:** Gráfico de actividad semanal construido con **Recharts**, optimizado para carga perezosa (Lazy Rendering).
- 💾 **Exportación Profesional:** Generación de reportes en **Excel (.xlsx)** con cálculo automático de historial de visitas del cliente.
- 🔔 **Feedback Sensorial:** Notificaciones visuales con **SweetAlert2** y alertas sonoras de sistema (Éxito, Terminado, Excel).
- 📱 **Diseño Responsive:** Interfaz moderna y adaptable a móviles, tablets y escritorio mediante **Tailwind CSS**.
- 🔒 **Sincronización Cloud:** Base de datos en tiempo real con **Firebase Firestore**.

---

## 🛠️ Stack Tecnológico Completo

Este proyecto se apoya en un ecosistema robusto de herramientas de desarrollo:

* **Entorno de Ejecución:** [Node.js](https://nodejs.org/) (Motor fundamental para la gestión de dependencias y compilación).
* **Framework:** [React.js](https://reactjs.org/) (Vite) para una arquitectura de componentes reactiva.
* **Base de Datos:** [Firebase Firestore](https://firebase.google.com/) (Sincronización en la nube en tiempo real).
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (Diseño Mobile-First altamente personalizado).
* **Análisis de Datos:** [Recharts](https://recharts.org/) (Gráficos estadísticos dinámicos).
* **Manipulación de Excel:** [SheetJS (XLSX)](https://sheetjs.com/) (Generador de planillas de cálculo).
* **Iconografía y Animaciones:** [Lucide-React](https://lucide.dev/) y [Framer Motion](https://www.framer.com/motion/).
* **Alertas:** [SweetAlert2](https://sweetalert2.github.io/).

---

## 📦 Estructura del Proyecto



```text
wash-control/
├── node_modules/         # Dependencias instaladas vía npm
├── src/
│   ├── componentes/
│   │   ├── Formulario.jsx    # Registro, persistencia local e iconos Lucide
│   │   └── Tabla.jsx         # Gestión de estados y acciones de Firebase
│   ├── App.jsx               # Dashboard central, buscador y lógica de Recharts
│   ├── firebase.config.js    # Credenciales y conexión con Firestore
│   └── index.css             # Estilos globales y configuraciones de Tailwind
├── public/                   # Activos estáticos y sonidos
├── .env                      # Variables de entorno (Firebase Config)
└── package.json              # Manifiesto de dependencias de Node.js
>>>>>>> origin/main
