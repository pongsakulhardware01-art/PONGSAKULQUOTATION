import React, { useState, useMemo } from 'react';
import { ProductPreset, QuotationItem } from '../types';
import { HARDWARE_PRODUCT_CATALOG } from '../data/defaultData';
import { Search, Plus, Check, X, Tag, Package } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface ProductCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (item: QuotationItem) => void;
}

export const ProductCatalogModal: React.FC<ProductCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => {
    const cats = Array.from(new Set(HARDWARE_PRODUCT_CATALOG.map((p) => p.category)));
    return ['all', ...cats];
  }, []);

  const filteredProducts = useMemo(() => {
    return HARDWARE_PRODUCT_CATALOG.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  const handleAdd = (p: ProductPreset) => {
    const newItem: QuotationItem = {
      id: 'item-' + Date.now() + Math.random(),
      sku: p.sku,
      description: p.name,
      details: p.description || '',
      quantity: 1,
      unit: p.unit,
      unitPrice: p.unitPrice,
      discount: 0,
      discountType: 'amount',
      total: p.unitPrice,
    };
    onSelectProduct(newItem);

    // Feedback
    setAddedIds((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [p.id]: false }));
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">คลังสินค้าฮาร์ดแวร์ & อุปกรณ์ช่าง</h2>
              <p className="text-xs text-stone-300">
                เลือกรายการสำเร็จรูปเพื่อเพิ่มลงในใบเสนอราคาได้สะดวกรวดเร็ว
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อสินค้า รหัส SKU หรือหมวดหมู่..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
              autoFocus
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <Tag className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                {cat === 'all' ? 'ทั้งหมด' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products List */}
        <div className="p-4 overflow-y-auto divide-y divide-stone-100 flex-1">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <Package className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-medium">ไม่พบสินค้าที่ตรงกับการค้นหา</p>
              <p className="text-xs text-stone-400 mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const isAdded = addedIds[product.id];
              return (
                <div
                  key={product.id}
                  className="py-3 px-2 flex items-center justify-between gap-4 hover:bg-stone-50 rounded-xl transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        {product.sku}
                      </span>
                      <span className="text-[10px] text-red-700 bg-red-50 px-2 py-0.5 rounded-full font-medium">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-stone-900 leading-snug">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-stone-500 line-clamp-1">{product.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-stone-900">
                        ฿{formatCurrency(product.unitPrice)}
                      </div>
                      <div className="text-[10px] text-stone-500">ต่อ {product.unit}</div>
                    </div>

                    <button
                      onClick={() => handleAdd(product)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 hover:border-red-600'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>เพิ่มแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>เลือก</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>พบทั้งหมด {filteredProducts.length} รายการ</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-medium transition-colors"
          >
            เสร็จสิ้น / ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
