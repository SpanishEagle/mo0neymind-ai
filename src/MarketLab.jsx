
import { useEffect, useMemo, useState } from "react";
import {
  Search, Star, Trash2, TrendingUp, Globe2,
  PieChart as PieIcon, BarChart3, Plus, Info,
  Calculator, BookOpen
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from "recharts";
import "./MarketLab.css";

const DEFAULT_STOCKS = [
  { symbol: "NASDAQ:AAPL", name: "Apple" },
  { symbol: "NASDAQ:MSFT", name: "Microsoft" },
  { symbol: "NASDAQ:NVDA", name: "NVIDIA" },
  { symbol: "NASDAQ:GOOGL", name: "Alphabet (Google)" },
  { symbol: "NASDAQ:AMZN", name: "Amazon" },
  { symbol: "NASDAQ:TSLA", name: "Tesla" },
  { symbol: "NASDAQ:META", name: "Meta" },
  { symbol: "NYSE:KO", name: "Coca-Cola" },
  { symbol: "NYSE:DIS", name: "Disney" },
  { symbol: "BME:SAN", name: "Santander" },
  { symbol: "BME:ITX", name: "Inditex" },
  { symbol: "BME:IBE", name: "Iberdrola" },
  { symbol: "INDEX:IBEX35", name: "IBEX 35" },
  { symbol: "SP:SPX", name: "S&P 500" },
  { symbol: "NASDAQ:NDX", name: "Nasdaq 100" }
];

const FUND_TYPES = [
  {
    id: "global",
    es: "Fondo global diversificado",
    en: "Diversified global fund",
    rate: 0.05,
    color: "#9b87ff"
  },
  {
    id: "bonds",
    es: "Fondo de renta fija",
    en: "Fixed-income fund",
    rate: 0.02,
    color: "#39c6bd"
  },
  {
    id: "sustainable",
    es: "Fondo sostenible",
    en: "Sustainable fund",
    rate: 0.04,
    color: "#ffb86b"
  }
];

const formatMoney = (value, en) =>
  new Intl.NumberFormat(en ? "en-GB" : "es-ES", {
    style: "currency",
    currency: "EUR"
  }).format(Number(value) || 0);

function readSaved(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) ? saved : fallback;
  } catch {
    return fallback;
  }
}

// Evita símbolos con caracteres no válidos.
function cleanSymbol(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9:_./-]/g, "")
    .slice(0, 80);
}

// ==============================
// GRÁFICOS TRADINGVIEW
// ==============================

function TradingWidget({ type, options, height = 450 }) {
  const html = useMemo(() => {
    const scripts = {
      chart: "embed-widget-advanced-chart.js",
      tape: "embed-widget-ticker-tape.js",
      overview: "embed-widget-market-overview.js"
    };

    const script = scripts[type] || scripts.chart;
    const json = JSON.stringify(options).replace(/</g, "\\u003c");

    return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
html,body{
 margin:0;
 padding:0;
 width:100%;
 height:100%;
 background:#151a29;
 overflow:hidden;
}
.tradingview-widget-container,
.tradingview-widget-container__widget{
 width:100%;
 height:100%;
}
</style>
</head>
<body>
<div class="tradingview-widget-container">
<div class="tradingview-widget-container__widget"></div>
<script async
src="https://s3.tradingview.com/external-embedding/${script}"
type="text/javascript">${json}</script>
</div>
</body>
</html>`;
  }, [type, options]);

  return (
    <iframe
      key={`${type}-${JSON.stringify(options)}`}
      title={`TradingView ${type}`}
      srcDoc={html}
      loading="lazy"
      style={{
        display: "block",
        width: "100%",
        height,
        border: 0,
        borderRadius: 12,
        background: "#151a29"
      }}
    />
  );
}

const btnStyle = {
  padding: "10px 14px",
  border: "1px solid #45415e",
  borderRadius: 10,
  color: "#f6f4ff",
  background: "#29243e",
  cursor: "pointer"
};

const inputStyle = {
  width: "100%",
  minWidth: 0,
  padding: "12px 14px",
  borderRadius: 10,
  background: "#171525",
  color: "#fff",
  border: "1px solid #45415e",
  outline: "none",
  boxSizing: "border-box"
};

// ==============================
// BOLSA
// ==============================

export function MarketPage({ language = "es" }) {
  const en = language === "en";

  const [symbol, setSymbol] = useState("NASDAQ:AAPL");
  const [search, setSearch] = useState("");
  const [customSymbol, setCustomSymbol] = useState("");
  const [customName, setCustomName] = useState("");
  const [message, setMessage] = useState("");

  const [favorites, setFavorites] = useState(() =>
    readSaved("mm_market_favorites_v2", [])
  );

  const [recent, setRecent] = useState(() =>
    readSaved("mm_market_recent_v2", [])
  );

  useEffect(() => {
    localStorage.setItem(
      "mm_market_favorites_v2",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(
      "mm_market_recent_v2",
      JSON.stringify(recent)
    );
  }, [recent]);

  const allStocks = useMemo(() => {
    const map = new Map();

    for (const item of DEFAULT_STOCKS) {
      map.set(item.symbol, item);
    }

    for (const item of [...recent, ...favorites]) {
      if (item && typeof item.symbol === "string") {
        map.set(item.symbol, item);
      }
    }

    return [...map.values()];
  }, [recent, favorites]);

  const currentStock = allStocks.find(s => s.symbol === symbol) || {
    symbol,
    name: symbol
  };

  const isFavorite = favorites.some(
    item => item.symbol === symbol
  );

  const filtered = allStocks.filter(item => {
    const q = search.trim().toLowerCase();

    return !q ||
      item.name.toLowerCase().includes(q) ||
      item.symbol.toLowerCase().includes(q);
  });

  function openStock(stock) {
    setSymbol(stock.symbol);
    setRecent(previous => [
      stock,
      ...previous.filter(item => item.symbol !== stock.symbol)
    ].slice(0, 25));

    setMessage("");
  }

  function addCustom(event) {
    event.preventDefault();

    const code = cleanSymbol(customSymbol);

    if (!/^[A-Z0-9_.-]+:[A-Z0-9_./-]+$/.test(code)) {
      setMessage(en
        ? "Enter a symbol such as NASDAQ:TSLA or NYSE:KO."
        : "Introduce un símbolo como NASDAQ:TSLA o NYSE:KO."
      );
      return;
    }

    const existing = allStocks.find(
      item => item.symbol === code
    );

    const name =
      existing?.name ||
      customName.trim().slice(0, 100) ||
      code.split(":").pop();

    const stock = { symbol: code, name };

    openStock(stock);
    setCustomSymbol("");
    setCustomName("");

    setMessage(en
      ? "Symbol loaded. Confirm the company in the chart."
      : "Símbolo cargado. Comprueba la empresa en el gráfico."
    );
  }

  function toggleFavorite(stock) {
    const exists = favorites.some(
      item => item.symbol === stock.symbol
    );

    if (exists) {
      setFavorites(previous =>
        previous.filter(item => item.symbol !== stock.symbol)
      );
    } else {
      setFavorites(previous => [stock, ...previous]);
    }
  }

  const chartOptions = useMemo(() => ({
    autosize: true,
    symbol,
    interval: "D",
    timezone: "Europe/Madrid",
    theme: "dark",
    style: "1",
    locale: en ? "en" : "es",
    backgroundColor: "#151a29",
    hide_side_toolbar: false,
    allow_symbol_change: true,
    save_image: false,
    calendar: false,
    support_host: "https://www.tradingview.com"
  }), [symbol, en]);

  const tapeOptions = useMemo(() => ({
    symbols: [
      { proName: "NASDAQ:AAPL", title: "Apple" },
      { proName: "NASDAQ:NVDA", title: "NVIDIA" },
      { proName: "NASDAQ:TSLA", title: "Tesla" },
      { proName: "SP:SPX", title: "S&P 500" },
      { proName: "INDEX:IBEX35", title: "IBEX 35" }
    ],
    showSymbolLogo: true,
    isTransparent: true,
    displayMode: "adaptive",
    colorTheme: "dark",
    locale: en ? "en" : "es"
  }), [en]);

  const overviewOptions = useMemo(() => ({
    colorTheme: "dark",
    dateRange: "12M",
    showChart: true,
    locale: en ? "en" : "es",
    width: "100%",
    height: "100%",
    showSymbolLogo: true,
    tabs: [
      {
        title: "Indices",
        symbols: [
          { s: "SP:SPX", d: "S&P 500" },
          { s: "NASDAQ:NDX", d: "Nasdaq 100" },
          { s: "INDEX:IBEX35", d: "IBEX 35" }
        ]
      },
      {
        title: "Stocks",
        symbols: [
          { s: "NASDAQ:AAPL", d: "Apple" },
          { s: "NASDAQ:NVDA", d: "NVIDIA" },
          { s: "NASDAQ:TSLA", d: "Tesla" }
        ]
      }
    ]
  }), [en]);

  return (
    <div className="mm-market-page">

      <div className="mm-market-hero">
        <div>
          <span className="eyebrow">
            {en ? "GLOBAL MARKETS" : "MERCADOS MUNDIALES"}
          </span>
          <h2>
            <Globe2 size={25} />
            {en ? "Stock market" : "Bolsa"}
          </h2>
          <p>
            {en
              ? "Discover symbols, explore charts and save favorites."
              : "Explora empresas, consulta gráficos y guarda favoritos."}
          </p>
        </div>
        <TrendingUp size={44} />
      </div>

      {/* TICKER */}

      <div className="mm-market-panel" style={{ padding: 8 }}>
        <TradingWidget
          type="tape"
          options={tapeOptions}
          height={85}
        />
      </div>

      {/* BÚSQUEDA */}

      <div className="mm-market-panel">
        <h3>
          <Search size={19} />
          {en ? "Find a company" : "Buscar empresa"}
        </h3>

        <p className="mm-market-muted">
          {en
            ? "Search popular companies and symbols you have saved."
            : "Busca empresas conocidas y los símbolos que hayas guardado."}
        </p>

        <input
          style={inputStyle}
          type="search"
          placeholder={en
            ? "Apple, Tesla, Microsoft, NASDAQ..."
            : "Apple, Tesla, Microsoft, Santander..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div
          style={{
            display: "grid",
            gap: 8,
            marginTop: 14,
            maxHeight: 285,
            overflowY: "auto"
          }}
        >
          {filtered.length ? filtered.map(item => {
            const saved = favorites.some(
              fav => fav.symbol === item.symbol
            );

            return (
              <div
                key={item.symbol}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center"
                }}
              >
                <button
                  type="button"
                  onClick={() => openStock(item)}
                  style={{
                    ...btnStyle,
                    flex: 1,
                    textAlign: "left",
                    background: symbol === item.symbol
                      ? "#45396b"
                      : "#211d32"
                  }}
                >
                  <strong style={{ display: "block" }}>
                    {item.name}
                  </strong>
                  <small style={{ opacity: 0.65 }}>
                    {item.symbol}
                  </small>
                </button>

                <button
                  type="button"
                  onClick={() => toggleFavorite(item)}
                  title={saved
                    ? "Quitar de favoritos"
                    : "Añadir a favoritos"}
                  style={btnStyle}
                >
                  <Star
                    size={19}
                    fill={saved ? "#f6c64b" : "none"}
                    color={saved ? "#f6c64b" : "#ddd"}
                  />
                </button>
              </div>
            );
          }) : (
            <p className="mm-market-muted">
              {en
                ? "Not in your list? Add any TradingView symbol below."
                : "¿No aparece? Añade su símbolo de TradingView abajo."}
            </p>
          )}
        </div>
      </div>

      {/* CUALQUIER SÍMBOLO */}

      <div className="mm-market-panel">
        <h3>
          <Plus size={19} />
          {en
            ? "Search any TradingView symbol"
            : "Buscar cualquier símbolo de TradingView"}
        </h3>

        <p className="mm-market-muted">
          {en
            ? "Use the chart's built-in company search to find its official exchange code. Then enter that code here to add it to your watchlist."
            : "Utiliza el buscador del propio gráfico para localizar una empresa y su símbolo. Después introduce ese símbolo aquí para añadirla a favoritos."}
        </p>

        <form
          onSubmit={addCustom}
          style={{
            display: "grid",
            gap: 12,
            marginTop: 16
          }}
        >
          <label style={{ display: "grid", gap: 7 }}>
            <span>
              {en ? "Exchange and symbol" : "Bolsa y símbolo"}
            </span>
            <input
              style={inputStyle}
              value={customSymbol}
              placeholder="NASDAQ:TSLA"
              onChange={e => setCustomSymbol(e.target.value)}
              required
            />
          </label>

          <label style={{ display: "grid", gap: 7 }}>
            <span>
              {en
                ? "Company name (optional)"
                : "Nombre de empresa (opcional)"}
            </span>
            <input
              style={inputStyle}
              value={customName}
              placeholder={en ? "Tesla" : "Ejemplo: Tesla"}
              onChange={e => setCustomName(e.target.value)}
            />
          </label>

          <button
            type="submit"
            className="mm-market-action"
          >
            <Search size={17} />
            {en ? "Open company" : "Mostrar empresa"}
          </button>
        </form>

        {message && (
          <p className="mm-market-muted">{message}</p>
        )}

        <p className="mm-market-muted" style={{ marginTop: 12 }}>
          {en ? "You can also discover symbols on" : "También puedes encontrar símbolos en"}{" "}
          <a
            href="https://www.tradingview.com/symbols/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#b6a1ff" }}
          >
            TradingView
          </a>.
        </p>
      </div>

      {/* FAVORITOS */}

      <div className="mm-market-panel">
        <h3>
          <Star size={20} color="#f6c64b" />
          {en ? "My favorites" : "Mis favoritos"}
          <span style={{ opacity: 0.6, marginLeft: 6 }}>
            ({favorites.length})
          </span>
        </h3>

        {favorites.length === 0 ? (
          <p className="mm-market-muted">
            {en
              ? "Click a star next to a company to save it here."
              : "Pulsa la estrella de una empresa para guardarla aquí."}
          </p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {favorites.map(item => (
              <div
                key={item.symbol}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}
              >
                <button
                  type="button"
                  onClick={() => openStock(item)}
                  style={{
                    ...btnStyle,
                    flex: 1,
                    textAlign: "left",
                    background: symbol === item.symbol
                      ? "#45396b"
                      : "#211d32"
                  }}
                >
                  <strong style={{ display: "block" }}>
                    {item.name}
                  </strong>
                  <small style={{ opacity: 0.65 }}>
                    {item.symbol}
                  </small>
                </button>

                <button
                  type="button"
                  style={btnStyle}
                  onClick={() => toggleFavorite(item)}
                  title={en ? "Remove favorite" : "Quitar favorito"}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GRÁFICO */}

      <div className="mm-market-section-title">
        <h3>
          {en ? "Interactive chart" : "Gráfico interactivo"}
        </h3>
      </div>

      <div className="mm-market-panel">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
          marginBottom: 15
        }}>
          <div>
            <strong style={{ fontSize: 19 }}>
              {currentStock.name}
            </strong>
            <div className="mm-market-muted">
              {currentStock.symbol}
            </div>
          </div>

          <button
            type="button"
            style={btnStyle}
            onClick={() => toggleFavorite(currentStock)}
          >
            <Star
              size={18}
              fill={isFavorite ? "#f6c64b" : "none"}
              color="#f6c64b"
              style={{ verticalAlign: "middle", marginRight: 6 }}
            />
            {isFavorite
              ? (en ? "Saved" : "En favoritos")
              : (en ? "Add favorite" : "Añadir a favoritos")}
          </button>
        </div>

        <p className="mm-market-muted">
          {en
            ? "You can also use the symbol search inside the chart. To save a new symbol as a favorite, enter it in the form above."
            : "También puedes buscar empresas dentro del gráfico. Para guardar una nueva como favorita, escribe su símbolo en el formulario de arriba."}
        </p>

        <TradingWidget
          type="chart"
          options={chartOptions}
          height={550}
        />
      </div>

      {/* RESUMEN */}

      <div className="mm-market-panel">
        <h3>
          <BarChart3 size={19} />
          {en ? "Market overview" : "Resumen de mercados"}
        </h3>
        <TradingWidget
          type="overview"
          options={overviewOptions}
          height={460}
        />
      </div>

      <div className="mm-market-panel">
        <h3>
          <Info size={19} />
          {en ? "Market information" : "Información de mercado"}
        </h3>

        <p className="mm-market-muted">
          {en
            ? "Charts and quotes are provided by TradingView. Some markets display delayed information. Adding favorites does not buy shares."
            : "Gráficos y cotizaciones proporcionados por TradingView. Algunos mercados muestran datos con retraso. Añadir favoritos no compra acciones."}
        </p>
      </div>
    </div>
  );
}

// ==============================
// INVERSIONES SIMULADAS
// ==============================

export function InvestmentLab({
  language = "es",
  investments = [],
  setInvestments = () => {},
  funds = [],
  investedTotal = 0,
  balance = 0,
  addInvestment = e => e.preventDefault(),
  investmentAmount = "",
  setInvestmentAmount = () => {},
  selectedFund = "global",
  setSelectedFund = () => {}
}) {
  const en = language === "en";

  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(50);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(0.03);

  const amount = Math.max(0, Number(initial) || 0);
  const contribution = Math.max(0, Number(monthly) || 0);
  const duration = Math.min(
    40,
    Math.max(1, Math.round(Number(years) || 1))
  );

  const simulation = useMemo(() => {
    let value = amount;
    const data = [{ year: 0, value }];

    for (let year = 1; year <= duration; year++) {
      for (let month = 0; month < 12; month++) {
        value = value * (1 + rate / 12) + contribution;
      }
      data.push({ year, value });
    }

    return data;
  }, [amount, contribution, duration, rate]);

  const result = simulation[simulation.length - 1].value;
  const deposited = amount + contribution * 12 * duration;

  const allocation = FUND_TYPES.map(fund => ({
    ...fund,
    amount: investments
      .filter(item => item.fundId === fund.id)
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  })).filter(item => item.amount > 0);

  const totalAllocated = allocation.reduce(
    (sum, item) => sum + item.amount, 0
  );

  const fieldStyle = {
    display: "grid",
    gap: 7
  };

  return (
    <div className="mm-market-page">
      <div className="mm-market-hero">
        <div>
          <span className="eyebrow">
            {en ? "EDUCATIONAL PORTFOLIO" : "CARTERA EDUCATIVA"}
          </span>
          <h2>
            <PieIcon size={25} />
            {en ? "Investment studio" : "Centro de inversiones"}
          </h2>
          <p>
            {en
              ? "Practice allocation and explore hypothetical outcomes."
              : "Practica la distribución de fondos y explora resultados hipotéticos."}
          </p>
        </div>
        <TrendingUp size={44} />
      </div>

      <div className="mm-market-panel">
        <p className="mm-market-muted">
          {en
            ? "Educational simulation. No real investments or guaranteed returns."
            : "Simulación educativa. Sin inversiones reales ni rentabilidades garantizadas."}
        </p>
      </div>

      <div className="mm-market-kpis">
        <div>
          <small>{en ? "Virtual contributions" : "Aportaciones virtuales"}</small>
          <strong>{formatMoney(investedTotal, en)}</strong>
        </div>
        <div>
          <small>{en ? "Available balance" : "Saldo disponible"}</small>
          <strong>{formatMoney(balance, en)}</strong>
        </div>
        <div>
          <small>{en ? "Operations" : "Operaciones"}</small>
          <strong>{investments.length}</strong>
        </div>
      </div>

      <div className="mm-market-section-title">
        <h3>{en ? "Example funds" : "Fondos de ejemplo"}</h3>
      </div>

      <div className="mm-fund-grid">
        {FUND_TYPES.map(fund => {
          const actualFund = funds.find(f => f.id === fund.id);

          return (
            <div
              className={`mm-market-panel mm-fund-card ${
                selectedFund === fund.id ? "selected" : ""
              }`}
              key={fund.id}
            >
              <span
                className="mm-fund-swatch"
                style={{ background: fund.color }}
              />
              <h3>{en ? fund.en : fund.es}</h3>
              <p>
                {en
                  ? "Illustrative fund. Actual returns can be negative."
                  : "Fondo ilustrativo. Las rentabilidades reales pueden ser negativas."}
              </p>
              <div className="mm-fund-features">
                <span>{en ? "Example rate" : "Tasa ilustrativa"}</span>
                <strong>
                  {((actualFund?.rate ?? fund.rate) * 100).toFixed(1)}%
                </strong>
              </div>
              <button
                type="button"
                className="mm-market-action"
                onClick={() => setSelectedFund(fund.id)}
              >
                {selectedFund === fund.id
                  ? (en ? "Selected" : "Seleccionado")
                  : (en ? "Select" : "Seleccionar")}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mm-market-grid">
        <div className="mm-market-panel">
          <h3>
            <Plus size={18} />
            {en ? "Virtual contribution" : "Aportación virtual"}
          </h3>

          <form
            className="mm-invest-form"
            onSubmit={addInvestment}
          >
            <label>
              {en ? "Fund" : "Fondo"}
              <select
                value={selectedFund}
                onChange={e => setSelectedFund(e.target.value)}
              >
                {FUND_TYPES.map(f => (
                  <option value={f.id} key={f.id}>
                    {en ? f.en : f.es}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {en ? "Amount (€)" : "Cantidad (€)"}
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={investmentAmount}
                onChange={e => setInvestmentAmount(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              className="mm-market-action"
              disabled={
                Number(investmentAmount) <= 0 ||
                Number(investmentAmount) > balance
              }
            >
              {en ? "Add virtually" : "Añadir virtualmente"}
            </button>
          </form>
        </div>

        <div className="mm-market-panel">
          <h3>
            {en ? "Portfolio allocation" : "Distribución de cartera"}
          </h3>

          {allocation.length ? (
            <>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie
                    data={allocation}
                    dataKey="amount"
                    nameKey={en ? "en" : "es"}
                    innerRadius={48}
                    outerRadius={78}
                    stroke="none"
                  >
                    {allocation.map(item => (
                      <Cell
                        key={item.id}
                        fill={item.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={value => formatMoney(value, en)}
                  />
                </PieChart>
              </ResponsiveContainer>

              {allocation.map(item => (
                <div
                  className="mm-fund-features"
                  key={item.id}
                >
                  <span>{en ? item.en : item.es}</span>
                  <strong>
                    {formatMoney(item.amount, en)} ·{" "}
                    {(item.amount / totalAllocated * 100).toFixed(0)}%
                  </strong>
                </div>
              ))}
            </>
          ) : (
            <p className="mm-market-muted">
              {en
                ? "No virtual investments yet."
                : "Todavía no hay inversiones virtuales."}
            </p>
          )}
        </div>
      </div>

      <div className="mm-market-panel">
        <h3>
          <Calculator size={19} />
          {en ? "Scenario simulator" : "Simulador de escenarios"}
        </h3>

        <div className="mm-simulator-form">
          <label style={fieldStyle}>
            {en ? "Initial (€)" : "Inicial (€)"}
            <input
              type="number"
              min="0"
              value={initial}
              onChange={e => setInitial(e.target.value)}
            />
          </label>

          <label style={fieldStyle}>
            {en ? "Monthly (€)" : "Mensual (€)"}
            <input
              type="number"
              min="0"
              value={monthly}
              onChange={e => setMonthly(e.target.value)}
            />
          </label>

          <label style={fieldStyle}>
            {en ? "Years" : "Años"}
            <input
              type="number"
              min="1"
              max="40"
              value={years}
              onChange={e => setYears(e.target.value)}
            />
          </label>

          <label style={fieldStyle}>
            {en ? "Hypothetical scenario" : "Escenario hipotético"}
            <select
              value={rate}
              onChange={e => setRate(Number(e.target.value))}
            >
              <option value={-0.03}>-3%</option>
              <option value={0.03}>+3%</option>
              <option value={0.06}>+6%</option>
            </select>
          </label>
        </div>

        <div className="mm-projection">
          <div>
            <small>{en ? "Contributed" : "Aportado"}</small>
            <strong>{formatMoney(deposited, en)}</strong>
          </div>
          <div>
            <small>{en ? "Final hypothetical value" : "Valor final hipotético"}</small>
            <strong>{formatMoney(result, en)}</strong>
          </div>
          <div>
            <small>{en ? "Difference" : "Diferencia"}</small>
            <strong>{formatMoney(result - deposited, en)}</strong>
          </div>
        </div>

        <div className="mm-scenario-chart">
          {simulation.filter((_, i) =>
            i === 0 ||
            i === duration ||
            i % Math.max(1, Math.ceil(duration / 12)) === 0
          ).map(point => {
            const maximum = Math.max(
              1,
              ...simulation.map(p => p.value)
            );

            return (
              <div
                key={point.year}
                className="mm-scenario-bar"
              >
                <span>{point.year}</span>
                <div>
                  <i
                    style={{
                      width: `${Math.max(
                        2,
                        point.value / maximum * 100
                      )}%`
                    }}
                  />
                </div>
                <strong>
                  {formatMoney(point.value, en)}
                </strong>
              </div>
            );
          })}
        </div>

        <p className="mm-market-muted">
          {en
            ? "Rates are hypothetical, not forecasts. Fees, taxes and inflation are excluded."
            : "Las tasas son hipotéticas, no previsiones. No se incluyen comisiones, impuestos ni inflación."}
        </p>
      </div>

      <div className="mm-market-panel">
        <h3>
          {en ? "Virtual history" : "Historial virtual"}
        </h3>

        {investments.length ? (
          investments.slice().reverse().map((item, index) => {
            const fund = FUND_TYPES.find(
              f => f.id === item.fundId
            );

            return (
              <div
                className="mm-invest-history"
                key={item.id ?? index}
              >
                <div>
                  <strong>
                    {fund
                      ? (en ? fund.en : fund.es)
                      : item.fundName || item.fundId}
                  </strong>
                  <small>
                    {item.date
                      ? new Date(item.date).toLocaleDateString(
                          en ? "en-GB" : "es-ES"
                        )
                      : ""}
                  </small>
                </div>

                <b>{formatMoney(item.amount, en)}</b>

                <button
                  type="button"
                  onClick={() => setInvestments(previous =>
                    previous.filter(
                      entry => entry.id !== item.id
                    )
                  )}
                  aria-label={en ? "Remove" : "Eliminar"}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        ) : (
          <p className="mm-market-muted">
            {en ? "No contributions." : "Sin aportaciones."}
          </p>
        )}
      </div>

      <div className="mm-market-panel">
        <h3>
          <BookOpen size={19} />
          {en ? "Learn about risk" : "Aprende sobre el riesgo"}
        </h3>
        <p className="mm-market-muted">
          {en
            ? "Diversification can reduce concentration risk but does not prevent losses. Past returns do not guarantee future results."
            : "La diversificación puede reducir el riesgo de concentración, pero no evita las pérdidas. Las rentabilidades pasadas no garantizan resultados futuros."}
        </p>
      </div>
    </div>
  );
}
