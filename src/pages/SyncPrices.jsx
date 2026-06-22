import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle } from "lucide-react";

export default function SyncPrices() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("syncing"); // syncing, done, error

  useEffect(() => {
    const token = searchParams.get("token");
    const clinic = searchParams.get("clinic");

    if (!token || !clinic) {
      setStatus("error");
      return;
    }

    const fetchAndSync = async () => {
      try {
        const parserUrl = import.meta.env.VITE_PARSER_URL || "http://localhost:8000";
        const res = await fetch(`${parserUrl}/api/prices?clinic_name=${encodeURIComponent(clinic)}`);
        if (!res.ok) throw new Error("Failed to fetch prices");
        const parsedData = await res.json();
        
        const existingApps = JSON.parse(localStorage.getItem("clinic_applications") || "[]");
        let appIndex = existingApps.findIndex(a => a.token === token);
        
        if (appIndex >= 0) {
          existingApps[appIndex].prices = parsedData;
          existingApps[appIndex].status = "prices_moderation"; // Переводим на модерацию прайсов
          localStorage.setItem("clinic_applications", JSON.stringify(existingApps));
          localStorage.setItem("current_clinic_user", existingApps[appIndex].name);
          setStatus("done");
          
          // Через 2 секунды кидаем в профиль
          setTimeout(() => {
            navigate("/profile");
          }, 2000);
        } else {
          console.error("Токен недействителен.");
          setStatus("error");
        }
        
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    };

    fetchAndSync();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center border border-slate-100">
        {status === "syncing" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Синхронизация данных...</h2>
            <p className="text-slate-500">Загружаем ваш прайс-лист в маркетплейс</p>
          </div>
        )}
        
        {status === "done" && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Отправлено на модерацию!</h2>
            <p className="text-slate-500 mb-6">Администратор проверит ваш прайс перед публикацией.</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
              <span className="text-4xl">!</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Ошибка синхронизации</h2>
            <p className="text-slate-500 mb-6">Неверный токен безопасности или данные повреждены.</p>
            <button onClick={() => navigate("/")} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">
              На главную
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
