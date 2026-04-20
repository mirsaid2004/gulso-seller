import { Card, CardContent } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import {
    Search,
    Bell,
    Plus,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Filter
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"

const products = [
    { id: 1, title: "Atirgul 'Qizil nafis'", price: "150,000 so'm", status: "MAVJUD", statusColor: "bg-[#00B894] text-white", img: "https://images.unsplash.com/photo-1548013210-4f52613ba242?w=300&h=300&fit=crop" },
    { id: 2, title: "Lola 'Bahor nafasi'", price: "80,000 so'm", status: "MAVJUD EMAS", statusColor: "bg-[#636E72] text-white", img: "https://images.unsplash.com/photo-1558231011-82d615967756?w=300&h=300&fit=crop" },
    { id: 3, title: "Pion 'Oq orzu'", price: "210,000 so'm", status: "MAVJUD", statusColor: "bg-[#00B894] text-white", img: "https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=300&h=300&fit=crop" },
    { id: 4, title: "Xrizantema 'Kuz jilosi'", price: "65,000 so'm", status: "MAVJUD", statusColor: "bg-[#00B894] text-white", img: "https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?w=300&h=300&fit=crop" },
    { id: 5, title: "Gortenziya 'Moviy dengiz'", price: "120,000 so'm", status: "MAVJUD", statusColor: "bg-[#00B894] text-white", img: "https://images.unsplash.com/photo-1550983058-294747eb68ac?w=300&h=300&fit=crop" },
    { id: 6, title: "Orxideya 'Ekzotik'", price: "350,000 so'm", status: "MAVJUD EMAS", statusColor: "bg-[#636E72] text-white", img: "https://images.unsplash.com/photo-1534885408544-77c59babb724?w=300&h=300&fit=crop" },
]

export default function ProductsPage() {
    return (
        <div className="space-y-8 pb-10">
            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Mahsulotlar bo'ylab qidirish..." className="pl-9 w-[450px] bg-slate-100 border-none rounded-xl h-12" />
                </div>
                <div className="flex items-center gap-6">
                    <Button className="rounded-xl h-12 px-6 bg-primary hover:bg-primary/90 text-white font-black italic gap-2 shadow-lg shadow-primary/20">
                        <Plus className="w-5 h-5" /> Yangi tovar qo'shish
                    </Button>
                    <div className="flex items-center gap-4 pl-6 border-l">
                        <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 relative shrink-0">
                            <Bell className="w-5 h-5 text-slate-600" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white animate-pulse" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Title & Filters */}
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Barcha tovarlar</h1>
                    <p className="text-slate-400 text-sm font-medium">Sizning do'koningizdagi barcha mahsulotlar ro'yxati va holati</p>
                </div>
                <div className="flex items-center bg-slate-50 p-1 rounded-xl gap-1">
                    <Button variant="ghost" size="sm" className="rounded-lg h-9 px-4 font-bold text-[11px] bg-white text-primary shadow-sm uppercase tracking-wide">Barchasi</Button>
                    <Button variant="ghost" size="sm" className="rounded-lg h-9 px-4 font-bold text-[11px] text-slate-400 uppercase tracking-wide hover:bg-white hover:text-slate-900 transition-all">Mavjud</Button>
                    <Button variant="ghost" size="sm" className="rounded-lg h-9 px-4 font-bold text-[11px] text-slate-400 uppercase tracking-wide hover:bg-white hover:text-slate-900 transition-all">Tugagan</Button>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Card key={product.id} className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                        <CardContent className="p-4 space-y-4">
                            <div className="relative aspect-square rounded-[1.5rem] overflow-hidden">
                                <img
                                    src={product.img}
                                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${product.status === "MAVJUD EMAS" ? "grayscale" : ""}`}
                                    alt={product.title}
                                />
                                <Badge className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-[9px] font-black tracking-widest ${product.statusColor}`}>
                                    {product.status}
                                </Badge>
                            </div>
                            <div className="space-y-1 px-1">
                                <h3 className="text-sm font-black text-slate-800 line-clamp-1">{product.title}</h3>
                                <p className="text-lg font-black text-primary italic">{product.price}</p>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button variant="secondary" className="flex-1 rounded-xl h-10 gap-2 font-bold text-xs bg-slate-50 text-slate-600 hover:bg-slate-100 italic transition-all active:scale-95">
                                    <Pencil className="w-3.5 h-3.5" /> Tahrirlash
                                </Button>
                                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 pt-8">
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl border-slate-100 text-slate-400 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></Button>
                <Button className="w-10 h-10 rounded-xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/20">1</Button>
                <Button variant="ghost" className="w-10 h-10 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50">2</Button>
                <Button variant="ghost" className="w-10 h-10 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50">3</Button>
                <div className="text-slate-300 px-2">...</div>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl border-slate-100 text-slate-400 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></Button>
            </div>
        </div>
    )
}
