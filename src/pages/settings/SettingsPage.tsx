import { useTranslation } from "react-i18next";
import { Settings, Bell, Shield, Puzzle, User } from "lucide-react";

const FEATURES = [
  { key: "profile", icon: User },
  { key: "notifications", icon: Bell },
  { key: "security", icon: Shield },
  { key: "integrations", icon: Puzzle },
] as const;

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Icon */}
      <div className="relative flex items-center justify-center">
        <div className="w-28 h-28 rounded-3xl bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center">
          <Settings className="w-12 h-12 text-primary/40 animate-spin" style={{ animationDuration: "8s" }} />
        </div>
        {/* Orbiting dots */}
        <div className="absolute w-3 h-3 rounded-full bg-primary/30 top-0 right-4 animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="absolute w-2 h-2 rounded-full bg-primary/20 bottom-2 left-2 animate-bounce" style={{ animationDelay: "0.4s" }} />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-primary/25 top-4 left-0 animate-bounce" style={{ animationDelay: "0.8s" }} />
      </div>

      {/* Text */}
      <div className="text-center space-y-2 max-w-sm">
        <h2 className="text-2xl font-black text-slate-900">{t("settings.buildingTitle")}</h2>
        <p className="text-sm text-slate-400 font-medium leading-relaxed">{t("settings.buildingDesc")}</p>
      </div>

      {/* Upcoming features */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {FEATURES.map(({ key, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-50"
          >
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-xs font-bold text-slate-500 leading-tight">
              {t(`settings.features.${key}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
