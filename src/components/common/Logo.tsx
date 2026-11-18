import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  customSrc?: string;
  forceTypographic?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  customSrc,
  forceTypographic = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Tamanhos padronizados
  const heightClasses = {
    sm: 'h-8 max-w-[140px]',
    md: 'h-11 max-w-[180px]',
    lg: 'h-14 max-w-[240px]',
  };

  const textClasses = {
    sm: 'text-base tracking-[0.22em]',
    md: 'text-xl tracking-[0.28em]',
    lg: 'text-2xl tracking-[0.32em]',
  };

  const subtitleClasses = {
    sm: 'text-[8px] tracking-[0.16em]',
    md: 'text-[9px] tracking-[0.18em]',
    lg: 'text-[10px] tracking-[0.20em]',
  };

  const logoSrc = customSrc || '/assets/logo-essencial.png';

  if (forceTypographic || imageError) {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center font-serif text-base font-semibold shadow-2xs">
          E
        </div>
        <div className="flex flex-col">
          <span className={`font-serif font-semibold text-[#111111] uppercase leading-none ${textClasses[size]}`}>
            ESSENCIAL
          </span>
          {showSubtitle && (
            <span className={`font-sans font-medium text-[#777777] mt-1 leading-none ${subtitleClasses[size]}`}>
              Salão de Beleza e Aluguel de Roupas
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Salão Essencial"
        onError={() => setImageError(true)}
        className={`${heightClasses[size]} w-auto object-contain transition-opacity duration-200`}
      />
    </div>
  );
};
