import cetemLogo from '@/assets/logos/cetem-logo.png';
import municipioLogo from '@/assets/logos/municipalidad-logo.png';

const InstitucionesFooter = () => (
  <footer className="mt-auto w-full rounded-t-[1.75rem] border border-slate-200/80 bg-white/90 shadow-[0_-16px_36px_rgba(15,23,42,0.06)] backdrop-blur-sm">
    <div className="mx-auto flex w-full max-w-[1900px] items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-5 md:gap-6 md:px-8">
      <div className="flex flex-1 items-center justify-center sm:justify-start">
        <img src={cetemLogo} alt="CETEM" className="h-10 w-auto object-contain sm:h-12 md:h-16 lg:h-20" />
      </div>

      <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent sm:block" />

      <div className="flex flex-1 items-center justify-center sm:justify-end">
        <img src={municipioLogo} alt="Municipalidad de Bella Vista" className="h-9 w-auto object-contain sm:h-11 md:h-14 lg:h-18" />
      </div>
    </div>
  </footer>
);

export default InstitucionesFooter;
