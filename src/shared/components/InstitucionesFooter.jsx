import cetemLogo from '@/assets/logos/cetem-logo.png';
import municipioLogo from '@/assets/logos/municipalidad-logo.png';

const InstitucionesFooter = () => (
  <footer className="mt-auto w-full border-t border-slate-200 bg-[#f8fafc] shadow-[0_-10px_24px_rgba(15,23,42,0.04)]">
    <div className="mx-auto flex w-full max-w-[1900px] items-center justify-between gap-2 px-2 py-3 sm:gap-4 sm:px-4 md:gap-6 md:px-8 lg:gap-8 lg:px-12">
      <div className="flex flex-1 items-center justify-start">
        <img src={cetemLogo} alt="CETEM" className="h-10 w-auto max-w-[110px] shrink-0 object-contain sm:h-12 sm:max-w-[140px] md:h-18 md:max-w-[190px] lg:h-22 lg:max-w-[230px]" />
      </div>

      <div className="flex flex-1 items-center justify-end">
        <img src={municipioLogo} alt="Municipalidad de Bella Vista" className="h-12 w-auto max-w-[130px] shrink-0 object-contain sm:h-14 sm:max-w-[170px] md:h-22 md:max-w-[240px] lg:h-26 lg:max-w-[290px]" />
      </div>
    </div>
  </footer>
);

export default InstitucionesFooter;
