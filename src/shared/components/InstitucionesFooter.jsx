import cetemLogo from '@/assets/logos/cetem-logo.png';
import municipioLogo from '@/assets/logos/municipalidad-logo.png';

const InstitucionesFooter = () => (
  <footer className="mt-auto w-full overflow-hidden bg-[#020b12] shadow-[0_-20px_35px_rgba(2,6,23,0.18)]">
    <div className="mx-auto flex w-full max-w-[1900px] flex-col gap-4 px-3 py-4 sm:px-5 md:flex-row md:items-center md:justify-between md:gap-6 md:px-8 lg:gap-10 lg:px-12">
      <div className="flex items-center justify-center md:justify-start">
        <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5">
          <img src={municipioLogo} alt="Municipalidad de Bella Vista" className="h-16 w-auto max-w-[150px] object-contain sm:h-20 md:h-24 lg:h-28" />
          <div className="hidden h-16 w-px bg-slate-500/50 md:block md:h-24" />
          <img src={cetemLogo} alt="CETEM" className="h-16 w-auto max-w-[150px] object-contain sm:h-20 md:h-24 lg:h-28" />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center text-center md:justify-end">
        <div className="w-full max-w-[1100px] md:text-left">
          <div className="text-[clamp(2rem,5vw,7rem)] font-black leading-[0.82] tracking-[-0.06em] text-slate-400/90">CETEM</div>
          <div className="mt-2 text-[clamp(0.8rem,2vw,1.8rem)] font-light leading-tight tracking-[-0.04em] text-slate-300/90">Centro de Educación Tecnológica Municipal</div>
          <div className="mt-1 text-[clamp(1rem,2.3vw,3rem)] font-light leading-tight tracking-[-0.04em] text-slate-200/90">Municipalidad de Bella Vista</div>
        </div>
      </div>
    </div>
  </footer>
);

export default InstitucionesFooter;
