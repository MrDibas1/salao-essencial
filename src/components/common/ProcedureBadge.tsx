import React from 'react';

interface ProcedureBadgeProps {
  procedure: string;
  customName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProcedureBadge: React.FC<ProcedureBadgeProps> = ({
  procedure,
  customName,
  size = 'md',
  className = '',
}) => {
  const displayName = procedure === 'Outro' && customName ? customName : procedure;
  const p = procedure.toLowerCase();

  // Mapeamento visual com cores elegantes, sugestivas e profissionais
  let badgeStyles = {
    bg: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    dot: 'bg-neutral-500',
  };

  if (p.includes('coloração') || p.includes('coloracao')) {
    // Tom terracota / cobre quente rico
    badgeStyles = {
      bg: 'bg-amber-100 text-amber-950 border-amber-300 shadow-2xs font-bold',
      dot: 'bg-amber-600',
    };
  } else if (p.includes('retoque')) {
    // Tom caramelo / âmbar dourado
    badgeStyles = {
      bg: 'bg-orange-100 text-orange-950 border-orange-300 shadow-2xs font-bold',
      dot: 'bg-orange-600',
    };
  } else if (p.includes('mechas') || p.includes('luzes')) {
    // Louro dourado iluminado / champanhe
    badgeStyles = {
      bg: 'bg-yellow-100 text-yellow-950 border-yellow-300 shadow-2xs font-bold',
      dot: 'bg-yellow-500',
    };
  } else if (p.includes('descoloração') || p.includes('descoloracao')) {
    // Tom platinado / azul gelo
    badgeStyles = {
      bg: 'bg-sky-100 text-sky-950 border-sky-300 shadow-2xs font-bold',
      dot: 'bg-sky-500',
    };
  } else if (p.includes('tonalização') || p.includes('tonalizacao')) {
    // Tom lavanda / violeta matizador de salão
    badgeStyles = {
      bg: 'bg-purple-100 text-purple-950 border-purple-300 shadow-2xs font-bold',
      dot: 'bg-purple-600',
    };
  } else if (p.includes('hidratação') || p.includes('hidratacao')) {
    // Verde menta / hidratação botânica fresca
    badgeStyles = {
      bg: 'bg-emerald-100 text-emerald-950 border-emerald-300 shadow-2xs font-bold',
      dot: 'bg-emerald-600',
    };
  } else if (p.includes('reconstrução') || p.includes('reconstrucao')) {
    // Rosa coral / queratina restauradora
    badgeStyles = {
      bg: 'bg-rose-100 text-rose-950 border-rose-300 shadow-2xs font-bold',
      dot: 'bg-rose-600',
    };
  } else if (p.includes('corte')) {
    // Índigo / ardósia moderno
    badgeStyles = {
      bg: 'bg-indigo-100 text-indigo-950 border-indigo-300 shadow-2xs font-bold',
      dot: 'bg-indigo-600',
    };
  } else if (p.includes('escova')) {
    // Pêssego / seda suave
    badgeStyles = {
      bg: 'bg-fuchsia-100 text-fuchsia-950 border-fuchsia-300 shadow-2xs font-bold',
      dot: 'bg-fuchsia-600',
    };
  } else if (p.includes('progressiva') || p.includes('alisamento')) {
    // Bronze / avelã
    badgeStyles = {
      bg: 'bg-stone-200 text-stone-900 border-stone-400 shadow-2xs font-bold',
      dot: 'bg-stone-600',
    };
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3 py-1.5 gap-2',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide transition-all select-none ${badgeStyles.bg} ${sizeClasses[size]} ${className}`}
    >
      <span className={`rounded-full shrink-0 ${badgeStyles.dot} ${dotSizes[size]}`} />
      <span>{displayName}</span>
    </span>
  );
};
