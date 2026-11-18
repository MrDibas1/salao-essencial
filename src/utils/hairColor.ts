// Mapeamento de colorimetria capilar universal
export interface HairToneInfo {
  bg: string;
  border: string;
  name: string;
}

export function getHairToneColor(shadeNumber?: string): HairToneInfo | null {
  if (!shadeNumber) return null;

  const clean = shadeNumber.trim().toUpperCase();

  // Ruivos e Cobres (.4, .44, .34, 7.4, etc.)
  if (clean.includes('.4') || clean.includes('/4') || clean.includes('7.4') || clean.includes('8.34')) {
    return {
      bg: '#C86134',
      border: '#A94B22',
      name: 'Acobreado / Ruivo',
    };
  }

  // Vermelhos / Acaju / Violeta (.5, .6, 6.66)
  if (clean.includes('.5') || clean.includes('.6') || clean.includes('6.35')) {
    return {
      bg: '#7E3831',
      border: '#622720',
      name: 'Chocolate Acaju',
    };
  }

  // Louros Claríssimos / Platinados / Pérolas (9, 10, 9.89, 10.0, 9+)
  if (clean.startsWith('9') || clean.startsWith('10') || clean.includes('9.89') || clean.includes('10.')) {
    return {
      bg: '#EBD4A8',
      border: '#CBB07E',
      name: 'Louro Claríssimo / Pérola',
    };
  }

  // Louros Claros (8.0, 8.1, 8.3)
  if (clean.startsWith('8')) {
    return {
      bg: '#D2A969',
      border: '#B38B4B',
      name: 'Louro Claro',
    };
  }

  // Louros Médios (7.0, 7.1, 7.3)
  if (clean.startsWith('7')) {
    return {
      bg: '#B2824D',
      border: '#926533',
      name: 'Louro Médio',
    };
  }

  // Louros Escuros / Castanhos Claros (6.0, 5.0)
  if (clean.startsWith('6') || clean.startsWith('5')) {
    return {
      bg: '#6E4933',
      border: '#533421',
      name: 'Louro Escuro / Castanho',
    };
  }

  // Castanhos Escuros / Preto (1, 2, 3, 4)
  if (clean.startsWith('1') || clean.startsWith('2') || clean.startsWith('3') || clean.startsWith('4')) {
    return {
      bg: '#2C1D18',
      border: '#1B110E',
      name: 'Castanho / Preto',
    };
  }

  // Oxidantes
  if (clean.includes('VOL') || clean.includes('6%') || clean.includes('9%') || clean.includes('12%')) {
    return {
      bg: '#38BDF8',
      border: '#0284C7',
      name: 'Oxidante',
    };
  }

  return {
    bg: '#A3784A',
    border: '#7A5228',
    name: 'Tom Capilar',
  };
}
