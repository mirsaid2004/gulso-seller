import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/features/auth/useAuthStore";

type Step = "phone" | "otp";

const OTP_LENGTH = 6;
const TIMER_DURATION = 59;

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").substring(0, 9);
  const p1 = digits.substring(0, 2);
  const p2 = digits.substring(2, 5);
  const p3 = digits.substring(5, 7);
  const p4 = digits.substring(7, 9);
  if (digits.length > 7) return `${p1} ${p2} ${p3} ${p4}`;
  if (digits.length > 5) return `${p1} ${p2} ${p3}`;
  if (digits.length > 2) return `${p1} ${p2}`;
  return p1;
}

function isPhoneValid(phone: string): boolean {
  return /^\d{2} \d{3} \d{2} \d{2}$/.test(phone);
}

export function useLoginViewModel() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [timerExpired, setTimerExpired] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (step !== "otp" || timerExpired) return;
    if (timeLeft <= 0) { setTimerExpired(true); return; }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [step, timeLeft, timerExpired]);

  // Auto-focus first OTP box when entering OTP step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    }
  }, [step]);

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(formatPhone(value));
    setError(null);
  }, []);

  const handleSendOtp = useCallback(async () => {
    if (!isPhoneValid(phone)) return;
    setError(null);
    setSending(true);
    try {
      await authApi.sendOtp(`+998${phone.replace(/\s/g, "")}`);
      setStep("otp");
      setTimeLeft(TIMER_DURATION);
      setTimerExpired(false);
      setOtp(Array(OTP_LENGTH).fill(""));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xato yuz berdi");
    } finally {
      setSending(false);
    }
  }, [phone]);

  const handleResend = useCallback(async () => {
    if (!timerExpired) return;
    setSending(true);
    setError(null);
    try {
      await authApi.sendOtp(`+998${phone.replace(/\s/g, "")}`);
      setTimeLeft(TIMER_DURATION);
      setTimerExpired(false);
      setOtp(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xato yuz berdi");
    } finally {
      setSending(false);
    }
  }, [phone, timerExpired]);

  const handleOtpChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
        setOtp((prev) => { const next = [...prev]; next[index - 1] = ""; return next; });
      }
    },
    [otp]
  );

  const handleVerifyOtp = useCallback(async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) return;
    setError(null);
    setVerifying(true);
    try {
      const res = await authApi.verifyOtp(`+998${phone.replace(/\s/g, "")}`, code);
      setAuth(res.data);
      navigate("/products", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noto'g'ri kod");
      setOtp(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  }, [otp, phone, setAuth, navigate]);

  const handleBack = useCallback(() => {
    setStep("phone");
    setError(null);
    setOtp(Array(OTP_LENGTH).fill(""));
  }, []);

  const formatTime = (secs: number) =>
    `${Math.floor(secs / 60).toString().padStart(2, "0")}:${(secs % 60).toString().padStart(2, "0")}`;

  return {
    step,
    phone,
    otp,
    otpRefs,
    error,
    sending,
    verifying,
    timeLeft,
    timerExpired,
    isPhoneValid: isPhoneValid(phone),
    otpFilled: otp.join("").length === OTP_LENGTH,
    formattedTime: formatTime(timeLeft),
    handlePhoneChange,
    handleSendOtp,
    handleResend,
    handleOtpChange,
    handleOtpKeyDown,
    handleVerifyOtp,
    handleBack,
  };
}
