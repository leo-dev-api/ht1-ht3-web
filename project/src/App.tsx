import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedSection } from './components/FeaturedSection';
import { PackGrid } from './components/PackGrid';
import { Footer } from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        <Header />
        <Hero />
        <FeaturedSection />
        <PackGrid />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
