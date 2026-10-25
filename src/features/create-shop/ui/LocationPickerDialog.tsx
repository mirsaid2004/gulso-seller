import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import type { GeoPoint } from "@/entities/shop"

const TASHKENT: GeoPoint = { lat: 41.3111, lng: 69.2797 }

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
})

function ClickToPlace({ onPick }: { onPick: (p: GeoPoint) => void }) {
  useMapEvents({ click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }) })
  return null
}

interface LocationPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: GeoPoint | null
  onConfirm: (point: GeoPoint) => void
}

export function LocationPickerDialog({ open, onOpenChange, value, onConfirm }: LocationPickerDialogProps) {
  const { t } = useTranslation()
  const [point, setPoint] = useState<GeoPoint | null>(value)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-full rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-base font-black text-slate-900">{t("shops.form.map.title")}</DialogTitle>
          <p className="text-xs font-medium text-slate-400">{t("shops.form.map.hint")}</p>
        </DialogHeader>
        <div className="h-[400px] w-full">
          {open && (
            <MapContainer center={value ?? TASHKENT} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ClickToPlace onPick={setPoint} />
              {point && <Marker position={point} icon={markerIcon} />}
            </MapContainer>
          )}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4">
          <Button variant="ghost" className="rounded-xl h-11 px-6 font-bold text-slate-500" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            disabled={!point}
            onClick={() => point && onConfirm(point)}
            className="rounded-xl h-11 px-6 bg-primary hover:bg-primary/90 text-white font-black italic shadow-lg shadow-primary/20"
          >
            {t("shops.form.map.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
