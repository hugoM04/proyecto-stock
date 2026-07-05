import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler // Requerido para poder pintar el fondo debajo de la línea
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

function GraficaPortafolio({ historial }){

    // Construcción de los datos de la gráfica estilizada
    const data = {
        labels: historial.map(h => new Date(h.fecha).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })),
        datasets: [{
            label: "Valor del Portafolio",
            data: historial.map(h => h.valor),
            tension: 0.4, // Curvatura suave de la línea como en la imagen
            borderColor: "#2563eb", // Azul eléctrico vivo para el trazo
            borderWidth: 3, // Línea ligeramente más gruesa y firme
            pointBackgroundColor: "#2563eb",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 4, // Puntos visibles pero discretos
            pointHoverRadius: 6,
            fill: true, // Habilitamos el relleno inferior
            
            // Creamos el degradado difuminado idéntico al de tu imagen de referencia
            backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return null;
                
                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                gradient.addColorStop(0, "rgba(37, 99, 235, 0.25)"); // Azul semitransparente arriba
                gradient.addColorStop(1, "rgba(37, 99, 235, 0.00)"); // Completamente invisible abajo
                return gradient;
            }
        }]
    };

    // Opciones avanzadas de configuración para limpiar la interfaz de Chart.js
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // Ocultamos la etiqueta repetitiva de arriba para un diseño limpio
            },
            tooltip: {
                backgroundColor: "#0b132b", // Fondo oscuro tipo tooltip de tu imagen
                titleColor: "#ffffff",
                bodyColor: "#94a3b8",
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return ` Valor: $${context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false // Oculta las líneas verticales de la cuadrícula
                },
                ticks: {
                    color: "#94a3b8", // Texto gris suave para las fechas
                    font: { size: 11, weight: "500" }
                }
            },
            y: {
                grid: {
                    color: "#f1f5f9" // Líneas horizontales muy delgadas y tenues
                },
                ticks: {
                    color: "#94a3b8",
                    font: { size: 11, weight: "500" },
                    callback: function(value) {
                        return `$${value.toLocaleString('en-US')}`; // Formato de dinero en el eje Y
                    }
                }
            }
        }
    };

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mt-4">
            
            {/* Cabecera estilizada */}
            <div className="card-header bg-white border-bottom border-light py-3 px-4 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold d-flex align-items-center text-dark">
                    <i className="bi bi-graph-up text-primary me-2 fs-4"></i>
                    Evolución del Valor del Portafolio
                </h5>
                
                {/* Simulador de filtros de tiempo idéntico a tu imagen de referencia */}
                <div className="badge bg-light text-secondary border border-light-subtle p-2 rounded-3 d-none d-sm-block" style={{ fontSize: "0.8rem" }}>
                    <span className="px-2 py-1 rounded bg-primary text-white fw-semibold me-1" style={{ cursor: "pointer" }}>1M</span>
                    <span className="px-2 py-1 text-muted" style={{ cursor: "pointer" }}>3M</span>
                    <span className="px-2 py-1 text-muted" style={{ cursor: "pointer" }}>6M</span>
                    <span className="px-2 py-1 text-muted" style={{ cursor: "pointer" }}>Todo</span>
                </div>
            </div>

            {/* Cuerpo de la tarjeta con una altura fija para la gráfica */}
            <div className="card-body p-4">
                <div style={{ height: "320px", width: "100%" }}>
                    <Line data={data} options={options} />
                </div>
            </div>

        </div>
    );
}

export default GraficaPortafolio;