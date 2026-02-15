import { Star, Download, Eye } from 'lucide-react';
import { Pack } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { getPackRatings } from '../lib/packUtils';

interface PackCardProps {
  pack: Pack;
  onClick: () => void;
}

export function PackCard({ pack, onClick }: PackCardProps) {
  const [rating, setRating] = useState({ average: 0, count: 0 });

  useEffect(() => {
    getPackRatings(pack.id).then(setRating);
  }, [pack.id]);

  const categoryLabels = {
    texture_packs: 'Texture Pack',
    overlays: 'Overlay',
    mods: 'Mod',
    settings_packs: 'Settings Pack'
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300" />

      <div className="relative aspect-video overflow-hidden">
        <img
          src={pack.thumbnail_url}
          alt={pack.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {pack.is_featured && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">
            Featured
          </div>
        )}
        <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
          {categoryLabels[pack.category]}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-1 truncate">
          {pack.name}
        </h3>

        <p className="text-sm text-gray-400 mb-1">
          by {pack.creator_name} • v{pack.version}
        </p>

        <p className="text-sm text-gray-300 mb-4 line-clamp-2 min-h-[2.5rem]">
          {pack.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold">
              {rating.average > 0 ? rating.average.toFixed(1) : 'N/A'}
            </span>
            <span className="text-gray-400">({rating.count})</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{pack.view_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              <span>{pack.download_count}</span>
            </div>
          </div>
        </div>

        <button className="mt-4 w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
          View Details
        </button>
      </div>
    </div>
  );
}
