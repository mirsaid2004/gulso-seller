import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface LocationMapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lat: number
  lng: number
  label?: string
}

export function LocationMapDialog({ open, onOpenChange, lat, lng, label }: LocationMapDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-base font-black text-slate-900">
            {label ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`}
          </DialogTitle>
        </DialogHeader>
        <div className="h-[420px] w-full">
          {open && (
            <MapContainer
              center={[lat, lng]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]} icon={markerIcon} />
            </MapContainer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
