import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '../data/campusBiteData';

interface DishIllustrationProps {
  type: MenuItem['illustrationKey'];
  src?: string;
  alt?: string;
  className?: string;
}

export const DishIllustration: React.FC<DishIllustrationProps> = ({
  type,
  src,
  alt,
  className = '',
}) => {
  const [failed, setFailed] = useState(false);

  const matchedItem = MENU_ITEMS.find((m) => m.illustrationKey === type);
  const resolvedSrc = src || matchedItem?.imageUrl || '';
  const resolvedAlt = alt || matchedItem?.name || 'Homemade CampusBite meal';

  if (failed || !resolvedSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF3E0] via-[#F7EFE4] to-[#E8F4EC] p-6 text-center ${className}`}
      >
        <Utensils className="h-8 w-8 text-[#C2410C]" />
        <p className="mt-2 text-xs font-semibold text-[#1F1814]">{resolvedAlt}</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#F5EFE6] ${className}`}>
      <img
        src={resolvedSrc}
        alt={resolvedAlt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </div>
  );
};
