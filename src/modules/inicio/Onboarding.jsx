import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hablar } from '@/shared/voz';
import { avatares } from '@/shared/data/avatares';

const Onboarding = ({ onComplete }) => {
  const [paso, setPaso] = useState(0); // 0 = desbloquea el audio del navegador
  const [nombre, setNombre] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [escuchando, setEscuchando] = useState(false);
  const [aviso, setAviso] = useState('');
  const reconocimientoRef = useRef(null);

  useEffect(() => () => {
    reconocimientoRef.current?.stop();
  }, []);

  const detenerMicrofono = () => {
    reconocimientoRef.current?.stop();
    reconocimientoRef.current = null;
    setEscuchando(false);
  };

  const iniciarMicrofono = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setAviso('🎙️ ❌ Este navegador no tiene micrófono. Escribí tu nombre.'); return; }
    setAviso('');
    detenerMicrofono();

    const rec = new SR();
    reconocimientoRef.current = rec;
    rec.lang = 'es-AR';
    rec.interimResults = false;
    rec.continuous = false;
    rec.onstart = () => setEscuchando(true);
    rec.onresult = (e) => {
      const valor = e.results?.[0]?.[0]?.transcript?.replace(/\./g, '').trim();
      if (valor) setNombre(valor);
      setEscuchando(false);
    };
    rec.onerror = (e) => {
      setEscuchando(false);
      if (e.error === 'not-allowed') setAviso('🎙️ ❌ Permití el micrófono para hablar, o escribí tu nombre.');
    };
    rec.onend = () => {
      if (reconocimientoRef.current === rec) reconocimientoRef.current = null;
      setEscuchando(false);
    };
    rec.start();
  };

  const iniciarApp = () => { hablar('¡Hola! Bienvenido a TecnoPuentes. ¿Cómo te llamas?'); setPaso(1); };
  const irPasoDos = () => { if (nombre.trim()) { hablar(`¡Qué lindo nombre, ${nombre}! Ahora, elige tu tarjeta.`); setPaso(2); } };
  const finalizar = () => { if (avatar) { hablar(`¡Genial, ${nombre}! Vamos a jugar y aprender.`); onComplete?.(nombre.trim(), avatar); } };
  const reiniciar = () => {
    detenerMicrofono();
    setPaso(0);
    setNombre('');
    setAvatar(null);
    setAviso('');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#f7fbff_0%,#eef8f2_52%,#fff6dc_100%)] p-4 text-slate-800">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-12 top-16 h-44 w-44 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute right-10 top-20 h-52 w-52 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-48 w-48 rounded-full bg-emerald-200/30 blur-3xl" />
      </div>

      <AnimatePresence>
        {paso > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
            whileTap={{ scale: 0.9 }} onClick={reiniciar} aria-label="Volver al inicio"
            className="absolute left-4 top-4 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/95 text-2xl text-slate-500 shadow-sm md:left-6 md:top-6"
          >🔄</motion.button>
        )}
      </AnimatePresence>

      <motion.div layout className="relative z-10 w-full max-w-xl md:max-w-4xl mx-auto overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="grid md:grid-cols-[0.85fr_1.15fr]">
          <aside className="hidden bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.35),_transparent_40%),linear-gradient(135deg,#0f172a_0%,#1e293b_60%,#0f172a_100%)] p-8 text-white md:flex md:flex-col md:justify-between">
            <div>
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-4xl shadow-inner shadow-white/10">🤖</div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-amber-300">TecnoPuentes</p>
              <h1 className="text-4xl font-black leading-tight">Un inicio simple para aprender jugando.</h1>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-sm font-bold text-slate-200">Tu espacio para comunicarte, jugar y crecer.</p>
            </div>
          </aside>

          <div className="p-4 text-center md:p-10">
        <AnimatePresence mode="wait">
            {paso === 0 && (
            <motion.div key="p0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex min-h-[20rem] md:min-h-[28rem] flex-col items-center justify-center">
              <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-[2rem] bg-sky-50 text-7xl shadow-[0_12px_30px_rgba(56,189,248,0.15)]">🤖</div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-teal-600 md:hidden">TecnoPuentes</p>
              <h1 className="mb-4 text-3xl font-black text-slate-800 md:text-5xl">TecnoPuentes</h1>
              <p className="mb-8 max-w-md text-lg font-bold leading-relaxed text-slate-500">
                Un espacio amigable para comunicar, jugar y aprender.
              </p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={iniciarApp}
                className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-3 text-xl md:text-2xl font-black text-white shadow-lg shadow-sky-200 transition hover:brightness-105">
                Entrar
              </motion.button>
            </motion.div>
          )}

          {paso === 1 && (
            <motion.div key="p1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex min-h-[20rem] md:min-h-[28rem] flex-col justify-center">
              <h2 className="mb-3 text-2xl font-black text-slate-800 md:text-4xl">¿Cómo te llamas?</h2>
              <p className="mb-6 text-sm md:text-base font-bold text-slate-500">Podés escribirlo o decirlo con el micrófono.</p>
              <div className="mb-4 flex items-center gap-3 rounded-[1.5rem] border border-sky-100 bg-sky-50/60 p-2 shadow-inner shadow-sky-100">
                <input
                  type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Escribe tu nombre..."
                  className="min-h-12 min-w-0 flex-1 rounded-2xl border-0 bg-transparent p-3 text-center text-xl md:text-2xl font-black text-slate-700 outline-none placeholder:text-slate-400"
                />
                <motion.button
                  whileTap={{ scale: 0.85 }} onClick={iniciarMicrofono} aria-label="Decir mi nombre con el micrófono"
                  className={`flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-2xl text-2xl md:text-3xl text-white shadow-md ${escuchando ? 'animate-pulse bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'}`}
                >🎙️</motion.button>
              </div>
              {aviso && <p className="mb-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">{aviso}</p>}
              <motion.button whileTap={{ scale: 0.95 }} onClick={irPasoDos} disabled={!nombre.trim()}
                className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-3 text-xl md:text-2xl font-black text-white shadow-md transition hover:brightness-105 disabled:opacity-50">
                Siguiente
              </motion.button>
            </motion.div>
          )}

          {paso === 2 && (
            <motion.div key="p2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex min-h-[20rem] md:min-h-[28rem] flex-col justify-center">
              <h2 className="mb-3 text-3xl font-black text-slate-800 md:text-4xl">Elige tu tarjeta</h2>
              <p className="mb-8 text-base font-bold text-slate-500">Esta tarjeta te acompaña en todos los módulos.</p>
              <div className="mb-8 grid grid-cols-3 gap-3">
                {avatares.map((item) => (
                  <motion.button
                    key={item.id} whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.92 }}
                    onClick={() => { setAvatar(item.id); hablar(item.texto); }} aria-label={item.texto} aria-pressed={avatar === item.id}
                    className={`flex min-h-36 flex-col items-center justify-center rounded-3xl border-4 p-3 transition-all md:p-4 ${avatar === item.id ? 'scale-105 border-sky-500 bg-sky-50 shadow-lg shadow-sky-100' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'}`}
                  >
                    <div className="mb-2 text-5xl md:text-6xl">{item.icono}</div>
                    <span className="text-base font-black uppercase text-slate-700 md:text-lg">{item.texto}</span>
                  </motion.button>
                ))}
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={finalizar} disabled={!avatar}
                className="min-h-16 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5 text-2xl font-black text-white shadow-md transition hover:brightness-105 disabled:opacity-50">
                ¡A jugar!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
