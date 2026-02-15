export function Footer() {
  return (
    <footer className="bg-gray-900/50 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <span className="text-lg font-bold text-white">HT</span>
            </div>
            <div>
              <h3 className="font-bold text-white">HT1-HT3 Settings</h3>
              <p className="text-xs text-gray-400">Premium PvP Pack Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#packs" className="hover:text-white transition-colors">
              Browse Packs
            </a>
            <a href="#featured" className="hover:text-white transition-colors">
              Featured
            </a>
            <a href="https://discord.gg/example" className="hover:text-white transition-colors">
              Discord
            </a>
          </div>

          <p className="text-sm text-gray-500">
            © 2024 HT1-HT3 Settings. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
