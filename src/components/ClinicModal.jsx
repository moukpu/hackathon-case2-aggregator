import { Building, UploadCloud, X, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const KZ_CITIES = [
  "Астана", "Алматы", "Шымкент", "Караганда", "Актобе", "Павлодар", "Атырау", "Усть-Каменогорск"
];

export default function ClinicModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", city: "", phone: "", password: "" });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Жесткая проверка телефона (Казахстанский формат)
    const phoneRegex = /^(?:\+7|8)\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Введите корректный номер телефона (например, +7 777 123 45 67)");
      return;
    }

    if (!formData.city) {
      setError("Выберите город");
      return;
    }

    if (formData.password.length < 4) {
      setError("Пароль должен быть не менее 4 символов");
      return;
    }

    // Сохраняем заявку в localStorage
    const existingApps = JSON.parse(localStorage.getItem("clinic_applications") || "[]");
    
    // Проверка на дубликат телефона
    if (existingApps.some(app => app.phone === formData.phone)) {
      setError("Клиника с таким номером телефона уже подавала заявку");
      return;
    }

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const newApp = {
      id: Date.now(),
      name: formData.name,
      city: formData.city,
      phone: formData.phone,
      password: formData.password, // В реальном проекте хэшируется
      token: token,
      status: "new",
      date: new Date().toISOString()
    };
    localStorage.setItem("clinic_applications", JSON.stringify([newApp, ...existingApps]));

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative max-h-[95vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-200 z-10">
          <X className="w-6 h-6" />
        </button>

        {!submitted ? (
          <div className="flex flex-col md:flex-row h-full">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white md:w-2/5 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Building className="w-32 h-32" />
              </div>
              <h2 className="text-2xl font-extrabold mb-4 relative z-10">Партнерская программа</h2>
              <p className="text-indigo-100 mb-6 relative z-10 leading-relaxed text-sm">
                Присоединяйтесь к крупнейшему маркетплейсу медицинских услуг Казахстана. Мы приведем к вам новых пациентов.
              </p>
              <ul className="space-y-3 relative z-10 text-sm font-medium">
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-2 text-emerald-400" /> Удобное подключение</li>
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-2 text-emerald-400" /> Интеллектуальный анализ</li>
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-2 text-emerald-400" /> Приток целевого трафика</li>
              </ul>
            </div>
            
            <div className="p-8 md:w-3/5">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Оставьте заявку</h3>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Название клиники</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    placeholder="ТОО 'Медикал Центр'" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Город</label>
                  <select 
                    required 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="" disabled>Выберите город...</option>
                    {KZ_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Контактный телефон (Логин)</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    placeholder="+7 777 123 45 67" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Придумайте пароль</label>
                  <input 
                    type="password" 
                    required 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    placeholder="Минимум 4 символа" 
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center">
                    <UploadCloud className="w-5 h-5 mr-2" /> Отправить заявку
                  </button>
                </div>
              </form>
              <div className="mt-4 text-center">
                <button onClick={() => { onClose(); navigate("/login"); }} className="text-sm text-indigo-600 hover:underline font-semibold">Уже оставляли заявку? Войти</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Заявка успешно отправлена!</h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Ваша заявка направлена администраторам. Вы можете отслеживать статус модерации в личном кабинете.
            </p>
            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl mb-8 w-full">
              <button 
                onClick={() => { onClose(); navigate("/login"); }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center"
              >
                Войти в личный кабинет <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700 font-semibold transition-colors">
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
