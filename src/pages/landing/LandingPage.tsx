import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher"
import { ShoppingBag, Truck, BarChart3, Users, Zap, Globe, Share2, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import heroLaptop from "@/assets/images/hero-laptop.png"
import workingScene from "@/assets/images/working-scene.png"

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true }
}

export default function LandingPage() {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFDFD] font-sans selection:bg-primary/10">
            {/* Navigation */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b"
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a className="flex items-center gap-2" href="#">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-extrabold tracking-tight text-foreground uppercase">Gulso Seller</span>
                    </a>
                    <nav className="hidden md:flex gap-8 lg:gap-10 items-center">
                        {(["features", "howItWorks", "pricing", "help"] as const).map((key) => (
                            <a key={key} className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider" href={`#${key}`}>
                                {t(`landing.nav.${key}`)}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <Button
                            className="rounded-full px-5 h-9 text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                            onClick={() => window.location.href = '/login'}
                        >
                            {t("landing.nav.goToPanel")}
                        </Button>
                    </div>
                </div>
            </motion.header>

            <main className="flex-1 pt-16">
                {/* Hero */}
                <section className="relative overflow-hidden py-12 lg:py-24 px-6">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col space-y-6"
                        >
                            <Badge variant="secondary" className="w-fit py-1 px-3 bg-primary/5 text-primary border-none text-[9px] uppercase tracking-[0.25em] font-black">
                                <Zap className="w-3 h-3 mr-2 text-primary" /> {t("landing.hero.badge")}
                            </Badge>
                            <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-[1.1] text-[#1A1A1A]">
                                {t("landing.hero.title1")}{" "}
                                <span className="text-primary italic">{t("landing.hero.title2")}</span>{" "}
                                {t("landing.hero.title3")}
                            </h1>
                            <p className="text-base text-[#666666] leading-relaxed max-w-lg opacity-90">
                                {t("landing.hero.description")}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <Button size="lg" className="rounded-xl h-12 px-6 text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                    {t("landing.hero.startSelling")}
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-xl h-12 px-6 text-sm font-bold border-[#E5E5E5] hover:bg-secondary/50 active:scale-95 transition-all">
                                    {t("landing.hero.learnMore")}
                                </Button>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative group flex justify-center"
                        >
                            <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
                            <img
                                src={heroLaptop}
                                alt="Gulso Admin Dashboard"
                                className="relative rounded-[2rem] shadow-2xl border border-black/5 w-full max-w-[400px] transform group-hover:translate-y-[-5px] transition-transform duration-500"
                            />
                        </motion.div>
                    </div>
                </section>

                {/* Benefits */}
                <section id="features" className="py-20 bg-white px-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.div {...fadeIn as any} className="text-center space-y-3 mb-16">
                            <span className="text-primary text-[9px] uppercase tracking-[0.5em] font-black italic">{t("landing.benefits.eyebrow")}</span>
                            <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-[#1A1A1A]">{t("landing.benefits.title")}</h2>
                            <p className="text-sm text-[#666666] max-w-xl mx-auto opacity-80">{t("landing.benefits.description")}</p>
                        </motion.div>
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-3 gap-6"
                        >
                            {([
                                { icon: Truck, key: "logistics" },
                                { icon: Users, key: "customers" },
                                { icon: BarChart3, key: "analytics" },
                            ] as const).map(({ icon: Icon, key }) => (
                                <motion.div key={key} variants={fadeIn} className="group p-8 rounded-[2rem] bg-[#FDFDFD] border border-black/5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">{t(`landing.benefits.${key}.title`)}</h3>
                                    <p className="text-sm text-[#666666] leading-relaxed opacity-85">{t(`landing.benefits.${key}.desc`)}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* How it works */}
                <section id="howItWorks" className="py-20 px-6 bg-[#F9F9F9]">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-10">
                            <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-[#1A1A1A]">{t("landing.howItWorks.title")}</h2>
                            <div className="space-y-8">
                                {(["step1", "step2", "step3"] as const).map((step, idx) => (
                                    <motion.div key={step} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className="flex gap-6 group">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base shadow-md shadow-primary/15 group-hover:scale-110 transition-transform">
                                            {idx + 1}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-bold text-[#1A1A1A]">{t(`landing.howItWorks.${step}.title`)}</h4>
                                            <p className="text-sm text-[#666666] leading-relaxed italic opacity-80">{t(`landing.howItWorks.${step}.desc`)}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative flex justify-center">
                            <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-2xl" />
                            <img src={workingScene} alt="Working scene" className="relative rounded-[2.5rem] shadow-xl border border-black/5 w-full max-w-[400px]" />
                        </motion.div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-12 bg-primary transform -skew-y-1 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 skew-y-1 flex flex-wrap justify-center lg:justify-between items-center gap-8 text-white">
                        {([
                            { val: "10K+", key: "sellers" },
                            { val: "500K+", key: "buyers" },
                            { val: "24/7", key: "support" },
                            { val: "100+", key: "delivery" },
                        ] as const).map((stat, idx) => (
                            <motion.div key={stat.key} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }} className="text-center group min-w-[150px]">
                                <div className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform">{stat.val}</div>
                                <div className="text-[10px] text-white/70 font-black tracking-[0.2em] uppercase">{t(`landing.stats.${stat.key}`)}</div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.div {...fadeIn as any} className="relative rounded-[2.5rem] bg-[#14141A] p-12 lg:py-16 overflow-hidden text-center max-w-4xl mx-auto">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(242,102,34,0.1),transparent_50%)]" />
                            <div className="relative z-10 space-y-8">
                                <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-white italic">{t("landing.cta.title")}</h2>
                                <p className="text-[#A1A1AA] text-base max-w-xl mx-auto opacity-70">{t("landing.cta.description")}</p>
                                <div className="flex flex-wrap justify-center gap-4 pt-2">
                                    <Button size="lg" className="rounded-xl h-12 px-8 text-sm font-bold shadow-xl shadow-primary/10 active:scale-95 transition-all">
                                        {t("landing.cta.start")}
                                    </Button>
                                    <Button size="lg" variant="outline" className="rounded-xl h-12 px-8 text-sm font-bold border-white/10 text-white hover:bg-white/5 active:scale-95 transition-all">
                                        {t("landing.cta.contact")}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-10 border-t px-6 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                        <div className="w-7 h-7 bg-primary rounded flex items-center justify-center text-white">
                            <ShoppingBag className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-black tracking-tight text-foreground uppercase">Gulso Seller</span>
                    </div>
                    <nav className="flex gap-8">
                        {(["privacy", "terms", "partnership"] as const).map((key) => (
                            <a key={key} className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest" href="#">
                                {t(`landing.footer.${key}`)}
                            </a>
                        ))}
                    </nav>
                    <div className="flex gap-2">
                        {[Share2, MessageSquare, Globe].map((Icon, idx) => (
                            <Button key={idx} variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-primary/5 hover:text-primary transition-all">
                                <Icon className="h-4 w-4" />
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="text-center pt-8 text-[9px] text-muted-foreground font-bold uppercase tracking-[0.3em] opacity-40">
                    {t("landing.footer.copyright")}
                </div>
            </footer>
        </div>
    )
}
