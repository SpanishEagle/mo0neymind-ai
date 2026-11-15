import { useEffect, useMemo, useRef, useState } from "react";
import {
  Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, Sparkles,
  LayoutDashboard, ChartNoAxesCombined, Target, ArrowUpRight,
  ArrowDownRight, X, CircleDollarSign, CalendarDays, Trash2,
  CheckCircle2, Coins, House, BriefcaseBusiness, ReceiptText, LineChart, Bot, CalendarCheck, MessageCircle, Send, RotateCcw, Square
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import "./App.css";
import { queueCloudSave } from "./cloudSync";
import { InvestmentLab, MarketPage } from "./MarketLab";


// Bilingual interface: keys stored in Spanish keep saved data compatible.
const TRANSLATIONS_EN = {
  "Inicio": "Home",
  "Estadísticas": "Statistics",
  "Ahorros": "Savings",
  "Inversiones": "Investments",
  "Bolsa": "Stock market",
  "Gastos mensuales": "Monthly expenses",
  "Nómina": "Salary",
  "Claridad Hogar": "Household Clarity",
  "Otros": "Other",
  "Comida": "Food",
  "Transporte": "Transport",
  "Ocio": "Leisure",
  "Compras": "Shopping",
  "Estudios": "Education",
  "Trabajo": "Work",
  "Regalo": "Gift",
  "Mesada": "Allowance",
  "Venta": "Sale",
  "Vivienda": "Housing",
  "Suministros": "Utilities",
  "Servicios": "Services",
  "Alimentación": "Groceries",
  "Salud": "Health",
  "Alquiler": "Rent",
  "Agua y luz": "Water and electricity",
  "Internet y teléfono": "Internet and phone",
  "Dinero inicial": "Initial money",
  "Mi próximo objetivo": "My next goal",
  "Fondo personal": "Personal fund",
  "MENÚ PRINCIPAL": "MAIN MENU",
  "Mi cuenta": "My account",
  "Usuario": "User",
  "TU CENTRO FINANCIERO": "YOUR FINANCE HUB",
  "Añadir movimiento": "Add transaction",
  "Pequeños pasos,": "Small steps,",
  "grandes metas.": "big goals.",
  "Tu futuro financiero empieza hoy.": "Your financial future starts today.",
  "BIENVENIDO A MONEYMIND AI": "WELCOME TO MONEYMIND AI",
  "Tu dinero, más organizado.": "Your money, better organized.",
  "Aquí tienes un resumen de tu situación financiera.": "Here is an overview of your finances.",
  "Dinero disponible": "Available balance",
  "Ingresos": "Income",
  "Dinero ahorrado": "Money saved",
  "Fuera de tus ahorros": "Excluding your savings",
  "Dinero recibido": "Money received",
  "En todos tus objetivos": "Across all your goals",
  "RESUMEN FINANCIERO": "FINANCIAL OVERVIEW",
  "Así está tu dinero": "Your money at a glance",
  "Ingresos totales": "Total income",
  "Gastos totales": "Total expenses",
  "Ahorros acumulados": "Total savings",
  "TUS OBJETIVOS": "YOUR GOALS",
  "Progreso de tus ahorros": "Savings progress",
  "Todavía no tienes objetivos de ahorro.": "You have no savings goals yet.",
  "Ver todos mis ahorros": "View all my savings",
  "ÚLTIMA ACTIVIDAD": "LATEST ACTIVITY",
  "Tus últimos movimientos": "Your latest transactions",
  "Ir al Dashboard": "Go to dashboard",
  "DINERO DISPONIBLE": "AVAILABLE BALANCE",
  "Este es tu dinero libre después de descontar gastos y ahorros.": "This is your available money after expenses and savings.",
  "Dinero que has recibido": "Money you have received",
  "Dinero que has gastado": "Money you have spent",
  "Dinero apartado para tus metas": "Money set aside for your goals",
  "TU ACTIVIDAD": "YOUR ACTIVITY",
  "Resumen de movimientos": "Transaction overview",
  "Ver estadísticas": "View statistics",
  "Balance": "Balance",
  "Ingresos menos gastos": "Income minus expenses",
  "Todos tus ingresos registrados": "All recorded income",
  "Todos tus gastos registrados": "All recorded expenses",
  "ANÁLISIS VISUAL": "VISUAL ANALYSIS",
  "Tu dinero, bajo control": "Keep your finances under control",
  "Ingresos vs. gastos": "Income vs. expenses",
  "Actividad de esta semana": "This week’s activity",
  "SEMANAL": "WEEKLY",
  "En qué gastas": "Where your money goes",
  "Distribución por categorías": "Breakdown by category",
  "Añade gastos para ver tus categorías.": "Add expenses to see your categories.",
  "Evolución mensual": "Monthly trends",
  "Comparativa de los últimos seis meses": "Comparison over the last six months",
  "6 MESES": "6 MONTHS",
  "AHORRO GENERAL": "TOTAL SAVINGS",
  "La suma de todo el dinero que tienes apartado en tus objetivos.": "The total amount set aside for your goals.",
  "Ahorro total": "Total savings",
  "Todos tus objetivos juntos": "All your goals combined",
  "Objetivos activos": "Active goals",
  "Metas que estás intentando alcanzar": "Goals you are working towards",
  "PLANES Y OBJETIVOS": "PLANS AND GOALS",
  "Mis objetivos de ahorro": "My savings goals",
  "Nuevo objetivo": "New goal",
  "Añadir dinero": "Add money",
  "Todavía no tienes objetivos. ¡Crea el primero!": "No goals yet. Create your first one!",
  "Consejo MoneyMind": "MoneyMind tip",
  "Ahorrar un poco de forma constante puede ayudarte a alcanzar tus objetivos. ¡Cada paso cuenta!": "Saving a little consistently can help you reach your goals. Every step counts!",
  "EXPLORAR FONDOS": "EXPLORE FUNDS",
  "Fondos de ejemplo": "Example funds",
  "APRENDER SOBRE INVERSIÓN": "LEARN ABOUT INVESTING",
  "Tu cartera de inversión simulada.": "Your simulated investment portfolio.",
  "Prueba aportaciones ficticias y entiende cómo pueden variar los fondos.": "Try virtual contributions and learn how fund values can change.",
  "No se mueve dinero real ni se compra ningún producto financiero.": "No real money is transferred and no financial products are purchased.",
  "Riesgo ilustrativo": "Illustrative risk",
  "Supuesto anual de ejemplo": "Illustrative annual assumption",
  "SIMULACIÓN": "SIMULATION",
  "Añadir a simulación": "Add to simulation",
  "Seleccionar fondo": "Select fund",
  "Fondo": "Fund",
  "Registrar aportación virtual": "Record virtual contribution",
  "Mis aportaciones": "My contributions",
  "Registro de tus pruebas de inversión.": "Record of your investment simulations.",
  "MoneyMind AI · Guía educativa": "MoneyMind AI · Educational guide",
  "Antes de invertir, aprende qué son el riesgo, la diversificación, las comisiones y el horizonte temporal. La rentabilidad no está garantizada y puedes perder dinero. Esta simulación no recomienda comprar fondos reales.": "Before investing, learn about risk, diversification, fees and time horizons. Returns are not guaranteed and you could lose money. This simulation does not recommend buying real funds.",
  "CONTROL DE RECIBOS": "BILL TRACKER",
  "Todos tus gastos mensuales, organizados.": "All your monthly expenses, organized.",
  "Marca los pagos que ya has realizado y controla lo que queda pendiente.": "Mark payments you have made and track what is still due.",
  "Gastos mensuales previstos": "Expected monthly expenses",
  "Suma de todos los recibos": "Total of all bills",
  "Ya pagado": "Already paid",
  "Pagos marcados como realizados": "Payments marked as completed",
  "Pendiente": "Pending",
  "Pagos todavía sin marcar": "Payments not yet marked as paid",
  "Añadir gasto mensual": "Add monthly expense",
  "Introduce un recibo o gasto recurrente.": "Enter a bill or recurring expense.",
  "Concepto": "Description",
  "Categoría": "Category",
  "Importe mensual (€)": "Monthly amount (€)",
  "Añadir gasto": "Add expense",
  "Tu lista de gastos": "Your expense list",
  "Los cambios se guardan automáticamente en este navegador.": "Changes are saved automatically in this browser.",
  "Pagado": "Paid",
  "Eliminar gasto": "Delete expense",
  "Añade tu primer gasto mensual.": "Add your first monthly expense.",
  "PLANIFICADOR DE INGRESOS": "INCOME PLANNER",
  "Organiza tu nómina antes de gastar.": "Plan your salary before spending.",
  "Introduce tus ingresos y calcula cuánto queda después de los gastos mensuales.": "Enter your income and calculate what remains after monthly expenses.",
  "INGRESO NETO MENSUAL": "MONTHLY NET INCOME",
  "¿Cuánto recibes al mes?": "How much do you receive per month?",
  "Introduce el importe que llega a tu cuenta, después de impuestos y retenciones.": "Enter the amount that reaches your account after taxes and deductions.",
  "Nómina (€)": "Salary (€)",
  "Nómina mensual": "Monthly salary",
  "Ingreso neto introducido": "Net income entered",
  "Gastos previstos": "Expected expenses",
  "Todos tus gastos mensuales": "All monthly expenses",
  "Sobrante estimado": "Estimated remainder",
  "Nómina menos gastos previstos": "Salary minus expected expenses",
  "Resumen de pagos": "Payment overview",
  "El cálculo incluye tanto los gastos pagados como los pendientes.": "The calculation includes both paid and pending expenses.",
  "Gestionar gastos": "Manage expenses",
  "MoneyMind AI · Análisis de tu presupuesto": "MoneyMind AI · Budget analysis",
  "Orientación educativa basada únicamente en los datos que has introducido; no es asesoramiento financiero personalizado.": "Educational guidance based only on the data you entered; not personalized financial advice.",
  "Tipo de movimiento": "Transaction type",
  "Ingreso": "Income",
  "Gasto": "Expense",
  "Cantidad (€)": "Amount (€)",
  "¿Cuál de tus gastos mensuales es?": "Which monthly expense is it?",
  "Otro gasto mensual (lo escribo yo)": "Another monthly expense (I will enter it)",
  "Guardar movimiento": "Save transaction",
  "¡Ingreso añadido!": "Income added!",
  "¿Quieres aprovechar este ingreso para poner una parte en tus ahorros?": "Would you like to set aside part of this income as savings?",
  "Elige tu objetivo": "Choose your goal",
  "¿Cuánto quieres ahorrar? (€)": "How much would you like to save? (€)",
  "Ahora no, gracias": "Not now, thanks",
  "Confirmar": "Confirm",
  "Nombre del objetivo": "Goal name",
  "¿Cuánto quieres conseguir? (€)": "How much would you like to save? (€)",
  "Crear objetivo": "Create goal",
  "Crear objetivo de ahorro": "Create savings goal",
  "Eliminar movimiento": "Delete transaction",
  "Eliminar aportación": "Delete contribution",
  "Todavía no tienes movimientos registrados.": "You have not recorded any transactions yet.",
  "Todavía no has registrado aportaciones virtuales.": "You have not recorded any virtual contributions yet.",
  "Disponible en la app": "Available in the app",
  "Aportado en simulación": "Invested in simulation",
  "Balance menos ahorros": "Balance minus savings",
  "Dinero virtual registrado": "Virtual money recorded",
  "Perfiles educativos": "Educational profiles",
  "OBJETIVO": "GOAL",
  "Ej. Gimnasio": "E.g. Gym",
  "Ej. Mesada, compra...": "E.g. Allowance, shopping...",
  "Ej. Nuevo ordenador": "E.g. New computer",
  "Ej. 10": "E.g. 10",
  "Ej. 25": "E.g. 25",
  "Asistente MoneyMind": "MoneyMind Assistant",
  "Asistente MoneyMind AI": "MoneyMind AI Assistant",
  "IA conectada": "AI connected",
  "Modo local": "Local mode",
  "Nueva conversación": "New conversation",
  "Cerrar chat": "Close chat",
  "Detener respuesta": "Stop response",
  "Detener": "Stop",
  "Enviar": "Send",
  "Abrir asistente": "Open assistant",
  "Cerrar asistente": "Close assistant",
  "Escribe tu pregunta… (Intro para enviar)": "Type your question… (Enter to send)",
  "Orientación educativa; no es asesoramiento financiero.": "Educational guidance; not financial advice.",
  "La IA puede equivocarse. ": "AI can make mistakes. ",
  "Fondo global diversificado": "Diversified global fund",
  "Fondo de renta fija": "Fixed-income fund",
  "Fondo sostenible": "Sustainable fund",
  "Variable": "Variable",
  "Moderado": "Moderate",
  "Ejemplo educativo de exposición amplia a mercados globales.": "Educational example of broad exposure to global markets.",
  "Ejemplo educativo centrado en deuda; también puede perder valor.": "Educational example focused on bonds; it can also lose value.",
  "Ejemplo educativo con criterios ambientales y sociales.": "Educational example with environmental and social criteria."
};
let currentLanguage = "es";
function tr(value) {
  if (typeof value !== "string") return value;
  return currentLanguage === "en" ? (TRANSLATIONS_EN[value] ?? value) : value;
}

const initialTransactions = [
  { id: 1, name: "Dinero inicial", category: "Otros", type: "income", amount: 300, date: new Date().toISOString() },
  { id: 2, name: "Comida", category: "Comida", type: "expense", amount: 25, date: new Date().toISOString() },
  { id: 3, name: "Transporte", category: "Transporte", type: "expense", amount: 12, date: new Date().toISOString() },
  { id: 4, name: "Ocio", category: "Ocio", type: "expense", amount: 18, date: new Date().toISOString() }
];

const initialGoals = [
  { id: 1, name: "Mi próximo objetivo", target: 500, saved: 25, color: "#9b87ff" },
  { id: 2, name: "Fondo personal", target: 300, saved: 15, color: "#39c6bd" }
];

const EXPENSE_CATEGORIES = ["Comida", "Transporte", "Ocio", "Compras", "Estudios", "Gastos mensuales", "Otros"];
const INCOME_CATEGORIES = ["Otros", "Trabajo", "Regalo", "Mesada", "Venta"];

// El chat usa solo cálculos locales. No utiliza VITE_AI_ENDPOINT ni ninguna API.

const euro = value => new Intl.NumberFormat("es-ES", {
  style: "currency", currency: "EUR"
}).format(value);

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function App({ accountEmail = "", onOpenAccount = () => {} }) {
  const [language, setLanguage] = useState(() => readStorage("mm_language", "es"));
  currentLanguage = language;
  useEffect(() => {
    localStorage.setItem("mm_language", language); queueCloudSave();
    document.documentElement.lang = language;
  }, [language]);

  const [transactions, setTransactions] = useState(() =>
    readStorage("mm_transactions", initialTransactions)
  );
  const [goals, setGoals] = useState(() =>
    readStorage("mm_goals", initialGoals)
  );

  const [page, setPage] = useState("Inicio");
  const [showTransaction, setShowTransaction] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [pendingIncome, setPendingIncome] = useState(null);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [saveAmount, setSaveAmount] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");

  const [form, setForm] = useState({
    name: "", amount: "", type: "expense", category: "Comida", billId: ""
  });
  const [goalForm, setGoalForm] = useState({ name: "", target: "" });
  const [salary, setSalary] = useState(() => readStorage("mm_salary", 2000));
  const [bills, setBills] = useState(() => readStorage("mm_bills", [
    { id: 1, name: "Alquiler", category: "Vivienda", amount: 750, paid: false },
    { id: 2, name: "Agua y luz", category: "Suministros", amount: 100, paid: false },
    { id: 3, name: "Internet y teléfono", category: "Servicios", amount: 50, paid: false },
    { id: 4, name: "Comida", category: "Alimentación", amount: 250, paid: false },
    { id: 5, name: "Transporte", category: "Transporte", amount: 100, paid: false }
  ]));
  const [billForm, setBillForm] = useState({ name: "", category: "Vivienda", amount: "" });
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [selectedFund, setSelectedFund] = useState("global");
  const [investments, setInvestments] = useState(() => readStorage("mm_investments", []));

  useEffect(() => {
    localStorage.setItem("mm_transactions", JSON.stringify(transactions)); queueCloudSave();
  }, [transactions, language]);

  useEffect(() => {
    localStorage.setItem("mm_goals", JSON.stringify(goals)); queueCloudSave();
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("mm_salary", JSON.stringify(salary)); queueCloudSave();
  }, [salary]);

  useEffect(() => {
    localStorage.setItem("mm_bills", JSON.stringify(bills)); queueCloudSave();
  }, [bills]);

  useEffect(() => {
    localStorage.setItem("mm_investments", JSON.stringify(investments)); queueCloudSave();
  }, [investments]);

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);
  const totalMoney = income - expenses;
  const investedTotal = investments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const balance = totalMoney - totalSaved - investedTotal;
  const monthlyBillsTotal = bills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  const paidBillsTotal = bills.filter(bill => bill.paid).reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  const unpaidBillsTotal = monthlyBillsTotal - paidBillsTotal;
  const salaryRemaining = Number(salary || 0) - monthlyBillsTotal;

  const funds = [
    { id: "global", name: "Fondo global diversificado", risk: "Variable", description: "Ejemplo educativo de exposición amplia a mercados globales.", rate: 0.05 },
    { id: "bonds", name: "Fondo de renta fija", risk: "Moderado", description: "Ejemplo educativo centrado en deuda; también puede perder valor.", rate: 0.02 },
    { id: "sustainable", name: "Fondo sostenible", risk: "Variable", description: "Ejemplo educativo con criterios ambientales y sociales.", rate: 0.04 }
  ];
  const addBill = e => {
    e.preventDefault();
    const amount = Number(billForm.amount);
    if (!billForm.name.trim() || !Number.isFinite(amount) || amount <= 0) return;
    setBills(prev => [...prev, { id: Date.now(), ...billForm, amount, paid: false }]);
    setBillForm({ name: "", category: "Vivienda", amount: "" });
  };
  const toggleBillPaid = id => setBills(prev => prev.map(bill => bill.id === id ? { ...bill, paid: !bill.paid } : bill));
  const deleteBill = id => setBills(prev => prev.filter(bill => bill.id !== id));
  const addInvestment = e => {
    e.preventDefault();
    const amount = Number(investmentAmount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > Math.max(0, balance)) return;
    const fund = funds.find(item => item.id === selectedFund);
    if (!fund) return;
    setInvestments(prev => [...prev, { id: Date.now(), fundId: fund.id, fundName: fund.name, amount, date: new Date().toISOString(), illustrativeRate: fund.rate }]);
    setInvestmentAmount("");
  };

  const addTransaction = e => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount <= 0 || !form.name.trim()) return;

    // Si el gasto está vinculado a un gasto mensual, lo marcamos como pagado
    const linkedBillId = form.type === "expense" && form.category === "Gastos mensuales" && form.billId
      ? Number(form.billId)
      : null;

    const transaction = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      type: form.type,
      amount,
      date: new Date().toISOString(),
      ...(linkedBillId ? { billId: linkedBillId } : {})
    };

    setTransactions(prev => [transaction, ...prev]);
    if (linkedBillId) {
      setBills(prev => prev.map(bill => bill.id === linkedBillId ? { ...bill, paid: true } : bill));
    }
    setShowTransaction(false);
    setForm({ name: "", amount: "", type: "expense", category: "Comida", billId: "" });

    if (transaction.type === "income") {
      setPendingIncome(transaction);
      setSaveAmount("");
      setSelectedGoal(goals[0]?.id?.toString() || "");
      setShowSavePrompt(true);
    }
  };

  const confirmSaving = () => {
    const amount = Number(saveAmount);
    if (amount > 0 && amount <= pendingIncome.amount && selectedGoal) {
      setGoals(prev => prev.map(goal =>
        goal.id === Number(selectedGoal)
          ? { ...goal, saved: goal.saved + amount }
          : goal
      ));
    }
    setShowSavePrompt(false);
    setPendingIncome(null);
  };

  const addGoal = e => {
    e.preventDefault();
    const target = Number(goalForm.target);
    if (!goalForm.name.trim() || target <= 0) return;

    setGoals(prev => [...prev, {
      id: Date.now(),
      name: goalForm.name.trim(),
      target,
      saved: 0,
      color: ["#9b87ff", "#39c6bd", "#ffb86b", "#ed82b5", "#6e9cff"][prev.length % 5]
    }]);

    setGoalForm({ name: "", target: "" });
    setShowGoal(false);
  };

  const addToGoal = id => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const raw = prompt(`¿Cuánto quieres añadir a "${goal.name}"?`);
    if (raw === null) return;

    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Introduce una cantidad válida.");
      return;
    }
    if (amount > balance) {
      alert("No tienes suficiente dinero disponible para apartar esa cantidad.");
      return;
    }

    setGoals(prev => prev.map(g =>
      g.id === id ? { ...g, saved: g.saved + amount } : g
    ));
  };

  const deleteTransaction = id => {
    const removed = transactions.find(t => t.id === id);
    // Si el movimiento estaba vinculado a un gasto mensual, vuelve a quedar pendiente
    if (removed?.billId) {
      setBills(prev => prev.map(bill => bill.id === removed.billId ? { ...bill, paid: false } : bill));
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const pendingBills = bills.filter(bill => !bill.paid);

  const selectMonthlyBill = billId => {
    const bill = bills.find(b => String(b.id) === billId);
    setForm(prev => bill
      ? { ...prev, billId, name: bill.name, amount: String(bill.amount) }
      : { ...prev, billId: "" });
  };

  const weeklyData = useMemo(() => {
    const days = language === "en" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

    return days.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);

      const sameDay = transactions.filter(t =>
        new Date(t.date).toDateString() === date.toDateString()
      );

      return {
        day,
        ingresos: sameDay.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0),
        gastos: sameDay.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
      };
    });
  }, [transactions, language]);

  const categoryData = useMemo(() => {
    const totals = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });

    const colors = ["#9b87ff", "#39c6bd", "#ffb86b", "#ed82b5", "#6e9cff", "#f07878"];
    return Object.entries(totals).map(([name, value], i) => ({
      name, value, color: colors[i % colors.length]
    }));
  }, [transactions]);

  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const month = date.getMonth();
      const year = date.getFullYear();

      const items = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });

      return {
        month: date.toLocaleDateString(language === "en" ? "en-GB" : "es-ES", { month: "short" }),
        ingresos: items.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0),
        gastos: items.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
      };
    });
  }, [transactions, language]);

  const aiContext = {
    fechaHoy: new Date().toISOString().slice(0, 10),
    paginaActual: page,
    disponible: balance,
    ingresos: income,
    gastos: expenses,
    ahorrado: totalSaved,
    invertidoSimulado: investedTotal,
    nomina: Number(salary || 0),
    gastosMensualesPrevistos: monthlyBillsTotal,
    gastosMensualesPagados: paidBillsTotal,
    gastosMensualesPendientes: unpaidBillsTotal,
    sobranteEstimado: salaryRemaining,
    objetivos: goals.map(g => ({ nombre: g.name, meta: g.target, ahorrado: g.saved })),
    gastosMensuales: bills.map(b => ({ concepto: b.name, categoria: b.category, importe: Number(b.amount), pagado: b.paid })),
    gastosPorCategoria: categoryData.map(c => ({ categoria: c.name, total: c.value })),
    ultimosMovimientos: transactions.slice(0, 10).map(t => ({
      concepto: t.name, categoria: t.category, tipo: t.type === "income" ? "ingreso" : "gasto",
      importe: t.amount, fecha: t.date.slice(0, 10)
    }))
  };

  const nav = [
    { name: "Inicio", icon: House },
    { name: "Dashboard", icon: Wallet },
    { name: "Estadísticas", icon: ChartNoAxesCombined },
    { name: "Ahorros", icon: Target },
    { name: "Inversiones", icon: LineChart },
    { name: "Bolsa", icon: ChartNoAxesCombined },
    { name: "Gastos mensuales", icon: ReceiptText },
    { name: "Nómina", icon: BriefcaseBusiness },
    { name: "Claridad Hogar", icon: House }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Sparkles size={22} /></div>
          <div><strong>MoneyMind</strong><span>AI FINANCE</span></div>
        </div>

        <p className="side-label">{tr("MENÚ PRINCIPAL")}</p>
        <nav>
          {nav.map(item => (
            <button
              key={tr(item.name)}
              className={`nav-item ${page === item.name ? "active" : ""}`}
              onClick={() => setPage(item.name)}
            >
              <item.icon size={19} /> {tr(item.name)}
            </button>
          ))}
        </nav>

        <div className="language-switch" role="group" aria-label="Language / Idioma">
          <button type="button" className={language === "es" ? "active" : ""} onClick={() => setLanguage("es")}>🇪🇸 Español</button>
          <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>🇬🇧 English</button>
        </div>
        <div className="sidebar-bottom">
          <div className="side-tip">
            <Sparkles size={18} />
            <strong>{tr("Pequeños pasos,")}<br />{tr("grandes metas.")}</strong>
            <span>{tr("Tu futuro financiero empieza hoy.")}</span>
          </div>
          <button type="button" className="profile mm-account-trigger" onClick={onOpenAccount} aria-label={language === "en" ? "Open account settings" : "Abrir ajustes de mi cuenta"}>
            <div className="avatar">{accountEmail ? accountEmail.charAt(0).toUpperCase() : "M"}</div>
            <div className="mm-account-trigger-text">
              <strong>{tr("Mi cuenta")}</strong>
              <span title={accountEmail}>{accountEmail || tr("Usuario")}</span>
            </div>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">{tr("TU CENTRO FINANCIERO")}</span>
            <h1>{tr(page)}</h1>
          </div>
          <div className="top-actions">
            <span className="date-chip">
              <CalendarDays size={15} />
              {new Date().toLocaleDateString(language === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "long" })}
            </span>
            <button className="primary-button" onClick={() => setShowTransaction(true)}>
              <Plus size={18} /> Añadir movimiento
            </button>
          </div>
        </header>

        {page === "Inicio" && (
          <>
            <div className="welcome-banner">
              <div>
                <span className="eyebrow">{tr("BIENVENIDO A MONEYMIND AI")}</span>
                <h2>{tr("Tu dinero, más organizado.")}</h2>
                <p>{tr("Aquí tienes un resumen de tu situación financiera.")}</p>
              </div>
              <Sparkles size={45} />
            </div>

            <section className="stat-grid">
              <StatCard icon={Wallet} label={tr("Dinero disponible")} value={euro(balance)} tone="purple" note={tr("Fuera de tus ahorros")} />
              <StatCard icon={TrendingUp} label={tr("Ingresos")} value={euro(income)} tone="green" note={tr("Dinero recibido")} />
              <StatCard icon={PiggyBank} label={tr("Dinero ahorrado")} value={euro(totalSaved)} tone="purple" note={tr("En todos tus objetivos")} />
            </section>

            <div className="home-grid">
              <div className="panel home-summary">
                <span className="eyebrow">{tr("RESUMEN FINANCIERO")}</span>
                <h3>{tr("Así está tu dinero")}</h3>
                <div className="home-summary-row">
                  <span>{tr("Ingresos totales")}</span>
                  <strong className="amount-positive">{euro(income)}</strong>
                </div>
                <div className="home-summary-row">
                  <span>{tr("Gastos totales")}</span>
                  <strong className="amount-negative">{euro(expenses)}</strong>
                </div>
                <div className="home-summary-row">
                  <span>{tr("Ahorros acumulados")}</span>
                  <strong>{euro(totalSaved)}</strong>
                </div>
                <div className="home-summary-row total-row">
                  <span>{tr("Dinero disponible")}</span>
                  <strong>{euro(balance)}</strong>
                </div>
              </div>

              <div className="panel home-summary">
                <span className="eyebrow">{tr("TUS OBJETIVOS")}</span>
                <h3>{tr("Progreso de tus ahorros")}</h3>
                {goals.length === 0 ? (
                  <p className="home-muted">{tr("Todavía no tienes objetivos de ahorro.")}</p>
                ) : goals.slice(0, 3).map(goal => (
                  <div className="mini-goal" key={goal.id}>
                    <div>
                      <strong>{goal.name}</strong>
                      <span>{euro(goal.saved)} de {euro(goal.target)}</span>
                    </div>
                    <div className="progress-track">
                      <div style={{
                        width: `${Math.min(100, goal.saved / goal.target * 100)}%`,
                        background: goal.color
                      }} />
                    </div>
                  </div>
                ))}
                <button className="text-button" onClick={() => setPage("Ahorros")}>
                  Ver todos mis ahorros <ArrowUpRight size={16} />
                </button>
              </div>
            </div>

            <div className="section-heading">
              <div><span className="eyebrow">{tr("ÚLTIMA ACTIVIDAD")}</span><h2>{tr("Tus últimos movimientos")}</h2></div>
              <button className="text-button" onClick={() => setPage("Dashboard")}>
                Ir al Dashboard <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="panel transaction-panel">
              <TransactionList transactions={transactions.slice(0, 4)} onDelete={deleteTransaction} />
            </div>
          </>
        )}

        {page === "Dashboard" && (
          <>
            <section className="hero-card">
              <div className="hero-content">
                <span className="hero-label"><Wallet size={16} /> {tr("DINERO DISPONIBLE")}</span>
                <h2>{euro(balance)}</h2>
                <p>{tr("Este es tu dinero libre después de descontar gastos y ahorros.")}</p>
                <div className="hero-stats">
                  <div><span><TrendingUp size={15} /> {tr("Ingresos")}</span><strong>{euro(income)}</strong></div>
                  <div><span><TrendingDown size={15} /> Gastos</span><strong>{euro(expenses)}</strong></div>
                </div>
              </div>
              <div className="hero-orb orb-one" />
              <div className="hero-orb orb-two" />
              <div className="hero-decoration"><CircleDollarSign size={100} /></div>
            </section>

            <section className="stat-grid">
              <StatCard icon={TrendingUp} label={tr("Ingresos totales")} value={euro(income)} tone="green" note={tr("Dinero que has recibido")} />
              <StatCard icon={TrendingDown} label={tr("Gastos totales")} value={euro(expenses)} tone="red" note={tr("Dinero que has gastado")} />
              <StatCard icon={PiggyBank} label="Total ahorrado" value={euro(totalSaved)} tone="purple" note={tr("Dinero apartado para tus metas")} />
            </section>

            <div className="section-heading">
              <div><span className="eyebrow">{tr("TU ACTIVIDAD")}</span><h2>{tr("Resumen de movimientos")}</h2></div>
              <button className="text-button" onClick={() => setPage("Estadísticas")}>
                Ver estadísticas <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="panel transaction-panel">
              <TransactionList transactions={transactions.slice(0, 6)} onDelete={deleteTransaction} />
            </div>
          </>
        )}

        {page === "Estadísticas" && (
          <>
            <section className="stat-grid">
              <StatCard icon={TrendingUp} label={tr("Ingresos")} value={euro(income)} tone="green" note={tr("Todos tus ingresos registrados")} />
              <StatCard icon={TrendingDown} label="Gastos" value={euro(expenses)} tone="red" note={tr("Todos tus gastos registrados")} />
              <StatCard icon={Wallet} label={tr("Balance")} value={euro(totalMoney)} tone="purple" note={tr("Ingresos menos gastos")} />
            </section>

            <div className="section-heading">
              <div><span className="eyebrow">{tr("ANÁLISIS VISUAL")}</span><h2>{tr("Tu dinero, bajo control")}</h2></div>
            </div>

            <section className="charts-grid">
              <div className="panel chart-panel large-chart">
                <div className="panel-heading">
                  <div><h3>{tr("Ingresos vs. gastos")}</h3><p>{tr("Actividad de esta semana")}</p></div>
                  <span className="chart-tag">{tr("SEMANAL")}</span>
                </div>
                <div className="chart-legend">
                  <span><i className="legend-dot income-dot" /> {tr("Ingresos")}</span>
                  <span><i className="legend-dot expense-dot" /> Gastos</span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={weeklyData} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#39c6bd" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#39c6bd" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9b87ff" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#9b87ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#24283a" strokeDasharray="4 5" vertical={false} />
                    <XAxis dataKey="day" stroke="#777d96" tickLine={false} axisLine={false} />
                    <YAxis stroke="#777d96" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "#171b2b", border: "1px solid #343950", borderRadius: 12 }} formatter={value => euro(value)} />
                    <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#39c6bd" strokeWidth={3} fill="url(#incomeGradient)" />
                    <Area type="monotone" dataKey="gastos" name="Gastos" stroke="#9b87ff" strokeWidth={3} fill="url(#expenseGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="panel chart-panel">
                <div className="panel-heading">
                  <div><h3>{tr("En qué gastas")}</h3><p>{tr("Distribución por categorías")}</p></div>
                </div>
                {categoryData.length ? (
                  <>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={5} stroke="none">
                          {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: "#171b2b", border: "1px solid #343950", borderRadius: 12 }} formatter={value => euro(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="category-legend">
                      {categoryData.map(item => (
                        <div key={item.name}>
                          <span><i style={{ background: item.color }} />{tr(item.name)}</span>
                          <strong>{euro(item.value)}</strong>
                        </div>
                      ))}
                    </div>
                  </>
                ) : <EmptyState text={tr("Añade gastos para ver tus categorías.")} />}
              </div>

              <div className="panel chart-panel full-chart">
                <div className="panel-heading">
                  <div><h3>{tr("Evolución mensual")}</h3><p>{tr("Comparativa de los últimos seis meses")}</p></div>
                  <span className="chart-tag">{tr("6 MESES")}</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyData} barGap={8} margin={{ top: 15, right: 8, left: -18, bottom: 0 }}>
                    <CartesianGrid stroke="#24283a" strokeDasharray="4 5" vertical={false} />
                    <XAxis dataKey="month" stroke="#777d96" tickLine={false} axisLine={false} />
                    <YAxis stroke="#777d96" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "#171b2b", border: "1px solid #343950", borderRadius: 12 }} formatter={value => euro(value)} />
                    <Bar dataKey="ingresos" name="Ingresos" fill="#39c6bd" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="gastos" name="Gastos" fill="#9b87ff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}

        {page === "Ahorros" && (
          <>
            <section className="savings-hero">
              <div>
                <span className="hero-label"><PiggyBank size={16} /> {tr("AHORRO GENERAL")}</span>
                <h2>{euro(totalSaved)}</h2>
                <p>{tr("La suma de todo el dinero que tienes apartado en tus objetivos.")}</p>
              </div>
              <div className="savings-hero-icon"><Coins size={66} /></div>
            </section>

            <section className="stat-grid savings-stats">
              <StatCard icon={PiggyBank} label={tr("Ahorro total")} value={euro(totalSaved)} tone="purple" note={tr("Todos tus objetivos juntos")} />
              <StatCard icon={Target} label={tr("Objetivos activos")} value={String(goals.length)} tone="green" note={tr("Metas que estás intentando alcanzar")} />
              <StatCard icon={Wallet} label={tr("Dinero disponible")} value={euro(balance)} tone="purple" note={tr("Fuera de tus ahorros")} />
            </section>

            <div className="section-heading">
              <div><span className="eyebrow">{tr("PLANES Y OBJETIVOS")}</span><h2>{tr("Mis objetivos de ahorro")}</h2></div>
              <button className="primary-button" onClick={() => setShowGoal(true)}>
                <Plus size={18} /> Nuevo objetivo
              </button>
            </div>

            <section className="goals-grid">
              {goals.map(goal => {
                const progress = Math.min(100, goal.target ? goal.saved / goal.target * 100 : 0);
                return (
                  <div className="panel goal-card" key={goal.id}>
                    <div className="goal-top">
                      <div className="goal-icon" style={{ color: goal.color, background: `${goal.color}20` }}>
                        <Target size={23} />
                      </div>
                      <span className="chart-tag">{tr("OBJETIVO")}</span>
                    </div>
                    <h3>{goal.name}</h3>
                    <div className="goal-numbers">
                      <strong>{euro(goal.saved)}</strong>
                      <span>de {euro(goal.target)}</span>
                    </div>
                    <div className="progress-track">
                      <div style={{ width: `${progress}%`, background: goal.color }} />
                    </div>
                    <div className="goal-bottom">
                      <span>{progress.toFixed(0)}% completado</span>
                      <span>Faltan {euro(Math.max(0, goal.target - goal.saved))}</span>
                    </div>
                    <button className="goal-add-button" onClick={() => addToGoal(goal.id)}>
                      <Plus size={16} /> Añadir dinero
                    </button>
                  </div>
                );
              })}

              {!goals.length && (
                <div className="panel empty-goals">
                  <EmptyState text={tr("Todavía no tienes objetivos. ¡Crea el primero!")} />
                  <button className="primary-button" onClick={() => setShowGoal(true)}>{tr("Crear objetivo")}</button>
                </div>
              )}
            </section>

            <div className="panel savings-tip">
              <Sparkles size={22} />
              <div>
                <strong>{tr("Consejo MoneyMind")}</strong>
                <p>{tr("Ahorrar un poco de forma constante puede ayudarte a alcanzar tus objetivos. ¡Cada paso cuenta!")}</p>
              </div>
            </div>
          </>
        )}

        {page === "Inversiones" && (
          <InvestmentLab
            language={language}
            investments={investments}
            setInvestments={setInvestments}
            funds={funds}
            investedTotal={investedTotal}
            balance={balance}
            addInvestment={addInvestment}
            investmentAmount={investmentAmount}
            setInvestmentAmount={setInvestmentAmount}
            selectedFund={selectedFund}
            setSelectedFund={setSelectedFund}
          />
        )}

        {page === "Bolsa" && <MarketPage language={language} />}

        {page === "Gastos mensuales" && (
          <>
            <div className="welcome-banner"><div><span className="eyebrow">{tr("CONTROL DE RECIBOS")}</span><h2>{tr("Todos tus gastos mensuales, organizados.")}</h2><p>{tr("Marca los pagos que ya has realizado y controla lo que queda pendiente.")}</p></div><ReceiptText size={45} /></div>
            <section className="stat-grid">
              <StatCard icon={ReceiptText} label={tr("Gastos mensuales previstos")} value={euro(monthlyBillsTotal)} tone="purple" note={tr("Suma de todos los recibos")} />
              <StatCard icon={CheckCircle2} label={tr("Ya pagado")} value={euro(paidBillsTotal)} tone="green" note={tr("Pagos marcados como realizados")} />
              <StatCard icon={CalendarDays} label={tr("Pendiente")} value={euro(unpaidBillsTotal)} tone="red" note={tr("Pagos todavía sin marcar")} />
            </section>
            <div className="panel feature-panel">
              <div className="panel-heading"><div><h3>{tr("Añadir gasto mensual")}</h3><p>{tr("Introduce un recibo o gasto recurrente.")}</p></div></div>
              <form className="inline-form" onSubmit={addBill}>
                <label>{tr("Concepto")}<input required value={billForm.name} onChange={e => setBillForm({ ...billForm, name: e.target.value })} placeholder={tr("Ej. Gimnasio")} /></label>
                <label>{tr("Categoría")}<select value={billForm.category} onChange={e => setBillForm({ ...billForm, category: e.target.value })}>{["Vivienda","Suministros","Servicios","Alimentación","Transporte","Salud","Otros"].map(c => <option key={c}>{tr(c)}</option>)}</select></label>
                <label>{tr("Importe mensual (€)")}<input required type="number" min="0.01" step="0.01" value={billForm.amount} onChange={e => setBillForm({ ...billForm, amount: e.target.value })} placeholder="0,00" /></label>
                <button className="primary-button" type="submit"><Plus size={16} /> {tr("Añadir gasto")}</button>
              </form>
            </div>
            <div className="panel feature-panel">
              <div className="panel-heading"><div><h3>{tr("Tu lista de gastos")}</h3><p>{tr("Los cambios se guardan automáticamente en este navegador.")}</p></div></div>
              {bills.length ? bills.map(bill => (
                <div className="bill-row" key={bill.id}>
                  <label className="bill-check"><input type="checkbox" checked={bill.paid} onChange={() => toggleBillPaid(bill.id)} /><span><strong>{bill.name}</strong><small>{tr(bill.category)}</small></span></label>
                  <strong>{euro(bill.amount)}</strong>
                  <span className={bill.paid ? "bill-status paid" : "bill-status"}>{tr(bill.paid ? "Pagado" : "Pendiente")}</span>
                  <button className="delete-button" onClick={() => deleteBill(bill.id)} title={tr("Eliminar gasto")}><Trash2 size={16} /></button>
                </div>
              )) : <EmptyState text={tr("Añade tu primer gasto mensual.")} />}
            </div>
          </>
        )}

        {page === "Nómina" && (
          <>
            <div className="welcome-banner"><div><span className="eyebrow">{tr("PLANIFICADOR DE INGRESOS")}</span><h2>{tr("Organiza tu nómina antes de gastar.")}</h2><p>{tr("Introduce tus ingresos y calcula cuánto queda después de los gastos mensuales.")}</p></div><BriefcaseBusiness size={45} /></div>
            <div className="panel salary-panel">
              <div><span className="eyebrow">{tr("INGRESO NETO MENSUAL")}</span><h3>{tr("¿Cuánto recibes al mes?")}</h3><p>{tr("Introduce el importe que llega a tu cuenta, después de impuestos y retenciones.")}</p></div>
              <label className="salary-input"><span>{tr("Nómina (€)")}</span><input type="number" min="0" step="0.01" value={salary} onChange={e => setSalary(Math.max(0, Number(e.target.value)))} /></label>
            </div>
            <section className="stat-grid">
              <StatCard icon={Wallet} label={tr("Nómina mensual")} value={euro(Number(salary || 0))} tone="purple" note={tr("Ingreso neto introducido")} />
              <StatCard icon={ReceiptText} label={tr("Gastos previstos")} value={euro(monthlyBillsTotal)} tone="red" note={tr("Todos tus gastos mensuales")} />
              <StatCard icon={Sparkles} label={tr("Sobrante estimado")} value={euro(salaryRemaining)} tone={salaryRemaining >= 0 ? "green" : "red"} note={tr("Nómina menos gastos previstos")} />
            </section>
            <div className="panel feature-panel">
              <div className="panel-heading"><div><h3>{tr("Resumen de pagos")}</h3><p>{tr("El cálculo incluye tanto los gastos pagados como los pendientes.")}</p></div><button className="text-button" onClick={() => setPage("Gastos mensuales")}>{tr("Gestionar gastos")} <ArrowUpRight size={16} /></button></div>
              {bills.map(bill => <div className="bill-row" key={bill.id}><span><strong>{bill.name}</strong><small>{tr(bill.paid ? "Pagado" : "Pendiente")}</small></span><strong>{euro(bill.amount)}</strong><span className={bill.paid ? "bill-status paid" : "bill-status"}>{tr(bill.paid ? "Pagado" : "Pendiente")}</span></div>)}
            </div>
            <div className="panel ai-advice">
              <Bot size={27} />
              <div><strong>{tr("MoneyMind AI · Análisis de tu presupuesto")}</strong>
                {salaryRemaining >= 0 ? <p>{language === "en" ? `After setting aside ${euro(monthlyBillsTotal)} for monthly expenses, your estimated remainder is ${euro(salaryRemaining)}. Consider building an emergency fund, reviewing savings goals and keeping some money for personal expenses. You do not need to invest everything.` : `Después de reservar ${euro(monthlyBillsTotal)} para tus gastos mensuales, tu sobrante estimado es de ${euro(salaryRemaining)}. Una idea prudente es priorizar un fondo para imprevistos, revisar tus objetivos de ahorro y dejar una cantidad para gastos personales. No hace falta destinar todo el sobrante a inversiones.`}</p> : <p>{language === "en" ? `Your monthly expenses exceed the entered salary by ${euro(Math.abs(salaryRemaining))}. Review your essential expenses and consider where you can adjust your budget. Do not record payments you have not made.` : `Tus gastos mensuales superan la nómina introducida en ${euro(Math.abs(salaryRemaining))}. Revisa los importes, comprueba qué gastos son esenciales y considera dónde puedes ajustar el presupuesto. No registres pagos que no hayas realizado.`}</p>}
                <small>{tr("Orientación educativa basada únicamente en los datos que has introducido; no es asesoramiento financiero personalizado.")}</small>
              </div>
            </div>
          </>
        )}
        {page === "Claridad Hogar" && <ClaridadHogar language={language} />}
      </main>

      {showTransaction && (
        <Modal title={tr("Añadir movimiento")} onClose={() => setShowTransaction(false)}>
          <form onSubmit={addTransaction} className="modal-form">
            <label>{tr("Tipo de movimiento")}</label>
            <div className="type-switch">
              <button type="button" className={form.type === "income" ? "selected income-selected" : ""} onClick={() => setForm({ ...form, type: "income", category: "Otros", billId: "" })}>
                <TrendingUp size={16} /> Ingreso
              </button>
              <button type="button" className={form.type === "expense" ? "selected expense-selected" : ""} onClick={() => setForm({ ...form, type: "expense", category: "Comida", billId: "" })}>
                <TrendingDown size={16} /> Gasto
              </button>
            </div>
            <label>{tr("Concepto")}</label>
            <input required placeholder={tr("Ej. Mesada, compra...")} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <label>{tr("Cantidad (€)")}</label>
            <input required type="number" min="0.01" step="0.01" placeholder="0,00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            <label>{tr("Categoría")}</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value, billId: "" })}>
              {(form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => <option key={c}>{tr(c)}</option>)}
            </select>
            {form.type === "expense" && form.category === "Gastos mensuales" && (
              <>
                <label>{tr("¿Cuál de tus gastos mensuales es?")}</label>
                <select value={form.billId} onChange={e => selectMonthlyBill(e.target.value)}>
                  <option value="">{tr("Otro gasto mensual (lo escribo yo)")}</option>
                  {pendingBills.map(bill => <option key={bill.id} value={bill.id}>{bill.name} · {euro(bill.amount)}</option>)}
                </select>
                <p className="hint-text">
                  {pendingBills.length
                    ? "Si eliges uno de la lista, se rellena solo y se marcará como pagado en «Gastos mensuales»."
                    : "No tienes gastos mensuales pendientes. Puedes añadirlos en el apartado «Gastos mensuales»."}
                </p>
              </>
            )}
            <button className="primary-button submit-button" type="submit">{tr("Guardar movimiento")} <ArrowUpRight size={17} /></button>
          </form>
        </Modal>
      )}

      {showSavePrompt && pendingIncome && (
        <Modal title={tr("¡Ingreso añadido!")} onClose={() => { setShowSavePrompt(false); setPendingIncome(null); }}>
          <div className="save-prompt">
            <div className="success-icon"><CheckCircle2 size={30} /></div>
            <h3>Has recibido {euro(pendingIncome.amount)}</h3>
            <p>{tr("¿Quieres aprovechar este ingreso para poner una parte en tus ahorros?")}</p>

            {goals.length ? (
              <>
                <label>{tr("Elige tu objetivo")}</label>
                <select value={selectedGoal} onChange={e => setSelectedGoal(e.target.value)}>
                  {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <label>{tr("¿Cuánto quieres ahorrar? (€)")}</label>
                <input type="number" min="0" max={pendingIncome.amount} step="0.01" placeholder={tr("Ej. 10")} value={saveAmount} onChange={e => setSaveAmount(e.target.value)} />
                <p className="hint-text">Puedes ahorrar desde 0 € hasta {euro(pendingIncome.amount)}.</p>
              </>
            ) : (
              <p className="hint-text">Todavía no tienes objetivos. Puedes crear uno en el apartado Ahorros.</p>
            )}

            <button className="primary-button submit-button" onClick={confirmSaving}>{tr("Confirmar")}</button>
            <button className="skip-button" onClick={() => { setShowSavePrompt(false); setPendingIncome(null); }}>{tr("Ahora no, gracias")}</button>
          </div>
        </Modal>
      )}

      {showGoal && (
        <Modal title={tr("Crear objetivo de ahorro")} onClose={() => setShowGoal(false)}>
          <form className="modal-form" onSubmit={addGoal}>
            <label>{tr("Nombre del objetivo")}</label>
            <input required placeholder={tr("Ej. Nuevo ordenador")} value={goalForm.name} onChange={e => setGoalForm({ ...goalForm, name: e.target.value })} />
            <label>{tr("¿Cuánto quieres conseguir? (€)")}</label>
            <input required type="number" min="1" step="0.01" placeholder="500" value={goalForm.target} onChange={e => setGoalForm({ ...goalForm, target: e.target.value })} />
            <button className="primary-button submit-button" type="submit">{tr("Crear objetivo")} <Target size={17} /></button>
          </form>
        </Modal>
      )}

      <AssistantChat context={aiContext} language={language} />
    </div>
  );
}


// Claridad Hogar: sección independiente. No modifica AssistantChat.
const CH_TEXT = {
 es:{title:'Claridad Hogar',sub:'Organiza tu presupuesto doméstico',examples:'Escenarios de ejemplo',scenarios:['Con deudas','Sin colchón','Equilibrado','Presupuesto ajustado'],salary:'Nómina neta',other:'Otros ingresos',currency:'Moneda',emergency:'Colchón actual',expenses:'Gastos mensuales y ahorro',debts:'Deudas activas',name:'Concepto',amount:'Importe',category:'Tipo',needs:'Necesidades',wants:'Deseos',savings:'Ahorro',addExpense:'Añadir gasto',addDebt:'Añadir deuda',balance:'Saldo de deuda',payment:'Cuota mensual',interest:'TIN anual (%)',noDebts:'No hay deudas registradas.',import:'Importar desde texto',importHint:'Ejemplo: nómina 1800, alquiler 650, comida 250, ocio 120, emergencia 400',importHelp:'Importación básica: separa los conceptos con comas y revisa los importes.',importAction:'Importar datos',income:'Ingresos',committed:'Gastos y cuotas',remaining:'Margen mensual',coverage:'Cobertura emergencias',months:'meses',budget:'Radiografía 50/30/20',target:'Objetivo',actual:'Actual',advice:'3 recomendaciones prácticas',remove:'Eliminar',warning:'Educación financiera general, no asesoramiento profesional ni recomendaciones de inversión. No introduzcas datos bancarios privados.',saved:'Datos guardados solo en este navegador.',recognized:'Importación terminada. Revisa los valores.',notRecognized:'No se detectaron cantidades. Utiliza: alquiler 650, comida 250',emergencyGoal:'Referencia orientativa: entre 3 y 6 meses de gastos esenciales.',followup:'Puedes hacer preguntas de seguimiento al asistente original de MoneyMind AI, que se mantiene sin cambios.'},
 en:{title:'Household Clarity',sub:'Manage your household budget',examples:'Example scenarios',scenarios:['With debt','No emergency fund','Balanced','Tight budget'],salary:'Net salary',other:'Other income',currency:'Currency',emergency:'Current emergency fund',expenses:'Monthly expenses and savings',debts:'Outstanding debts',name:'Description',amount:'Amount',category:'Type',needs:'Needs',wants:'Wants',savings:'Savings',addExpense:'Add expense',addDebt:'Add debt',balance:'Outstanding debt',payment:'Monthly payment',interest:'Annual interest rate (%)',noDebts:'No debts recorded.',import:'Import from text',importHint:'Example: salary 1800, rent 650, food 250, entertainment 120, emergency 400',importHelp:'Basic import: separate items with commas and review amounts.',importAction:'Import data',income:'Income',committed:'Expenses and payments',remaining:'Monthly remainder',coverage:'Emergency coverage',months:'months',budget:'50/30/20 breakdown',target:'Target',actual:'Actual',advice:'3 practical recommendations',remove:'Delete',warning:'General financial education, not professional advice or investment recommendations. Do not enter private banking data.',saved:'Data stored in this browser only.',recognized:'Import finished. Review the values.',notRecognized:'No amounts found. Try: rent 650, food 250',emergencyGoal:'General guideline: 3–6 months of essential expenses.',followup:'You can ask follow-up questions using the original MoneyMind AI assistant, which remains unchanged.'}
};
const CH_INITIAL = {
 salary:1800,other:0,emergency:400,currency:'EUR',
 expenses:[{id:1,name:'Alquiler',amount:650,category:'needs'},{id:2,name:'Comida',amount:250,category:'needs'},{id:3,name:'Ocio',amount:120,category:'wants'}],debts:[]
};
const CH_EXAMPLES = [
 {salary:1900,other:0,emergency:0,expenses:[{id:1,name:'Alquiler',amount:700,category:'needs'},{id:2,name:'Comida',amount:260,category:'needs'},{id:3,name:'Ocio',amount:190,category:'wants'}],debts:[{id:4,name:'Préstamo',balance:2400,payment:150,rate:9}]},
 {salary:1450,other:100,emergency:100,expenses:[{id:1,name:'Alquiler',amount:680,category:'needs'},{id:2,name:'Comida',amount:260,category:'needs'},{id:3,name:'Compras',amount:170,category:'wants'}],debts:[]},
 {salary:2600,other:150,emergency:5400,expenses:[{id:1,name:'Vivienda',amount:850,category:'needs'},{id:2,name:'Servicios',amount:190,category:'needs'},{id:3,name:'Viajes',amount:340,category:'wants'},{id:4,name:'Ahorro',amount:400,category:'savings'}],debts:[]},
 {salary:1200,other:0,emergency:0,expenses:[{id:1,name:'Alquiler',amount:750,category:'needs'},{id:2,name:'Comida',amount:300,category:'needs'},{id:3,name:'Ocio',amount:200,category:'wants'}],debts:[{id:4,name:'Tarjeta',balance:950,payment:70,rate:19}]}
];
function ClaridadHogar({language='es'}) {
 const en = language === 'en';
 const t = CH_TEXT[en ? 'en' : 'es'];
 const [data,setData]=useState(()=>readStorage('mm_claridad_hogar',CH_INITIAL));
 const [expense,setExpense]=useState({name:'',amount:'',category:'needs'});
 const [debt,setDebt]=useState({name:'',balance:'',payment:'',rate:''});
 const [raw,setRaw]=useState('');
 const [notice,setNotice]=useState('');
 useEffect(()=>{localStorage.setItem('mm_claridad_hogar',JSON.stringify(data)); queueCloudSave();},[data]);
 const n=v=>Math.max(0,Number(v)||0);
 const change=(key,value)=>setData(p=>({...p,[key]:value}));
 const fmt=value=>new Intl.NumberFormat(en?'en-GB':'es-ES',{style:'currency',currency:data.currency}).format(value||0);
 const income=n(data.salary)+n(data.other);
 const needs=data.expenses.filter(x=>x.category==='needs').reduce((s,x)=>s+n(x.amount),0);
 const wants=data.expenses.filter(x=>x.category==='wants').reduce((s,x)=>s+n(x.amount),0);
 const savings=data.expenses.filter(x=>x.category==='savings').reduce((s,x)=>s+n(x.amount),0);
 const payments=data.debts.reduce((s,x)=>s+n(x.payment),0);
 const essentials=needs+payments;
 const committed=essentials+wants+savings;
 const remaining=income-committed;
 const coverage=essentials>0?n(data.emergency)/essentials:null;
 const debts=data.debts.filter(x=>n(x.balance)>0);
 const highest=[...debts].sort((a,b)=>n(b.rate)-n(a.rate))[0];
 const recommendations=[
  highest?(en?`Prioritize debt payments. Keep up with minimum payments, then consider directing available money to higher-interest debt such as “${highest.name}” (${n(highest.rate)}% annual rate), while covering essentials.`:`Prioriza las deudas. Mantén las cuotas mínimas y, si tienes margen, considera amortizar primero las de mayor interés, como «${highest.name}» (${n(highest.rate)}% anual), sin descuidar lo esencial.`):(en?'No outstanding debt is recorded. Avoid costly borrowing and review your obligations periodically.':'No has registrado deudas pendientes. Evita financiación costosa y revisa periódicamente tus compromisos.'),
  essentials>0&&coverage<3?(en?`Build an emergency fund: three months of essential expenses would be about ${fmt(essentials*3)}. You still need roughly ${fmt(Math.max(0,essentials*3-n(data.emergency)))}. Start with manageable contributions.`:`Refuerza el colchón de emergencia: tres meses de gastos esenciales serían unos ${fmt(essentials*3)}. Te faltan aproximadamente ${fmt(Math.max(0,essentials*3-n(data.emergency)))}. Empieza con aportaciones asumibles.`):(en?'Review your emergency fund regularly. Three to six months of essential costs is a general guideline.':'Revisa periódicamente tu colchón. Entre tres y seis meses de gastos esenciales es una referencia general.'),
  remaining<0?(en?`Your budget has a ${fmt(-remaining)} monthly shortfall. Review optional spending first and adapt the 50/30/20 guideline to your needs.`:`Tu presupuesto tiene un déficit mensual de ${fmt(-remaining)}. Revisa primero los gastos opcionales y adapta la regla 50/30/20 a tu situación.`):(en?`Use 50/30/20 as a flexible guide. You allocate ${income?(essentials/income*100).toFixed(1):0}% to needs and ${income?(wants/income*100).toFixed(1):0}% to wants, with ${fmt(remaining)} unallocated.`:`Usa la regla 50/30/20 como orientación flexible. Destinas el ${income?(essentials/income*100).toFixed(1):0}% a necesidades y el ${income?(wants/income*100).toFixed(1):0}% a deseos, con ${fmt(remaining)} sin asignar.`)
 ];
 const addExpense=e=>{e.preventDefault();if(!expense.name.trim()||n(expense.amount)<=0)return;change('expenses',[...data.expenses,{...expense,name:expense.name.trim(),amount:n(expense.amount),id:Date.now()+Math.random()}]);setExpense({name:'',amount:'',category:'needs'});};
 const addDebt=e=>{e.preventDefault();if(!debt.name.trim()||n(debt.balance)<=0)return;change('debts',[...data.debts,{...debt,name:debt.name.trim(),balance:n(debt.balance),payment:n(debt.payment),rate:n(debt.rate),id:Date.now()+Math.random()}]);setDebt({name:'',balance:'',payment:'',rate:''});};
 const importData=()=>{
  const parts=raw.replace(/\n/g,',').split(/[,;]+/).map(x=>x.trim()).filter(Boolean);
  const additions=[];const loanAdditions=[];const patch={};let found=0;
  for(const part of parts){const m=part.match(/^(.+?)\s*[:=]?\s*(\d+(?:[.,]\d+)?)\s*(?:€|EUR|USD|MXN)?$/i);if(!m)continue;const name=m[1].trim(),amt=Number(m[2].replace(',','.')),low=name.toLowerCase();if(!name||!Number.isFinite(amt))continue;found++;
   if(/nómina|nomina|salary|sueldo|salario/.test(low))patch.salary=amt;
   else if(/otro ingreso|other income/.test(low))patch.other=amt;
   else if(/colchón|colchon|emergencia|emergency/.test(low))patch.emergency=amt;
   else if(/deuda|préstamo|prestamo|debt|loan/.test(low))loanAdditions.push({id:Date.now()+Math.random(),name,balance:amt,payment:0,rate:0});
   else additions.push({id:Date.now()+Math.random(),name,amount:amt,category:/ahorro|saving/.test(low)?'savings':/ocio|viaje|entertainment|compras|shopping/.test(low)?'wants':'needs'});
  }
  if(!found){setNotice(t.notRecognized);return;}
  setData(p=>({...p,...patch,expenses:[...p.expenses,...additions],debts:[...p.debts,...loanAdditions]}));setRaw('');setNotice(t.recognized);
 };
 const rows=[['needs',t.needs,essentials,50,'#9b87ff'],['wants',t.wants,wants,30,'#ffb86b'],['savings',t.savings,savings,20,'#39c6bd']];
 return <section className="ch-section">
   <div className="welcome-banner"><div><span className="eyebrow">MONEYMIND AI · HOUSEHOLD</span><h2>{t.title}</h2><p>{t.sub}</p></div><House size={42}/></div>
   <div className="panel ch-panel"><h3>{t.examples}</h3><div className="ch-chips">{t.scenarios.map((s,i)=><button key={i} onClick={()=>setData(p=>({...p,...CH_EXAMPLES[i],currency:p.currency}))}>{s}</button>)}</div></div>
   <div className="panel ch-panel"><h3><Wallet size={19}/>{t.income}</h3><div className="ch-fields">
     {[['salary',t.salary],['other',t.other],['emergency',t.emergency]].map(([field,label])=><label key={field}>{label}<input type="number" min="0" step="0.01" value={data[field]} onChange={e=>change(field,e.target.value)}/></label>)}
     <label>{t.currency}<select value={data.currency} onChange={e=>change('currency',e.target.value)}>{['EUR','MXN','USD','COP','ARS'].map(c=><option key={c}>{c}</option>)}</select></label>
   </div><p className="ch-muted">{t.saved}</p></div>
   <div className="panel ch-panel"><h3>{t.import}</h3><textarea rows="3" value={raw} onChange={e=>setRaw(e.target.value)} placeholder={t.importHint}/><p className="ch-muted">{t.importHelp}</p><button className="primary-button" onClick={importData}>{t.importAction}</button>{notice&&<p role="status" className="ch-muted">{notice}</p>}</div>
   <div className="panel ch-panel"><h3>{t.expenses}</h3>{data.expenses.map(x=><div className="ch-entry" key={x.id}><span><strong>{x.name}</strong><small>{t[x.category]}</small></span><strong>{fmt(n(x.amount))}</strong><button aria-label={t.remove} className="delete-button" onClick={()=>change('expenses',data.expenses.filter(y=>y.id!==x.id))}><Trash2 size={16}/></button></div>)}
   <form className="ch-add" onSubmit={addExpense}><input required placeholder={t.name} value={expense.name} onChange={e=>setExpense(p=>({...p,name:e.target.value}))}/><input required type="number" min="0.01" step="0.01" placeholder={t.amount} value={expense.amount} onChange={e=>setExpense(p=>({...p,amount:e.target.value}))}/><select value={expense.category} onChange={e=>setExpense(p=>({...p,category:e.target.value}))}>{['needs','wants','savings'].map(k=><option key={k} value={k}>{t[k]}</option>)}</select><button className="primary-button" type="submit"><Plus size={16}/>{t.addExpense}</button></form></div>
   <div className="panel ch-panel"><h3>{t.debts}</h3>{!data.debts.length&&<p className="ch-muted">{t.noDebts}</p>}{data.debts.map(x=><div className="ch-entry" key={x.id}><span><strong>{x.name}</strong><small>{t.payment}: {fmt(n(x.payment))} · TIN {n(x.rate)}%</small></span><strong>{fmt(n(x.balance))}</strong><button className="delete-button" aria-label={t.remove} onClick={()=>change('debts',data.debts.filter(y=>y.id!==x.id))}><Trash2 size={16}/></button></div>)}
   <form className="ch-add" onSubmit={addDebt}><input required placeholder={t.name} value={debt.name} onChange={e=>setDebt(p=>({...p,name:e.target.value}))}/><input required type="number" min="0.01" step="0.01" placeholder={t.balance} value={debt.balance} onChange={e=>setDebt(p=>({...p,balance:e.target.value}))}/><input type="number" min="0" step="0.01" placeholder={t.payment} value={debt.payment} onChange={e=>setDebt(p=>({...p,payment:e.target.value}))}/><input type="number" min="0" step="0.01" placeholder={t.interest} value={debt.rate} onChange={e=>setDebt(p=>({...p,rate:e.target.value}))}/><button type="submit" className="primary-button"><Plus size={16}/>{t.addDebt}</button></form></div>
   <div className="ch-metrics">{[[t.income,fmt(income)],[t.committed,fmt(committed)],[t.remaining,fmt(remaining)],[t.coverage,coverage===null?'—':`${coverage.toFixed(1)} ${t.months}`]].map(([label,v])=><div className="panel ch-metric" key={label}><span>{label}</span><strong>{v}</strong></div>)}</div>
   <div className="panel ch-panel"><h3>{t.budget}</h3>{rows.map(([key,label,value,target,color])=><div className="ch-bar" key={key}><div><strong>{label}</strong><span>{t.actual}: {income?(value/income*100).toFixed(1):0}% · {t.target}: {target}%</span></div><div className="progress-track"><div style={{width:`${income?Math.min(100,value/income*100):0}%`,background:color}}/></div></div>)}<p className="ch-muted">{t.emergencyGoal}</p></div>
   <div className="panel ch-panel"><h3><Sparkles size={20}/>{t.advice}</h3>{recommendations.map((v,i)=><div className="ch-recommendation" key={i}><span>{i+1}</span><p>{v}</p></div>)}<p className="ch-muted">{t.followup}</p><p className="ch-disclaimer">{t.warning}</p></div>
 </section>;
}

function StatCard({ icon: Icon, label, value, tone, note }) {
  return (
    <div className="panel stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={21} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function TransactionList({ transactions, onDelete }) {
  if (!transactions.length) return <EmptyState text={tr("Todavía no tienes movimientos registrados.")} />;

  return (
    <div className="transaction-list">
      {transactions.map(t => (
        <div className="transaction-row" key={t.id}>
          <div className={`transaction-icon ${t.type}`}>
            {t.type === "income" ? <ArrowDownRight size={19} /> : <ArrowUpRight size={19} />}
          </div>
          <div className="transaction-info">
            <strong>{t.name}</strong>
            <span>{tr(t.category)} · {new Date(t.date).toLocaleDateString(currentLanguage === "en" ? "en-GB" : "es-ES")}</span>
          </div>
          <strong className={t.type === "income" ? "amount-positive" : "amount-negative"}>
            {t.type === "income" ? "+" : "-"}{euro(t.amount)}
          </strong>
          <button className="delete-button" title={tr("Eliminar movimiento")} onClick={() => onDelete(t.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={e => e.stopPropagation()}>
        <div className="modal-heading">
          <h2>{title}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <PiggyBank size={30} />
      <p>{text}</p>
    </div>
  );
}

// Motor financiero 100 % local: sin APIs, claves, servicios ni conexiones externas.
// Basado en reglas transparentes y datos guardados en este navegador.
const LOCAL_DISCLAIMER = {
  es: "Información educativa, no asesoramiento financiero profesional ni recomendaciones de inversión.",
  en: "Educational information, not professional financial advice or investment recommendations."
};

function normalizedLocal(text) {
  return String(text || "").toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9%/ ]+/g, " ")
    .replace(/\s+/g, " ").trim();
}


// Extra stock-market learning topics. These rules are offline: no invented live quotes.
function stockEducationReply(question, context, language = "es") {
  const en = language === "en";
  const q = normalizedLocal(question);
  const has = (...terms) => terms.some(t => q.includes(normalizedLocal(t)));
  const cash = n => new Intl.NumberFormat(en ? "en-GB" : "es-ES", { style: "currency", currency: "EUR" }).format(n);
  const decimal = s => Number(String(s).replace(",", "."));
  const answer = (es, english) => en ? english : es;
  const intro = answer("En la pestaña **Bolsa** puedes explorar gráficos y guardar empresas en favoritos. Los datos vienen de TradingView y pueden tener retraso.", "In **Stock market**, you can browse charts and save companies. TradingView supplies market data, which may be delayed.");
  const noLive = answer("No tengo acceso directo a cotizaciones actuales dentro del chat local. Para ver el precio, abre el gráfico en **Bolsa** y revisa la fecha, hora, mercado y posible retraso.", "I cannot read live prices inside this offline chat. Open the chart in **Stock market** and check timestamp, exchange and potential delays.");
  const wrap = s => s + "\n\n" + LOCAL_DISCLAIMER[en ? "en" : "es"];

  // Numeric examples: 'si compro 4 acciones a 25 y sube a 30' and English equivalent.
  const stockExample = q.match(/(?:compro|comprar|buy)\s+(\d+(?:[.,]\d+)?)\s+(?:acciones|shares?)\s+(?:a|at|de|por)\s+(\d+(?:[.,]\d+)?)(?:\s*(?:€|eur|euros?))?\s+(?:y\s+)?(?:sube|baja|llega|pasa|rise|falls?|goes|moves)\s+(?:a|to)\s+(\d+(?:[.,]\d+)?)/);
  if (stockExample) {
    const qty = decimal(stockExample[1]), from = decimal(stockExample[2]), to = decimal(stockExample[3]);
    if ([qty,from,to].every(v => Number.isFinite(v) && v >= 0) && qty <= 1e8 && from <= 1e9 && to <= 1e9 && from > 0) {
      const initial = qty * from, final = qty * to, change = final - initial;
      return wrap(answer(`Ejemplo **hipotético**, sin comisiones ni impuestos:\n• Valor inicial: ${cash(initial)} (${qty} × ${cash(from)}).\n• Valor final: ${cash(final)}.\n• Diferencia: ${cash(change)} (${((to/from-1)*100).toFixed(2)}%).\nEl resultado real depende del precio de ejecución, costes y fiscalidad.`, `**Hypothetical** example, before fees and taxes:\n• Initial value: ${cash(initial)} (${qty} × ${cash(from)}).\n• Final value: ${cash(final)}.\n• Difference: ${cash(change)} (${((to/from-1)*100).toFixed(2)}%).\nReal outcomes depend on execution price, costs and taxes.`));
    }
  }

  const simulation = q.match(/(?:invertir|invierto|investment|invest)\s+(\d+(?:[.,]\d+)?)\s*(?:euros?|eur)?\s*(?:durante|por|for|over)\s+(\d+)\s*(?:anos?|years?)/);
  if (simulation) {
    const capital = decimal(simulation[1]), years = Number(simulation[2]);
    if (capital > 0 && capital <= 1e7 && years >= 1 && years <= 40) {
      const scenarios = [-.03, .03, .06].map(rate => `${(rate*100).toFixed(0)}%: ${cash(capital*Math.pow(1+rate, years))}`).join("\n• ");
      return wrap(answer(`Simulación **sin aportaciones adicionales**, durante ${years} años, de ${cash(capital)}:\n• ${scenarios}\nSon escenarios matemáticos, no predicciones. No incluyen comisiones, impuestos ni inflación.`, `**No-additional-contributions** illustration over ${years} years with ${cash(capital)}:\n• ${scenarios}\nThese are mathematical scenarios, not forecasts; fees, tax and inflation are excluded.`));
    }
  }

  if (has("precio actual", "cotizacion actual", "cotiza ahora", "cuanto vale la accion", "precio de apple", "precio de nvidia", "precio de tesla", "ahora mismo", "tiempo real", "real time", "live price", "current price", "today's price", "precio hoy", "ultimo precio", "latest quote")) return wrap(noLive);

  if (has("que empresa compro", "que accion compro", "que acciones compro", "en que invierto", "en que invertir", "me recomiendas comprar", "deberia comprar", "es buen momento", "comprar ahora", "mejor accion", "mejores acciones", "mejor inversion", "which stock should", "what stock should", "best stock", "buy now", "should i buy", "what should i invest")) return wrap(answer(`No puedo determinar qué acción comprar ni prometer rendimientos. Para **analizar una empresa** de forma educativa, revisa su negocio, ingresos, beneficios, deuda, liquidez, valoración, competencia y riesgos; compárala con alternativas diversificadas. ${intro}`, `I can't pick a stock for you or promise a return. To **research a company** educationally, review its business, revenue, profits, debt, cash flow, valuation, competition and risks; compare with diversified alternatives. ${intro}`));

  if (has("comparar empresas", "compara dos empresas", "comparar dos empresas", "analizar empresa", "analisis de empresa", "company analysis", "compare companies", "compare two companies")) return wrap(answer("Para **comparar dos empresas** de forma educativa, apunta estos datos de ambas: 1) ingresos y crecimiento, 2) beneficio y margen, 3) deuda y caja, 4) flujo de efectivo, 5) valoración (PER u otras métricas), 6) competencia, ventajas y riesgos. Compáralas en el mismo periodo y moneda. No basta con mirar el precio de la acción.", "To **compare two companies**, examine both firms' 1) revenue and growth, 2) earnings and margins, 3) debt and cash, 4) free cash flow, 5) valuation, 6) competition, advantages and risks. Compare the same period and currency. Share price alone is not enough."));

  if (has("dca", "aportaciones periodicas", "inversion periodica", "dollar cost averaging")) return wrap(answer("Las **aportaciones periódicas** consisten en invertir importes similares en distintos momentos. En un simulador puedes comparar ese método con una aportación única. No elimina el riesgo de pérdidas ni asegura una rentabilidad superior.", "**Periodic contributions** invest similar amounts over time. In a simulator, compare this with a lump sum. It does not eliminate losses or guarantee better returns."));

  if (has("split", "desdoblamiento", "contrasplit", "reverse split")) return wrap(answer("Un **split** divide las acciones existentes en más títulos y ajusta proporcionalmente el precio por acción; por sí solo no crea valor. Un **contrasplit** hace lo contrario. Revisa el número de acciones y no confundas ese cambio con rentabilidad.", "A **stock split** increases share count while adjusting price per share proportionally; it doesn't create value on its own. A reverse split does the opposite. Check share count rather than mistaking the price adjustment for a return."));

  const glossary = [
    {terms:["que es una accion", "acciones", "accion de", "stock", "share", "equity"], es:"Una **acción** representa una pequeña participación en una empresa. Su precio fluctúa y puedes perder parte o todo el capital. Estudia el negocio y sus riesgos antes de tomar decisiones.", en:"A **share** represents partial ownership in a company. Its price fluctuates and the investment can lose value. Learn about the business and its risks."},
    {terms:["etf", "fondo cotizado", "exchange traded"], es:"Un **ETF** es un fondo que cotiza en bolsa y agrupa activos siguiendo una estrategia o índice. Considera índice, diversificación real, comisiones (TER), divisa, réplica y riesgo; un ETF no garantiza beneficios.", en:"An **ETF** is an exchange-traded fund holding assets under a strategy or index. Review its benchmark, actual diversification, expense ratio, currency, replication and risk."},
    {terms:["fondo indexado", "index fund", "indexado"], es:"Un **fondo indexado** intenta replicar un índice como el S&P 500. No elimina el riesgo bursátil. Frente a un ETF puede diferir en operativa, costes y tratamiento fiscal según el país.", en:"An **index fund** tracks an index such as the S&P 500. It still has market risk. Trading, fees and tax treatment can differ from ETFs depending on country."},
    {terms:["sp 500", "s p 500", "s&p 500", "nasdaq", "ibex", "dow jones", "indice bursatil", "indices"], es:"Un **índice bursátil** mide la evolución de un grupo de valores. S&P 500 reúne grandes empresas estadounidenses; Nasdaq 100 sigue cien grandes empresas no financieras del Nasdaq; IBEX 35 refleja una selección de acciones españolas. No se compra directamente un índice: los fondos pueden seguirlo.", en:"A **market index** measures a group of securities. The S&P 500 tracks large US companies, Nasdaq-100 large non-financial Nasdaq-listed companies, and IBEX 35 selected Spanish stocks. An index itself cannot be purchased directly; funds may track it."},
    {terms:["dividend", "dividendo", "rentabilidad por dividendo", "yield"], es:"Un **dividendo** es un reparto que algunas empresas hacen a sus accionistas. No está garantizado. La rentabilidad por dividendo se calcula como dividendo anual por acción ÷ precio por acción × 100. Cobrar dividendos no significa ganar dinero si la acción cae de valor.", en:"A **dividend** is a distribution some companies make to shareholders. It is not guaranteed. Dividend yield = annual dividend per share / share price × 100. Receiving dividends does not prevent an overall loss."},
    {terms:["per", "price earnings", "p/e", "precio beneficio"], es:"El **PER** (precio/beneficio) compara precio por acción con beneficio por acción. Un PER elevado puede reflejar expectativas de crecimiento; uno bajo no significa automáticamente que la acción esté barata. Compáralo por sector y considera deudas y calidad de beneficios.", en:"**P/E** compares share price with earnings per share. A high figure may reflect growth expectations; a low figure does not automatically mean cheap. Compare peers and check debt and earnings quality."},
    {terms:["capitalizacion", "market cap", "market capitalization"], es:"La **capitalización bursátil** es precio por acción × número de acciones en circulación. Aproxima el valor bursátil de una empresa, no el efectivo que tiene ni el precio que costaría adquirirla.", en:"**Market capitalization** = share price × shares outstanding. It indicates the stock-market value of a company, not its cash balance or exact takeover cost."},
    {terms:["volatilidad", "volatility", "riesgo bursatil", "riesgos de invertir", "riesgo de inversion"], es:"La **volatilidad** mide cuánto varían los precios. Otros riesgos incluyen pérdidas permanentes, concentración, liquidez, divisa y cambios en tipos de interés. Un activo que ha subido mucho también puede caer mucho.", en:"**Volatility** describes price swings. Other risks include permanent losses, concentration, liquidity, currency and interest-rate changes. Large past gains do not prevent large declines."},
    {terms:["stop loss", "stop-loss", "orden limitada", "orden a mercado", "limit order", "market order"], es:"Las **órdenes de mercado** priorizan ejecución, pero el precio puede cambiar. Las **órdenes limitadas** fijan un precio máximo de compra o mínimo de venta, pero podrían no ejecutarse. Un **stop-loss** no garantiza un precio final si hay saltos de cotización.", en:"A **market order** prioritizes execution but price may vary. A **limit order** sets a maximum buy or minimum sell price but may not execute. A **stop-loss** doesn't guarantee the final execution price if prices gap."},
    {terms:["analisis tecnico", "analisis fundamental", "technical analysis", "fundamental analysis", "velas japonesas", "candlestick"], es:"El **análisis fundamental** estudia negocio, ingresos, beneficios, deuda y valoración. El **técnico** observa gráficos, precios y volumen; no predice con certeza. Las velas resumen apertura, máximo, mínimo y cierre de un periodo.", en:"**Fundamental analysis** studies business, revenue, profit, debt and valuation. **Technical analysis** looks at charts, prices and volume, without reliable certainty. Candlesticks summarize open, high, low and close."},
    {terms:["diversificacion", "diversificar", "cartera", "portfolio allocation"], es:"**Diversificar** significa repartir exposición entre empresas, sectores, países y tipos de activos. Puede reducir la dependencia de una sola inversión, pero no elimina las caídas generales del mercado.", en:"**Diversification** spreads exposure across companies, sectors, regions and asset types. It may reduce single-investment concentration but cannot eliminate broad market losses."},
    {terms:["comisiones", "ter", "spread", "custodia", "fees", "expense ratio"], es:"Los costes pueden incluir **comisión de compraventa**, custodia, cambio de divisa, **spread** (diferencia compra/venta) y **TER** (gastos anuales de un fondo). Incluso pequeñas comisiones acumuladas reducen el resultado final.", en:"Costs may include trading, custody, FX, **bid-ask spread** and **TER** (annual fund expenses). Even small fees compound over time and reduce net results."},
    {terms:["interes compuesto", "compound interest", "reinvertir dividendos", "reinvest dividends"], es:"El **interés compuesto** implica generar rendimiento sobre lo ya acumulado; con acciones o fondos no hay una tasa garantizada. Reinvierte solo en ejemplos educativos: el resultado real varía y puede ser negativo.", en:"**Compounding** means earning returns on accumulated value; stocks and funds have no guaranteed rate. Reinvestment examples are educational: actual returns vary and may be negative."},
    {terms:["inflacion", "inflation", "rentabilidad real", "real return"], es:"La **rentabilidad real** tiene en cuenta el aumento de precios. Aproximadamente es rentabilidad nominal − inflación; más exactamente: (1 + nominal)/(1 + inflación) − 1. La inflación reduce el poder adquisitivo.", en:"**Real return** accounts for inflation. Approximately nominal return minus inflation; more exactly (1 + nominal)/(1 + inflation) − 1. Inflation erodes purchasing power."},
    {terms:["fondo de emergencia", "antes de invertir", "emergency fund", "before investing"], es:"Antes de asumir volatilidad, suele ser útil cubrir gastos básicos y tener una reserva accesible para imprevistos, especialmente si existe deuda cara. El dinero para necesidades cercanas no debería depender de que la bolsa suba.", en:"Before accepting market volatility, cover essentials and maintain an accessible emergency reserve, especially if expensive debt exists. Money needed soon shouldn't rely on rising stock prices."},
    {terms:["criptomonedas", "bitcoin", "crypto", "apalancamiento", "leverage", "cfds", "opciones financieras", "options trading"], es:"Las criptomonedas, los productos apalancados y los derivados pueden sufrir grandes fluctuaciones o pérdidas rápidas. Para aprender, empieza por comprender su funcionamiento y riesgos mediante simulaciones, sin operar con dinero real.", en:"Cryptoassets, leveraged products and derivatives can fluctuate sharply or cause rapid losses. Learn their mechanics and risks through simulations rather than real-money trading."},
    {terms:["bolsa", "tradingview", "buscar empresa", "favoritos", "stock market", "watchlist", "chart"], es:intro + " Para comparar empresas, revisa el historial del gráfico, el mercado correcto, volumen y datos financieros; las cotizaciones pueden tener retraso.", en:intro + " When comparing companies, check chart history, the correct exchange, volume and company financials; quotes can be delayed."},
    {terms:["inversion", "invertir", "investments", "investing"], es:"En **Inversiones** puedes experimentar con una cartera y escenarios simulados. En **Bolsa** puedes consultar gráficos del proveedor. ¿Quieres aprender sobre ETF, acciones, índices, dividendos, comisiones o riesgo?", en:"In **Investments** you can explore a simulated portfolio and scenarios. In **Stock market** you can view provider charts. Ask about ETFs, shares, indices, dividends, fees or risk."}
  ];
  const found = glossary.find(entry => entry.terms.some(term => {
    const normalized = normalizedLocal(term);
    return normalized.includes(" ") ? q.includes(normalized) : q.split(" ").includes(normalized);
  }));
  if (found) return wrap(found[en ? "en" : "es"]);
  return null;
}

function localFinanceReply(question, c, language = "es", history = []) {
  const en = language === "en";
  const q = normalizedLocal(question);
  const has = (...terms) => terms.some(term => q.includes(normalizedLocal(term)));
  const stockAnswer = stockEducationReply(question, c, language);
  if (stockAnswer) return stockAnswer;
  const amount = n => Number.isFinite(Number(n)) ? Number(n) : 0;
  const money = n => new Intl.NumberFormat(en ? "en-GB" : "es-ES", {
    style: "currency", currency: "EUR"
  }).format(amount(n));
  const pct = n => `${Number(n).toFixed(1)}%`;
  const footer = `\n\n${LOCAL_DISCLAIMER[en ? "en" : "es"]}`;
  let household = null;
  try {
    const item = JSON.parse(localStorage.getItem("mm_claridad_hogar") || "null");
    if (item && Array.isArray(item.expenses) && Array.isArray(item.debts)) household = item;
  } catch { /* Datos locales inválidos: no bloquean el asistente */ }
  const recordedIncome = amount(c.ingresos);
  const recordedExpenses = amount(c.gastos);
  const netSalary = amount(c.nomina);
  const categories = Array.isArray(c.gastosPorCategoria) ? c.gastosPorCategoria : [];
  const goals = Array.isArray(c.objetivos) ? c.objetivos : [];
  const bills = Array.isArray(c.gastosMensuales) ? c.gastosMensuales : [];
  const top = [...categories].sort((a,b) => amount(b.total) - amount(a.total))[0];
  const hhIncome = household ? amount(household.salary) + amount(household.other ?? household.otherIncome) : netSalary;
  const hhNeeds = household ? household.expenses.filter(x => x.category === "needs")
    .reduce((s,x) => s + amount(x.amount),0) : amount(c.gastosMensualesPrevistos);
  const hhWants = household ? household.expenses.filter(x => x.category === "wants")
    .reduce((s,x) => s + amount(x.amount),0) : 0;
  const hhSavings = household ? household.expenses.filter(x => x.category === "savings")
    .reduce((s,x) => s + amount(x.amount),0) : 0;
  const debts = household ? household.debts.filter(x => amount(x.balance) > 0) : [];
  const debtPayments = debts.reduce((s,x) => s + amount(x.payment),0);
  const committed = hhNeeds + hhWants + hhSavings + debtPayments;
  const remainder = hhIncome - committed;
  const emergency = household ? amount(household.emergency) : 0;
  const essentials = hhNeeds + debtPayments;
  const months = essentials > 0 ? emergency / essentials : null;
  const higherDebt = [...debts].sort((a,b) => amount(b.rate)-amount(a.rate))[0];
  const lastQuestion = [...history].reverse().find(x => x.role === "user")?.content || "";

  const output = text => text + footer;
  const quick = () => en
    ? `I can analyze budgets, savings and debts, and explain stocks, ETFs, dividends, indices, risks and hypothetical investment calculations. Ask a specific question. ${household ? "I can also use your Household Clarity data." : "Add debts and emergency savings in Household Clarity for a more detailed plan."}`
    : `Puedo analizar tu presupuesto, ahorros y deudas, además de explicar acciones, ETF, dividendos, índices, riesgos y cálculos hipotéticos de inversión. ${household ? "También puedo utilizar tus datos de Claridad Hogar." : "Añade tus deudas y tu colchón en Claridad Hogar para un plan más detallado."}`;

  if (has("hola", "buenas", "hello", "hi ", "hey") && q.length < 20) {
    return output((en ? "Hello! I'm the offline MoneyMind financial assistant. " : "¡Hola! Soy el asistente financiero sin conexión de MoneyMind. ") + quick());
  }
  if (has("que puedes", "ayuda", "help", "what can", "como funciona", "capabilities")) return output(quick());

  if (has("50/30/20", "50 30 20", "presupuesto", "budget", "repartir", "distribuir sueldo", "allocate")) {
    const income = hhIncome || recordedIncome;
    if (income <= 0) return output(en
      ? "Enter your monthly net salary first. The 50/30/20 guideline uses 50% for needs, 30% for wants and 20% for saving or debt repayment."
      : "Introduce tu nómina neta mensual. La regla 50/30/20 propone un 50% para necesidades, un 30% para deseos y un 20% para ahorro o amortizar deudas.");
    const header = en
      ? `For monthly income of ${money(income)}, the *illustrative* 50/30/20 budget is:\n• Needs: ${money(income * .5)}\n• Wants: ${money(income * .3)}\n• Saving/debt: ${money(income * .2)}.`
      : `Con unos ingresos mensuales de ${money(income)}, el reparto 50/30/20 *orientativo* sería:\n• Necesidades: ${money(income * .5)}\n• Deseos: ${money(income * .3)}\n• Ahorro/deudas: ${money(income * .2)}.`;
    return output(header + (household
      ? (en ? `\nYour Household Clarity needs are ${money(essentials)}, wants ${money(hhWants)}, and recorded savings ${money(hhSavings)}. Adjust the guideline to your real necessities.` : `\nEn Claridad Hogar registras ${money(essentials)} en necesidades y cuotas, ${money(hhWants)} en deseos y ${money(hhSavings)} en ahorro. Adapta la guía a tus necesidades reales.`)
      : (en ? "\nComplete Household Clarity for a more specific comparison." : "\nCompleta Claridad Hogar para comparar los porcentajes reales.")));
  }

  if (has("deuda", "deudas", "prestamo", "tarjeta", "debt", "loan", "credit card", "tin", "interes deuda")) {
    if (!household) return output(en
      ? "Add your outstanding balances, monthly payments and interest rates in Household Clarity. First cover essentials and required payments; then consider directing extra money to higher-interest debt."
      : "Añade saldos, cuotas y tipos de interés en Claridad Hogar. Cubre primero lo esencial y las cuotas obligatorias; después valora amortizar antes las deudas de mayor interés.");
    if (!debts.length) return output(en ? "No outstanding debts are recorded in Household Clarity. Review this information periodically." : "No tienes deudas pendientes registradas en Claridad Hogar. Revisa este dato periódicamente.");
    return output((en
      ? `You have ${debts.length} outstanding debt(s), with ${money(debtPayments)} in scheduled monthly payments. The highest recorded rate is ${higherDebt.name} (${pct(amount(higherDebt.rate))} annual). Keep up with required payments and, if affordable, consider directing extra funds to the highest-interest balance. Never skip essential expenses.`
      : `Tienes ${debts.length} deuda(s) pendiente(s), con cuotas mensuales de ${money(debtPayments)}. El mayor tipo de interés registrado corresponde a «${higherDebt.name}» (${pct(amount(higherDebt.rate))} anual). Mantén las cuotas obligatorias y, si tienes margen, valora amortizar primero la deuda de mayor interés sin descuidar gastos esenciales.`));
  }

  if (has("emergencia", "colchon", "imprevistos", "emergency", "rainy day", "safety net")) {
    if (!household) return output(en
      ? "Set your emergency savings and essential monthly expenses in Household Clarity. A common benchmark is 3–6 months of essentials, starting with a small accessible reserve."
      : "Registra tu colchón y tus gastos esenciales en Claridad Hogar. Como referencia general se usan 3–6 meses de gastos básicos, empezando por un pequeño fondo accesible.");
    if (essentials <= 0) return output(en ? "Enter your essential spending first to estimate emergency coverage." : "Introduce primero tus gastos esenciales para calcular la cobertura del colchón.");
    const gap = Math.max(0, essentials * 3 - emergency);
    return output(en
      ? `You have ${money(emergency)} set aside. Essential costs and debt payments are ${money(essentials)}/month, covering about ${months.toFixed(1)} months. A three-month benchmark is ${money(essentials * 3)}${gap > 0 ? ` (${money(gap)} remaining)` : " (already reached)"}. Start gradually and keep the money accessible.`
      : `Tienes ${money(emergency)} de colchón. Los gastos esenciales y cuotas suman ${money(essentials)}/mes: cubres unos ${months.toFixed(1)} meses. Tres meses serían ${money(essentials * 3)}${gap > 0 ? ` (faltan ${money(gap)})` : " (objetivo alcanzado)"}. Avanza poco a poco y mantenlo accesible.`);
  }

  if (has("3 recomend", "tres recomend", "plan financiero", "plan mensual", "financial plan", "three tip", "three recommendation", "analiza mi situacion", "analyze my finances")) {
    const first = higherDebt
      ? (en ? `1. Debt first: keep up with minimum repayments and review higher-interest debt, starting with ${higherDebt.name}.` : `1. Deudas primero: mantén las cuotas y revisa la deuda de mayor interés, empezando por «${higherDebt.name}».`)
      : (en ? "1. Review debts: none are recorded; avoid costly borrowing." : "1. Revisa las deudas: no hay ninguna registrada; evita financiación costosa.");
    const second = essentials > 0
      ? (en ? `2. Emergency savings: you have ${money(emergency)}, about ${(months || 0).toFixed(1)} months of essentials. Build toward 3–6 months at a manageable pace.` : `2. Colchón de emergencia: tienes ${money(emergency)}, unos ${(months || 0).toFixed(1)} meses de básicos. Avanza de forma asumible hacia 3–6 meses.`)
      : (en ? "2. Emergency savings: record essential expenses and start with a small accessible reserve." : "2. Colchón de emergencia: registra los gastos esenciales y empieza con una reserva pequeña y accesible.");
    const third = en
      ? `3. Budget: use 50/30/20 as a flexible guideline; your estimated household remainder is ${money(remainder)} before any unrecorded costs.`
      : `3. Presupuesto: usa la regla 50/30/20 como guía flexible; el margen doméstico estimado es ${money(remainder)} antes de gastos no registrados.`;
    return output([first,second,third].join("\n"));
  }

  if (has("pendiente", "por pagar", "recibo", "factura", "unpaid", "pending bill", "monthly bill", "bill due")) {
    const pending = bills.filter(b => !b.pagado);
    if (!bills.length) return output(en ? "You haven't added monthly bills yet." : "Todavía no has añadido gastos mensuales.");
    if (!pending.length) return output(en ? `All recorded bills are marked paid (${money(c.gastosMensualesPagados)}).` : `Todos los recibos figuran pagados (${money(c.gastosMensualesPagados)}).`);
    return output((en ? `You have ${pending.length} unpaid bills totaling ${money(c.gastosMensualesPendientes)}:` : `Tienes ${pending.length} gastos mensuales pendientes por ${money(c.gastosMensualesPendientes)}:`) +
      "\n" + pending.map(b => `• ${b.concepto}: ${money(b.importe)}`).join("\n"));
  }

  if (has("nomina", "salario", "sueldo", "sobrante", "salary", "paycheck", "pay slip", "monthly income")) {
    if (netSalary <= 0) return output(en ? "Add your salary in the Salary section to estimate your monthly remainder." : "Introduce tu nómina en la pestaña Nómina para calcular cuánto podría sobrar.");
    return output(en
      ? `Your recorded salary is ${money(netSalary)}, planned monthly bills are ${money(c.gastosMensualesPrevistos)}, and the estimated remainder is ${money(c.sobranteEstimado)}. This does not include any additional costs not entered.`
      : `Tu nómina registrada es ${money(netSalary)}, tus gastos mensuales previstos suman ${money(c.gastosMensualesPrevistos)} y el sobrante estimado es ${money(c.sobranteEstimado)}. No incluye gastos que no hayas registrado.`);
  }

  const targetMatch = q.match(/(?:ahorrar|save|saving)\s+(\d+(?:[.,]\d+)?)\s*(?:€|euros?|eur|dollars?)?\s*(?:en|in|over)?\s*(\d+)\s*(?:meses?|months?)/);
  if (targetMatch) {
    const target = Number(targetMatch[1].replace(",", "."));
    const duration = Number(targetMatch[2]);
    if (target > 0 && duration > 0 && duration <= 600) {
      const monthly = target / duration;
      return output(en
        ? `To save ${money(target)} in ${duration} months, you'd need to set aside about ${money(monthly)} each month. Compare that with your estimated monthly remainder (${money(c.sobranteEstimado)}). Adjust the goal if essentials and debt payments leave too little.`
        : `Para ahorrar ${money(target)} en ${duration} meses tendrías que reservar unos ${money(monthly)} al mes. Compáralo con tu sobrante mensual estimado (${money(c.sobranteEstimado)}). Adapta la meta si los gastos esenciales y deudas no dejan margen.`);
    }
  }

  if (has("cuanto gasto", "en que gasto", "gasto mas", "mis gastos", "analiza mis gastos", "analiza gastos", "que gasto mas", "gastos por categoria", "spend most", "spending", "expenses by category", "where do i spend", "my expenses")) {
    if (!categories.length) return output(en ? "No spending categories have been recorded yet." : "Aún no hay categorías de gastos registradas.");
    return output((en ? `Your recorded spending totals ${money(recordedExpenses)}. ` : `Tus gastos registrados suman ${money(recordedExpenses)}. `) +
      (top ? (en ? `The largest category is ${top.categoria} (${money(top.total)}).` : `La categoría más alta es ${top.categoria} (${money(top.total)}).`) : "") +
      "\n" + [...categories].sort((a,b)=>amount(b.total)-amount(a.total)).slice(0,6).map(x=>`• ${x.categoria}: ${money(x.total)}`).join("\n"));
  }

  if (has("ahorrar", "ahorro mas", "ahorrar mas", "reducir gastos", "recortar", "save more", "save money", "cut cost", "reduce spend", "tip for saving")) {
    const lines = en ? [
      "1. Track essentials and discretionary spending separately.",
      top ? `2. Review ${top.categoria}, your largest recorded spending category (${money(top.total)}).` : "2. Record expenses regularly to spot patterns.",
      higherDebt ? `3. Prioritize required debt payments, especially high-interest balances.` : "3. Build accessible emergency savings before taking additional financial risks."
    ] : [
      "1. Separa gastos imprescindibles y opcionales.",
      top ? `2. Revisa «${top.categoria}», tu categoría de mayor gasto (${money(top.total)}).` : "2. Registra gastos para detectar patrones.",
      higherDebt ? "3. Prioriza las cuotas de deuda, sobre todo las de interés alto." : "3. Empieza un colchón de emergencia antes de asumir riesgos financieros adicionales."
    ];
    return output(lines.join("\n"));
  }

  if (has("objetivo", "meta", "mis ahorros", "saving goal", "my savings", "goal", "target")) {
    if (!goals.length) return output(en ? "No savings goals recorded. Add one in Savings." : "Todavía no tienes objetivos. Puedes crearlos en Ahorros.");
    return output((en ? `You've set aside ${money(c.ahorrado)} across your goals:` : `Llevas ${money(c.ahorrado)} apartados para tus objetivos:`) + "\n" +
      goals.map(g => `• ${g.nombre}: ${money(g.ahorrado)} / ${money(g.meta)} (${g.meta > 0 ? Math.min(100,Math.round(g.ahorrado/g.meta*100)) : 0}%)`).join("\n"));
  }

  const glossary = [
    { words:["interes compuesto", "compound interest"], es:"El interés compuesto consiste en que los intereses se acumulan y pueden generar intereses nuevos. El resultado depende de la tasa, el tiempo y los riesgos.", en:"Compound interest means previously earned interest can itself earn interest. The result depends on the rate, time and risks." },
    { words:["inflacion", "inflation"], es:"La inflación es el aumento general de precios, que reduce el poder adquisitivo de una cantidad fija de dinero.", en:"Inflation is a general rise in prices that reduces the purchasing power of a fixed amount of money." },
    { words:["diversificar", "diversificacion", "diversification"], es:"Diversificar consiste en distribuir el dinero entre distintos activos o sectores. Puede reducir la concentración del riesgo, pero no elimina las pérdidas.", en:"Diversification spreads exposure across investments or sectors. It can reduce concentration risk but does not eliminate the possibility of losses." },
    { words:["indexado", "etf", "index fund"], es:"Un fondo indexado busca seguir un índice de mercado. Tiene riesgos, posibles pérdidas y comisiones; aquí solo ofrecemos información educativa.", en:"An index fund aims to track a market index. It has risks, possible losses and fees; this explanation is educational only." },
    { words:["inversion", "invertir", "invest", "stock market"], es:"Antes de invertir, conviene entender el riesgo, mantener liquidez para imprevistos y revisar deudas. Las inversiones pueden perder valor. El simulador de MoneyMind no mueve dinero real.", en:"Before investing, understand the risks, keep emergency cash and review debts. Investments can lose value. MoneyMind's simulator does not move real money." }
  ];
  const term = glossary.find(g => g.words.some(w => has(w)));
  if (term) return output(term[en ? "en" : "es"]);

  if (has("saldo", "balance", "dinero disponible", "cuanto tengo", "cuanto dinero tengo", "cuanto me queda", "money left", "available money", "how much money", "my balance")) {
    return output(en
      ? `Your MoneyMind available balance is ${money(c.disponible)}: income ${money(recordedIncome)} − expenses ${money(recordedExpenses)} − set-aside savings ${money(c.ahorrado)} − simulated investments ${money(c.invertidoSimulado)}.`
      : `Tu saldo disponible en MoneyMind es ${money(c.disponible)}: ingresos ${money(recordedIncome)} − gastos ${money(recordedExpenses)} − ahorros apartados ${money(c.ahorrado)} − inversiones simuladas ${money(c.invertidoSimulado)}.`);
  }

  if (q.length < 6 && has("si", "yes", "ok", "vale")) return output(quick());
  const followup = normalizedLocal(lastQuestion);
  if (has("y eso", "and that", "explica mas", "explain more") && followup) {
    return output(en ? "Could you specify which amount or concept you'd like me to explain? I can calculate it from your recorded data." : "¿Qué cantidad o concepto quieres que explique? Puedo calcularlo con los datos registrados.");
  }
  return output(en
    ? "I can help with budgets, monthly expenses, saving goals, stocks, ETFs, indices, dividends, investing risks and hypothetical calculations. Ask about one of those topics. I don't generate unrestricted answers like a cloud language model."
    : "Puedo ayudarte con saldos, gastos, recibos, deudas, ahorros, acciones, ETF, índices, dividendos, riesgos y cálculos hipotéticos. Pregúntame por un tema concreto. No genero respuestas libres como una IA en la nube.");
}

// Convierte el texto de la IA (Markdown ligero) en elementos de React, sin HTML inseguro.
function renderInline(text) {
  return text.split(/(\*\*[^*\n]+\*\*|`[^`\n]+`)/g).map((part, i) => {
    if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    return part;
  });
}

function RichText({ text }) {
  const lines = text.split("\n");
  const bullet = /^\s*[-*•]\s+/;
  const numbered = /^\s*\d+[.)]\s+/;
  const heading = /^#{1,4}\s+/;
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      const code = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) { code.push(lines[i]); i++; }
      i++;
      blocks.push({ type: "code", text: code.join("\n") });
    } else if (bullet.test(line)) {
      const items = [];
      while (i < lines.length && bullet.test(lines[i])) { items.push(lines[i].replace(bullet, "")); i++; }
      blocks.push({ type: "ul", items });
    } else if (numbered.test(line)) {
      const items = [];
      while (i < lines.length && numbered.test(lines[i])) { items.push(lines[i].replace(numbered, "")); i++; }
      blocks.push({ type: "ol", items });
    } else if (heading.test(line)) {
      blocks.push({ type: "h", text: line.replace(heading, "") });
      i++;
    } else if (!line.trim()) {
      i++;
    } else {
      const para = [];
      while (
        i < lines.length && lines[i].trim() && !bullet.test(lines[i]) && !numbered.test(lines[i]) &&
        !heading.test(lines[i]) && !lines[i].trim().startsWith("```")
      ) { para.push(lines[i]); i++; }
      blocks.push({ type: "p", text: para.join("\n") });
    }
  }

  return blocks.map((block, k) => {
    if (block.type === "code") return <pre key={k}><code>{block.text}</code></pre>;
    if (block.type === "ul") return <ul key={k}>{block.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}</ul>;
    if (block.type === "ol") return <ol key={k}>{block.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}</ol>;
    if (block.type === "h") return <h4 key={k}>{renderInline(block.text)}</h4>;
    return <p key={k}>{renderInline(block.text)}</p>;
  });
}

function AssistantChat({ context, language = "es" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => readStorage("mm_chat", []));
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  // Guardamos la conversación para que no se pierda al recargar
  useEffect(() => {
    const toSave = messages.filter(m => !m.pending && m.content.trim()).slice(-40);
    try { localStorage.setItem("mm_chat", JSON.stringify(toSave)); queueCloudSave(); } catch { /* sin espacio */ }
  }, [messages]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const resetChat = () => {
    setMessages([]);
  };


  const send = text => {
    const question = text.trim();
    if (!question) return;
    const previous = messages.filter(m => !m.pending);
    const next = [...previous, { role: "user", content: question }];
    setInput("");
    // Cálculo inmediato, 100% dentro del navegador y sin peticiones de red.
    const answer = localFinanceReply(question, context, language, previous);
    setMessages([...next, { role: "assistant", content: answer }]);
  };

  const en = language === "en";
  const suggestions = en
    ? ["Analyze my spending", "What is an ETF?", "How do dividends work?", "How can I compare two companies?", "Explain stock-market risk", "Explain the 50/30/20 rule"]
    : ["Analiza mis gastos", "¿Qué es un ETF?", "¿Cómo funcionan los dividendos?", "¿Cómo comparo dos empresas?", "Explícame los riesgos de la bolsa", "Explícame la regla 50/30/20"];

  return (
    <>
      {open && (
        <div className="chat-panel" role="dialog" aria-label={en ? "MoneyMind financial assistant" : "Asistente MoneyMind AI"}>
          <div className="chat-header">
            <div className="chat-header-icon"><Bot size={20} /></div>
            <div>
              <strong>Asistente MoneyMind</strong>
              <span>{en ? "Offline financial assistant" : "Asistente financiero sin conexión"}</span>
            </div>
            <div className="chat-header-actions">
              <button type="button" onClick={resetChat} aria-label={en ? "New conversation" : "Nueva conversación"} title={en ? "New conversation" : "Nueva conversación"}>
                <RotateCcw size={16} />
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label={en ? "Close chat" : "Cerrar chat"}>
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="chat-messages" ref={listRef}>
            <div className="chat-bubble assistant">
              <RichText text={en ? "Hello! I can help with your MoneyMind budget and explain stocks, ETFs, indices, dividends, investing risks and educational examples. No external AI API is needed." : "¡Hola! Puedo ayudarte con tus datos de MoneyMind y enseñarte sobre acciones, ETF, índices, dividendos, riesgos y simulaciones. Todo sin API de IA externa."} />
            </div>
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                {m.role === "user"
                  ? m.content
                  : m.content
                    ? <RichText text={m.content} />
                    : <span className="chat-typing"><i /><i /><i /></span>}
              </div>
            ))}
          </div>

          {messages.length === 0 && (
            <div className="chat-chips">
              {suggestions.map(s => (
                <button type="button" key={s} onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          <form className="chat-form" onSubmit={e => { e.preventDefault(); send(input); }}>
            <textarea
              value={input}
              rows={Math.min(4, input.split("\n").length)}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder={en ? "Ask a question… (Enter to send)" : "Escribe tu pregunta… (Intro para enviar)"}
              maxLength={2000}
            />
            <button type="submit" disabled={!input.trim()} aria-label={en ? "Send" : "Enviar"}>
              <Send size={17} />
            </button>
          </form>
          <small className="chat-disclaimer">
            {LOCAL_DISCLAIMER[en ? "en" : "es"]}
          </small>
        </div>
      )}

      <button
        type="button"
        className="chat-fab"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? (en ? "Close assistant" : "Cerrar asistente") : (en ? "Open assistant" : "Abrir asistente")}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}

export default App;