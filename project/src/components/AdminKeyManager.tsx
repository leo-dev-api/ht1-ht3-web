import { X, Plus, Copy, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, AdminKey } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AdminKeyManagerProps {
  onClose: () => void;
}

export function AdminKeyManager({ onClose }: AdminKeyManagerProps) {
  const [keys, setKeys] = useState<AdminKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { adminToken } = useAuth();

  const [newKey, setNewKey] = useState({
    created_by: '',
    usage_type: 'multi' as 'single' | 'multi',
    max_uses: '',
    expires_at: '',
  });

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKeys(data || []);
    } catch (error) {
      console.error('Error loading keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = 'HT-';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) key += '-';
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const keyValue = generateKey();
      const keyData: any = {
        key_value: keyValue,
        created_by: newKey.created_by,
        usage_type: newKey.usage_type,
        is_active: true,
      };

      if (newKey.max_uses) {
        keyData.max_uses = parseInt(newKey.max_uses);
      }

      if (newKey.expires_at) {
        keyData.expires_at = new Date(newKey.expires_at).toISOString();
      }

      const { error } = await supabase
        .from('admin_keys')
        .insert(keyData);

      if (error) throw error;

      setShowForm(false);
      setNewKey({
        created_by: '',
        usage_type: 'multi',
        max_uses: '',
        expires_at: '',
      });
      loadKeys();
    } catch (error: any) {
      console.error('Error creating key:', error);
      alert(error.message || 'Failed to create key');
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin key?')) return;

    try {
      const { error } = await supabase
        .from('admin_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadKeys();
    } catch (error) {
      console.error('Error deleting key:', error);
      alert('Failed to delete key');
    }
  };

  const handleToggleActive = async (key: AdminKey) => {
    try {
      const { error } = await supabase
        .from('admin_keys')
        .update({ is_active: !key.is_active })
        .eq('id', key.id);

      if (error) throw error;
      loadKeys();
    } catch (error) {
      console.error('Error updating key:', error);
      alert('Failed to update key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Key copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-gray-900 rounded-2xl border border-white/10 shadow-2xl my-8">
        <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-white">Admin Key Manager</h2>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 mb-6"
          >
            <Plus className="w-4 h-4" />
            Generate New Key
          </button>

          {showForm && (
            <form onSubmit={handleCreateKey} className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Created By
                  </label>
                  <input
                    type="text"
                    value={newKey.created_by}
                    onChange={(e) => setNewKey({ ...newKey, created_by: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Usage Type
                  </label>
                  <select
                    value={newKey.usage_type}
                    onChange={(e) => setNewKey({ ...newKey, usage_type: e.target.value as any })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="single" className="bg-gray-900">Single Use</option>
                    <option value="multi" className="bg-gray-900">Multi Use</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Uses (optional)
                  </label>
                  <input
                    type="number"
                    value={newKey.max_uses}
                    onChange={(e) => setNewKey({ ...newKey, max_uses: e.target.value })}
                    placeholder="Unlimited"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Expires At (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newKey.expires_at}
                    onChange={(e) => setNewKey({ ...newKey, expires_at: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Generate Key
              </button>
            </form>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-xl">
              <p className="text-gray-400">No admin keys found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    key.is_active
                      ? 'bg-white/5 border-white/10'
                      : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm font-mono text-purple-400 break-all">
                          {key.key_value}
                        </code>
                        <button
                          onClick={() => copyToClipboard(key.key_value)}
                          className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                        >
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>Created by: {key.created_by}</span>
                        <span>Type: {key.usage_type}</span>
                        <span>Uses: {key.current_uses}{key.max_uses ? `/${key.max_uses}` : ''}</span>
                        {key.expires_at && (
                          <span>Expires: {new Date(key.expires_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggleActive(key)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          key.is_active
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {key.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
