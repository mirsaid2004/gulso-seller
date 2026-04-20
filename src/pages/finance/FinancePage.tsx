import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Bell, Search, Info, Landmark, TrendingUp, SlidersHorizontal, Download } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"

const transactions = [
    { id: "#10254", date: "24.05.2024", summa: "150,000 so'm", komissiya: "15,000 so'm", status: "To'langan" },
    { id: "#10248", date: "23.05.2024", summa: "250,000 so'm", komissiya: "25,000 so'm", status: "Kutilmoqda" },
    { id: "#10241", date: "22.05.2024", summa: "120,000 so'm", komissiya: "12,000 so'm", status: "To'langan" },
]

export default function FinancePage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 italic">Moliya</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Qidiruv..." className="pl-9 w-64 bg-slate-50 border-none rounded-xl" />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 relative">
                        <Bell className="w-5 h-5 text-slate-600" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                    </Button>
                    <Avatar className="w-10 h-10 border-2 border-white shadow-sm cursor-pointer border-emerald-500">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>DK</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white rounded-[2rem] p-4">
                    <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">Umumiy daromad</span>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none font-bold">
                            <TrendingUp className="w-3 h-3 mr-1" /> +12%
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">4,200,000 so'm</div>
                        <p className="text-xs text-slate-400">So'nggi 30 kunlik ko'rsatkich</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white rounded-[2rem] p-4">
                    <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">Gulso komissiyasi (10%)</span>
                        <Info className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">420,000 so'm</div>
                        <p className="text-xs text-slate-400">Platforma xizmat haqi</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-primary rounded-[2rem] p-4 text-white">
                    <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
                        <span className="text-sm font-medium opacity-80">To'lanadigan summa</span>
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <Landmark className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="text-3xl font-black mb-1 tracking-tight">3,780,000 so'm</div>
                        <p className="text-xs opacity-70">Yechib olish uchun tayyor</p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Table */}
            <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
                <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900">Sotuvlar jadvali</CardTitle>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="rounded-xl gap-2 font-bold text-slate-600 border-slate-100 italic">
                            <SlidersHorizontal className="w-4 h-4" /> Saralash
                        </Button>
                        <Button variant="secondary" size="sm" className="rounded-xl gap-2 font-bold text-primary italic">
                            <Download className="w-4 h-4" /> Eksport
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <Table>
                        <TableHeader className="[&_tr]:border-none">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="uppercase text-[10px] font-black tracking-widest text-slate-400">Sana</TableHead>
                                <TableHead className="uppercase text-[10px] font-black tracking-widest text-slate-400">Buyurtma raqami</TableHead>
                                <TableHead className="uppercase text-[10px] font-black tracking-widest text-slate-400">Summa</TableHead>
                                <TableHead className="uppercase text-[10px] font-black tracking-widest text-slate-400">Komissiya</TableHead>
                                <TableHead className="uppercase text-[10px] font-black tracking-widest text-slate-400">To'lov holati</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((t) => (
                                <TableRow key={t.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="text-slate-500 font-medium py-6 px-0">{t.date}</TableCell>
                                    <TableCell className="font-black text-slate-900 py-6">{t.id}</TableCell>
                                    <TableCell className="text-slate-500 font-medium py-6">{t.summa}</TableCell>
                                    <TableCell className="text-slate-400 italic py-6">{t.komissiya}</TableCell>
                                    <TableCell className="py-6">
                                        <Badge className={`rounded-lg px-3 py-1 font-bold text-[10px] shadow-sm ${t.status === "To'langan"
                                                ? "bg-emerald-50 text-emerald-600 border-none"
                                                : "bg-amber-50 text-amber-600 border-none"
                                            }`}>
                                            {t.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex items-center justify-between mt-6">
                        <span className="text-xs text-slate-400 italic">Jami: 3 ta buyurtma</span>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-slate-400 text-xs">Oldingi</Button>
                            <Button size="sm" className="w-8 h-8 p-0 rounded-lg bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">1</Button>
                            <Button variant="ghost" size="sm" className="text-slate-400 text-xs">Keyingi</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Withdrawal CTA */}
            <Card className="border-none shadow-xl bg-[#0F1117] rounded-[2.5rem] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(242,102,34,0.1),transparent_60%)]" />
                <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-white italic">Mablag'larni yechib olish</h2>
                        <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                            Yig'ilgan mablag'larni bank kartangizga yoki hisob raqamingizga o'tkazish uchun so'rov qoldiring.
                        </p>
                    </div>
                    <Button size="lg" className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-base shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 italic">
                        Yechib olish
                    </Button>
                </div>
            </Card>
        </div>
    )
}
