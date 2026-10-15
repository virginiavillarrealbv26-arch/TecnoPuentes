import { useState } from 'react';
import { motion } from 'motion/react';
import Avatar from '@/shared/components/Avatar';
import { hablar } from '@/shared/voz';
import { useTimeouts } from '@/shared/hooks/useTimeouts';

const PILARES = [
	{
		id: 'comunicacion',
		icono: '🗣️',
		titulo: 'Comunicador',
		desc: 'Armar frases',
		accion: 'Hablar y elegir',
		borde: 'border-sky-300',
		texto: 'text-sky-700',
		fondo: 'from-sky-50 to-white',
		detalle: 'bg-sky-100 text-sky-700',
	},
	{
		id: 'juegos',
		icono: '🎮',
		titulo: 'Juegos',
		desc: 'Aprender jugando',
		accion: 'Retos y memoria',
		borde: 'border-emerald-300',
		texto: 'text-emerald-700',
		fondo: 'from-emerald-50 to-white',
		detalle: 'bg-emerald-100 text-emerald-700',
	},
	{
		id: 'educacion',
		icono: '📚',
		titulo: 'Educación',
		desc: 'Tarjetas para aprender',
		accion: 'Explorar palabras',
		borde: 'border-violet-300',
		texto: 'text-violet-700',
		fondo: 'from-violet-50 to-white',
		detalle: 'bg-violet-100 text-violet-700',
	},
];

const MenuPrincipal = ({ usuario, estrellas = 0, onElegir, onSalir }) => {
	const [confirmando, setConfirmando] = useState(false);
	const { programar } = useTimeouts();
	const estrellasVisibles = Array.from({ length: 5 }, (_, index) => index < Math.min(estrellas, 5));

	// "Salir" pide un segundo toque para evitar salidas accidentales
	const manejarSalir = () => {
		if (confirmando) return;
		setConfirmando(true);
		hablar('¿Querés salir? Elegí una opción');
		programar(() => setConfirmando(false), 4000);
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#eef8f5_48%,#fff8e7_100%)] p-4 text-slate-800 md:p-6"
		>
			<div className="mx-auto flex w-full max-w-xl md:max-w-6xl flex-col gap-6 px-2">
				<header className="flex items-center justify-between gap-3">
					{confirmando ? (
						<div className="flex items-center gap-2">
							<motion.button
								whileTap={{ scale: 0.96 }}
								onClick={onSalir}
								className="min-h-14 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-extrabold text-emerald-700 shadow-sm transition hover:bg-emerald-100 md:px-5"
							>
								Sí
							</motion.button>
							<motion.button
								whileTap={{ scale: 0.96 }}
								onClick={() => setConfirmando(false)}
								className="min-h-14 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-extrabold text-slate-600 shadow-sm transition hover:bg-slate-50 md:px-5"
							>
								No
							</motion.button>
						</div>
					) : (
						<motion.button
							whileTap={{ scale: 0.95 }}
							onClick={manejarSalir}
							className="min-h-14 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-base font-extrabold text-slate-500 shadow-sm transition hover:text-slate-700 md:px-6"
						>
							Salir
						</motion.button>
					)}

					<div className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/80 bg-white/95 px-4 py-2 shadow-sm md:px-5">
						<Avatar id={usuario.avatar} className="text-3xl" />
						<div className="leading-tight">
							<p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Hola</p>
							<span className="block max-w-[9rem] truncate text-lg font-black text-slate-700 md:max-w-xs md:text-xl">
								{usuario.nombre}
							</span>
						</div>
					</div>
				</header>

				<section className="grid items-center gap-5 md:grid-cols-[1.4fr_0.6fr]">
					<div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
						<p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-teal-600">Inicio</p>
						<h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-800 md:text-6xl">
							¿Qué hacemos hoy?
						</h1>
						<p className="mt-4 max-w-2xl text-lg font-bold leading-relaxed text-slate-500">
							Elegí una actividad para comunicar, jugar o aprender a tu ritmo.
						</p>
					</div>

					<div className="rounded-[2rem] border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-yellow-50 p-5 shadow-[0_12px_30px_rgba(251,191,36,0.12)]">
						<div className="mb-3 flex items-center justify-center gap-2 text-3xl md:text-4xl" aria-label={`${estrellas} estrellas ganadas`}>
							{estrellasVisibles.map((llena, index) => (
								<span
									key={`estrella-${index}`}
									aria-hidden="true"
									className={`transition-transform duration-200 ${llena ? 'scale-100 drop-shadow-sm' : 'scale-90 opacity-30'}`}
								>
									{llena ? '⭐' : '☆'}
								</span>
							))}
						</div>
						<p className="text-center text-sm font-black uppercase tracking-[0.18em] text-amber-600">Estrellas</p>
					</div>
				</section>

				<div className="grid w-full grid-cols-1 gap-4 pb-6 md:grid-cols-3 md:gap-5">
					{PILARES.map((p) => (
						<motion.button
							key={p.id}
							whileHover={{ scale: 1.02, y: -4 }}
							whileTap={{ scale: 0.96 }}
							onClick={() => { hablar(p.titulo); onElegir(p.id); }}
							aria-label={`${p.titulo}: ${p.desc}`}
							className={`group flex min-h-[10.5rem] items-center gap-5 rounded-[2rem] border-4 ${p.borde} bg-gradient-to-br ${p.fondo} p-5 text-left shadow-sm transition-all hover:shadow-xl md:min-h-[22rem] md:flex-col md:items-start md:justify-between md:p-7`}
						>
							<span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.75rem] bg-white text-6xl shadow-sm md:h-32 md:w-32 md:text-7xl">{p.icono}</span>
							<div className="min-w-0">
								<span className={`mb-4 hidden w-fit rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.15em] md:block ${p.detalle}`}>{p.accion}</span>
								<h2 className={`text-2xl font-black uppercase tracking-wide md:text-3xl ${p.texto}`}>{p.titulo}</h2>
								<p className="mt-2 text-base font-bold leading-snug text-slate-500 md:text-lg">{p.desc}</p>
								<span className="mt-5 hidden text-sm font-black uppercase tracking-[0.18em] text-slate-400 transition group-hover:text-slate-600 md:block">Entrar</span>
							</div>
						</motion.button>
					))}
				</div>
			</div>
		</motion.div>
	);
};

export default MenuPrincipal;
