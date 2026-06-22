import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Clinic from "./pages/Clinic";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import SyncPrices from "./pages/SyncPrices";
import Header from "./components/Header";
import CityModal from "./components/CityModal";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 relative">
        <Header />
        <CityModal />

        {/* Main Content */}
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/clinic/:id" element={<Clinic />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sync-prices" element={<SyncPrices />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-20">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
            &copy; 2026 MedAggregator. Разработано на Хакатоне. База данных обновляется автоматически.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
