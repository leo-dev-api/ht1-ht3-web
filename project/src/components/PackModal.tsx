import { X, Download, Eye, Star } from 'lucide-react';
import { Pack } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { getPackRatings, submitRating, getUserIdentifier, incrementViewCount, incrementDownloadCount } from '../lib/packUtils';

interface PackModalProps {
  pack: Pack;
  onClose: () => void;
}

export function PackModal({ pack, onClose }: PackModalProps) {
  const [rating, setRating] = useState({ average: 0, count: 0 });
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    incrementViewCount(pack.id);
    loadRating();
  }, [pack.id]);

  const loadRating = async () => {
    const data = await getPackRatings(pack.id);
    setRating(data);
  };

  const handleRating = async (value: number) => {
    try {
      const identifier = getUserIdentifier();
      await submitRating(pack.id, value, identifier);
      setUserRating(value);
      await loadRating();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleDownload = () => {
    incrementDownloadCount(pack.id);
    window.open(pack.download_url, '_blank');
  };

  const categoryLabels = {
    texture_packs: 'Texture Pack',
    overlays: 'Overlay',
    mods: 'Mod',
    settings_packs: 'Settings Pack'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-2xl border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="aspect-video w-full overflow-hidden rounded-t-2xl">
          <img
            src={pack.thumbnail_url}
            alt={pack.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">{pack.name}</h2>
                {pack.is_featured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-gray-400">
                by {pack.creator_name} • v{pack.version} • {categoryLabels[pack.category]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span>{pack.view_count} views</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              <span>{pack.download_count} downloads</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">Description</h3>
            <p className="text-gray-300 leading-relaxed">{pack.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">Rate this pack</h3>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredStar || userRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-gray-400">
                <span className="text-2xl font-bold text-yellow-400">
                  {rating.average > 0 ? rating.average.toFixed(1) : 'N/A'}
                </span>
                <span className="ml-2">({rating.count} ratings)</span>
              </div>
            </div>
          </div>

          {pack.screenshots && pack.screenshots.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">Screenshots</h3>
              <div className="grid grid-cols-2 gap-4">
                {pack.screenshots.map((screenshot, index) => (
                  <img
                    key={index}
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleDownload}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white text-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <Download className="w-6 h-6" />
            Download Pack
          </button>
        </div>
      </div>
    </div>
  );
}
