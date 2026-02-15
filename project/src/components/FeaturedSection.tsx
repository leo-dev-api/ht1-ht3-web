import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Pack } from '../lib/supabase';
import { getPacks } from '../lib/packUtils';
import { PackCard } from './PackCard';
import { PackModal } from './PackModal';

export function FeaturedSection() {
  const [featuredPacks, setFeaturedPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  useEffect(() => {
    loadFeaturedPacks();
  }, []);

  const loadFeaturedPacks = async () => {
    try {
      setLoading(true);
      const data = await getPacks({});
      const featured = data.filter(pack => pack.is_featured).slice(0, 3);
      setFeaturedPacks(featured);
    } catch (error) {
      console.error('Error loading featured packs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || featuredPacks.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" id="featured">
      <div className="flex items-center gap-3 mb-8">
        <Star className="w-8 h-8 text-yellow-400 fill-current" />
        <h2 className="text-3xl font-bold text-white">Featured Packs</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredPacks.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            onClick={() => setSelectedPack(pack)}
          />
        ))}
      </div>

      {selectedPack && (
        <PackModal
          pack={selectedPack}
          onClose={() => setSelectedPack(null)}
        />
      )}
    </div>
  );
}
