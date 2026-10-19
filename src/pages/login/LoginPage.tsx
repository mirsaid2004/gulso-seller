import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLoginViewModel } from "./useLoginViewModel";

export default function LoginPage() {
  const vm = useLoginViewModel();

  return (
    <div className="fixed inset-0 bg-[#FDFDFD] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <img src="/logo.svg" alt="Gulso" className="w-10 h-10" />
            <span className="text-xl font-black tracking-tight uppercase">Gulso Seller</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {vm.step === "phone" ? (
              <PhoneStep vm={vm} />
            ) : (
              <OtpStep vm={vm} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneStep({ vm }: { vm: ReturnType<typeof useLoginViewModel> }) {
  const { t } = useTranslation();
  return (
    <>
      <h1 className="text-2xl font-black text-slate-900 mb-1">{t("login.title")}</h1>
      <p className="text-sm text-slate-400 font-medium mb-8">{t("login.subtitle")}</p>

      <form
        onSubmit={(e) => { e.preventDefault(); vm.handleSendOtp(); }}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
            {t("login.phoneLabel")}
          </label>
          <div className="relative flex items-center group">
            <div className="absolute left-0 top-0 bottom-0 w-20 flex items-center justify-center bg-slate-50 border-r border-slate-200 rounded-l-xl z-10 transition-colors group-focus-within:border-primary/50 group-focus-within:bg-primary/5">
              <span className="text-slate-600 font-bold text-sm">+998</span>
            </div>
            <input
              type="tel"
              value={vm.phone}
              onChange={(e) => vm.handlePhoneChange(e.target.value)}
              placeholder={t("login.phonePlaceholder")}
              className="w-full pl-24 pr-4 h-14 rounded-xl border border-slate-200 bg-slate-50 text-lg font-black tracking-widest text-slate-900 placeholder:text-slate-300 placeholder:font-medium placeholder:tracking-normal focus:outline-none focus:border-primary/40 focus:bg-white transition-all"
            />
          </div>
          <p className="text-xs font-medium text-slate-400 text-center mt-1">
            {t("login.phoneHint")}
          </p>
        </div>

        {vm.error && <ErrorBox message={vm.error} />}

        <button
          type="submit"
          disabled={!vm.isPhoneValid || vm.sending}
          className="w-full h-13 rounded-xl text-white text-sm font-black shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
          style={{ background: "linear-gradient(135deg, #e7236a 0%, #c41d5e 100%)" }}
        >
          {vm.sending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {t("login.sendCode")}
        </button>
      </form>
    </>
  );
}

function OtpStep({ vm }: { vm: ReturnType<typeof useLoginViewModel> }) {
  const { t } = useTranslation();
  return (
    <>
      <button
        onClick={vm.handleBack}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {t("common.back")}
      </button>

      <h1 className="text-2xl font-black text-slate-900 mb-1">{t("otp.title")}</h1>
      <p className="text-sm text-slate-400 font-medium mb-8">
        <span className="font-black text-slate-700">+998 {vm.phone}</span>{" "}
        {t("otp.subtitle", { phone: "" }).replace("{{phone}} ", "")}
      </p>

      <fieldset className="flex justify-between gap-2 mb-6">
        {vm.otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { vm.otpRefs.current[i] = el; }}
            value={digit}
            onChange={(e) => vm.handleOtpChange(i, e.target.value)}
            onKeyDown={(e) => vm.handleOtpKeyDown(i, e)}
            type="number"
            maxLength={1}
            className="w-full h-14 text-center text-xl font-black rounded-xl border-2 border-slate-200 focus:border-primary bg-slate-50 focus:bg-white outline-none transition-all text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        ))}
      </fieldset>

      {vm.error && <ErrorBox message={vm.error} />}

      <div className="flex items-center justify-center mb-6">
        {!vm.timerExpired ? (
          <span className="text-sm font-bold text-primary bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
            {vm.formattedTime}
          </span>
        ) : (
          <button
            onClick={vm.handleResend}
            disabled={vm.sending}
            className="text-sm font-bold text-primary hover:underline disabled:opacity-50"
          >
            {vm.sending ? <Loader2 className="w-4 h-4 animate-spin inline" /> : t("otp.resend")}
          </button>
        )}
      </div>

      <button
        onClick={vm.handleVerifyOtp}
        disabled={!vm.otpFilled || vm.verifying}
        className="w-full h-13 rounded-xl text-white text-sm font-black shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #e7236a 0%, #c41d5e 100%)" }}
      >
        {vm.verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {t("otp.verify")}
      </button>

      <p className="text-center text-[11px] text-slate-400 font-medium mt-5">
        {t("otp.demoHint")}: <span className="font-black text-slate-700">123456</span>
      </p>
    </>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <p className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5">
      {message}
    </p>
  );
}
