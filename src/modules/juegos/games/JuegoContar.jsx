import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hablar, callar } from '@/shared/voz';
import { mezclar } from '@/shared/utils/mezclar';
import { useTimeouts } from '@/shared/hooks/useTimeouts';

const NIVELES = [
	{
		n: 1,
		min: 1,
		max: 5,
		icono: '1️⃣',
		titulo: 'Nivel 1',
		desc: 'Del 1 al 5',
		caja: 'bg-green-50 border-green-400',
		texto: 'text-green-700',
	},
	{
		n: 2,
		min: 1,
		max: 10,
		icono: '🔟',
		titulo: 'Nivel 2',
		desc: 'Del 1 al 10',
		caja: 'bg-yellow-50 border-yellow-400',
		texto: 'text-yellow-700',
	},
	{
		n: 3,
		min: 6,
		max: 20,
		icono: '🔢',
		titulo: 'Nivel 3',
		desc: 'Del 6 al 20',
		caja: 'bg-orange-50 border-orange-400',
		texto: 'text-orange-700',
	},
];

const BANCO = [
	{ icono: '🍎', singular: 'manzana', plural: 'manzanas' },
	{ icono: '⭐', singular: 'estrella', plural: 'estrellas' },
	{ icono: '🚗', singular: 'auto', plural: 'autos' },
	{ icono: '🎈', singular: 'globo', plural: 'globos' },
	{ icono: '🧸', singular: 'oso', plural: 'osos' },
];

const rango = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

const JuegoContar = ({ onAcierto }) => {
	const [nivel, setNivel] = useState(null);
	const [ronda, setRonda] = useState(0);
	const [objetivo, setObjetivo] = useState(0);
	const [elemento, setElemento] = useState(null);
	const [contados, setContados] = useState([]);
	const [opciones, setOpciones] = useState([]);
	const [mostrarOpciones, setMostrarOpciones] = useState(false);
	const [ganador, setGanador] = useState(false);
	const [ocultas, setOcultas] = useState([]);
	const ultimo = useRef(null);
	const terminado = useRef(false);
	const { programar, limpiar } = useTimeouts();

	const generarRonda = (cfg) => {
		terminado.current = false;
		setGanador(false);
		setMostrarOpciones(false);
		setContados([]);
		setOcultas([]);
		setRonda((r) => r + 1);

		const posibles = rango(cfg.min, cfg.max).filter((x) => x !== ultimo.current);
		const cantidad = mezclar(posibles)[0];
		ultimo.current = cantidad;
		const falsos = mezclar(rango(cfg.min, cfg.max).filter((x) => x !== cantidad)).slice(0, 2);
		const el = mezclar(BANCO)[0];

		setObjetivo(cantidad);
		setElemento(el);
		setOpciones(mezclar([cantidad, ...falsos]));
		hablar(`Vamos a contar ${el.plural}`);
	};

	const iniciarNivel = (cfg) => {
		setNivel(cfg);
		ultimo.current = null;
		generarRonda(cfg);
	};
	const volverANiveles = () => {
		limpiar();
		callar();
		setNivel(null);
	};

	const tocarObjeto = (i) => {
		if (ganador || mostrarOpciones || contados.includes(i)) return;
		const nuevos = [...contados, i];
		setContados(nuevos);
		hablar(String(nuevos.length), { interrumpir: nuevos.length === 1 });
		if (nuevos.length === objetivo) {
			programar(() => {
				setMostrarOpciones(true);
				hablar('¿Cuántos hay en total?');
			}, 1200);
		}
	};

	const verificar = (numero) => {
		if (terminado.current) return;
		if (numero === objetivo) {
			terminado.current = true;
			setGanador(true);
			hablar(`¡Excelente! Hay ${objetivo} ${objetivo === 1 ? elemento.singular : elemento.plural}`);
			onAcierto?.();
			programar(() => generarRonda(nivel), 3500);
		} else {
			setOcultas((prev) => [...prev, numero]);
		}
	};

	if (!nivel) {
		return (
			<div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto flex-1 p-4">
				<h2 className="text-2xl md:text-3xl font-extrabold text-green-600 mb-8 uppercase text-center">
					¿Hasta cuánto contamos hoy?
				</h2>
				<div className="flex flex-col md:flex-row gap-4 md:gap-6">
					{NIVELES.map((cfg) => (
						<motion.button
							key={cfg.n}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => iniciarNivel(cfg)}
							aria-label={`${cfg.titulo}, ${cfg.desc}`}
							className={`p-6 md:p-8 border-4 border-b-8 rounded-[2rem] shadow-sm flex flex-col items-center w-64 ${cfg.caja}`}
						>
							<span className="text-5xl mb-2">{cfg.icono}</span>
							<span className={`font-extrabold text-xl ${cfg.texto}`}>{cfg.titulo}</span>
							<span className="font-bold text-gray-500">{cfg.desc}</span>
						</motion.button>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center w-full max-w-4xl mx-auto flex-1 justify-between py-4">
			<div className="flex items-center justify-between w-full px-2 mb-2 gap-3">
				<div className="bg-green-100 text-green-700 px-5 py-3 rounded-[2rem] border-4 border-green-200 shadow-sm flex-1">
					<h2 className="text-lg md:text-2xl font-extrabold uppercase tracking-widest text-center">
						¡Toca para contar!
					</h2>
				</div>
				<motion.button
					whileTap={{ scale: 0.95 }}
					onClick={volverANiveles}
					className="bg-gray-100 text-gray-600 px-4 py-3 rounded-2xl border-b-4 border-gray-300 font-bold whitespace-nowrap"
				>
					⚙️ Niveles
				</motion.button>
			</div>

			<div className="flex-1 flex items-center justify-center w-full my-2">
				<div className="flex flex-wrap justify-center gap-2 sm:gap-4 bg-white p-4 md:p-8 rounded-[3rem] border-8 border-gray-100 shadow-inner w-full min-h-[240px]">
					{Array.from({ length: objetivo }).map((_, i) => {
						const hecho = contados.includes(i);
						return (
							<motion.button
								key={`${ronda}-${i}`}
								disabled={hecho || mostrarOpciones}
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: hecho ? 0.3 : 1, scale: hecho ? 0.9 : 1 }}
								transition={{ delay: i * 0.04, type: 'spring' }}
								whileHover={!hecho && !mostrarOpciones ? { scale: 1.1, rotate: 5 } : {}}
								whileTap={!hecho && !mostrarOpciones ? { scale: 0.9 } : {}}
								onClick={() => tocarObjeto(i)}
								aria-label={hecho ? `${elemento.singular} contado` : elemento.singular}
								className="relative text-4xl sm:text-5xl md:text-7xl"
							>
								{elemento?.icono}
								{hecho && (
									<span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs sm:text-sm font-extrabold rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
										{contados.indexOf(i) + 1}
									</span>
								)}
							</motion.button>
						);
					})}
				</div>
			</div>

			<div className="w-full bg-green-50 border-t-8 border-green-100 p-4 md:p-8 rounded-t-[3rem] shadow-inner min-h-[140px] flex items-center justify-center">
				{!mostrarOpciones ? (
					<p className="text-green-700 font-extrabold text-lg text-center">
						Primero toca y cuenta todos 👆
					</p>
				) : (
					<div className="flex justify-center gap-3 md:gap-8">
						<AnimatePresence mode="popLayout">
							{opciones
								.filter(
									(n) =>
										!ocultas.includes(n) && !(ganador && n !== objetivo)
								)
								.map((n) => (
									<motion.button
										key={`${ronda}-${n}`}
										layout
										initial={{
											opacity: 0,
											scale: 0.5,
											y: 50,
										}}
										animate={{
											opacity: 1,
											scale: 1,
											y: 0,
										}}
										exit={{
											opacity: 0,
											scale: 0,
											y: 20,
										}}
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => verificar(n)}
										aria-label={String(n)}
										className="flex items-center justify-center w-20 h-20 md:w-32 md:h-32 bg-white border-4 border-b-8 border-gray-200 hover:border-green-400 rounded-3xl shadow-sm text-4xl md:text-6xl font-extrabold text-gray-700"
									>
										{n}
									</motion.button>
								))}
						</AnimatePresence>
					</div>
				)}
			</div>
		</div>
	);
};

export default JuegoContar;
