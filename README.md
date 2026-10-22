# 📊 Dashboard de Inversión Publicitaria (1995 – 2030)

Plataforma analítica y ejecutiva de alto rendimiento para el análisis de la **evolución histórica (1995–2025)** y la **simulación predictiva a 5 períodos (2026–2030)** de la inversión publicitaria por medios de comunicación.

---

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.8-22c55e)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

---

## 📑 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Medios Publicitarios Monitoreados](#-medios-publicitarios-monitoreados)
- [Características y Módulos](#-características-y-módulos)
  - [1. Resumen Ejecutivo y KPIs](#1-resumen-ejecutivo-y-kpis)
  - [2. Tendencias Históricas (1995–2025)](#2-tendencias-históricas-19952025)
  - [3. Distribución y Market Share](#3-distribución-y-market-share)
  - [4. Rankings Comparativos](#4-rankings-comparativos)
  - [5. Simulador Predictivo a 5 Periodos](#5-simulador-predictivo-a-5-periodos)
  - [6. Hallazgos e Insights Estratégicos](#6-hallazgos-e-insights-estratégicos)
  - [7. Metodología y Calidad de Datos](#7-metodología-y-calidad-de-datos)
  - [8. Exportador de Informes Ejecutivos](#8-exportador-de-informes-ejecutivos)
- [Arquitectura y Stack Tecnológico](#-arquitectura-y-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Uso Local](#-instalación-y-uso-local)
- [Scripts Disponibles](#-scripts-disponibles)
- [Despliegue](#-despliegue)
- [Licencia](#-licencia)

---

## 💡 Descripción General

El **Dashboard de Inversión Publicitaria** está diseñado para directores de marketing (CMOs), agencias de medios, analistas financieros e investigadores de mercado. Ofrece una vista panorámica del cambio de paradigma en la inversión publicitaria durante las últimas tres décadas: desde el predominio absoluto de la televisión abierta y los medios impresos hasta la consolidación y liderazgo de los canales digitales y la publicidad exterior programática.

Además de documentar la serie histórica de **más de 30 años**, la aplicación incorpora un motor de proyección estadística que permite evaluar **3 escenarios a 5 periodos futuros** (Conservador, Base y Optimista), facilitando la planificación estratégica de presupuestos y la asignación de recursos.

---

## 📡 Medios Publicitarios Monitoreados

El dataset consolida información estructurada de 7 categorías de medios:

| Medio | Categoría | Descripción |
| :--- | :--- | :--- |
| **Digital** | Online / Programática | Portales informativos, redes sociales, motores de búsqueda, retail media y video online. |
| **TV Nacional** | Broadcast / Tradicional | Canales de televisión abierta de cobertura nacional. |
| **Radio** | Audio / Tradicional | Emisoras en amplitud y frecuencia modulada (AM/FM) con alcance nacional y regional. |
| **Publicidad Exterior (OOH)** | Vía Pública / DOOH | Vallas publicitarias, paraderos, mobiliario urbano y pantallas digitales en vía pública. |
| **Prensa** | Impreso | Diarios, matutinos y periódicos de circulación nacional y local. |
| **TV Regional y Local** | Broadcast | Televisión pública y privada de ámbito local o autonómico. |
| **Revistas** | Impreso | Publicaciones periódicas especializadas, corporativas y de consumo masivo. |

---

## 🚀 Características y Módulos

### 1. Resumen Ejecutivo y KPIs
- Métricas instantáneas de inversión total acumulada y del último ejercicio.
- Indicador del medio líder en volumen y su respectivo porcentaje de cuota.
- Tasa de Crecimiento Anual Compuesto (**CAGR**) histórica y proyectada.
- Alertas de variación interanual y tarjetas de resumen diseñadas bajo una estética oscura ejecutiva.

### 2. Tendencias Históricas (1995–2025)
- Gráficos interactivos de series de tiempo con curvas suaves.
- Filtro selector de rango de años (control interactivo deslizante / inputs).
- Alternancia de medios (activa o desactiva cualquier medio individual para comparar curvas aisladas).
- Modos de visualización dual: Valores monetarios absolutos y Porcentajes de participación relativa.

### 3. Distribución y Market Share
- Gráficos de área 100% apilada para apreciar la transformación estructural de la torta publicitaria.
- Selector de año específico para inspeccionar la cuota de mercado en gráficos de dona con tooltips descriptivos.

### 4. Rankings Comparativos
- Tabla ordenada dinámicamente por año seleccionado.
- Barras de participación porcentual en línea con codificación de colores uniforme para cada medio.
- Identificación inmediata del Top 3 y medios en declive o expansión.

### 5. Simulador Predictivo a 5 Periodos
- Modelado estadístico a 5 ejercicios futuros (2026 a 2030).
- **3 Escenarios configurables**:
  - 🛡️ **Conservador**: Tasas prudentes con menor dinamismo en canales tradicionales.
  - ⚖️ **Base**: Proyección tendencial alineada con las tasas CAGR de los últimos ciclos estables.
  - 🚀 **Optimista**: Escenario de aceleración de inversión global con mayor penetración digital.
- Comparativa visual entre la serie histórica consolidada y el intervalo proyectado con líneas punteadas y marcadores diferenciados.

### 6. Hallazgos e Insights Estratégicos
- Síntesis analítica generada automáticamente:
  - *La disrupción digital*: Año de inflexión en que Digital superó a la TV Nacional.
  - *La contracción de impresos*: Pérdida acumulada de cuota en Prensa y Revistas.
  - *Resiliencia de exteriores (OOH)*: Estabilización impulsada por la digitalización de pantallas urbanas (DOOH).
  - *Evolución de la televisión abierta*: Transición hacia formatos híbridos y Connected TV (CTV).

### 7. Metodología y Calidad de Datos
- Documentación transparente de fuentes, criterios de imputación de períodos iniciales (años 1995-1997 sin medición formal de exterior o digital) y fórmulas empleadas para los escenarios proyectivos.

### 8. Exportador de Informes Ejecutivos
- Generador de reportes en formato **HTML autónomo y listo para imprimir (PDF via Print)**.
- El informe exportado incluye:
  - Resumen ejecutivo con fecha de corte y metadatos.
  - Tablas completas formateadas en alta resolución.
  - Estilos tipográficos ejecutivos autocontenidos sin dependencias de red externas.
  - Opciones de exportación: *Reporte Completo*, *Solo Histórico*, o *Solo Proyecciones*.

---

## 🛠️ Arquitectura y Stack Tecnológico

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Empaquetador & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Visualización de Datos**: [Recharts 3](https://recharts.org/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Animaciones**: [Motion](https://motion.dev/) y CSS Transitions

---

## 📂 Estructura del Proyecto

```text
├── public/                 # Recursos públicos y favicon
├── src/
│   ├── components/         # Módulos y vistas principales de la aplicación
│   │   ├── Header.tsx              # Barra de navegación superior y acciones
│   │   ├── KpiSection.tsx          # Tarjetas de indicadores clave (KPIs)
│   │   ├── HistoricalSection.tsx   # Gráficos cronológicos 1995-2025
│   │   ├── ShareSection.tsx        # Cuota de mercado y áreas apiladas
│   │   ├── RankingSection.tsx      # Tabla comparativa y ordenamiento anual
│   │   ├── ProjectionSection.tsx   # Simulador predictivo a 5 periodos
│   │   ├── InsightsSection.tsx     # Hallazgos y conclusiones ejecutivas
│   │   ├── MethodologySection.tsx  # Documentación técnica del modelo
│   │   └── ExportReportModal.tsx   # Modal de configuración de exportación
│   ├── utils/              # Funciones auxiliares y algoritmos
│   │   ├── formatters.ts           # Formateo de moneda, porcentajes y cifras
│   │   ├── htmlExporter.ts         # Generador de informes HTML descargables
│   │   └── projections.ts          # Cálculos de CAGR, escenarios y métricas
│   ├── data.ts             # Dataset histórico (1995–2025) y metadatos de medios
│   ├── types.ts            # Interfaces y definiciones de tipos TypeScript
│   ├── App.tsx             # Componente contenedor con gestión de pestañas
│   ├── index.css           # Estilos globales y directivas Tailwind CSS v4
│   └── main.tsx            # Punto de entrada de la aplicación
├── index.html              # Plantilla HTML raíz y metadatos SEO/OpenGraph
├── metadata.json           # Descriptor de la aplicación
├── package.json            # Dependencias y scripts de ejecución
├── tsconfig.json           # Configuración de compilador TypeScript
└── vite.config.ts          # Configuración del empaquetador Vite
```

---

## 💻 Instalación y Uso Local

### Prerrequisitos
- **Node.js**: Versión 18.0 o superior recomendada.
- **npm** (o gestor de paquetes de su preferencia).

### Pasos

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/dashboard-inversion-publicitaria.git
   cd dashboard-inversion-publicitaria
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   El dashboard estará disponible automáticamente en `http://localhost:3000`.

---

## 📜 Scripts Disponibles

En el directorio raíz del proyecto puede ejecutar:

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia el entorno local de desarrollo con recarga rápida en el puerto 3000. |
| `npm run build` | Compila y optimiza la aplicación para producción en la carpeta `dist/`. |
| `npm run preview` | Previsualiza localmente el build de producción generado. |
| `npm run lint` | Ejecuta la verificación estática de tipos con `tsc --noEmit`. |
| `npm run clean` | Elimina artefactos temporales y directorios compilados (`dist/`). |

---

## 🌐 Despliegue

La aplicación es una SPA (Single Page Application) estática altamente optimizada que puede desplegarse en cualquier servicio de hosting moderno:

### Vercel
```bash
npx vercel
```

### Netlify
Arrastra la carpeta generada por `npm run build` (`dist/`) o vincula tu repositorio de GitHub con:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### GitHub Pages
Si se despliega en GitHub Pages bajo un subdirectorio, configure la propiedad `base` en `vite.config.ts`:
```ts
export default defineConfig({
  base: '/nombre-del-repositorio/',
  // ... resto de la configuración
});
```

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **Apache 2.0**. Consulte el archivo [LICENSE](LICENSE) o los encabezados de código para más detalles.
