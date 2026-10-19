import { useTranslation } from "react-i18next"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"

type LangCode = "uz" | "ru" | "en"

const LOCALES: { code: LangCode; label: string; nativeLabel: string }[] = [
  { code: "uz", label: "UZ", nativeLabel: "O'zbek" },
  { code: "ru", label: "RU", nativeLabel: "Русский" },
  { code: "en", label: "EN", nativeLabel: "English" },
]

function FlagImg({ code }: { code: LangCode }) {
  return (
    <img
      src={`/${code}.png`}
      alt={code}
      width={20}
      height={14}
      className="rounded-sm object-cover shadow-sm shrink-0"
    />
  )
}

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = LOCALES.find((l) => l.code === i18n.language) ?? LOCALES[0]

  return (
    <Select value={i18n.language} onValueChange={(v) => i18n.changeLanguage(v as LangCode)}>
      <SelectTrigger className="h-10 px-3 gap-2 font-bold text-slate-600 hover:bg-primary/5 hover:text-primary border-none shadow-none bg-transparent rounded-lg focus-visible:ring-0 focus:ring-0 w-auto">
        <SelectValue>
          <span className="flex items-center gap-2">
            <FlagImg code={current.code} />
            <span className="text-sm font-bold">{current.label}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map(({ code, label, nativeLabel }) => (
          <SelectItem key={code} value={code}>
            <span className="flex items-center gap-2.5">
              <FlagImg code={code} />
              <span className="font-bold text-sm">{label}</span>
              <span className="text-xs text-muted-foreground">{nativeLabel}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
