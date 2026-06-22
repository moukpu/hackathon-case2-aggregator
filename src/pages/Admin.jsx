import { useState, useEffect } from "react";
import { Lock, ShieldCheck, Check, Clock, Phone, MapPin, XCircle, FileText, User } from "lucide-react";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadApplications();
    }
  }, [isAuthenticated]);

  const loadApplications = () => {
    const apps = JSON.parse(localStorage.getItem("clinic_applications") || "[]");
    setApplications(apps);
  };

  const approveApplication = (id) => {
    const apps = JSON.parse(localStorage.getItem("clinic_applications") || "[]");
    const app = apps.find(a => a.id === id);
    if (!app) return;

    // Генерируем уникальный токен для клиники
    const clinicToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    app.status = 'approved';
    app.token = clinicToken;
    
    // Берем URL парсера из .env, или используем localhost по умолчанию
    const parserUrl = import.meta.env.VITE_PARSER_URL || "http://localhost:8000";
    app.magicLink = `${parserUrl}/?token=${clinicToken}&clinic=${encodeURIComponent(app.name)}`;
    
    localStorage.setItem("clinic_applications", JSON.stringify(apps));
    loadApplications();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Неверный пароль");
    }
  };

  const updateStatus = (id, newStatus) => {
    const apps = JSON.parse(localStorage.getItem("clinic_applications") || "[]");
    const updatedApps = apps.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    );
    localStorage.setItem("clinic_applications", JSON.stringify(updatedApps));
    loadApplications();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-900 mb-6">Панель администратора</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-md"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderAppCard = (app, isPriceModeration) => (
    <div key={app.id} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-slate-900">{app.name}</h3>
          
          {/* Status Badge */}
          {app.status === "new" && (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" /> На рассмотрении
            </span>
          )}
          {app.status === "accepted_waiting_prices" && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" /> Ждем прайс
            </span>
          )}
          {app.status === "prices_moderation" && (
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Модерация прайса
            </span>
          )}
          {app.status === "published" && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" /> Опубликовано
            </span>
          )}
          {app.status === "rejected" && (
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
              <XCircle className="w-3 h-3" /> Отклонено
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600 mt-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" /> {app.city}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400" /> {app.phone}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" /> 
            {new Date(app.date).toLocaleString('ru-RU')}
          </div>
          {app.prices && (
            <div className="flex items-center gap-2 text-indigo-600 font-semibold">
              <FileText className="w-4 h-4" /> Распознано услуг: {app.prices.length}
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:w-auto flex flex-col gap-2">
        {app.status === "new" && !isPriceModeration && (
          <>
            <button 
              onClick={() => updateStatus(app.id, "accepted_waiting_prices")}
              className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Одобрить регистрацию
            </button>
            <button 
              onClick={() => updateStatus(app.id, "rejected")}
              className="w-full md:w-auto px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Отклонить
            </button>
          </>
        )}
        
        {app.status === "prices_moderation" && isPriceModeration && (
          <>
            <button 
              onClick={() => updateStatus(app.id, "published")}
              className="w-full md:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Опубликовать прайс
            </button>
            <button 
              onClick={() => updateStatus(app.id, "rejected")}
              className="w-full md:w-auto px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Отклонить прайс
            </button>
          </>
        )}

        {(app.status === "accepted_waiting_prices" || app.status === "published" || app.status === "rejected") && (
          <div className="text-sm font-medium text-slate-400 px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-center">
            {app.status === "accepted_waiting_prices" && "Ждем загрузку прайса"}
            {app.status === "published" && "В каталоге"}
            {app.status === "rejected" && "Отказ"}
          </div>
        )}
      </div>
    </div>
  );

  const registrationApps = applications.filter(a => a.status === "new" || a.status === "accepted_waiting_prices" || (a.status === "rejected" && !a.prices));
  const priceApps = applications.filter(a => a.status === "prices_moderation" || a.status === "published" || (a.status === "rejected" && a.prices));

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-extrabold text-slate-900">Управление маркетплейсом</h1>
        </div>

        <div className="space-y-8">
          {/* Section 1: Регистрации */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-800">1. Заявки на регистрацию</h2>
            </div>
            
            <div className="p-0">
              {registrationApps.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                  Нет заявок
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {registrationApps.map(app => renderAppCard(app, false))}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Прайсы */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-slate-800">2. Модерация загруженных прайсов</h2>
            </div>
            
            <div className="p-0">
              {priceApps.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                  Нет прайсов на модерацию
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {priceApps.map(app => renderAppCard(app, true))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
