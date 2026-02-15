import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Pack } from '../lib/supabase';
import { getPacks } from '../lib/packUtils';
import { PackCard } from './PackCard';
import { PackModal } from './PackModal';

export function PackGrid() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'downloads' | 'rating'>('newest');
  const [search, setSearch] = useState('');
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  useEffect(() => {
    loadPacks();
  }, [category, sortBy, search]);

  const loadPacks = async () => {
    try {
      setLoading(true);
      const data = await getPacks({
        category: category !== 'all' ? category : undefined,
        sortBy,
        search: search || undefined,
      });
      setPacks(data);
    } catch (error) {
      console.error('Error loading packs:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Packs' },
    { value: 'texture_packs', label: 'Texture Packs' },
    { value: 'overlays', label: 'Overlays' },
    { value: 'mods', label: 'Mods' },
    { value: 'settings_packs', label: 'Settings Packs' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'downloads', label: 'Most Downloaded' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" id="packs">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search packs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-gray-900">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-900">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                category === cat.value
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl h-96 animate-pulse" />
          ))}
        </div>
      ) : packs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400">No packs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packs.map((pack) => (
            <PackCard
              key={pack.id}
              pack={pack}
              onClick={() => setSelectedPack(pack)}
            />
          ))}
        </div>
      )}

      {selectedPack && (
        <PackModal
          pack={selectedPack}
          onClose={() => setSelectedPack(null)}
        />
      )}
    </div>
  );
}
