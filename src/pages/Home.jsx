import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { topCategories } from "../data/mockData";
import { useCity } from "../context/CityContext";

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { selectedCity, setIsCityModalOpen } = useCity();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Сравнивайте цены на <br/> медицинские услуги
          </h1>
          <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            Единая база прайс-листов клиник Казахстана. Находите лучшую цену на МРТ, УЗИ или анализы за пару кликов.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-grow flex items-center w-full pl-4 text-slate-400">
              <Search className="w-6 h-6" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-4 text-lg text-slate-800 focus:outline-none bg-transparent"
                placeholder="Например: Магнитно-резонансная томография"
              />
            </div>
            <div 
              onClick={() => setIsCityModalOpen(true)}
              className="flex items-center px-4 py-4 border-t sm:border-t-0 sm:border-l border-slate-200 cursor-pointer hover:bg-slate-50 w-full sm:w-auto text-slate-600 transition-colors"
            >
              <MapPin className="w-5 h-5 mr-2 text-indigo-500" />
              <span className="font-medium whitespace-nowrap">{selectedCity?.name || "Город"}</span>
            </div>
            <button type="submit" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-md">
              Найти цены
            </button>
          </form>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Каталог услуг</h2>
        <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">Все услуги классифицированы нашим ИИ-алгоритмом для удобного поиска.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topCategories.map((cat) => (
            <div key={cat.id} onClick={() => navigate(`/catalog?q=${cat.name}`)} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer group flex flex-col items-center text-center transform hover:-translate-y-1">
              <div className="w-20 h-20 bg-indigo-50/50 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <img src={`/icons/${cat.icon}.png`} alt={cat.name} className="w-16 h-16 object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
