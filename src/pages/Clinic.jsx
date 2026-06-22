import { useParams, Link } from "react-router-dom";
import { clinics } from "../data/mockData";
import { MapPin, Star, Building, ArrowLeft, Phone, Globe } from "lucide-react";

export default function Clinic() {
  const { id } = useParams();
  const clinic = clinics.find(c => c.id === parseInt(id));

  if (!clinic) {
    return <div className="text-center py-20 text-2xl font-bold text-slate-700">Клиника не найдена</div>;
  }

  // Группировка услуг по категориям
  const groupedPrices = clinic.priceList.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/catalog" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Назад к поиску
      </Link>

      {/* Clinic Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-8 items-start">
        <img src={clinic.logo} alt={clinic.name} className="w-32 h-32 rounded-2xl object-cover shadow-md" />
        <div className="flex-grow">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">{clinic.name}</h1>
          <div className="flex flex-wrap gap-4 text-slate-600 mb-6">
            <span className="flex items-center"><MapPin className="w-5 h-5 mr-1.5 text-indigo-500"/> {clinic.address}</span>
            <span className="flex items-center text-amber-500 font-bold">
              <Star className="w-5 h-5 mr-1.5 fill-current" /> {clinic.rating} 
              <span className="text-slate-400 font-normal ml-1 text-sm">({clinic.reviews} отзыва)</span>
            </span>
          </div>
          <div className="flex gap-3">
            <button className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2.5 rounded-xl font-semibold shadow-sm transition-colors flex items-center">
              <Phone className="w-4 h-4 mr-2" /> Позвонить
            </button>
            <button className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-6 py-2.5 rounded-xl font-semibold transition-colors flex items-center">
              <Globe className="w-4 h-4 mr-2" /> Сайт клиники
            </button>
          </div>
        </div>
      </div>

      {/* Price List (grouped by standardized categories) */}
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
        Прайс-лист <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold uppercase tracking-wide">Стандартизировано ИИ</span>
      </h2>

      <div className="space-y-8">
        {Object.entries(groupedPrices).map(([category, items]) => (
          <div key={category} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-indigo-900">{category}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                  <span className="font-medium text-slate-800">{item.name}</span>
                  <span className="font-bold text-slate-900 whitespace-nowrap ml-4">{item.price.toLocaleString('ru-RU')} ₸</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
