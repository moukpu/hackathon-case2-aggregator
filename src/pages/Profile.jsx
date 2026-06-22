import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building, ShieldAlert, CheckCircle, FileText, Activity, Clock, XCircle, Link as LinkIcon } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [clinicName, setClinicName] = useState("");
  const [appData, setAppData] = useState(null);

  useEffect(() => {
    const current = localStorage.getItem("current_clinic_user");
    if (!current) {
      navigate("/login");
      return;
    }
    
    setClinicName(current);
    
    // Ищем данные клиники в заявках
    const existingApps = JSON.parse(localStorage.getItem("clinic_applications") || "[]");
    const app = existingApps.find(a => a.name === current);
    setAppData(app || null);
  }, [navigate]);

  if (!clinicName) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-200">
              <Building className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">{clinicName}</h1>
              <p className="text-slate-500 font-medium">Кабинет партнера</p>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem("current_clinic_user");
              navigate("/");
            }}
            className="text-slate-500 hover:text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Выйти
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            {/* Статус прайса / интеграции */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" /> Статус интеграции
              </h2>
              
              {!appData ? (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                  <p className="text-slate-500">Заявка не найдена.</p>
                </div>
              ) : appData.status === "new" ? (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4">
                  <Clock className="w-8 h-8 text-amber-500 shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-amber-900 mb-1">Заявка на рассмотрении</h3>
                    <p className="text-amber-700 text-sm">Ваша заявка на подключение к платформе находится на проверке у администратора. Мы уведомим вас об изменении статуса.</p>
                  </div>
                </div>
              ) : appData.status === "accepted_waiting_prices" ? (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-start gap-4">
                  <LinkIcon className="w-8 h-8 text-blue-500 shrink-0 mt-1" />
                  <div className="w-full">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">Заявка одобрена! Загрузите прайс</h3>
                    <p className="text-blue-800 text-sm mb-4">
                      Для публикации вашей клиники необходимо загрузить и стандартизировать прайс-лист через нашу умную систему. Перейдите по вашей уникальной защищенной ссылке:
                    </p>
                    <a 
                      href={`http://localhost:8000?token=${appData.token}&clinic=${encodeURIComponent(appData.name)}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors shadow-sm"
                    >
                      Открыть загрузчик прайсов
                    </a>
                  </div>
                </div>
              ) : appData.status === "prices_moderation" ? (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-8 h-8 shrink-0 relative flex items-center justify-center">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20 animate-ping"></span>
                    <ShieldAlert className="w-8 h-8 text-indigo-500 relative" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-indigo-900 mb-1">Прайс-лист на модерации</h3>
                    <p className="text-indigo-700 text-sm">Мы получили ваш стандартизованный прайс-лист. Сейчас он проходит проверку администратором. Ожидайте уведомления об успешной публикации.</p>
                  </div>
                </div>
              ) : appData.status === "published" ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-start gap-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900 mb-1">Опубликовано!</h3>
                    <p className="text-emerald-700 text-sm">Ваши услуги успешно интегрированы в каталог MedAggregator. Теперь пациенты могут находить вас.</p>
                  </div>
                </div>
              ) : appData.status === "rejected" ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
                  <XCircle className="w-8 h-8 text-red-500 shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-red-900 mb-1">Заявка отклонена</h3>
                    <p className="text-red-700 text-sm">К сожалению, администратор отклонил вашу заявку или загруженный прайс-лист. Пожалуйста, обратитесь в поддержку.</p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Статистика по ценам */}
            {appData?.prices && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" /> Загруженные услуги
                </h2>
                <div className="text-sm text-slate-500 mb-4">
                  Всего загружено услуг: <strong className="text-slate-900">{appData.prices.length}</strong>
                </div>
                <div className="max-h-64 overflow-y-auto pr-2 border border-slate-100 rounded-xl divide-y divide-slate-100">
                  {appData.prices.map((p, i) => (
                    <div key={i} className="p-3 flex justify-between items-center hover:bg-slate-50">
                      <div>
                        <div className="font-medium text-slate-800 text-sm">{p.standardized_name}</div>
                        <div className="text-xs text-slate-400">{p.category}</div>
                      </div>
                      <div className="font-bold text-slate-900">{p.price} ₸</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Данные клиники</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-slate-400 font-medium mb-1">Город</div>
                  <div className="font-semibold text-slate-800">{appData?.city || "—"}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium mb-1">Телефон</div>
                  <div className="font-semibold text-slate-800">{appData?.phone || "—"}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium mb-1">Дата регистрации</div>
                  <div className="font-semibold text-slate-800">
                    {appData?.date ? new Date(appData.date).toLocaleDateString("ru-RU") : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
