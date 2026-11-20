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

  // Mapeamento harmonioso com a paleta DESIGN.md
  let badgeStyles = {
    bg: 'bg-[#FAF8F6] text-[#736B65] border-[#EAE4DE]',
    dot: 'bg-[#736B65]',
  };

  if (p.includes('coloração') || p.includes('coloracao') || p.includes('retoque')) {
    // Terracota rosado / destaque principal do DESIGN.md
    badgeStyles = {
      bg: 'bg-[#FDF3E7] text-[#8C530A] border-[#EAE4DE] font-semibold',
      dot: 'bg-[#C87A14]',
    };
  } else if (p.includes('mechas') || p.includes('luzes') || p.includes('descoloração') || p.includes('descoloracao')) {
    // Louro / champanhe suave
    badgeStyles = {
      bg: 'bg-[#FAF2E8] text-[#8C6239] border-[#EAE4DE] font-medium',
      dot: 'bg-[#C28C53]',
    };
  } else if (p.includes('tonalização') || p.includes('tonalizacao')) {
    // Lavanda suave
    badgeStyles = {
      bg: 'bg-[#F3EEF8] text-[#694882] border-[#EAE4DE] font-medium',
      dot: 'bg-[#8F68AF]',
    };
  } else if (p.includes('hidratação') || p.includes('hidratacao')) {
    // Verde sálvia botânico (#2E7D5B / #E8F4EE)
    badgeStyles = {
      bg: 'bg-[#E8F4EE] text-[#2E7D5B] border-[#2E7D5B]/20 font-medium',
      dot: 'bg-[#2E7D5B]',
    };
  } else if (p.includes('reconstrução') || p.includes('reconstrucao')) {
    // Rose suave
    badgeStyles = {
      bg: 'bg-[#FCECEC] text-[#A8630A] border-[#EAE4DE] font-medium',
      dot: 'bg-[#C87A14]',
    };
  } else if (p.includes('corte') || p.includes('escova') || p.includes('progressiva')) {
    // Neutro grafite acolhedor
    badgeStyles = {
      bg: 'bg-[#FAF8F6] text-[#1F1D1B] border-[#EAE4DE] font-medium',
      dot: 'bg-[#736B65]',
    };
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs px-3 py-1 gap-2',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-tight transition-all select-none tabular-nums shadow-xs ${badgeStyles.bg} ${sizeClasses[size]} ${className}`}
    >
      <span className={`rounded-full shrink-0 ${badgeStyles.dot} ${dotSizes[size]}`} />
      <span>{displayName}</span>
    </span>
  );
};
