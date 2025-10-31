import { useMemo, useState } from "react";
import "./Head.css"

/** 👉 CONFIGURÁ ESTO con tus datos */
const ROTI = {
  nombre: "Rotisería Don Sabor",
  telefonoWhatsApp: "5493564651874",
  direccion: "Av. Siempre Viva 742, San Francisco, Córdoba",
  horario: [
    { dias: "Lun a Vie", horas: "11:30–15:00 / 20:00–23:00" },
    { dias: "Sáb", horas: "11:30–15:30 / 20:00–23:30" },
    { dias: "Dom", horas: "11:30–15:30" },
  ],
  /* Menú base (carta). Podés agregar/quitar categorías y platos */
  menu: [
    {
      categoria: "Platos del día",
      items: [
        { nombre: "Milanesa napolitana con fritas", precio: 6500, badge: "Más pedido" },
        { nombre: "Pollo al horno con papas", precio: 6000, badge: "Clásico" },
        { nombre: "Tarta de jamón y queso (porción)", precio: 3500 },
        { nombre: "Pastas caseras con salsa bolognesa", precio: 6200 },
      ],
    },
    {
      categoria: "Guarniciones",
      items: [
        { nombre: "Puré de papas", precio: 2500 },
        { nombre: "Ensalada mixta", precio: 2500 },
        { nombre: "Arroz con verduras", precio: 2500 },
        { nombre: "Papas fritas", precio: 3000 },
      ],
    },
    {
      categoria: "Bebidas",
      items: [
        { nombre: "Gaseosa 1.5L", precio: 3500 },
        { nombre: "Agua 500ml", precio: 1500 },
        { nombre: "Agua saborizada 1.5L", precio: 3000 },
      ],
    },
  ],
  /* Promos del día (se actualizan fácil) */
  promos: [
    {
      titulo: "Promo 2x1 en milas (mediodía)",
      desc: "Llevás 2, pagás 1. Solo al mediodía, de Lun a Vie.",
    },
    {
      titulo: "Combo Familiar",
      desc: "1/2 pollo al horno + 2 guarniciones + gaseosa 1.5L",
      precio: 9800,
    },
  ],
  /* Link a Google Maps (opcional). Si no tenés, dejamos un iframe por defecto. */
  mapsEmbed:
    "https://www.google.com/maps?q=Av.+Siempre+Viva+742,+San+Francisco,+C%C3%B3rdoba&output=embed",
};

function Hero({ nombre, onPedir }) {
  return (
    <header className="hero">
      <div className="hero__content">
        <h1>{nombre}</h1>
        <p>Comida casera, porciones abundantes y entrega rápida.</p>
        <div className="hero__cta">
          <button className="btn btn--primary" onClick={onPedir}>
            Pedir por WhatsApp
          </button>
          <a className="btn btn--ghost" href="#menu">Ver menú</a>
        </div>
      </div>
    </header>
  );
}

function PromoBadge({ text }) {
  if (!text) return null;
  return <span className="badge">{text}</span>;
}

function MenuSection({ categoria, items, onPedirItem }) {
  return (
    <section className="section" id="menu">
      <h2 className="section__title">{categoria}</h2>
      <div className="grid">
        {items.map((it, idx) => (
          <article className="card" key={idx}>
            <div className="card__header">
              <h3>{it.nombre}</h3>
              <PromoBadge text={it.badge} />
            </div>
            {it.desc && <p className="muted">{it.desc}</p>}
            {"precio" in it && (
              <div className="card__footer">
                <strong className="price">${it.precio.toLocaleString("es-AR")}</strong>
                <button className="btn btn--small" onClick={() => onPedirItem(it)}>
                  Pedir
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function Promos({ promos, onPedirPromo }) {
  if (!promos?.length) return null;
  return (
    <section className="section">
      <h2 className="section__title">Promos de hoy</h2>
      <div className="grid">
        {promos.map((p, i) => (
          <article className="card card--promo" key={i}>
            <h3>{p.titulo}</h3>
            <p className="muted">{p.desc}</p>
            {"precio" in p && (
              <strong className="price">${p.precio.toLocaleString("es-AR")}</strong>
            )}
            <button className="btn btn--small" onClick={() => onPedirPromo(p)}>
              Pedir promo
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Info({ direccion, horario, mapsEmbed }) {
  return (
    <section className="section" id="info">
      <h2 className="section__title">Info y horarios</h2>
      <div className="info">
        <div>
          <h3>Dirección</h3>
          <p>{direccion}</p>
          <h3>Horarios</h3>
          <ul className="list">
            {horario.map((h, i) => (
              <li key={i}>
                <strong>{h.dias}:</strong> {h.horas}
              </li>
            ))}
          </ul>
        </div>
        <div className="map">
          <iframe
            title="Mapa"
            src={mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Rotisería Don Sabor</span>
      <a href="#top">Volver arriba ↑</a>
    </footer>
  );
}

export default function App() {
  const [busqueda, setBusqueda] = useState("");

  const menuFiltrado = useMemo(() => {
    if (!busqueda.trim()) return ROTI.menu;
    const q = busqueda.toLowerCase();
    return ROTI.menu
      .map(cat => ({
        ...cat,
        items: cat.items.filter(it =>
          it.nombre.toLowerCase().includes(q) || it?.desc?.toLowerCase().includes(q)
        ),
      }))
      .filter(cat => cat.items.length > 0);
  }, [busqueda]);

  const msgBase = encodeURIComponent(`Hola! Quiero hacer un pedido de ${ROTI.nombre}.`);
  const waBase = `https://wa.me/${ROTI.telefonoWhatsApp}?text=`;

  const handlePedir = () => {
    const txt = `${msgBase}%0A¿Me pasás el menú del día?`;
    window.open(waBase + txt, "_blank");
  };

  const handlePedirItem = (item) => {
    const txt = encodeURIComponent(
      `Hola! Quiero pedir:\n- ${item.nombre}${item.precio ? ` ($${item.precio.toLocaleString("es-AR")})` : ""}\nRetiro/Envío: `
    );
    window.open(waBase + txt, "_blank");
  };

  const handlePedirPromo = (promo) => {
    const txt = encodeURIComponent(`Hola! Quiero la promo: ${promo.titulo}`);
    window.open(waBase + txt, "_blank");
  };

  return (
    <div id="top">
      

      <Hero nombre={ROTI.nombre} onPedir={handlePedir} />

      <section className="section section--search">
        <input
          type="search"
          placeholder="🔎 Buscar platos (ej: milanesa, tarta, pollo)..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </section>

      <Promos promos={ROTI.promos} onPedirPromo={handlePedirPromo} />

      {menuFiltrado.map((cat, idx) => (
        <MenuSection
          key={idx}
          categoria={cat.categoria}
          items={cat.items}
          onPedirItem={handlePedirItem}
        />
      ))}

      <Info
        direccion={ROTI.direccion}
        horario={ROTI.horario}
        mapsEmbed={ROTI.mapsEmbed}
      />

      <Footer />

      {/* Botón flotante de WhatsApp */}
      <a
        className="fab-wa"
        href={waBase + msgBase}
        target="_blank"
        rel="noreferrer"
        aria-label="Pedir por WhatsApp"
        title="Pedir por WhatsApp"
      >
        🟢
      </a>
    </div>
  );
}
