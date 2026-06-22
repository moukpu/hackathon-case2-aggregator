import { Link } from "react-router-dom";
import { useCity } from "../context/CityContext";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import ClinicModal from "./ClinicModal";

export default function Header() {
  const { selectedCity, setIsCityModalOpen, isGeolocationPrompt, setIsGeolocationPrompt } = useCity();
  const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);

  return (
    <>
      <nav className="glass sticky top-0 z-40 border-b border-slate-200 bg-white/80">
        {/* Geolocation Prompt */}
        {isGeolocationPrompt && selectedCity && (
          <div className="bg-indigo-600 text-white text-sm py-2.5 px-4 flex justify-center items-center gap-4 animate-in slide-in-from-top-full duration-300">
            <span className="font-medium">Ваш город — {selectedCity.name}?</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsGeolocationPrompt(false)} 
                className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md font-bold text-xs transition-colors"
              >
                Да
              </button>
              <button 
                onClick={() => {
                  setIsGeolocationPrompt(false);
                  setIsCityModalOpen(true);
                }} 
                className="bg-transparent border border-white/40 hover:bg-white/10 px-3 py-1 rounded-md font-bold text-xs transition-colors"
              >
                Выбрать другой
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
                MedAggregator
              </Link>
              
              {/* City Selector Button */}
              <button 
                onClick={() => setIsCityModalOpen(true)}
                className="hidden md:flex items-center text-slate-600 hover:text-indigo-600 font-medium transition-colors bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-200"
              >
                <MapPin className="w-4 h-4 mr-1.5" />
                {selectedCity ? selectedCity.name : "Выбрать город"}
                <ChevronDown className="w-3.5 h-3.5 ml-1.5 opacity-50" />
              </button>
            </div>

            <div className="flex space-x-4 items-center">
              <Link to="/catalog" className="text-slate-600 hover:text-indigo-600 font-medium px-3 py-2 rounded-md transition-colors">Каталог цен</Link>
              {localStorage.getItem("current_clinic_user") ? (
                <Link 
                  to="/profile"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  Кабинет клиники
                </Link>
              ) : (
                <button 
                  onClick={() => setIsClinicModalOpen(true)}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  Для клиник
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ClinicModal isOpen={isClinicModalOpen} onClose={() => setIsClinicModalOpen(false)} />
    </>
  );
}
