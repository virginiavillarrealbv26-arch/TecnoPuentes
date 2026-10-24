import cetemLogo from '@/assets/logos/cetem-logo.png';
import municipioLogo from '@/assets/logos/municipalidad-logo.png';

const InstitucionesFooter = () => (
  <footer className="mt-0 w-full border-t border-slate-200 bg-white/90 shadow-[0_-8px_20px_rgba(15,23,42,0.04)] backdrop-blur-sm">
    <div className="mx-auto flex w-full max-w-[420px] items-center justify-between gap-2 px-2 py-2 sm:max-w-[980px] sm:gap-3 sm:px-4 md:max-w-[1100px] md:gap-4 md:px-6 lg:gap-6 lg:px-8">
      <div className="flex flex-1 items-center justify-start">
        <img src={cetemLogo} alt="CETEM" className="h-10 w-auto max-w-[96px] shrink-0 object-contain sm:h-12 sm:max-w-[126px] md:h-14 md:max-w-[150px] lg:h-16 lg:max-w-[170px]" />
      </div>

      <div className="flex flex-1 items-center justify-end">
        <img src={municipioLogo} alt="Municipalidad de Bella Vista" className="h-11 w-auto max-w-[108px] shrink-0 object-contain sm:h-13 sm:max-w-[136px] md:h-15 md:max-w-[160px] lg:h-17 lg:max-w-[180px]" />
      </div>
    </div>
  </footer>
);

export default InstitucionesFooter;
