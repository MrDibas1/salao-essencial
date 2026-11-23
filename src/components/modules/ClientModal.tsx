import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { DateInput } from '../ui/DateInput';
import type { Client } from '../../types';
import { ClientAvatar } from '../common/ClientAvatar';
import { Camera, Trash2 } from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  clientToEdit: Client | null;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clientToEdit,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setPhone(clientToEdit.phone);
      setWhatsapp(clientToEdit.whatsapp || clientToEdit.phone);
      setSameAsPhone(clientToEdit.whatsapp === clientToEdit.phone);
      setBirthDate(clientToEdit.birthDate || '');
      setEmail(clientToEdit.email || '');
      setInstagram(clientToEdit.instagram || '');
      setAvatarUrl(clientToEdit.avatarUrl || '');
      setNotes(clientToEdit.notes || '');
    } else {
      setName('');
      setPhone('');
      setWhatsapp('');
      setSameAsPhone(true);
      setBirthDate('');
      setEmail('');
      setInstagram('');
      setAvatarUrl('');
      setNotes('');
    }
    setErrors({});
  }, [clientToEdit, isOpen]);

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (sameAsPhone) {
      setWhatsapp(val);
    }
  };

  const handleSameAsPhoneToggle = (checked: boolean) => {
    setSameAsPhone(checked);
    if (checked) {
      setWhatsapp(phone);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem é muito grande. Escolha uma foto de até 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Nome completo é obrigatório.';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Telefone para contato é obrigatório.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        name: name.trim(),
        phone: phone.trim(),
        whatsapp: sameAsPhone ? phone.trim() : whatsapp.trim(),
        birthDate: birthDate ? birthDate : undefined,
        email: email.trim() ? email.trim() : undefined,
        instagram: instagram.trim() ? instagram.trim() : undefined,
        avatarUrl: avatarUrl.trim() ? avatarUrl.trim() : undefined,
        notes: notes.trim() ? notes.trim() : undefined,
        status: clientToEdit ? clientToEdit.status : 'active',
      },
      clientToEdit ? clientToEdit.id : undefined
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clientToEdit ? 'Editar Cliente' : 'Nova Cliente'}
      subtitle="Dados de contato e notas para atendimento"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Foto de Perfil */}
        <div className="p-3.5 rounded-2xl border border-[#EAE4DE] bg-[#FAF8F6] flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <ClientAvatar name={name || 'Cliente'} avatarUrl={avatarUrl} size="lg" />
            <div>
              <span className="block text-xs font-semibold text-[#1F1D1B]">
                Foto de Perfil
              </span>
              <p className="text-[11px] text-[#736B65] mt-0.5">
                Facilita a identificação rápida
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[44px] inline-flex items-center gap-1.5 py-2 px-3 rounded-xl border border-[#EAE4DE] bg-white hover:bg-[#FAF8F6] text-xs font-medium text-[#1F1D1B] transition-colors shadow-xs active:scale-[0.98]"
            >
              <Camera className="w-3.5 h-3.5 text-[#C87A14]" />
              <span>{avatarUrl ? 'Trocar' : 'Foto'}</span>
            </button>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => setAvatarUrl('')}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl text-[#736B65] hover:text-[#C94A4A] hover:bg-[#FCECEC] transition-colors"
                title="Remover foto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Nome */}
        <div>
          <label className="block text-xs font-medium text-[#736B65] mb-1">
            Nome Completo <span className="text-[#C94A4A]">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Mariana Silva"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-[16px] text-[#1F1D1B] focus:outline-none transition-all shadow-xs ${
              errors.name
                ? 'border-[#C94A4A] bg-[#FCECEC]/30 focus:border-[#C94A4A]'
                : 'border-[#EAE4DE] bg-white focus:border-[#C87A14]'
            }`}
          />
          {errors.name && <p className="text-[11px] text-[#C94A4A] mt-1">{errors.name}</p>}
        </div>

        {/* Telefone e WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#736B65] mb-1">
              Telefone <span className="text-[#C94A4A]">*</span>
            </label>
            <input
              type="text"
              placeholder="(11) 98765-4321"
              value={phone}
              onChange={(e) => {
                handlePhoneChange(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-[16px] text-[#1F1D1B] tabular-nums focus:outline-none transition-all shadow-xs ${
                errors.phone
                  ? 'border-[#C94A4A] bg-[#FCECEC]/30 focus:border-[#C94A4A]'
                  : 'border-[#EAE4DE] bg-white focus:border-[#C87A14]'
              }`}
            />
            {errors.phone && <p className="text-[11px] text-[#C94A4A] mt-1">{errors.phone}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-[#736B65]">
                WhatsApp
              </label>
              <label className="inline-flex items-center gap-1.5 text-[11px] text-[#736B65] cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsPhone}
                  onChange={(e) => handleSameAsPhoneToggle(e.target.checked)}
                  className="rounded border-[#EAE4DE] text-[#C87A14] focus:ring-0"
                />
                <span>Igual</span>
              </label>
            </div>
            <input
              type="text"
              placeholder="(11) 98765-4321"
              value={sameAsPhone ? phone : whatsapp}
              disabled={sameAsPhone}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#EAE4DE] text-[16px] text-[#1F1D1B] tabular-nums bg-white focus:outline-none focus:border-[#C87A14] disabled:bg-[#FAF8F6] disabled:text-[#736B65] transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Data de Nascimento */}
        <div>
          <label className="block text-xs font-medium text-[#736B65] mb-1">
            Data de Nascimento
          </label>
          <DateInput
            value={birthDate}
            onChange={(newDate) => setBirthDate(newDate)}
            placeholder="DD/MM/AAAA"
          />
        </div>

        {/* Instagram e E-mail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#736B65] mb-1">
              Instagram
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-[#736B65]">@</span>
              <input
                type="text"
                placeholder="usuario"
                value={instagram.replace(/^@/, '')}
                onChange={(e) => {
                  const val = e.target.value.trim().replace(/^@/, '');
                  setInstagram(val ? `@${val}` : '');
                }}
                className="w-full min-h-[44px] pl-8 pr-3.5 py-2.5 rounded-xl border border-[#EAE4DE] text-[16px] text-[#1F1D1B] bg-white focus:outline-none focus:border-[#C87A14] transition-all shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#736B65] mb-1">
              E-mail
            </label>
            <input
              type="email"
              placeholder="cliente@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#EAE4DE] text-[16px] text-[#1F1D1B] bg-white focus:outline-none focus:border-[#C87A14] transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Observações Gerais */}
        <div>
          <label className="block text-xs font-medium text-[#736B65] mb-1">
            Preferências e Observações
          </label>
          <textarea
            rows={3}
            placeholder="Ex: Alergias, sensibilidade no couro cabeludo, preferência de café..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-[#EAE4DE] text-[16px] text-[#1F1D1B] bg-white focus:outline-none focus:border-[#C87A14] transition-all resize-none shadow-xs"
          />
        </div>

        {/* Action buttons */}
        <div className="pt-3 border-t border-[#EAE4DE] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] py-2 px-4 rounded-xl border border-[#EAE4DE] bg-white text-xs sm:text-sm font-medium text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6] transition-colors active:scale-[0.98]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="min-h-[44px] py-2 px-5 rounded-xl bg-[#C87A14] hover:bg-[#A8630A] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-[0.98]"
          >
            {clientToEdit ? 'Salvar alterações' : 'Salvar cliente'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
