import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import type { Client } from '../../types';

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
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setPhone(clientToEdit.phone);
      setWhatsapp(clientToEdit.whatsapp || clientToEdit.phone);
      setSameAsPhone(clientToEdit.whatsapp === clientToEdit.phone);
      setBirthDate(clientToEdit.birthDate || '');
      setEmail(clientToEdit.email || '');
      setNotes(clientToEdit.notes || '');
    } else {
      setName('');
      setPhone('');
      setWhatsapp('');
      setSameAsPhone(true);
      setBirthDate('');
      setEmail('');
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
      title={clientToEdit ? 'Editar Dados da Cliente' : 'Cadastrar Nova Cliente'}
      subtitle="Preencha os dados de contato e observações gerais"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
            Nome Completo <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Mariana Silva"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
              errors.name
                ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                : 'border-[#E5E5E5] bg-white focus:border-[#111111]'
            }`}
          />
          {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
        </div>

        {/* Telefone e WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
              Telefone Principal <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="(11) 98765-4321"
              value={phone}
              onChange={(e) => {
                handlePhoneChange(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                errors.phone
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                  : 'border-[#E5E5E5] bg-white focus:border-[#111111]'
              }`}
            />
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                WhatsApp
              </label>
              <label className="inline-flex items-center gap-1.5 text-[11px] text-[#777777] cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsPhone}
                  onChange={(e) => handleSameAsPhoneToggle(e.target.checked)}
                  className="rounded border-[#E5E5E5] text-[#111111] focus:ring-0"
                />
                <span>Mesmo do telefone</span>
              </label>
            </div>
            <input
              type="text"
              placeholder="(11) 98765-4321"
              value={sameAsPhone ? phone : whatsapp}
              disabled={sameAsPhone}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-sm bg-white focus:outline-none focus:border-[#111111] disabled:bg-[#F3F3F3] disabled:text-[#777777] transition-all"
            />
          </div>
        </div>

        {/* Data de Nascimento e E-mail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">
              Data de Nascimento (opcional)
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-sm bg-white focus:outline-none focus:border-[#111111] transition-all text-[#292929]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">
              E-mail (opcional)
            </label>
            <input
              type="email"
              placeholder="cliente@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-sm bg-white focus:outline-none focus:border-[#111111] transition-all"
            />
          </div>
        </div>

        {/* Observações Gerais */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">
            Observações Gerais / Preferências
          </label>
          <textarea
            rows={3}
            placeholder="Ex: Alergias, sensibilidade no couro cabeludo, preferência de café, hábitos..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-sm bg-white focus:outline-none focus:border-[#111111] transition-all resize-none"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E5E5]">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-[#E5E5E5] text-xs font-medium text-[#777777] hover:text-[#111111] hover:bg-[#F3F3F3] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-semibold transition-all shadow-xs"
          >
            {clientToEdit ? 'Salvar Alterações' : 'Concluir Cadastro'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
