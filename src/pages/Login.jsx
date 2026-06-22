import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Phone } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    
    const existingApps = JSON.parse(localStorage.getItem("clinic_applications") || "[]");
    const clinic = existingApps.find(app => app.phone === phone && app.password === password);

    if (clinic) {
      localStorage.setItem("current_clinic_user", clinic.name);
      navigate("/profile");
    } else {
      setError("Неверный номер телефона или пароль");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <User className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Вход для партнеров</h1>
        <p className="text-center text-slate-500 mb-6 text-sm">Управляйте услугами вашей клиники</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" /> Телефон
            </label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 777 123 45 67"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" /> Пароль
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-2"
          >
            Войти в кабинет
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button onClick={() => navigate("/")} className="text-sm text-slate-500 hover:text-slate-700 font-semibold underline">На главную</button>
        </div>
      </div>
    </div>
  );
}
