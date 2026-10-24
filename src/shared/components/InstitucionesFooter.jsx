import cetemLogo from '@/assets/logos/cetem-logo.png';
import municipioLogo from '@/assets/logos/municipalidad-logo.png';

const InstitucionesFooter = () => (
  <footer className="mt-auto w-full overflow-hidden bg-[#020b12] shadow-[0_-20px_35px_rgba(2,6,23,0.18)]">
    <div className="mx-auto flex w-full max-w-[1900px] items-center gap-3 px-3 py-3 sm:gap-5 sm:px-5 md:gap-8 md:px-8 lg:gap-10 lg:px-12">
      <div className="flex min-w-0 flex-1 items-center justify-center sm:justify-start">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src={municipioLogo} alt="Municipalidad de Bella Vista" className="h-16 w-auto object-contain sm:h-20 md:h-24 lg:h-28" />
          <img src={cetemLogo} alt="CETEM" className="h-16 w-auto object-contain sm:h-20 md:h-24 lg:h-28" />
        </div>
      </div>

      <div className="hidden min-w-0 flex-[1.5] items-center justify-center sm:flex">
        <div className="w-full text-center">
          <div className="text-[clamp(2rem,5vw,7rem)] font-black leading-[0.82] tracking-[-0.06em] text-slate-400/90">CETEM</div>
          <div className="mt-2 text-[clamp(0.8rem,2vw,2.8rem)] font-light tracking-[-0.04em] text-slate-300/90">Centro de Educación Tecnológica Municipal</div>
          <div className="mt-1 text-[clamp(1rem,2.3vw,3.5rem)] font-light tracking-[-0.04em] text-slate-200/90">Municipalidad de Bella Vista</div>
        </div>
      </div>
    </div>
  </footer>
);

export default InstitucionesFooter;
