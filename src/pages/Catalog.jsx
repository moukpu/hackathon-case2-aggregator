import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { clinics as staticClinics, cities } from "../data/mockData";
import { Search, MapPin, Star, Building, ChevronRight, ArrowUpDown } from "lucide-react";
import { useCity } from "../context/CityContext";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState("price_asc");
  const { selectedCity } = useCity();

  // Имитация поиска по клиникам и их прайсам
  useEffect(() => {
    let matched = [];
    
    // Подгружаем одобренные клиники из localStorage
    const localApps = JSON.parse(localStorage.getItem("clinic_applications") || "[]");
    const publishedApps = localApps.filter(app => app.status === "published");
    
    const dynamicClinics = publishedApps.map(app => {
      // Ищем ID города по названию, чтобы фильтр работал
      const cityObj = cities.find(c => c.name === app.city);
      
      return {
        id: `dynamic-${app.id}`,
        name: app.name,
        address: `${app.city}, Ожидает подтверждения адреса`,
        cityId: cityObj ? cityObj.id : 1,
        rating: 5.0, // Дефолтный рейтинг для новых клиник
        reviews: 0,  // Дефолтное кол-во отзывов
        logo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&h=200&fit=crop",
        priceList: (app.prices || []).map(p => ({
           name: p.standardized_name || p.original_name || "Услуга без названия",
           category: p.category || "Общее",
           price: parseInt(p.price) || 0
        }))
      };
    });

    const allClinics = [...staticClinics, ...dynamicClinics];

    // Фильтруем клиники по текущему городу
    const cityClinics = allClinics.filter(c => !selectedCity || c.cityId === selectedCity.id);

    cityClinics.forEach(clinic => {
      // Проверяем, совпадает ли само название клиники с поиском
      const matchClinic = initialQuery ? clinic.name.toLowerCase().includes(initialQuery.toLowerCase()) : false;

      // Ищем совпадения в услугах клиники
      const matchingServices = clinic.priceList.filter(s => 
        !initialQuery || 
        matchClinic || // Если искали саму клинику, возвращаем все её услуги
        s.name.toLowerCase().includes(initialQuery.toLowerCase()) || 
        s.category.toLowerCase().includes(initialQuery.toLowerCase())
      );

      if (matchingServices.length > 0) {
        // Для каждой найденной услуги создаем запись в результатах
        matchingServices.forEach(service => {
          matched.push({
            clinicId: clinic.id,
            clinicName: clinic.name,
            clinicAddress: clinic.address,
            clinicRating: clinic.rating,
            clinicReviews: clinic.reviews,
            logo: clinic.logo,
            serviceName: service.name,
            serviceCategory: service.category,
            price: service.price
          });
        });
      }
    });

    // Сортировка
    if (sortBy === "price_asc") {
      matched.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      matched.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      matched.sort((a, b) => b.clinicRating - a.clinicRating);
    }

    setResults(matched);
  }, [initialQuery, sortBy, selectedCity]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearch} className="relative w-full sm:w-2/3">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Поиск по услугам (напр. МРТ)..."
          />
        </form>
        <div className="w-full sm:w-1/3 flex items-center justify-end gap-2 text-sm text-slate-600">
          <ArrowUpDown className="w-4 h-4" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent font-medium border-none outline-none cursor-pointer hover:text-indigo-600"
          >
            <option value="price_asc">Сначала дешевые</option>
            <option value="price_desc">Сначала дорогие</option>
            <option value="rating">По рейтингу клиник</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {initialQuery ? `Цены на "${initialQuery}"` : "Все предложения"}
        </h1>
        <p className="text-slate-500 mt-1">Найдено предложений: {results.length}</p>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start md:items-center">
              <img src={item.logo} alt={item.clinicName} className="w-16 h-16 rounded-xl object-cover border border-slate-100" />
              
              <div className="flex-grow">
                <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1 bg-indigo-50 inline-block px-2 py-0.5 rounded">
                  {item.serviceCategory}
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2">{item.serviceName}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center"><Building className="w-4 h-4 mr-1 text-slate-400"/> {item.clinicName}</span>
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-slate-400"/> {item.clinicAddress}</span>
                  <span className="flex items-center text-amber-500 font-medium">
                    <Star className="w-4 h-4 mr-1 fill-current" /> {item.clinicRating} 
                    <span className="text-slate-400 font-normal ml-1">({item.clinicReviews} отзыва)</span>
                  </span>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 mt-2 md:mt-0">
                <div className="text-2xl font-extrabold text-slate-900 mb-2">{item.price.toLocaleString('ru-RU')} ₸</div>
                <Link to={`/clinic/${item.clinicId}`} className="flex items-center text-indigo-600 font-semibold hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors">
                  Записаться <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700">Ничего не найдено</h3>
            <p className="text-slate-500 mt-2">Попробуйте изменить запрос или поискать другую услугу.</p>
          </div>
        )}
      </div>
    </div>
  );
}
