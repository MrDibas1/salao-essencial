import React, { useState, useMemo, useRef } from 'react';
import type { Product, ProductCategory } from '../../types';
import { Modal } from '../ui/Modal';
import { getHairToneColor } from '../../utils/hairColor';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Camera,
  Upload,
  X,
} from 'lucide-react';

const getCategoryBadgeStyle = (category: ProductCategory) => {
  switch (category) {
    case 'Tintas':
    case 'Tonalizantes':
      return {
        badge: 'bg-[#FDF3E7] text-[#8C530A] border-[#EAE4DE]',
        dot: 'bg-[#C87A14]',
      };
    case 'Oxidantes':
    case 'Descolorantes':
      return {
        badge: 'bg-[#FAF2E8] text-[#8C6239] border-[#EAE4DE]',
        dot: 'bg-[#C28C53]',
      };
    case 'Hidratação':
    case 'Tratamentos':
      return {
        badge: 'bg-[#E8F4EE] text-[#2E7D5B] border-[#2E7D5B]/20',
        dot: 'bg-[#2E7D5B]',
      };
    case 'Reconstrução':
      return {
        badge: 'bg-[#FCECEC] text-[#A8630A] border-[#EAE4DE]',
        dot: 'bg-[#C87A14]',
      };
    default:
      return {
        badge: 'bg-[#FAF8F6] text-[#736B65] border-[#EAE4DE]',
        dot: 'bg-[#736B65]',
      };
  }
};

interface ProductsModuleProps {
  products: Product[];
  onSaveProduct: (productData: Omit<Product, 'id' | 'createdAt'>, id?: string) => void;
  onDeleteProduct: (product: Product) => void;
}

const CATEGORIES: ProductCategory[] = [
  'Tintas',
  'Oxidantes',
  'Descolorantes',
  'Tonalizantes',
  'Tratamentos',
  'Hidratação',
  'Reconstrução',
  'Outros',
];

export const ProductsModule: React.FC<ProductsModuleProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [line, setLine] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Tintas');
  const [shadeNumber, setShadeNumber] = useState('');
  const [unit, setUnit] = useState('tubo 60g');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setBrand('');
    setLine('');
    setCategory('Tintas');
    setShadeNumber('');
    setUnit('tubo 60g');
    setNotes('');
    setImageUrl('');
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setBrand(p.brand);
    setLine(p.line || '');
    setCategory(p.category);
    setShadeNumber(p.shadeNumber || '');
    setUnit(p.unit);
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

    if (!name.trim()) newErrors.name = 'Nome do produto é obrigatório.';
    if (!brand.trim()) newErrors.brand = 'Marca do produto é obrigatória.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSaveProduct(
      {
        name: name.trim(),
        brand: brand.trim(),
        line: line.trim() || undefined,
        category,
        shadeNumber: shadeNumber.trim() || undefined,
        unit: unit.trim() || 'unidade',
        notes: notes.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
      },
      editingProduct ? editingProduct.id : undefined
    );

    setIsModalOpen(false);
  };

  // Filtragem
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        prod.name.toLowerCase().includes(term) ||
        prod.brand.toLowerCase().includes(term) ||
        prod.line?.toLowerCase().includes(term) ||
        prod.shadeNumber?.toLowerCase().includes(term)
      );
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300 pb-32 sm:pb-12">
      {/* Barra de Filtro e Ação */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE4DE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Campo de Busca */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#736B65] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, marca ou tom..."
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

        {/* Filtro de Categoria e Botão Novo */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="min-h-[44px] px-3 py-2 rounded-xl border border-[#EAE4DE] bg-white text-xs font-medium text-[#1F1D1B] focus:outline-none focus:border-[#C87A14]"
          >
            <option value="all">Todas as categorias ({products.length})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat} ({products.filter((p) => p.category === cat).length})
              </option>
            ))}
          </select>

          <button
            onClick={openCreateModal}
            className="min-h-[44px] inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#C87A14] hover:bg-[#A8630A] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* Grade de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-14 text-center bg-white rounded-2xl border border-dashed border-[#EAE4DE] space-y-2.5 px-4">
            <div className="w-10 h-10 rounded-full bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center mx-auto">
              <Package className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-[#1F1D1B]">Nenhum produto encontrado</h4>
            <p className="text-xs text-[#736B65] max-w-sm mx-auto">
              Cadastre tintas, oxidantes ou tratamentos no catálogo com fotos para agilizar os atendimentos.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-1 min-h-[44px] inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#C87A14] text-white text-xs font-semibold active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cadastrar produto</span>
            </button>
          </div>
        ) : (
          filteredProducts.map((prod) => {
            const catStyle = getCategoryBadgeStyle(prod.category);
            const tone = getHairToneColor(prod.shadeNumber);

            return (
              <div
                key={prod.id}
                className="rounded-2xl bg-white border border-[#EAE4DE] shadow-xs hover:border-[#C87A14]/60 transition-all flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  {/* Foto de Capa do Produto */}
                  <div className="relative h-40 w-full bg-[#FAF8F6] overflow-hidden border-b border-[#EAE4DE]">
                    {prod.imageUrl ? (
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#736B65]">
                        <Package className="w-9 h-9 mb-1 opacity-40 text-[#C87A14]" />
                        <span className="text-[11px] font-medium text-[#736B65]">
                          {prod.brand}
                        </span>
                      </div>
                    )}

                    {/* Badge da Categoria sobre a foto */}
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] border shadow-xs backdrop-blur-xs ${catStyle.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
                        <span>{prod.category}</span>
                      </span>
                    </div>

                    {/* Badge do Tom / Numeração em tabular-nums */}
                    {prod.shadeNumber && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#1F1D1B] bg-white/95 backdrop-blur-xs border border-[#EAE4DE] px-2 py-0.5 rounded-full shadow-xs tabular-nums">
                          {tone && (
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                              style={{ backgroundColor: tone.bg, border: `1px solid ${tone.border}` }}
                              title={tone.name}
                            />
                          )}
                          <span>{prod.shadeNumber}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-4 space-y-1">
                    <h4 className="text-sm font-semibold text-[#1F1D1B] leading-snug line-clamp-2">
                      {prod.name}
                    </h4>

                    <p className="text-xs text-[#736B65]">
                      <span className="text-[#1F1D1B] font-medium">{prod.brand}</span>
                      {prod.line ? ` • ${prod.line}` : ''}
                    </p>

                    {prod.notes && (
                      <p className="text-[11px] text-[#736B65] mt-1.5 p-2 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE] line-clamp-2 leading-relaxed">
                        {prod.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rodapé com Unidade e Ações */}
                <div className="p-3.5 pt-2 border-t border-[#EAE4DE]/60 flex items-center justify-between text-xs">
                  <span className="text-[#736B65] font-mono text-[11px] bg-[#FAF8F6] border border-[#EAE4DE] px-2 py-0.5 rounded-full tabular-nums">
                    {prod.unit}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6] transition-colors"
                      title="Editar produto"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(prod)}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#736B65] hover:text-[#C94A4A] hover:bg-[#FCECEC] transition-colors"
                      title="Excluir produto"
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

      {/* Modal / Bottom Sheet de Cadastro / Edição */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        subtitle="Dados e foto para identificação no catálogo"
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Foto do Produto */}
          <div>
            <label className="block text-xs font-medium text-[#736B65] mb-1">
              Foto do Produto
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
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
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
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EAE4DE] hover:bg-[#FAF8F6] text-xs font-medium text-[#1F1D1B] shadow-xs transition-all active:scale-[0.98]"
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

          <div>
            <label className="block text-xs font-medium text-[#736B65] mb-1">
              Nome do Produto <span className="text-[#C94A4A]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Coloração Permanente 7.1 Louro Médio Cinza"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#736B65] mb-1">
                Marca <span className="text-[#C94A4A]">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Essência, Wella, L'Oréal..."
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  if (errors.brand) setErrors({ ...errors, brand: '' });
                }}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-[16px] text-[#1F1D1B] focus:outline-none transition-all shadow-xs ${
                  errors.brand
                    ? 'border-[#C94A4A] bg-[#FCECEC]/30 focus:border-[#C94A4A]'
                    : 'border-[#EAE4DE] bg-white focus:border-[#C87A14]'
                }`}
              />
              {errors.brand && <p className="text-[11px] text-[#C94A4A] mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#736B65] mb-1">
                Linha
              </label>
              <input
                type="text"
                placeholder="Ex: Permanent Color Pro"
                value={line}
                onChange={(e) => setLine(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#EAE4DE] bg-white text-[16px] text-[#1F1D1B] focus:outline-none focus:border-[#C87A14] shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#736B65] mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#EAE4DE] bg-white text-[16px] text-[#1F1D1B] focus:outline-none focus:border-[#C87A14] shadow-xs"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#736B65] mb-1">
                Tom / Numeração
              </label>
              <input
                type="text"
                placeholder="Ex: 7.1, 20 Vol..."
                value={shadeNumber}
                onChange={(e) => setShadeNumber(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#EAE4DE] bg-white text-[16px] font-mono text-[#1F1D1B] tabular-nums focus:outline-none focus:border-[#C87A14] shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#736B65] mb-1">
                Embalagem
              </label>
              <input
                type="text"
                placeholder="Ex: tubo 60g, 900ml"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#EAE4DE] bg-white text-[16px] text-[#1F1D1B] tabular-nums focus:outline-none focus:border-[#C87A14] shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#736B65] mb-1">
              Observações Técnicas
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Recomendações de uso, tempo padrão..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#EAE4DE] bg-white text-[16px] text-[#1F1D1B] focus:outline-none focus:border-[#C87A14] resize-none shadow-xs"
            />
          </div>

          <div className="pt-3 border-t border-[#EAE4DE] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="min-h-[44px] py-2 px-4 rounded-xl border border-[#EAE4DE] bg-white text-xs sm:text-sm font-medium text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6] transition-colors active:scale-[0.98]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] py-2 px-5 rounded-xl bg-[#C87A14] hover:bg-[#A8630A] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-[0.98]"
            >
              {editingProduct ? 'Salvar alterações' : 'Salvar produto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
