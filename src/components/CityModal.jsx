import { Search, MapPin, X } from "lucide-react";
import { useState } from "react";
import { cities } from "../data/mockData";
import { useCity } from "../context/CityContext";

export default function CityModal() {
  const { isCityModalOpen, setIsCityModalOpen, changeCity, selectedCity } = useCity();
  const [search, setSearch] = useState("");

  if (!isCityModalOpen) return null;

  const filteredCities = cities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-indigo-600" /> Выбор города
          </h2>
          <button onClick={() => setIsCityModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск города..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {filteredCities.map(city => (
              <button 
                key={city.id} 
                onClick={() => changeCity(city.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${selectedCity?.id === city.id ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold' : 'bg-white border border-transparent hover:bg-slate-50 hover:border-slate-200 text-slate-700 font-medium'}`}
              >
                <span>{city.name}</span>
                {selectedCity?.id === city.id && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>}
              </button>
            ))}
            {filteredCities.length === 0 && (
              <div className="text-center text-slate-500 py-4">Город не найден</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
