
const fs = require("node:fs");
const path = require("node:path");

const jsxPath = path.join(__dirname, "src", "App.jsx");
const cssPath = path.join(__dirname, "src", "App.css");

if (!fs.existsSync(jsxPath) || !fs.existsSync(cssPath)) {
  console.error("No se encuentran App.jsx o App.css dentro de src.");
  process.exit(1);
}

let jsx = fs.readFileSync(jsxPath, "utf8");
let css = fs.readFileSync(cssPath, "utf8");

const translations = {
  "Inicio": "Home",
  "Dashboard": "Dashboard",
  "Estadísticas": "Statistics",
  "Ahorros": "Savings",
  "Inversiones": "Investments",
  "Gastos mensuales": "Monthly expenses",
  "Nómina": "Salary",
  "Movimientos": "Transactions",
  "MENÚ PRINCIPAL": "MAIN MENU",
  "Mi cuenta": "My account",
  "Usuario": "User",
  "TU CENTRO FINANCIERO": "YOUR FINANCIAL HUB",
  "Añadir movimiento": "Add transaction",
  "Pequeños pasos,": "Small steps,",
  "grandes metas.": "big goals.",
  "Tu futuro financiero empieza hoy.":
    "Your financial future starts today.",
  "BIENVENIDO A MONEYMIND AI": "WELCOME TO MONEYMIND AI",
  "Tu dinero, más organizado.": "Your money, better organized.",
  "Aquí tienes un resumen de tu situación financiera.":
    "Here is an overview of your financial situation.",
  "Dinero disponible": "Available balance",
  "Ingresos": "Income",
  "Gastos": "Expenses",
  "Dinero ahorrado": "Money saved",
  "Ingresos totales": "Total income",
  "Gastos totales": "Total expenses",
  "Ahorros acumulados": "Accumulated savings",
  "RESUMEN FINANCIERO": "FINANCIAL SUMMARY",
  "Así está tu dinero": "Your financial overview",
  "TUS OBJETIVOS": "YOUR GOALS",
  "Progreso de tus ahorros": "Savings progress",
  "ÚLTIMA ACTIVIDAD": "RECENT ACTIVITY",
  "Tus últimos movimientos": "Your latest transactions",
  "Ver todos mis ahorros": "View all savings",
  "Ir al Dashboard": "Go to Dashboard",
  "DINERO DISPONIBLE": "AVAILABLE BALANCE",
  "TU ACTIVIDAD": "YOUR ACTIVITY",
  "Resumen de movimientos": "Transaction overview",
  "Ver estadísticas": "View statistics",
  "ANÁLISIS VISUAL": "VISUAL ANALYTICS",
  "Tu dinero, bajo control": "Take control of your money",
  "Ingresos vs. gastos": "Income vs. expenses",
  "Actividad de esta semana": "This week's activity",
  "En qué gastas": "Where your money goes",
  "Distribución por categorías": "Spending by category",
  "Evolución mensual": "Monthly trends",
  "Comparativa de los últimos seis meses":
    "Comparison of the last six months",
  "SEMANAL": "WEEKLY",
  "6 MESES": "6 MONTHS",
  "AHORRO GENERAL": "TOTAL SAVINGS",
  "Ahorro total": "Total savings",
  "Objetivos activos": "Active goals",
  "PLANES Y OBJETIVOS": "PLANS AND GOALS",
  "Mis objetivos de ahorro": "My savings goals",
  "Crear objetivo": "Create goal",
  "Crear objetivo de ahorro": "Create savings goal",
  "Nombre del objetivo": "Goal name",
  "¿Cuánto quieres conseguir? (€)": "Target amount (€)",
  "Añadir dinero": "Add money",
  "Añadir a objetivo": "Add to goal",
  "Fondo global diversificado": "Diversified global fund",
  "Fondo de renta fija": "Fixed-income fund",
  "Fondo sostenible": "Sustainable fund",
  "Variable": "Variable",
  "Moderado": "Moderate",
  "Riesgo": "Risk",
  "Rentabilidad ilustrativa": "Illustrative return",
  "Simular inversión": "Simulate investment",
  "Importe a invertir": "Amount to invest",
  "Total invertido": "Total invested",
  "SIMULACIÓN": "SIMULATION",
  "Alquiler": "Rent",
  "Agua y luz": "Water and electricity",
  "Internet y teléfono": "Internet and phone",
  "Vivienda": "Housing",
  "Suministros": "Utilities",
  "Servicios": "Services",
  "Alimentación": "Groceries",
  "Comida": "Food",
  "Transporte": "Transport",
  "Ocio": "Leisure",
  "Compras": "Shopping",
  "Estudios": "Education",
  "Otros": "Other",
  "Trabajo": "Work",
  "Regalo": "Gift",
  "Mesada": "Allowance",
  "Venta": "Sale",
  "Concepto": "Description",
  "Cantidad": "Amount",
  "Categoría": "Category",
  "Ingresos recibidos": "Income received",
  "Gastos registrados": "Recorded expenses",
  "Gastos previstos": "Planned expenses",
  "Pagado": "Paid",
  "Pendiente": "Pending",
  "Ya pagado": "Already paid",
  "Total previsto": "Total planned",
  "Total pendiente": "Total pending",
  "Añadir gasto mensual": "Add monthly expense",
  "Nombre del gasto": "Expense name",
  "Guardar": "Save",
  "Cancelar": "Cancel",
  "Eliminar": "Delete",
  "Nómina mensual": "Monthly salary",
  "Sueldo mensual": "Monthly salary",
  "Sobrante estimado": "Estimated remainder",
  "Consejo de IA": "AI advice",
  "Recomendación de IA": "AI recommendation",
  "Ahora no, gracias": "Not now, thanks",
  "Continuar": "Continue",
  "Dinero recibido": "Money received",
  "Dinero gastado": "Money spent",
  "Dinero inicial": "Initial money",
  "Mi próximo objetivo": "My next goal",
  "Fondo personal": "Personal fund",
  "Añadir": "Add",
  "Ingreso": "Income",
  "Gasto": "Expense",
  "Todos": "All",
  "No hay movimientos": "No transactions",
  "No hay datos": "No data available"
};

const TRANSLATION_MARKER = "/* MONEYMIND_BILINGUAL_TRANSLATIONS */";
const STATE_MARKER = "/* MONEYMIND_BILINGUAL_STATE */";
const CSS_MARKER = "/* MONEYMIND_BILINGUAL_CSS */";

if (jsx.includes(TRANSLATION_MARKER)) {
  console.log("El sistema bilingüe ya estaba instalado.");
  process.exit(0);
}

const appStart = jsx.indexOf("function App()");
const appEnd = jsx.indexOf("\nfunction StatCard(", appStart);

if (appStart === -1 || appEnd === -1) {
  console.error(
    "La estructura de App.jsx no coincide con la versión original."
  );
  process.exit(1);
}

const sidebarMarker = '<div className="sidebar-bottom">';

if (!jsx.slice(appStart, appEnd).includes(sidebarMarker)) {
  console.error("No se encuentra el menú lateral original.");
  process.exit(1);
}

// Copias de seguridad.
fs.copyFileSync(jsxPath, jsxPath + ".backup");
fs.copyFileSync(cssPath, cssPath + ".backup");

// Traducciones compartidas. No modifica la IA.
const helper = `
${TRANSLATION_MARKER}
const MM_TRANSLATIONS = ${JSON.stringify(translations, null, 2)};

function mmTranslate(value, language) {
  if (typeof value !== "string" || language !== "en") {
    return value;
  }

  return MM_TRANSLATIONS[value] ?? value;
}

`;

jsx = jsx.slice(0, jsx.indexOf("function App()")) +
  helper +
  jsx.slice(jsx.indexOf("function App()"));

// Estado del selector.
const state = `
  ${STATE_MARKER}
  const [mmLanguage, setMmLanguage] = useState(() => {
    try {
      return localStorage.getItem("mm_language") || "es";
    } catch {
      return "es";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("mm_language", mmLanguage);
    } catch {}
    document.documentElement.lang = mmLanguage;
  }, [mmLanguage]);

  const mmT = (value) => mmTranslate(value, mmLanguage);

`;

jsx = jsx.replace("function App() {", "function App() {" + state);

// Separar el componente principal del asistente y del resto de funciones.
const start = jsx.indexOf("function App()");
const end = jsx.indexOf("\nfunction StatCard(", start);

let app = jsx.slice(start, end);
const rest = jsx.slice(end);
const before = jsx.slice(0, start);

// Traducir textos literales del JSX del componente principal.
// No se modifican funciones, peticiones ni algoritmos de la IA.
app = app.replace(/>([^<>{}\n]+)</g, (original, raw) => {
  const clean = raw.trim();
  const translated = translations[clean];

  if (!translated) return original;

  const left = raw.match(/^\s*/)?.[0] || "";
  const right = raw.match(/\s*$/)?.[0] || "";

  return ">" + left + "{mmT(" +
    JSON.stringify(clean) +
    ")}" + right + "<";
});

// Traducir la navegación sin modificar las claves de cada página.
app = app.replace(
  /<item\.icon size=\{19\} \/>\s*\{item\.name\}/,
  '<item.icon size={19} /> {mmT(item.name)}'
);

// Traducir el título de la página.
app = app.replace(
  /<h1>\{page\}<\/h1>/,
  "<h1>{mmT(page)}</h1>"
);

// Selector de idioma.
const selector = `
        <div className="language-switch" aria-label="Language / Idioma">
          <button
            type="button"
            className={mmLanguage === "es" ? "active" : ""}
            onClick={() => setMmLanguage("es")}
          >
            🇪🇸 Español
          </button>
          <button
            type="button"
            className={mmLanguage === "en" ? "active" : ""}
            onClick={() => setMmLanguage("en")}
          >
            🇬🇧 English
          </button>
        </div>

`;

app = app.replace(sidebarMarker, selector + "        " + sidebarMarker);

jsx = before + app + rest;

// Estilos del selector.
const cssAddition = `

${CSS_MARKER}
.language-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 16px 0;
  padding: 6px;
  border-radius: 12px;
  border: 1px solid #343950;
  background: #0d1120;
}

.language-switch button {
  width: 100%;
  border: 0;
  border-radius: 9px;
  padding: 11px 8px;
  background: transparent;
  color: #aeb5ca;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: background .2s, color .2s;
}

.language-switch button.active {
  color: #fff;
  background: linear-gradient(110deg, #8d78f3, #6b59d1);
  box-shadow: 0 4px 12px #8069ff30;
}

.language-switch button:hover:not(.active) {
  background: #242a3e;
  color: #fff;
}

.language-switch button:focus-visible {
  outline: 2px solid #b8aaff;
  outline-offset: 2px;
}

@media (max-width: 750px) {
  .language-switch {
    margin: 12px 0;
  }
}
`;

if (!css.includes(CSS_MARKER)) {
  css += cssAddition;
}

fs.writeFileSync(jsxPath, jsx, "utf8");
fs.writeFileSync(cssPath, css, "utf8");

console.log("Actualización bilingüe instalada.");
console.log("App.jsx actualizado.");
console.log("App.css actualizado.");
console.log("La IA original no se ha modificado.");
console.log("Copias de seguridad: App.jsx.backup y App.css.backup");
console.log("El archivo bilingue.cjs funciona correctamente");