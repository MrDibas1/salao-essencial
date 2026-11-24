import React, { useState, useMemo, useRef } from 'react';
import type { Product } from '../../types';
import { Modal } from '../ui/Modal';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Camera,
  Upload,
  X,
  Sparkles,
} from 'lucide-react';

interface ProductsModuleProps {
  products: Product[];
  onSaveProduct: (productData: Omit<Product, 'id' | 'createdAt'>, id?: string) => void;
  onDeleteProduct: (product: Product) => void;
}

export const ProductsModule: React.FC<ProductsModuleProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states — campos simplificados: apenas Nome da Marca/Tinta, Foto e Observações
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setNotes('');
    setImageUrl('');
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setNotes(p.notes || '');
    setImageUrl(p.imageUrl || '');
    setErrors({});
    setIsModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Selecione um arquivo de imagem válido (PNG, JPG, WEBP).' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.image;
          return copy;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Nome da tinta ou marca é obrigatório.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSaveProduct(
      {
        name: name.trim(),
        brand: name.trim(),
        category: 'Tintas',
        notes: notes.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
      },
      editingProduct ? editingProduct.id : undefined
    );

    setIsModalOpen(false);
  };

  // Filtragem rápida por nome da marca/tinta
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter((prod) => {
      return (
        prod.name.toLowerCase().includes(term) ||
        prod.notes?.toLowerCase().includes(term)
      );
    });
  }, [products, searchTerm]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300 pb-32 sm:pb-12">
      {/* Barra de Filtro e Ação */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE4DE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Campo de Busca */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#736B65] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por marca ou tinta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-h-[44px] pl-10 pr-10 py-2.5 rounded-xl border border-[#EAE4DE] text-[16px] text-[#1F1D1B] bg-[#FAF8F6] focus:bg-white focus:outline-none focus:border-[#C87A14] transition-all shadow-xs placeholder:text-[#736B65]/70"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#736B65] hover:text-[#1F1D1B]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quantidade e Botão Novo */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <span className="text-xs text-[#736B65] font-medium hidden sm:inline-block">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'marca cadastrada' : 'marcas cadastradas'}
          </span>

          <button
            onClick={openCreateModal}
            className="min-h-[44px] inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#C87A14] hover:bg-[#A8630A] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Marca / Tinta</span>
          </button>
        </div>
      </div>

      {/* Grade de Produtos / Marcas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-14 text-center bg-white rounded-2xl border border-dashed border-[#EAE4DE] space-y-2.5 px-4">
            <div className="w-10 h-10 rounded-full bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center mx-auto">
              <Package className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-[#1F1D1B]">Nenhuma tinta ou marca encontrada</h4>
            <p className="text-xs text-[#736B65] max-w-sm mx-auto">
              Cadastre as marcas de tintas que você utiliza no salão para selecionar rapidamente nos atendimentos.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-1 min-h-[44px] inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#C87A14] text-white text-xs font-semibold active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cadastrar marca de tinta</span>
            </button>
          </div>
        ) : (
          filteredProducts.map((prod) => {
            return (
              <div
                key={prod.id}
                onClick={() => openEditModal(prod)}
                className="rounded-2xl bg-white border border-[#EAE4DE] shadow-xs hover:border-[#C87A14]/70 hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden cursor-pointer active:scale-[0.99]"
                title={`Toque ou clique para editar ${prod.name}`}
              >
                <div>
                  {/* Foto de Capa da Tinta / Marca */}
                  <div className="relative h-44 w-full bg-[#FAF8F6] overflow-hidden border-b border-[#EAE4DE]">
                    {prod.imageUrl ? (
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#736B65]">
                        <Package className="w-10 h-10 mb-1 opacity-40 text-[#C87A14]" />
                        <span className="text-xs font-medium text-[#736B65]">
                          {prod.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Conteúdo do Card: Nome em destaque e observações */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C87A14] shrink-0" />
                      <h4 className="text-base font-semibold text-[#1F1D1B] group-hover:text-[#C87A14] transition-colors leading-snug">
                        {prod.name}
                      </h4>
                    </div>

                    {prod.notes && (
                      <p className="text-xs text-[#736B65] p-2.5 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE] line-clamp-3 leading-relaxed">
                        {prod.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rodapé com Ações */}
                <div className="p-3.5 pt-2 border-t border-[#EAE4DE]/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-[#2E7D5B] bg-[#E8F4EE] px-2.5 py-0.5 rounded-full">
                    Ativa no salão
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(prod);
                      }}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6] transition-colors cursor-pointer"
                      title="Editar tinta / marca"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProduct(prod);
                      }}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#736B65] hover:text-[#C94A4A] hover:bg-[#FCECEC] transition-colors cursor-pointer"
                      title="Excluir tinta / marca"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Simplificado de Cadastro / Edição da Marca de Tinta */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Editar Marca de Tinta' : 'Nova Marca de Tinta'}
        subtitle="Identificação da tinta para seleção nos atendimentos"
        maxWidth="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Foto da Marca / Produto */}
          <div>
            <label className="block text-xs font-medium text-[#736B65] mb-1">
              Foto da Marca / Tinta
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3.5 p-3.5 rounded-2xl border border-[#EAE4DE] bg-[#FAF8F6]">
              {/* Preview da Imagem */}
              <div className="relative w-20 h-20 rounded-xl bg-white border border-[#EAE4DE] overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Pré-visualização" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
                      title="Remover foto"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <Camera className="w-6 h-6 text-[#736B65]" />
                )}
              </div>

              {/* Controles de Foto */}
              <div className="flex-1 w-full space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EAE4DE] hover:bg-[#FAF8F6] text-xs font-medium text-[#1F1D1B] shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#C87A14]" />
                  <span>Escolher Foto do Aparelho</span>
                </button>

                <input
                  type="url"
                  placeholder="Ou link direto da imagem (https://...)"
                  value={imageUrl.startsWith('data:') ? '' : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-xl border border-[#EAE4DE] bg-white text-[16px] text-[#1F1D1B] focus:outline-none focus:border-[#C87A14] shadow-xs placeholder:text-[#736B65]/70"
                />
                {errors.image && <p className="text-[11px] text-[#C94A4A]">{errors.image}</p>}
              </div>
            </div>
          </div>

          {/* Nome da Marca / Tinta */}
          <div>
            <label className="block text-xs font-semibold text-[#1F1D1B] mb-1">
              Nome da Tinta / Marca <span className="text-[#C94A4A]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Truss, Fest color, Igora 10, Igora, Gloss..."
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

          {/* Observações Técnicas (Opcional) */}
          <div>
            <label className="block text-xs font-semibold text-[#1F1D1B] mb-1">
              Observações Técnicas (Opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Características da cor, tempo de ação, recomendações de aplicação..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#EAE4DE] bg-white text-[16px] text-[#1F1D1B] focus:outline-none focus:border-[#C87A14] resize-none shadow-xs"
            />
          </div>

          <div className="pt-3 border-t border-[#EAE4DE] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="min-h-[44px] py-2 px-4 rounded-xl border border-[#EAE4DE] bg-white text-xs sm:text-sm font-medium text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6] transition-colors active:scale-[0.98] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] py-2 px-5 rounded-xl bg-[#C87A14] hover:bg-[#A8630A] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              {editingProduct ? 'Salvar alterações' : 'Salvar marca de tinta'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
