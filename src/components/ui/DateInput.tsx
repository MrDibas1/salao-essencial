import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DateInputProps {
  value: string; // ISO format 'YYYY-MM-DD' ou ''
  onChange: (isoValue: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  min?: string;
  max?: string;
}

/**
 * Converte 'YYYY-MM-DD' para 'DD/MM/AAAA'
 */
function isoToDisplay(iso: string): string {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length !== 3) return '';
  const [year, month, day] = parts;
  if (!year || !month || !day) return '';
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}

/**
 * Converte 'DD/MM/AAAA' para 'YYYY-MM-DD' se válido
 */
function displayToIso(display: string): string | null {
  const digits = display.replace(/\D/g, '');
  if (digits.length !== 8) return null;

  const day = parseInt(digits.slice(0, 2), 10);
  const month = parseInt(digits.slice(2, 4), 10);
  const year = parseInt(digits.slice(4, 8), 10);

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (year < 1900 || year > 2100) return null;

  // Valida dias reais no mês
  const testDate = new Date(year, month - 1, day);
  if (testDate.getFullYear() !== year || testDate.getMonth() !== month - 1 || testDate.getDate() !== day) {
    return null;
  }

  const sYear = String(year);
  const sMonth = String(month).padStart(2, '0');
  const sDay = String(day).padStart(2, '0');
  return `${sYear}-${sMonth}-${sDay}`;
}

/**
 * Aplica máscara de data 'DD/MM/AAAA' enquanto o usuário digita
 */
function applyDateMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'DD/MM/AAAA',
  disabled = false,
  required = false,
  id,
  name,
  min,
  max,
}) => {
  const [displayText, setDisplayText] = useState(() => isoToDisplay(value));
  const pickerInputRef = useRef<HTMLInputElement>(null);

  // Sincroniza estado de exibição se a prop value mudar externamente
  useEffect(() => {
    setDisplayText(isoToDisplay(value));
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const masked = applyDateMask(raw);
    setDisplayText(masked);

    if (!masked.trim()) {
      onChange('');
      return;
    }

    const iso = displayToIso(masked);
    if (iso) {
      onChange(iso);
    }
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIso = e.target.value;
    if (newIso) {
      setDisplayText(isoToDisplay(newIso));
      onChange(newIso);
    }
  };

  const openPicker = () => {
    if (disabled) return;
    const input = pickerInputRef.current;
    if (!input) return;
    try {
      if ('showPicker' in input && typeof (input as HTMLInputElement & { showPicker?: () => void }).showPicker === 'function') {
        (input as HTMLInputElement & { showPicker: () => void }).showPicker();
      } else {
        input.focus();
      }
    } catch {
      input.focus();
    }
  };

  return (
    <div
      className={`relative flex items-center min-h-[44px] rounded-xl border border-[#EAE4DE] bg-white text-[#1F1D1B] focus-within:border-[#C87A14] shadow-xs transition-colors ${
        disabled ? 'opacity-60 bg-gray-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {/* Campo visível com padrão brasileiro / Windows (DD/MM/AAAA) */}
      <input
        type="text"
        inputMode="numeric"
        id={id}
        name={name}
        disabled={disabled}
        required={required}
        value={displayText}
        onChange={handleTextChange}
        placeholder={placeholder}
        maxLength={10}
        className="w-full h-full min-h-[44px] pl-3.5 pr-10 py-2.5 bg-transparent text-[16px] text-[#1F1D1B] placeholder-[#736B65] tabular-nums focus:outline-none"
      />

      {/* Botão com ícone de calendário e picker nativo integrado */}
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#FAF8F6] transition-colors cursor-pointer text-[#736B65] hover:text-[#C87A14]">
        <CalendarIcon className="w-4 h-4 pointer-events-none" />

        {/* Input de data nativo transparente posicionado sobre o botão */}
        <input
          ref={pickerInputRef}
          type="date"
          value={value || ''}
          onChange={handlePickerChange}
          disabled={disabled}
          min={min}
          max={max}
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title="Abrir calendário"
          onClick={openPicker}
        />
      </div>
    </div>
  );
};
