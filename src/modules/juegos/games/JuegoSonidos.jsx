import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { hablar } from '@/shared/voz';
import { useTimeouts } from '@/shared/hooks/useTimeouts';

const MAX_PASOS = 5;

const BOTONES = [
  { id: 'rojo', icono: '🐶', nombre: 'Perro, nota Do', freq: 261.63, color: 'bg-red-400 border-red-600', hover: 'hover:bg-red-300', glow: 'shadow-red-300' },
  { id: 'azul', icono: '🐱', nombre: 'Gato, nota Mi', freq: 329.63, color: 'bg-blue-400 border-blue-600', hover: 'hover:bg-blue-300', glow: 'shadow-blue-300' },
  { id: 'amarillo', icono: '🦆', nombre: 'Pato, nota Sol', freq: 392.0, color: 'bg-yellow-400 border-yellow-600', hover: 'hover:bg-yellow-300', glow: 'shadow-yellow-300' },
  { id: 'verde', icono: '🐸', nombre: 'Rana, nota Do agudo', freq: 523.25, color: 'bg-green-400 border-green-600', hover: 'hover:bg-green-300', glow: 'shadow-green-300' },
];

const JuegoSonidos = ({ onAcierto, onTerminar }) => {
  const [secuencia, setSecuencia] = useState([]);
  const [turnoUsuario, setTurnoUsuario] = useState(false);
  const [botonActivo, setBotonActivo] = useState(null);
  const [mensaje, setMensaje] = useState('Toca JUGAR para empezar. 🔊 Sube el volumen');
  const [pasoVisible, setPasoVisible] = useState(0);
  const [gano, setGano] = useState(false);

  const audioCtx = useRef(null);
  const turno = useRef(false);
  const paso = useRef(0);
  const sesion = useRef(0);
  const { programar } = useTimeouts();

  useEffect(() => () => { sesion.current++; audioCtx.current?.close?.(); }, []);

  const esperar = (ms) => new Promise((resolver) => programar(resolver, ms));

  const decir = (texto, voz = true) => { setMensaje(texto); if (voz) hablar(texto); };
  const setTurno = (v) => { turno.current = v; setTurnoUsuario(v); };

  const tono = (frecuencia, ms = 500) => {
    const ctx = audioCtx.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frecuencia;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ms / 1000);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + ms / 1000);
  };

  const reproducir = async (sec) => {
    const id = ++sesion.current;
    setTurno(false);
    for (let i = 0; i < sec.length; i++) {
      await esperar(400);
      if (id !== sesion.current) return;
      setBotonActivo(sec[i].id); tono(sec[i].freq, 500);
      await esperar(550);
      if (id !== sesion.current) return;
      setBotonActivo(null);
    }
    paso.current = 0; setPasoVisible(0);
    decir('¡Tu turno!');
    setTurno(true);
  };

  const agregarPaso = (actual) => {
    const nueva = [...actual, BOTONES[Math.floor(Math.random() * BOTONES.length)]];
    setSecuencia(nueva);
    decir('¡Escucha y mira atentamente!', false);
    programar(() => reproducir(nueva), 900);
  };

  const iniciar = () => {
    if (!audioCtx.current || audioCtx.current.state === 'closed') {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    audioCtx.current.resume?.();
    setGano(false); setSecuencia([]);
    agregarPaso([]);
  };

  const tocar = (boton) => {
    if (!turno.current) return;
    tono(boton.freq, 380);
    setBotonActivo(boton.id);
    programar(() => setBotonActivo(null), 300);

    if (boton.id === secuencia[paso.current].id) {
      paso.current += 1; setPasoVisible(paso.current);
      if (paso.current === secuencia.length) {
        setTurno(false);
        onAcierto?.();
        if (secuencia.length >= MAX_PASOS) {
          setGano(true); decir('¡Lo lograste! ¡Eres un gran músico!'); onTerminar?.();
        } else {
          decir('¡Excelente!');
          programar(() => agregarPaso(secuencia), 1800);
        }
      }
    } else {
      setTurno(false);
      decir('Escuchemos otra vez');
      programar(() => reproducir(secuencia), 1500);
    }
  };

  const repetir = () => { if (turno.current) reproducir(secuencia); };

  const esperado = turnoUsuario ? secuencia[pasoVisible]?.id : null;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto flex-1 justify-between py-4">
      <div className="flex items-center justify-between w-full px-2 mb-4 gap-3">
        <div aria-live="polite" className="bg-blue-100 text-blue-700 px-4 py-3 rounded-[2rem] border-4 border-blue-200 shadow-sm flex-1 text-center font-extrabold text-base md:text-xl uppercase tracking-wide">
          {mensaje}
        </div>
        <div className="bg-white text-gray-700 px-4 py-3 rounded-2xl border-4 border-gray-200 shadow-sm font-bold text-lg whitespace-nowrap">
          Nivel <span className="text-blue-500 text-2xl">{secuencia.length}</span>/{MAX_PASOS}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full my-2 gap-4">
        {!secuencia.length || gano ? (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={iniciar}
            aria-label={gano ? 'Jugar de nuevo' : 'Jugar'}
            className="w-44 h-44 bg-green-400 rounded-full border-8 border-b-[12px] border-green-600 shadow-xl flex items-center justify-center text-7xl text-white pl-3">
            {gano ? '🔄' : '▶️'}
          </motion.button>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:gap-8 bg-gray-50 p-4 md:p-10 rounded-[3rem] border-8 border-gray-200 shadow-inner">
              {BOTONES.map((b) => {
                const brilla = botonActivo === b.id;
                const pista = esperado === b.id;
                return (
                  <motion.button
                    key={b.id}
                    whileHover={turnoUsuario ? { scale: 1.05 } : {}} whileTap={turnoUsuario ? { scale: 0.95 } : {}}
                    onClick={() => tocar(b)} aria-label={b.nombre}
                    className={`w-28 h-28 md:w-40 md:h-40 rounded-[2rem] flex items-center justify-center text-5xl md:text-7xl transition-all duration-200 border-4 border-b-8 shadow-sm ${b.color}
                      ${brilla ? `brightness-125 scale-110 shadow-xl ${b.glow}` : 'brightness-95'}
                      ${pista ? 'ring-8 ring-white animate-pulse' : ''}
                      ${turnoUsuario ? `cursor-pointer ${b.hover}` : 'cursor-default opacity-90'}`}
                  >
                    <span className={brilla ? 'animate-bounce' : ''}>{b.icono}</span>
                  </motion.button>
                );
              })}
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={repetir} disabled={!turnoUsuario}
              className="px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl border-b-4 border-gray-300 font-bold disabled:opacity-40">
              🔁 Escuchar otra vez
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
};

export default JuegoSonidos;
