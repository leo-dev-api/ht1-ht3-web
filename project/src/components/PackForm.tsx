import { X, Upload } from 'lucide-react';
import { useState } from 'react';
import { Pack } from '../lib/supabase';
import { createPack, updatePack } from '../lib/packUtils';
import { useAuth } from '../contexts/AuthContext';

interface PackFormProps {
  pack?: Pack | null;
  onClose: () => void;
}

export function PackForm({ pack, onClose }: PackFormProps) {
  const { adminToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: pack?.name || '',
    creator_name: pack?.creator_name || '',
    version: pack?.version || '',
    description: pack?.description || '',
    category: pack?.category || 'texture_packs',
    thumbnail_url: pack?.thumbnail_url || '',
    download_url: pack?.download_url || '',
    is_featured: pack?.is_featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) {
      setError('Not authenticated');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (pack) {
        await updatePack(pack.id, formData, adminToken);
      } else {
        await createPack(
          {
            ...formData,
            screenshots: [],
            is_featured: formData.is_featured,
          },
          adminToken
        );
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving pack:', err);
      setError(err.message || 'Failed to save pack');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gray-900 rounded-2xl border border-white/10 shadow-2xl my-8">
        <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">
            {pack ? 'Edit Pack' : 'Add New Pack'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pack Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Creator Name
              </label>
              <input
                type="text"
                name="creator_name"
                value={formData.creator_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Version
              </label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                placeholder="e.g., 1.0.0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
              required
            >
              <option value="texture_packs" className="bg-gray-900">Texture Pack</option>
              <option value="overlays" className="bg-gray-900">Overlay</option>
              <option value="mods" className="bg-gray-900">Mod</option>
              <option value="settings_packs" className="bg-gray-900">Settings Pack</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                required
              />
              <button
                type="button"
                className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Use stock photos from Pexels or upload your own</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Download URL
            </label>
            <input
              type="url"
              name="download_url"
              value={formData.download_url}
              onChange={handleChange}
              placeholder="https://example.com/download/pack.zip"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-white/5 border border-white/10 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-gray-300">
              Feature this pack
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : pack ? 'Update Pack' : 'Create Pack'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
