import React, { useState, useMemo } from 'react';
import type { Product, ProductCategory } from '../../types';
import { Modal } from '../ui/Modal';
import { getHairToneColor } from '../../utils/hairColor';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Info,
} from 'lucide-react';

const getCategoryBadgeStyle = (category: ProductCategory) => {
  switch (category) {
    case 'Tintas':
      return {
        badge: 'bg-amber-100 text-amber-950 border-amber-300 font-bold',
        dot: 'bg-amber-600',
      };
    case 'Oxidantes':
      return {
        badge: 'bg-sky-100 text-sky-950 border-sky-300 font-bold',
        dot: 'bg-sky-600',
      };
    case 'Descolorantes':
      return {
        badge: 'bg-cyan-100 text-cyan-950 border-cyan-300 font-bold',
        dot: 'bg-cyan-600',
      };
    case 'Tonalizantes':
      return {
        badge: 'bg-purple-100 text-purple-950 border-purple-300 font-bold',
        dot: 'bg-purple-600',
      };
    case 'Hidratação':
    case 'Tratamentos':
      return {
        badge: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold',
        dot: 'bg-emerald-600',
      };
    case 'Reconstrução':
      return {
        badge: 'bg-rose-100 text-rose-950 border-rose-300 font-bold',
        dot: 'bg-rose-600',
      };
    default:
      return {
        badge: 'bg-neutral-100 text-neutral-800 border-neutral-300 font-bold',
        dot: 'bg-neutral-500',
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setBrand('');
    setLine('');
    setCategory('Tintas');
    setShadeNumber('');
    setUnit('tubo 60g');
    setNotes('');
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
    setErrors({});
    setIsModalOpen(true);
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Informative Note */}
      <div className="p-4 rounded-xl bg-white border border-[#E5E5E5] flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-[#111111] shrink-0 mt-0.5" />
        <div className="text-xs text-[#777777] leading-relaxed">
          <strong className="text-[#111111] block mb-0.5">Catálogo Auxiliar Flexível:</strong>
          Este catálogo serve como ferramenta de suporte e agilidade. Durante qualquer atendimento, os profissionais podem utilizar tintas e insumos livremente mesmo que ainda não estejam cadastrados aqui.
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por nome, marca ou numeração..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm bg-[#FAFAFA] focus:bg-white focus:outline-none focus:border-[#111111] transition-all"
          />
        </div>

        {/* Category filter & Add button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-xs text-[#292929] focus:outline-none focus:border-[#111111]"
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
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#292929] text-white text-xs font-semibold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-[#E5E5E5] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F3F3F3] text-[#777777] flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-[#111111]">Nenhum produto encontrado</h4>
            <p className="text-xs text-[#777777] max-w-sm mx-auto">
              Cadastre tintas, oxidantes ou tratamentos no catálogo para facilitar o preenchimento dos atendimentos.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-2 inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#111111] text-white text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cadastrar Primeiro Produto</span>
            </button>
          </div>
        ) : (
          filteredProducts.map((prod) => {
            const catStyle = getCategoryBadgeStyle(prod.category);
            const tone = getHairToneColor(prod.shadeNumber);

            return (
              <div
                key={prod.id}
                className="p-5 rounded-2xl bg-white border border-[#E5E5E5] shadow-2xs hover:border-[#111111] hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] border ${catStyle.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
                      <span>{prod.category}</span>
                    </span>

                    {prod.shadeNumber && (
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#111111] bg-white border border-[#E5E5E5] px-2.5 py-0.5 rounded-md shadow-2xs">
                        {tone && (
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: tone.bg, border: `1px solid ${tone.border}` }}
                            title={tone.name}
                          />
                        )}
                        <span>{prod.shadeNumber}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-[#111111] mt-2.5 leading-snug">
                    {prod.name}
                  </h4>

                <p className="text-xs text-[#777777] mt-1">
                  <strong>Marca:</strong> {prod.brand} {prod.line ? `• Linha: ${prod.line}` : ''}
                </p>

                {prod.notes && (
                  <p className="text-[11px] text-[#292929] mt-2.5 p-2 rounded-lg bg-[#FAFAFA] border border-[#F3F3F3] line-clamp-2">
                    {prod.notes}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#F3F3F3] flex items-center justify-between text-xs">
                <span className="text-[#777777] font-mono text-[11px]">{prod.unit}</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(prod)}
                    className="p-1.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F3F3F3] transition-colors"
                    title="Editar produto"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteProduct(prod)}
                    className="p-1.5 rounded-lg text-[#777777] hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

      {/* Create / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Editar Produto do Catálogo' : 'Cadastrar Novo Produto'}
        subtitle="Informe os dados técnicos para facilitar o uso nos atendimentos"
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
              Nome do Produto <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Coloração Permanente 7.1 Louro Médio Cinza"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all shadow-2xs ${
                errors.name
                  ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-[#D1D5DB] bg-white focus:border-[#111111] focus:ring-1 focus:ring-[#111111]'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                Marca <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Linha Premium Color, Wella..."
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  if (errors.brand) setErrors({ ...errors, brand: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all shadow-2xs ${
                  errors.brand
                    ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-[#D1D5DB] bg-white focus:border-[#111111] focus:ring-1 focus:ring-[#111111]'
                }`}
              />
              {errors.brand && <p className="text-[11px] text-rose-500 mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-1">
                Linha (opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Permanent Color Pro"
                value={line}
                onChange={(e) => setLine(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D1D5DB] bg-white text-sm focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#D1D5DB] bg-white text-xs font-medium focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] shadow-2xs"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-1">
                Tonalidade / Tom
              </label>
              <input
                type="text"
                placeholder="Ex: 7.1, 20 Vol..."
                value={shadeNumber}
                onChange={(e) => setShadeNumber(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#D1D5DB] bg-white text-xs font-mono font-bold focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-1">
                Embalagem / Unidade
              </label>
              <input
                type="text"
                placeholder="Ex: tubo 60g, frasco 900ml"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#D1D5DB] bg-white text-xs focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-1">
              Observações Técnicas do Produto
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Recomendações de uso, neutralização ou tempo padrão..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D1D5DB] bg-white text-xs focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] resize-none shadow-2xs"
            />
          </div>

          <div className="pt-4 mt-6 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2.5 px-4 rounded-xl border border-[#D1D5DB] bg-white text-xs font-semibold text-[#374151] hover:text-[#111111] hover:bg-neutral-100 transition-colors shadow-2xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-semibold transition-all shadow-xs hover:shadow active:scale-[0.99]"
            >
              {editingProduct ? 'Salvar Produto' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
