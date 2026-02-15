import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Key } from 'lucide-react';
import { Pack } from '../lib/supabase';
import { getPacks, deletePack } from '../lib/packUtils';
import { useAuth } from '../contexts/AuthContext';
import { PackForm } from './PackForm';
import { AdminKeyManager } from './AdminKeyManager';

export function AdminDashboard() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPackForm, setShowPackForm] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [showKeyManager, setShowKeyManager] = useState(false);
  const { adminToken } = useAuth();

  useEffect(() => {
    loadPacks();
  }, []);

  const loadPacks = async () => {
    try {
      setLoading(true);
      const data = await getPacks({});
      setPacks(data);
    } catch (error) {
      console.error('Error loading packs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pack?')) return;

    try {
      if (!adminToken) return;
      await deletePack(id, adminToken);
      await loadPacks();
    } catch (error) {
      console.error('Error deleting pack:', error);
      alert('Failed to delete pack');
    }
  };

  const handleEdit = (pack: Pack) => {
    setEditingPack(pack);
    setShowPackForm(true);
  };

  const handleFormClose = () => {
    setShowPackForm(false);
    setEditingPack(null);
    loadPacks();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button
          onClick={() => setShowPackForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Add New Pack
        </button>

        <button
          onClick={() => setShowKeyManager(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-colors"
        >
          <Key className="w-4 h-4" />
          Manage Admin Keys
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : packs.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-xl">
          <p className="text-gray-400">No packs yet. Create your first pack!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors"
            >
              <img
                src={pack.thumbnail_url}
                alt={pack.name}
                className="w-16 h-16 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-white">{pack.name}</h3>
                <p className="text-sm text-gray-400">
                  {pack.creator_name} • v{pack.version}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(pack)}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(pack.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPackForm && (
        <PackForm
          pack={editingPack}
          onClose={handleFormClose}
        />
      )}

      {showKeyManager && (
        <AdminKeyManager onClose={() => setShowKeyManager(false)} />
      )}
    </div>
  );
}
