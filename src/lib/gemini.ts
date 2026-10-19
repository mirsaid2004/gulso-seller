import type { Lang } from "@/types"

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

// Try newer model first, fall back to 1.5 if rate-limited
const MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"]

const LANG_NAMES: Record<Lang, string> = {
  uz: "Uzbek",
  ru: "Russian",
  en: "English",
}

export interface TranslationData {
  name: string
  description: string
  specifications: string[]
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

export async function translateProduct(
  sourceLang: Lang,
  source: TranslationData
): Promise<Partial<Record<Lang, TranslationData>>> {
  if (!GEMINI_KEY) throw new Error("VITE_GEMINI_API_KEY sozlanmagan")

  const targetLangs = (["uz", "ru", "en"] as Lang[]).filter((l) => l !== sourceLang)

  const prompt = `You are a professional translator for a flower and gift shop.
Translate the following product details from ${LANG_NAMES[sourceLang]} to ${targetLangs.map((l) => LANG_NAMES[l]).join(" and ")}.

Product Name: ${source.name}
Description: ${source.description}
Specifications:
${source.specifications.length ? source.specifications.map((s) => `- ${s}`).join("\n") : "(none)"}

Return ONLY a valid JSON object with exactly these keys: ${targetLangs.join(", ")}
Each value must have: { "name": string, "description": string, "specifications": string[] }
Translate naturally. Keep numbers and measurements accurate.`

  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
  })

  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`

    // One retry per model on 429
    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      })

      if (res.status === 429) {
        if (attempt === 0) {
          await sleep(2500)
          continue   // retry same model after short wait
        }
        break       // both attempts failed, try next model
      }

      if (!res.ok) {
        const err = await res.text()
        throw new Error(`Gemini ${res.status}: ${err.slice(0, 120)}`)
      }

      const result = await res.json()
      const text: string = result.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error("Gemini bo'sh javob qaytardi")

      return JSON.parse(text) as Partial<Record<Lang, TranslationData>>
    }
  }

  throw new Error("Tarjima serveri band (429). Bir oz kuting va qayta urinib ko'ring.")
}
