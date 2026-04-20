import { Card, CardContent, CardHeader } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import {
    Search,
    Bell,
    ShoppingBag,
    Clock,
    Play,
    CheckCircle2,
    XCircle,
    SearchIcon,
    SlidersHorizontal,
    Download,
    ClipboardList,
    Wand2,
    Truck
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"

const orders = [
    {
        id: "#10254",
        time: "Bugun, 14:20",
        status: "Kutilmoqda",
        statusColor: "bg-amber-50 text-amber-600 border-none",
        statusText: "KUTILMOQDA",
        items: [
            { name: "Qizil atirgullar 'Premium'", qty: 1, price: "450,000 UZS", img: "https://images.unsplash.com/photo-1548013210-4f52613ba242?w=100&h=100&fit=crop" },
            { name: "Shokolad to'plami 'Ferrero'", qty: 1, price: "85,000 UZS", img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=100&h=100&fit=crop" }
        ],
        financials: {
            total: "535,000 UZS",
            commission: "-53,500 UZS",
            payable: "481,500 UZS"
        },
        delivery: {
            time: "Bugun, 18:00 - 20:00",
            comment: "Iltimos, atirgullar yangi bo'lsin. Ochiq qizil rangli qog'ozga o'rang."
        }
    },
    {
        id: "#10248",
        time: "Bugun, 11:45",
        status: "Ishda",
        statusColor: "bg-blue-50 text-blue-600 border-none",
        statusText: "ISHDA",
        items: [
            { name: "Oq liliyalar va tyulpanlar", qty: 1, price: "320,000 UZS", img: "https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=100&h=100&fit=crop" }
        ],
        financials: {
            total: "320,000 UZS",
            payable: "288,000 UZS"
        },
        delivery: {
            time: "Bugun, 15:00 gacha",
        }
    }
]

export default function OrdersPage() {
    return (
        <div className="space-y-8 pb-10">
            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Buyurtmani qidirish..." className="pl-9 w-80 bg-slate-100 border-none rounded-xl h-11" />
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 relative">
                        <Bell className="w-5 h-5 text-slate-600" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                    </Button>
                    <div className="flex items-center gap-3 pl-4 border-l">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-900">Ali Valiyev</p>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Gullar do'koni</p>
                        </div>
                        <Avatar className="w-10 h-10 border-2 border-white shadow-sm cursor-pointer border-emerald-500">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>AV</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>

            {/* Main Title */}
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Buyurtmalar</h1>
                    <p className="text-slate-400 text-sm font-medium">Sizning do'koningizdagi barcha buyurtmalar oqimi</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl h-11 px-5 border-slate-200 text-slate-600 font-bold gap-2">
                        <SlidersHorizontal className="w-4 h-4" /> Filtr
                    </Button>
                    <Button variant="outline" className="rounded-xl h-11 px-5 border-slate-200 text-slate-600 font-bold gap-2">
                        <Download className="w-4 h-4" /> Eksport
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="barchasi" className="w-full">
                <TabsList className="bg-transparent h-auto p-0 gap-8 border-b rounded-none w-full justify-start overflow-x-auto pb-px">
                    {[
                        { id: "barchasi", label: "Barchasi" },
                        { id: "yangi", label: "Yangi (Kutilmoqda)", count: 3 },
                        { id: "ishda", label: "Jarayonda (Ishda)" },
                        { id: "tayyor", label: "Kuryerga tayyor" },
                        { id: "yakunlangan", label: "Yakunlangan" }
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="px-0 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-bold text-slate-500 transition-all gap-2"
                        >
                            {tab.label}
                            {tab.count && (
                                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-black">
                                    {tab.count}
                                </span>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Order Cards */}
            <div className="space-y-6">
                {orders.map((order, idx) => (
                    <Card key={idx} className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden group">
                        <CardHeader className="p-6 pb-0 flex flex-row items-center justify-between border-b border-slate-50 mb-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100 group-hover:bg-primary/5 transition-colors">
                                    {order.status === "Kutilmoqda" ? <ShoppingBag className="w-6 h-6" /> : (order.status === "Ishda" ? <Wand2 className="w-6 h-6" /> : <Truck className="w-6 h-6" />)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Buyurtma {order.id}</h3>
                                    <p className="text-xs font-bold text-slate-400">{order.time}</p>
                                </div>
                            </div>
                            <div className="mb-6">
                                <Badge className={`px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest ${order.statusColor}`}>
                                    {order.statusText}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <div className="grid lg:grid-cols-3 gap-10">
                                {/* Mahsulotlar */}
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">Mahsulotlar</span>
                                    <div className="space-y-4">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <img src={item.img} className="w-12 h-12 rounded-xl object-cover shadow-sm bg-slate-50" alt={item.name} />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">{item.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400">{item.qty} dona x {item.price.split(' ')[0]} UZS</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Ma'lumotlar */}
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">Ma'lumotlar</span>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400 font-medium tracking-tight">Umumiy summa:</span>
                                            <span className="text-slate-900 font-black">{order.financials.total}</span>
                                        </div>
                                        {order.financials.commission && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400 font-medium tracking-tight">Platforma komissiyasi (10%):</span>
                                                <span className="text-rose-500 font-bold">{order.financials.commission}</span>
                                            </div>
                                        )}
                                        <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                                            <span className="text-slate-900 font-black italic">Sizga to'lanadi:</span>
                                            <span className="text-primary font-black text-lg italic">{order.financials.payable}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Yetkazib berish */}
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">Yetkazib berish</span>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-2">
                                            <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Vaqti:</span>
                                                <span className="text-sm font-bold text-slate-900">{order.delivery.time}</span>
                                            </div>
                                        </div>
                                        {order.delivery.comment && (
                                            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">Sharh:</span>
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed italic opacity-80">
                                                    "{order.delivery.comment}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end gap-3">
                                {order.status === "Kutilmoqda" ? (
                                    <Button className="rounded-xl h-11 px-8 bg-primary hover:bg-primary/90 text-white font-black italic gap-2 transition-all hover:scale-105">
                                        <Play className="w-4 h-4 fill-white" /> Ishga tushirish
                                    </Button>
                                ) : (
                                    <>
                                        <Button variant="outline" className="rounded-xl h-11 px-8 border-slate-200 text-slate-500 font-black italic">
                                            Bekor qilish
                                        </Button>
                                        <Button className="rounded-xl h-11 px-10 bg-blue-600 hover:bg-blue-700 text-white font-black italic gap-2 transition-all hover:scale-105">
                                            <CheckCircle2 className="w-4 h-4" /> Tayyor
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
