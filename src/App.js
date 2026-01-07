import './App.css';

import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./Images/Logo.png";

const animations = {
  home: { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } },
  properties: { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -60 } },
  about: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  contact: { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 } },
};

const biens = [
  { id: 1, title: "Appartement centre Lille", price: 420000, surface: 55, rooms: 2 },
  { id: 2, title: "Maison avec jardin", price: 790000, surface: 110, rooms: 4 },
  { id: 4, title: "Appartement lumineux", price: 380000, surface: 50, rooms: 2 },
];

function Page({ children, variant }) {
  return (
    <motion.main
      {...animations[variant]}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="flex-1"
    >
      {children}
    </motion.main>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[#465840] text-[#f6ebdd] px-4 sm:px-10 py-6 flex justify-between items-center">
      <motion.img
        src={logo}
        alt="Key'Lease Logo"
        className="h-20 sm:h-28 w-auto cursor-pointer"
        whileHover={{ scale: 1.05, rotate: -1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      />
      <nav className="hidden sm:flex gap-6 text-sm uppercase tracking-wide">
        <Link to="/" className="hover:opacity-80">Accueil</Link>
        <Link to="/biens" className="hover:opacity-80">Biens</Link>
        <Link to="/apropos" className="hover:opacity-80">À propos</Link>
        <Link to="/contact" className="hover:opacity-80">Contact</Link>
      </nav>
      <div className="sm:hidden relative">
        <button onClick={() => setOpen(!open)} className="text-2xl font-bold">☰</button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-[#465840] rounded-lg shadow-lg flex flex-col">
            <Link to="/" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-[#3a472f]">Accueil</Link>
            <Link to="/biens" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-[#3a472f]">Biens</Link>
            <Link to="/apropos" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-[#3a472f]">À propos</Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-[#3a472f]">Contact</Link>
          </div>
        )}
      </div>
    </header>
  );
}

function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex(prev => (prev + 1) % biens.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % biens.length);
  const prev = () => setIndex((prev) => (prev - 1 + biens.length) % biens.length);

  return (
    <section className="px-4 sm:px-10 py-24 bg-[#b7b49d]">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Biens en vedette</h2>
      <div className="relative max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-[#e2dfc4] to-[#d9d6c1] rounded-3xl shadow-lg overflow-hidden"
          >
            <div className="h-64 sm:h-80 flex items-center justify-center text-[#465840] font-bold text-xl sm:text-2xl tracking-wide">
              {biens[index].title}
            </div>
            <div className="p-4 sm:p-6 text-center">
              <p className="text-sm">{biens[index].rooms} pièces · {biens[index].surface} m² · {biens[index].price.toLocaleString()} €</p>
              <Link to={`/biens/${biens[index].id}`} className="mt-4 inline-block bg-[#465840] text-[#f6ebdd] px-4 sm:px-6 py-2 rounded-2xl shadow-md hover:scale-105 transition-transform">
                Voir le bien
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#465840] text-[#f6ebdd] px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg hover:scale-110 transition-transform">‹</button>
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#465840] text-[#f6ebdd] px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg hover:scale-110 transition-transform">›</button>
      </div>
    </section>
  );
}

function Properties() {
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [surfaceMin, setSurfaceMin] = useState("");
  const [surfaceMax, setSurfaceMax] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const perPage = 3;

  let filtered = biens.filter(b => (!priceMin || b.price >= priceMin) && (!priceMax || b.price <= priceMax) && (!surfaceMin || b.surface >= surfaceMin) && (!surfaceMax || b.surface <= surfaceMax));
  filtered.sort((a,b) => sortAsc ? a.price - b.price : b.price - a.price);

  const pageCount = Math.ceil(filtered.length / perPage);
  const currentData = filtered.slice((currentPage-1)*perPage, currentPage*perPage);

  return (
    <section className="px-4 sm:px-10 py-24 bg-[#f6ebdd]">
      <h2 className="text-3xl font-semibold text-center mb-12">Nos biens à Lille</h2>
      <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-4">
        <input type="number" placeholder="Prix min" className="border p-2 rounded w-20 sm:w-32" value={priceMin} onChange={e => setPriceMin(e.target.value)} />
        <input type="number" placeholder="Prix max" className="border p-2 rounded w-20 sm:w-32" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
        <input type="number" placeholder="Surface min" className="border p-2 rounded w-20 sm:w-32" value={surfaceMin} onChange={e => setSurfaceMin(e.target.value)} />
        <input type="number" placeholder="Surface max" className="border p-2 rounded w-20 sm:w-32" value={surfaceMax} onChange={e => setSurfaceMax(e.target.value)} />
        <button className="bg-[#465840] text-[#f6ebdd] px-3 py-1 rounded sm:px-4 sm:py-2" onClick={() => setSortAsc(!sortAsc)}>
          Tri prix {sortAsc ? "↑" : "↓"}
        </button>
      </div>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {currentData.map(b => (
          <motion.div
            key={b.id}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-gradient-to-br from-[#e2dfc4] to-[#d9d6c1] rounded-3xl shadow-lg cursor-pointer overflow-hidden transition-transform"
            onClick={() => navigate(`/biens/${b.id}`)}
          >
            <div className="h-48 flex items-center justify-center text-[#465840] font-bold text-lg tracking-wide px-2 text-center">
              {b.title}
            </div>
            <div className="p-4 sm:p-6 text-center">
              <p className="text-sm">{b.rooms} pièces · {b.surface} m² · {b.price.toLocaleString()} €</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6 flex-wrap">
        {Array.from({ length: pageCount }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i+1)} className={`px-3 py-1 rounded ${currentPage===i+1 ? "bg-[#465840] text-[#f6ebdd]" : "bg-white border"}`}>{i+1}</button>
        ))}
      </div>
    </section>
  );
}

function PropertyDetail() {
  const { id } = useParams();
  const bien = biens.find(b => b.id === parseInt(id));
  if (!bien) return <p className="p-10">Bien introuvable</p>;

  return (
    <section className="px-4 sm:px-10 py-24 max-w-4xl mx-auto bg-[#f6ebdd]">
      <div className="h-64 sm:h-80 flex items-center justify-center bg-gradient-to-br from-[#e2dfc4] to-[#d9d6c1] text-[#465840] font-bold text-xl sm:text-2xl rounded-3xl shadow mb-6 text-center px-4">
        {bien.title}
      </div>
      <p className="mb-4 text-sm text-center">{bien.rooms} pièces · {bien.surface} m² · {bien.price.toLocaleString()} €</p>
      <p className="text-center px-2">
        Description du bien : Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce efficitur, ligula a vehicula ullamcorper, sem neque convallis nunc, sed fermentum elit lectus id ligula.
      </p>
    </section>
  );
}

// --- Composants manquants ---
function About() {
  return (
    <section className="px-4 sm:px-10 py-24 max-w-4xl mx-auto bg-[#f6ebdd]">
      <h2 className="text-3xl font-semibold mb-6">À propos de l'agence</h2>
      <p className="mb-6">
        Key'Lease accompagne ses clients avec expertise et transparence dans tous leurs projets immobiliers.
      </p>
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {["Proximité", "Transparence", "Excellence"].map(v => (
          <div key={v} className="bg-white p-6 rounded-2xl shadow text-center font-semibold">
            {v}
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="px-4 sm:px-10 py-24 max-w-2xl mx-auto bg-[#f6ebdd]">
      <h2 className="text-3xl font-semibold mb-6">Contact</h2>
      <form className="grid gap-4 mb-12">
        <input className="border p-3 rounded" placeholder="Nom" />
        <input className="border p-3 rounded" placeholder="Email" />
        <textarea className="border p-3 rounded" placeholder="Message" rows="4" />
        <button className="bg-[#465840] text-[#f6ebdd] py-3 rounded-2xl">Envoyer</button>
      </form>
      <div className="bg-[#b7b49d] p-6 rounded-2xl">
        <h3 className="font-semibold mb-4">Coordonnées</h3>
        <p>📍 Lille – Centre</p>
        <p>📞 03 20 00 00 00</p>
        <p className="mt-4 text-sm">Du lundi au vendredi — 9h à 18h</p>
      </div>
    </section>
  );
}


function Footer() {
  return (
    <footer className="bg-[#465840] text-[#f6ebdd] text-center py-4">
      © 2026 Key'Lease
    </footer>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page variant="home"><Home /></Page>} />
        <Route path="/biens" element={<Page variant="properties"><Properties /></Page>} />
        <Route path="/biens/:id" element={<Page variant="properties"><PropertyDetail /></Page>} />
        <Route path="/apropos" element={<Page variant="about"><About /></Page>} />
        <Route path="/contact" element={<Page variant="contact"><Contact /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="bg-[#f6ebdd] text-[#465840] min-h-screen flex flex-col">
        <Header />
        <AnimatedRoutes />
        <Footer />
      </div>
    </Router>
  );
}

















