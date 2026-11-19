import React, { useState } from 'react';
import { X, Check, Plus, Minus } from 'lucide-react';
import { MenuItem } from '../data/campusBiteData';
import { DishIllustration } from './DishIllustration';

interface MenuModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, spiceLevel: 'Mild' | 'Homestyle' | 'Spicy') => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({ item, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Homestyle' | 'Spicy'>('Homestyle');

  if (!item) return null;

  const handleConfirm = () => {
    onAddToCart(item, quantity, spiceLevel);
    setQuantity(1);
    setSpiceLevel('Homestyle');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-modal-title"
      onClick={onClose}
    >
      <div
        className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E4E4E0] bg-white shadow-xl md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close meal details"
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E4E0] bg-white text-[#141715] transition-colors hover:bg-[#F2F1EC] focus-visible:outline-2 focus-visible:outline-[#1B4332]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex min-h-[260px] flex-col justify-between bg-[#FFF6EB] p-6">
          <DishIllustration
            type={item.illustrationKey}
            src={item.imageUrl}
            alt={item.name}
            className="h-64 w-full rounded-xl shadow-sm"
          />
          <div className="mt-4 border-t border-[#EEDCC6] pt-3 text-xs font-medium text-[#7C4A21]">
            {item.hygieneNote}
          </div>
        </div>

        <div className="flex flex-col justify-between p-6 md:p-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#7A6B5D]">
              <span className="font-semibold text-[#C2410C]">{item.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{item.slotLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{item.calories}</span>
            </div>

            <h2
              id="menu-modal-title"
              className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#1F1814]"
            >
              {item.name}
            </h2>

            <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-[#C2410C]">
              ₹{item.price}
              <span className="ml-2 font-sans text-xs font-normal text-[#15803D]">
                Free hostel delivery
              </span>
            </p>

            <p className="mt-4 text-sm leading-relaxed text-[#4F453C]">{item.fullDesc}</p>

            <div className="mt-5">
              <p className="text-xs font-semibold text-[#1F1814]">What is inside</p>
              <ul className="mt-2 grid grid-cols-1 gap-1.5 text-xs text-[#5E5247]">
                {item.ingredients.map((ing) => (
                  <li key={ing} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#15803D]" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-[#1F1814]">Spice Preference</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(['Mild', 'Homestyle', 'Spicy'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSpiceLevel(level)}
                    className={`min-h-[40px] rounded-lg border px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                      spiceLevel === level
                        ? 'border-[#C2410C] bg-[#C2410C] text-white'
                        : 'border-[#E6DDD0] bg-white text-[#4F453C] hover:border-[#C2410C]/40'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-[#EFE7DB] pt-5">
            <div className="flex items-center rounded-lg border border-[#E6DDD0] bg-[#FAF6EF]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-10 w-10 items-center justify-center text-[#1F1814] hover:bg-[#EFE7DB]"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center font-mono text-sm font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                aria-label="Increase quantity"
                className="flex h-10 w-10 items-center justify-center text-[#1F1814] hover:bg-[#EFE7DB]"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#15803D] px-5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803D]"
            >
              Add to Bag · ₹{item.price * quantity}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
