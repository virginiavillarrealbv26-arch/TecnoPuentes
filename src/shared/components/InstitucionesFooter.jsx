import cetemLogo from '@/assets/logos/cetem-logo.png';
import municipioLogo from '@/assets/logos/municipalidad-logo.png';

const InstitucionesFooter = () => (
  <footer className="mt-auto w-full border-t border-slate-200 bg-[#f8fafc] shadow-[0_-10px_24px_rgba(15,23,42,0.04)]">
    <div className="mx-auto flex w-full max-w-[1900px] items-center justify-between gap-3 px-3 py-3 sm:gap-5 sm:px-5 md:gap-8 md:px-8 lg:gap-10 lg:px-12">
      <div className="flex flex-1 items-center justify-start">
        <img src={cetemLogo} alt="CETEM" className="h-11 w-auto max-w-[120px] shrink-0 object-contain sm:h-13 sm:max-w-[150px] md:h-18 md:max-w-[190px] lg:h-22 lg:max-w-[230px]" />
      </div>

      <div className="flex flex-1 items-center justify-end">
        <img src={municipioLogo} alt="Municipalidad de Bella Vista" className="h-14 w-auto max-w-[150px] shrink-0 object-contain sm:h-16 sm:max-w-[180px] md:h-22 md:max-w-[240px] lg:h-26 lg:max-w-[290px]" />
      </div>
    </div>
  </footer>
);

export default InstitucionesFooter;
