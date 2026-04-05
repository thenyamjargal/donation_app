"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Instagram,
  Youtube,
  Heart,
  MessageCircle,
  Check,
  ArrowRight,
  Coffee,
  EyeOff,
  User,
  AlertCircle,
  Loader2,
  Facebook,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "@/components/theme-picker";

const SUPPORT_AMOUNTS = [
  { amount: 5000, label: "5,000₮", coffee: 1 },
  { amount: 10000, label: "10,000₮", coffee: 2 },
  { amount: 25000, label: "25,000₮", coffee: 5 },
  { amount: 50000, label: "50,000₮", coffee: 10 },
];

type RecentSupporter = {
  name: string;
  message: string;
  amount: number;
  isAnonymous: boolean;
  createdAt: string;
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Саяхан";
  if (minutes < 60) return `${minutes} минутын өмнө`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} цагийн өмнө`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} өдрийн өмнө`;
  const weeks = Math.floor(days / 7);
  return `${weeks} долоо хоногийн өмнө`;
}

const BANK_APPS = [
  { name: "Khan Bank", color: "#00A651", short: "KB" },
  { name: "Golomt", color: "#E31837", short: "GL" },
  { name: "TDB", color: "#003366", short: "TD" },
  { name: "Хас банк", color: "#F7941D", short: "ХБ" },
  { name: "State Bank", color: "#1E3A8A", short: "SB" },
  { name: "M Bank", color: "#7C3AED", short: "MB" },
];

type DeepLink = {
  name: string;
  description: string;
  logo: string;
  link: string;
};

export default function SupportPage() {
  const [selectedAmount, setSelectedAmount] = useState(SUPPORT_AMOUNTS[1]);
  const [message, setMessage] = useState("");
  const [supporterName, setSupporterName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<
    "qr" | "processing" | "success"
  >("qr");
  const [mounted, setMounted] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [qrImage, setQrImage] = useState<string>("");
  const [deepLinks, setDeepLinks] = useState<DeepLink[]>([]);
  const [donationId, setDonationId] = useState<string>("");
  const [statusToken, setStatusToken] = useState<string>("");
  const [paymentError, setPaymentError] = useState<string>("");
  const [isChecking, setIsChecking] = useState(false);
  const [notPaidYet, setNotPaidYet] = useState(false);
  const [recentSupporters, setRecentSupporters] = useState<RecentSupporter[]>(
    [],
  );
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const theme = useTheme();

  const fetchSupporters = useCallback(async () => {
    try {
      const res = await fetch("/api/donations/recent");
      const data = await res.json();
      if (data.supporters) setRecentSupporters(data.supporters);
    } catch { }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchSupporters();
  }, [fetchSupporters]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const startPolling = useCallback((id: string, token: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    const startTime = Date.now();
    const TIMEOUT = 5 * 60 * 1000; // 5 minutes

    pollingRef.current = setInterval(async () => {
      if (Date.now() - startTime > TIMEOUT) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        return;
      }

      try {
        const res = await fetch(
          `/api/donations/status?donationId=${id}&statusToken=${token}`,
        );
        const data = await res.json();

        if (data.status === "paid") {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setPaymentStep("success");
          fetchSupporters();
        } else if (data.status === "failed") {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setPaymentError("Төлбөр амжилтгүй боллоо");
          setPaymentStep("qr");
        }
      } catch {
        // Ignore polling errors, will retry
      }
    }, 10000); // Poll every 10 seconds
  }, []);

  const handleSupport = async () => {
    setPaymentError("");
    setIsCreatingInvoice(true);
    setShowPayment(true);
    setPaymentStep("qr");

    try {
      const res = await fetch("/api/donations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedAmount.amount,
          creatorSlug: "creator",
          supporterName: isAnonymous ? undefined : supporterName,
          message,
          isAnonymous,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invoice creation failed");
      }

      setQrImage(data.qrImage);
      setDeepLinks(data.deepLinks || []);
      setDonationId(data.donationId);
      setStatusToken(data.statusToken);

      // Start polling for payment status
      startPolling(data.donationId, data.statusToken);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Алдаа гарлаа";
      setPaymentError(msg);
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const checkPaymentManually = async () => {
    if (!donationId) return;
    setIsChecking(true);
    setNotPaidYet(false);

    try {
      const res = await fetch(
        `/api/donations/status?donationId=${donationId}&statusToken=${statusToken}`,
      );
      const data = await res.json();

      if (data.status === "paid") {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setPaymentStep("success");
        fetchSupporters();
      } else {
        setNotPaidYet(true);
        setTimeout(() => setNotPaidYet(false), 4000);
      }
    } catch {
      setNotPaidYet(true);
      setTimeout(() => setNotPaidYet(false), 4000);
    } finally {
      setIsChecking(false);
    }
  };

  const closePayment = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setShowPayment(false);
    setPaymentStep("qr");
    setQrImage("");
    setDeepLinks([]);
    setDonationId("");
    setStatusToken("");
    setPaymentError("");
    setNotPaidYet(false);
    setIsChecking(false);
    if (paymentStep === "success") {
      setMessage("");
      setSupporterName("");
      setSelectedAmount(SUPPORT_AMOUNTS[1]);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] overflow-x-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-125 h-125 bg-linear-to-bl from-orange-200/50 via-amber-100/30 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute top-1/2 -left-40 w-100 h-100 bg-linear-to-tr from-blue-100/30 via-indigo-50/20 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "1s" }}
        />
        <div
          className="absolute -bottom-20 right-1/4 w-75 h-75 bg-linear-to-t from-rose-100/40 via-pink-50/20 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "2s" }}
        />
      </div>

      <div
        suppressHydrationWarning
        className={`relative transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        {/* Minimal Header */}
        <header className="px-5 py-5 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Logo"
                width={180}
                height={60}
                className="w-[180px] h-auto object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-1.5">
              {process.env.NEXT_PUBLIC_YOUTUBE_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xlflex items-center justify-center hover:bg-white hover:scale-105 hover:shadow-lg transition-all duration-300"
                  style={{
                    background: '#ff0000',
                  }}
                >
                  <Youtube className="w-4.5 h-4.5 text-white" />
                </a>
              )}
              {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:scale-105 hover:shadow-lg transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  }}
                >
                  <Instagram className="w-4.5 h-4.5 text-white" />
                </a>
              )}
              {process.env.NEXT_PUBLIC_FACEBOOK_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:scale-105 hover:shadow-lg transition-all duration-300"
                  style={{
                    background: '#1877F2',
                  }}
                >
                  <Facebook className="w-4.5 h-4.5 text-white" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Two Column Layout */}
        <div className="px-5 max-w-6xl mx-auto lg:grid lg:grid-cols-[1fr_380px] lg:gap-6 lg:items-start">
          {/* Left Column */}
          <div>
            {/* Hero - Profile Section - Compact Horizontal */}
            <section className="pt-6 pb-4">
              <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xl shadow-stone-200/30 p-4 sm:p-5 overflow-hidden">
                <div className="flex items-center gap-4 sm:gap-5">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className="absolute inset-0 rounded-full blur-lg opacity-20"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <Avatar className="relative w-16 h-16 sm:w-20 sm:h-20 ring-2 ring-white shadow-lg">
                      <AvatarImage
                        src="/profile.jpg"
                        alt="Profile"
                        className="object-cover"
                      />
                      <AvatarFallback
                        className="text-xl sm:text-2xl text-white font-bold"
                        style={{ backgroundColor: theme.primary }}
                      >
                        БС
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                      <Check
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                        strokeWidth={3}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-lg sm:text-xl font-bold text-stone-900 truncate">
                      Э.Нямжаргал
                    </h1>
                    <p className="text-sm text-stone-500 mt-0.5 line-clamp-5">
                      Мэдээллийн технологийн зөвлөгөө зөвлөмжүүд, ухаалаг утас хэрэглэх аргууд, хиймэл оюун ухааны талаар хичээл, заавар гэх мэт сонирхолтой бичлэгүүд бүтээж намайг үзэж буй хүмүүсийн мэдлэгт хувь нэмрээ багахан оруулахыг зорьдог. Таны дэмжлэг дараа дараагийн бичлэгүүдийг илүү чанартай болгоход зориулагдах болно.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {process.env.NEXT_PUBLIC_YOUTUBE_URL && (
                        <Badge
                          variant="secondary"
                          className="gap-1 px-2 py-0.5 text-xs rounded-full bg-stone-100/80"
                        >
                          <Youtube className="w-3 h-3" />
                          YouTube
                        </Badge>
                      )}
                      {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
                        <Badge
                          variant="secondary"
                          className="gap-1 px-2 py-0.5 text-xs rounded-full bg-stone-100/80"
                        >
                          <Instagram className="w-3 h-3" />
                          Instagram
                        </Badge>
                      )}
                      {process.env.NEXT_PUBLIC_FACEBOOK_URL && (
                        <Badge
                          variant="secondary"
                          className="gap-1 px-2 py-0.5 text-xs rounded-full bg-stone-100/80"
                        >
                          <Facebook className="w-3 h-3" />
                          Facebook
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Support Card - The Main CTA */}
            <section className="pb-8">
              <div className="bg-white rounded-4xl shadow-xl shadow-stone-200/40 border border-stone-100 overflow-hidden">
                {/* Compact Header with gradient */}
                <div
                  className="relative px-6 py-5 overflow-hidden transition-colors duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  }}
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-white">
                          Манай контенуудыг дэмжээрэй
                        </h2>
                        <p className="text-xs text-stone-400">
                          Buy Me a Coffee
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Amount Selection - More visual */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SUPPORT_AMOUNTS.map((option) => (
                        <button
                          key={option.amount}
                          onClick={() => setSelectedAmount(option)}
                          className={`relative p-3 sm:p-3 rounded-2xl border-2 transition-all duration-300 ${selectedAmount.amount === option.amount
                            ? "scale-[1.02]"
                            : "border-stone-200 bg-stone-50/50 hover:border-stone-300 hover:bg-white hover:shadow-md"
                            }`}
                          style={
                            selectedAmount.amount === option.amount
                              ? {
                                backgroundColor: theme.primary,
                                borderColor: theme.primary,
                                boxShadow: `0 20px 25px -5px ${theme.primary}33`,
                              }
                              : {}
                          }
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-0.5">
                              {Array.from({
                                length: Math.min(option.coffee, 3),
                              }).map((_, i) => (
                                <Coffee
                                  key={i}
                                  className={`w-3.5 h-3.5 ${selectedAmount.amount === option.amount ? "text-amber-400" : "text-amber-500/70"}`}
                                />
                              ))}
                              {option.coffee > 3 && (
                                <span
                                  className={`text-[10px] font-bold ml-0.5 ${selectedAmount.amount === option.amount ? "text-amber-400" : "text-amber-500/70"}`}
                                >
                                  +{option.coffee - 3}
                                </span>
                              )}
                            </div>
                            <span
                              className={`font-bold text-sm ${selectedAmount.amount === option.amount
                                ? "text-white"
                                : "text-stone-700"
                                }`}
                            >
                              {option.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Support - Name & Anonymous */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                      <User
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isAnonymous ? "text-stone-300" : "text-stone-400"}`}
                      />
                      <Input
                        placeholder="Таны нэр"
                        value={supporterName}
                        onChange={(e) => setSupporterName(e.target.value)}
                        disabled={isAnonymous}
                        className={`w-full h-14 pl-12 pr-4 text-base rounded-xl border-stone-200 bg-stone-50/80 focus:bg-white transition-all ${isAnonymous ? "opacity-40 line-through" : ""
                          }`}
                      />
                    </div>
                    <button
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`h-14 px-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2.5 font-medium whitespace-nowrap ${isAnonymous
                        ? "text-white"
                        : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                        }`}
                      style={
                        isAnonymous
                          ? {
                            backgroundColor: theme.primary,
                            borderColor: theme.primary,
                          }
                          : {}
                      }
                    >
                      <EyeOff className="w-4 h-4" />
                      Нэрээ нуух
                    </button>
                  </div>

                  {/* Message - Collapsible feel */}
                  <div className="mb-6">
                    <Textarea
                      placeholder="Зурвас үлдээх (заавал биш)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={2}
                      className="resize-none rounded-xl border-stone-200 bg-stone-50/80 focus:bg-white transition-all"
                    />
                  </div>

                  {/* The Big CTA Button */}
                  <Button
                    onClick={handleSupport}
                    className="group w-full h-14 text-base font-bold rounded-2xl text-white border-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl relative overflow-hidden hover:brightness-110"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                      boxShadow: `0 25px 50px -12px ${theme.primary}40`,
                    }}
                    size="lg"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 cursor-pointer">
                      <Coffee className="w-5 h-5" />
                      {selectedAmount.label} илгээх
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                </div>
              </div>
            </section>
          </div>
          {/* End Left Column */}

          {/* Right Column - Recent Supporters */}
          <section className="pb-20 lg:pt-6 lg:pb-8 lg:sticky lg:top-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-stone-400" />
                <h3 className="text-lg font-bold text-stone-900">
                  Сүүлийн дэмжигчид
                </h3>
              </div>
              <div className="flex-1 h-px bg-linear-to-r from-stone-200 to-transparent" />
            </div>

            <div
              suppressHydrationWarning
              className="space-y-3 max-h-[593px] overflow-y-auto supporters-scroll pr-1"
            >
              {recentSupporters.length === 0 ? (
                <div className="text-center py-8 text-stone-400">
                  <Heart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Одоогоор дэмжигч байхгүй байна</p>
                  <p className="text-xs mt-1">Та эхний дэмжигч болоорой!</p>
                </div>
              ) : (
                recentSupporters.map((supporter, index) => (
                  <div
                    key={index}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/60 p-5 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-0.5 hover:border-stone-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="w-11 h-11 ring-2 ring-white shadow-md">
                        <AvatarFallback
                          className={`text-sm font-bold ${supporter.isAnonymous
                            ? "bg-stone-100 text-stone-400"
                            : "bg-linear-to-br from-amber-100 to-orange-100 text-amber-700"
                            }`}
                        >
                          {supporter.isAnonymous
                            ? "?"
                            : supporter.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-800">
                              {supporter.isAnonymous
                                ? "Нууц дэмжигч"
                                : supporter.name}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-stone-900 bg-stone-100 px-3 py-1 rounded-full">
                            {Array.from({
                              length: Math.min(
                                Math.ceil(supporter.amount / 10000),
                                3,
                              ),
                            }).map((_, i) => (
                              <Coffee
                                key={i}
                                className="w-3.5 h-3.5 text-amber-500 fill-amber-500" // Added fill for a "full" look
                              />
                            ))}
                          </span>
                        </div>
                        {supporter.message && (
                          <p className="mt-2 text-stone-600 leading-relaxed">
                            {supporter.message}
                          </p>
                        )}
                        {/* <p className="mt-2 text-xs text-stone-400">{timeAgo(supporter.createdAt)}</p> */}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
        {/* End Two Column Layout */}

        {/* Minimal Footer */}
        <footer className="px-5 py-8 border-t border-stone-200/60">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="font-bold text-stone-600 text-sm">
                Developed by <Link href="https://instagram.com/sododtechtips" target="_blank">@sododtechtips</Link>
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Payment Modal - Sleek & Fast */}
      <Dialog open={showPayment} onOpenChange={closePayment}>
        <DialogContent
          className="w-[calc(100%-2rem)] sm:max-w-md p-0 overflow-hidden border-0 rounded-3xl sm:rounded-4xl shadow-2xl mx-auto max-h-[90vh] flex flex-col"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">QPay төлбөр</DialogTitle>

          {paymentStep === "qr" && (
            <div className="flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div
                className="relative px-6 pt-6 pb-5 text-white overflow-hidden transition-colors duration-300 shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                }}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">QPay төлбөр</h3>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold">
                        {selectedAmount.amount.toLocaleString()}₮
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto overscroll-contain">
                {/* Error message */}
                {paymentError && (
                  <div className="text-center p-3 rounded-xl bg-red-50 text-red-600 text-sm">
                    {paymentError}
                  </div>
                )}

                {/* QR Code - Real from QPay */}
                <div className="flex justify-center">
                  <div className="relative p-2 sm:p-3 bg-white rounded-2xl shadow-lg border border-stone-100">
                    {isCreatingInvoice || !qrImage ? (
                      <div className="w-32 sm:w-40 h-32 sm:h-40 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-8 h-8 mx-auto mb-2 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
                          <p className="text-xs text-stone-400">
                            QR код ачааллаж байна...
                          </p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={`data:image/png;base64,${qrImage}`}
                        alt="QPay QR Code"
                        className="w-32 sm:w-40 h-32 sm:h-40 rounded-xl"
                      />
                    )}
                    <p className="text-center text-[11px] text-stone-400 mt-2 font-medium">
                      QR кодыг уншуулна уу
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-stone-400 font-medium">
                      эсвэл апп сонгох
                    </span>
                  </div>
                </div>

                {/* Bank Apps - from QPay deep links or fallback */}
                <div className="grid grid-cols-4 gap-1.5">
                  {deepLinks.length > 0
                    ? deepLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.link}
                        className="flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-all duration-200 hover:shadow-md active:scale-95"
                      >
                        {link.logo ? (
                          <img
                            src={link.logo}
                            alt={link.name}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg shadow"
                          />
                        ) : (
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-stone-300 flex items-center justify-center text-white font-bold text-[10px] shadow">
                            {link.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-[9px] sm:text-[10px] text-stone-500 font-medium truncate w-full text-center leading-tight">
                          {link.description || link.name}
                        </span>
                      </a>
                    ))
                    : BANK_APPS.map((bank) => (
                      <div
                        key={bank.name}
                        className="flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-xl bg-stone-50 border border-transparent opacity-50"
                      >
                        <div
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white font-bold text-[10px] shadow"
                          style={{ backgroundColor: bank.color }}
                        >
                          {bank.short}
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-stone-500 font-medium truncate w-full text-center">
                          {bank.name}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Not paid yet notification */}
                {notPaidYet && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Төлбөр төлөгдөөгүй байна
                      </p>
                      <p className="text-xs text-amber-600 mt-0.5">
                        Банкны апп-аар төлбөрөө баталгаажуулна уу
                      </p>
                    </div>
                  </div>
                )}

                {/* Check Payment Button */}
                <Button
                  onClick={checkPaymentManually}
                  disabled={!donationId || isCreatingInvoice || isChecking}
                  className="w-full h-12 rounded-xl font-semibold text-white hover:brightness-110 transition-all"
                  style={{ backgroundColor: theme.primary }}
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Шалгаж байна...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Төлбөр шалгах
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {paymentStep === "processing" && (
            <div className="py-20 px-6 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-stone-200" />
                <div className="absolute inset-0 rounded-full border-4 border-stone-900 border-t-transparent animate-spin" />
              </div>
              <p className="text-xl font-bold text-stone-800">
                Шалгаж байна...
              </p>
              <p className="text-stone-500 mt-2">Түр хүлээнэ үү</p>
            </div>
          )}

          {paymentStep === "success" && (
            <div className="py-16 px-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-emerald-100 rounded-full animate-ping opacity-20" />
                </div>
                <div className="relative w-24 h-24 mx-auto mb-6 bg-linear-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30">
                  <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-stone-900">
                Баярлалаа!
              </h3>
              <p className="text-stone-600 mt-2 mb-8">
                Таны дэмжлэг амжилттай илгээгдлээ
              </p>
              <Button
                onClick={closePayment}
                className="h-12 px-8 rounded-xl font-bold text-white hover:brightness-110 transition-all"
                style={{ backgroundColor: theme.primary }}
              >
                Хаах
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
