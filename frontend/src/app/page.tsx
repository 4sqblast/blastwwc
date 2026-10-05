"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  HandHeart,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";

import api from "@/lib/api";
import { Merch, CartItem } from "@/types";
import { upload } from "@imagekit/javascript";
import imageCompression from "browser-image-compression";
import { subscribeToPush } from "@/lib/push";
import { useRouter } from "next/navigation";

const EventDetails = dynamic(() => import("@/components/EventDetails"), {
  ssr: false,
});
const flyer =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2293.PNG-2MRVZHOgks7uNFlvlwElM0fO5A2z2M.png";
const eventDate = new Date("2026-11-19T18:00:00+01:00");
const gallery = [flyer, flyer, flyer];
const fallbackMerch: Merch[] = [
  {
    id: 1,
    name: "Fresh Oil Tee",
    adult_price: 12000,
    child_price: 9000,
    image: flyer,
    color: "blue",
  },
  {
    id: 2,
    name: "Blast Keepsake",
    adult_price: 15000,
    child_price: 11000,
    image: flyer,
    color: "black",
  },
  {
    id: 3,
    name: "Word & Worship Tee",
    adult_price: 12000,
    child_price: 9000,
    image: flyer,
    color: "white",
  },
];

const naira = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-[#ffd34b] shadow-[0_0_18px_rgba(255,211,75,.9)]"
    />
  );
}

function FloatingOrb({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-2xl ${className}`}
      animate={{ y: [0, -24, 0], x: [0, 12, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  if (now === null) {
    return (
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-white/15 bg-white/10 px-2 py-3 text-center backdrop-blur-sm"
          >
            <div className="font-display text-2xl font-semibold text-white sm:text-4xl">
              00
            </div>

            <div className="mt-1 text-[9px] uppercase tracking-[0.22em] text-white/60">
              {label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const distance = Math.max(0, eventDate.getTime() - now);

  const values = [
    Math.floor(distance / 86400000),
    Math.floor(distance / 3600000) % 24,
    Math.floor(distance / 60000) % 60,
    Math.floor(distance / 1000) % 60,
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {values.map((value, index) => (
        <div
          key={index}
          className="rounded-xl border border-white/15 bg-white/10 px-2 py-3 text-center backdrop-blur-sm"
        >
          <div className="font-display text-2xl font-semibold text-white sm:text-4xl">
            {String(value).padStart(2, "0")}
          </div>

          <div className="mt-1 text-[9px] uppercase tracking-[0.22em] text-white/60">
            {["Days", "Hours", "Minutes", "Seconds"][index]}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  const { scrollY } = useScroll();
  const heroGlowY = useTransform(scrollY, [0, 900], [0, 220]);
  const heroContentY = useTransform(scrollY, [0, 700], [0, -70]);
  const [merch, setMerch] = useState<Merch[]>(fallbackMerch);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<Merch>(fallbackMerch[0]);
  const [size, setSize] = useState("M");
  const [audience, setAudience] = useState<"Adult" | "Child">("Adult");
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [contact, setContact] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service worker registration failed:", error);
        });
    }
  }, []);

  async function enableNotifications() {
    console.log("clicked");
    try {
      if (typeof window == "undefined") return;
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      const subscription = await subscribeToPush();

      console.log(subscription);

      await api.post("user/push/subscribe/", {
        user_id: userId,
        subscription: subscription.toJSON(),
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    let active = true;
    async function loadMerchandise() {
      try {
        const response = await api.get<Merch[]>("merch/list/");
        if (active && response.data.length) {
          setMerch(response.data);
          setSelected(response.data[0]);
        }
      } catch {
        // Keep the curated fallback collection available if the API is unavailable.
      }
    }
    loadMerchandise();
    return () => {
      active = false;
    };
  }, []);

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText("25666798543");
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy account number:", error);
    }
  };

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          (item.audience === "Adult"
            ? item.product.adult_price
            : item.product.child_price) *
            item.quantity,
        0,
      ),
    [cart],
  );
  const selectedPrice =
    audience === "Adult" ? selected.adult_price : selected.child_price;

  function addToCart() {
    const itemId = selected.id;

    setCart((items) => {
      const existing = items.find(
        (item) =>
          item.id === itemId &&
          item.size === size &&
          item.audience === audience,
      );

      return existing
        ? items.map((item) =>
            item.id === itemId &&
            item.size === size &&
            item.audience === audience
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item,
          )
        : [
            ...items,
            {
              id: itemId,
              product: selected,
              size,
              audience,
              quantity,
              color: selected.color,
            },
          ];
    });

    setCartOpen(true);
  }

  function changeQuantity(id: number, delta: number) {
    setCart((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  }
  useEffect(() => {
    if (gallery.length <= 1) return;

    const timer = window.setInterval(() => {
      setGalleryIndex((current) => (current + 1) % gallery.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [gallery.length]);

  const handleReceiptChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setReceipt(file);
      setReceiptUrl(null);
      setReceiptError(null);
      setIsUploadingReceipt(true);

      console.log(
        "Original receipt size:",
        (file.size / 1024 / 1024).toFixed(2),
        "MB",
      );

      // Compress immediately after selecting the receipt
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        fileType: "image/jpeg",
      });

      console.log(
        "Compressed receipt size:",
        (compressedFile.size / 1024 / 1024).toFixed(2),
        "MB",
      );

      // Get ImageKit authentication parameters
      const authResponse = await fetch("/api/imagekit-auth");

      if (!authResponse.ok) {
        throw new Error("Failed to authenticate with ImageKit");
      }

      const auth = await authResponse.json();

      // Upload compressed image directly to ImageKit
      const result = await upload({
        file: compressedFile,
        fileName: `receipt-${Date.now()}.jpg`,
        token: auth.token,
        signature: auth.signature,
        expire: auth.expire,
        publicKey: auth.publicKey,
        folder: "/receipts",
        useUniqueFileName: true,
      });

      console.log("Receipt uploaded:", result);

      if (!result.url) {
        throw new Error("ImageKit did not return a receipt URL");
      }

      setReceiptUrl(result.url);

      console.log("Receipt URL ready:", result.url);
    } catch (error) {
      console.error("Receipt preparation/upload failed:", error);

      setReceiptUrl(null);
      setReceiptError("Receipt upload failed. Please try again.");
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const handleSubmission = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const userId = localStorage.getItem("user_id");

      if (!userId) {
        throw new Error("User ID not found");
      }

      if (!recipient.trim()) {
        throw new Error("Recipient name is required");
      }

      if (!contact.trim()) {
        throw new Error("Recipient contact is required");
      }

      if (!receipt) {
        throw new Error("Receipt is required");
      }

      if (cart.length === 0) {
        throw new Error("Cart is empty");
      }

      // The receipt should already have been uploaded
      if (isUploadingReceipt) {
        throw new Error("Receipt is still being uploaded");
      }

      if (!receiptUrl) {
        throw new Error("Receipt upload failed");
      }

      const items = cart.map((item) => ({
        merch: item.product.id,
        quantity: item.quantity,
        size: `${item.audience} - ${item.size}`,
        color: item.color || item.product.color || "",
      }));

      // Send JSON instead of FormData.
      // items stays stringified because your Django serializer
      // currently expects a JSON string.
      const response = await api.post("order/create/", {
        user: userId,
        recipient: recipient.trim(),
        contact: contact.trim(),
        receipt: receiptUrl,
        items: JSON.stringify(items),
      });

      console.log("ORDER CREATED:", response.data);

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setCheckoutOpen(false);

        setCart([]);
        setRecipient("");
        setReceipt(null);
        setReceiptUrl(null);
        setReceiptError(null);
        setQuantity(1);
      }, 3000);
    } catch (err: any) {
      console.error("ORDER SUBMISSION FAILED");
      console.error("STATUS:", err.response?.status);
      console.error("DATA:", err.response?.data);
      console.error("MESSAGE:", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f4ed] text-[#172c2a]">
      <ScrollProgress />
      <header className="fixed inset-x-0 top-0 z-20 transition-all duration-500">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-[#102d2b]/25 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100"
        />
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a className="flex items-center gap-3 text-white" href="#top">
            <img
              src="/blast-logo.png"
              alt="Blast"
              className="h-10 w-auto object-contain"
            />
            <span className="hidden text-xs font-semibold uppercase tracking-[0.24em] sm:block">
              Blast 2026
            </span>
          </a>
          <nav className="hidden gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/75 md:flex">
            <a href="#story">The story</a>
            <a href="#merchandise">Merchandise</a>
            <a href="#visit">Visit us</a>
          </nav>
          <button
            type="button"
            onClick={enableNotifications}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-[#173fca] shadow-sm transition hover:bg-[#ffd34b] hover:text-[#173fca]"
          >
            <Bell className="size-4" />
            Stay in the loop
          </button>
          <button
            className="rounded-full bg-white p-2.5 text-[#173fca] transition hover:bg-white/90"
            onClick={() => setCartOpen(true)}
            aria-label="Open shopping cart"
          >
            <span className="relative block">
              <ShoppingBag className="size-5" />

              <span className="absolute -right-2 -top-2 grid min-w-4 h-4 place-items-center rounded-full bg-[#173fca] px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </span>
          </button>
        </div>
      </header>

      <section
        id="top"
        className="relative isolate min-h-[780px] overflow-hidden bg-[#1648dc] text-white"
      >
        <motion.div
          style={{ y: heroGlowY }}
          className="absolute -inset-y-32 inset-x-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,203,50,.8),transparent_25%),radial-gradient(circle_at_12%_88%,rgba(183,82,255,.8),transparent_28%),linear-gradient(135deg,#1749dc,#1579f5)]"
        />
        <FloatingOrb
          delay={0.5}
          className="-right-24 top-28 size-72 bg-[#ffd34b]/35 sm:right-24 sm:size-[30rem]"
        />
        <FloatingOrb
          delay={1.5}
          className="-bottom-24 -left-20 size-64 bg-[#b752ff]/35"
        />
        <motion.div
          aria-hidden="true"
          className="absolute -right-20 top-24 size-80 rounded-full border-[45px] border-[#f5c52f]/80 opacity-80 blur-[1px] sm:right-12 sm:size-[32rem]"
          animate={{ rotate: 360, scale: [1, 1.06, 1] }}
          transition={{
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <motion.div
          style={{ y: heroContentY }}
          className="relative mx-auto grid max-w-7xl items-end gap-12 px-5 pb-14 pt-36 sm:px-8 lg:grid-cols-[1fr_360px] lg:pb-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <p className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.35em] text-[#ffd54e]">
              <Sparkles data-icon="inline-start" /> Word & Worship Conference
            </p>
            <h1 className="font-display text-[clamp(4.5rem,13vw,10rem)] font-black uppercase leading-[.78] tracking-[-.09em]">
              Fresh
              <br />
              <span className="text-[#ffd34b]">Oil</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/80">
              A fresh outpouring. A gathered people. Four days of worship,
              teaching and encounter in the heart of Lagos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                className="rounded-full flex items-center bg-[#ffd34b] px-6 text-[#173fca] hover:bg-[#ffe17b]"
                onClick={() =>
                  document
                    .getElementById("merchandise")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore the collection <ArrowDown data-icon="inline-end" />
              </button>
              <a
                href="#story"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/30 px-5 text-sm font-semibold"
              >
                Discover Fresh Oil <ArrowRight data-icon="inline-end" />
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="rounded-3xl border border-white/20 bg-[#062cae]/40 p-5 backdrop-blur-md"
          >
            <p className="mb-4 text-xs uppercase tracking-[.28em] text-white/60">
              We gather in
            </p>
            <Countdown />
            <div className="mt-6 grid gap-3 border-t border-white/15 pt-5 text-sm text-white/80">
              <div className="flex gap-3">
                <CalendarDays className="text-[#ffd34b]" />
                19 — 22 November, 2026
              </div>
              <div className="flex gap-3">
                <MapPin className="text-[#ffd34b]" />
                Blast Arena, Lagos
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <motion.div
        aria-hidden="true"
        className="overflow-hidden border-y border-[#1855df]/10 bg-[#ffd34b] py-3 text-[#173fca]"
      >
        <motion.div
          className="flex w-max gap-8 whitespace-nowrap text-xs font-black uppercase tracking-[.28em]"
          animate={{ x: [0, -720] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index}>Fresh oil · Word & worship · Lagos ·</span>
          ))}
        </motion.div>
      </motion.div>

      <section
        id="story"
        className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:py-32"
      >
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
        >
          <p className="eyebrow">The gathering</p>
          <h2 className="mt-4 max-w-xl font-display text-5xl font-bold leading-[1.05] tracking-[-.05em] sm:text-7xl sm:leading-[.95]">
            Come thirsty.
            <br />
            <span className="text-[#1855df]">Leave overflowing.</span>
          </h2>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-[#53615e]">
            Fresh Oil is a call to return to the source. Join BLAST community
            for a weekend of praise, teaching, prayer and honest connection.
          </p>
        </motion.div>
        <EventDetails />
      </section>

      <section
        id="gallery"
        className="bg-[#173fca] px-5 py-20 text-white sm:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_2fr] lg:items-end">
          <div>
            <p className="eyebrow text-[#ffd34b]">Moments with us</p>
            <h2 className="mt-4 font-display text-5xl font-bold tracking-[-.05em] sm:text-6xl">
              A people
              <br />
              gathered.
            </h2>

            <div className="mt-8 flex gap-2">
              <button
                className="rounded-full border-white/30 text-white hover:bg-white/10"
                onClick={() =>
                  setGalleryIndex(
                    (galleryIndex + gallery.length - 1) % gallery.length,
                  )
                }
              >
                <ChevronLeft />
              </button>
              <button
                className="rounded-full border-white/30 text-white hover:bg-white/10"
                onClick={() =>
                  setGalleryIndex((galleryIndex + 1) % gallery.length)
                }
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="relative aspect-[16/8] overflow-hidden rounded-3xl bg-[#2363e8]">
            <AnimatePresence mode="wait">
              <motion.img
                key={galleryIndex}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                src={gallery[galleryIndex]}
                alt="Fresh Oil conference artwork"
                className="size-full object-cover object-center"
              />
            </AnimatePresence>
            <div className="absolute bottom-4 left-4 flex gap-1.5">
              {gallery.map((_, index) => (
                <button
                  aria-label={`Show gallery image ${index + 1}`}
                  key={index}
                  onClick={() => setGalleryIndex(index)}
                  className={`size-2 rounded-full ${index === galleryIndex ? "bg-[#ffd34b]" : "bg-white/50"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="merchandise"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-32"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Carry the message</p>
            <h2 className="mt-4 font-display text-5xl font-bold tracking-[-.05em] sm:text-7xl">
              Fresh Oil
              <br />
              <span className="text-[#1855df]">collection.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-[#53615e]">
            Wear a reminder of what we are believing for. Every purchase
            supports the gathering.
          </p>
        </div>
        <div className="mt-12 gap-10">
          <div className="relative flex min-h-[520px] items-center justify-center overflow-visible p-4 sm:min-h-[580px]">
            {merch.map((item, index) => {
              const paths = [
                {
                  x: [-30, 80, 20, -90, -30],
                  y: [40, -80, 30, 100, 40],
                  rotate: [-4, 8, -5, 6, -4],
                  scale: [1, 1.05, 0.97, 1.04, 1],
                  duration: 8.5,
                  delay: 0,
                },
                {
                  x: [70, -40, -100, 40, 70],
                  y: [-40, 80, -20, -100, -40],
                  rotate: [5, -8, 4, -6, 5],
                  scale: [0.98, 1.04, 1.02, 0.97, 0.98],
                  duration: 10,
                  delay: 1.2,
                },
                {
                  x: [-80, 20, 100, -20, -80],
                  y: [-20, 100, -70, 40, -20],
                  rotate: [-6, 5, 8, -4, -6],
                  scale: [1.03, 0.96, 1.06, 0.99, 1.03],
                  duration: 9.2,
                  delay: 2.1,
                },
              ];

              const path = paths[index % paths.length];

              return (
                <motion.button
                  key={item.id ?? item.name}
                  onClick={() => setSelected(item)}
                  className={`group absolute left-1/2 top-1/2 w-[72%] max-w-[300px] -translate-x-1/2 -translate-y-1/2 text-left sm:w-[45%] lg:w-[32%] ${
                    index === 1 ? "z-20" : index === 2 ? "z-10" : "z-0"
                  }`}
                  animate={{
                    x: path.x,
                    y: path.y,
                    rotate: path.rotate,
                    scale: path.scale,
                  }}
                  transition={{
                    duration: path.duration,
                    delay: path.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 50,
                    transition: {
                      duration: 0.35,
                    },
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                >
                  <motion.div
                    animate={{
                      rotateX: [0, 5, -4, 3, 0],
                      rotateY: [0, -6, 5, -4, 0],
                    }}
                    transition={{
                      duration: path.duration * 0.8,
                      delay: path.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                    className={`relative aspect-[.85] overflow-hidden rounded-2xl bg-[#e9dfca] shadow-[0_25px_60px_rgba(0,0,0,.18)] ${
                      selected === item
                        ? "ring-4 ring-[#1855df] ring-offset-4 ring-offset-[#f7f4ed]"
                        : ""
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Floating glow */}
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[#ffd34b]/20 blur-3xl"
                      animate={{
                        scale: [0.8, 1.15, 0.9, 1.2, 0.8],
                        opacity: [0.2, 0.45, 0.25, 0.5, 0.2],
                      }}
                      transition={{
                        duration: path.duration * 0.7,
                        delay: path.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {selected === item && (
                      <motion.span
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{
                          scale: [1, 1.12, 1],
                          rotate: 0,
                        }}
                        transition={{
                          scale: {
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                          rotate: {
                            duration: 0.4,
                          },
                        }}
                        className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-[#ffd34b] text-[#173fca] shadow-lg"
                      >
                        <Check />
                      </motion.span>
                    )}
                  </motion.div>

                  <motion.div
                    animate={{
                      y: [0, -5, 2, -4, 0],
                      opacity: [0.85, 1, 0.9, 1, 0.85],
                    }}
                    transition={{
                      duration: path.duration * 0.9,
                      delay: path.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <p className="mt-3 font-semibold">{item.name}</p>

                    <p className="mt-1 text-sm text-[#53615e]">
                      From {naira(Math.min(item.adult_price, item.child_price))}
                    </p>
                  </motion.div>
                </motion.button>
              );
            })}
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-[0_12px_50px_rgba(23,63,202,.08)] sm:p-8">
            <p className="eyebrow">Your selection</p>
            <h3 className="mt-3 text-2xl font-bold">{selected.name}</h3>
            <div className="mt-7">
              <label className="label">Size</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {["S", "M", "L", "XL", "XXL"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSize(option)}
                    className={`size-11 rounded-full border text-sm font-semibold ${size === option ? "border-[#1855df] bg-[#1855df] text-white" : "border-[#d6ddd8] hover:border-[#1855df]"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-7">
              <label className="label">For</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["Adult", "Child"] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setAudience(option)}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold ${audience === option ? "border-[#1855df] bg-[#edf2ff] text-[#1855df]" : "border-[#d6ddd8]"}`}
                  >
                    {option}
                    <span className="mt-1 block text-xs font-normal">
                      {naira(
                        option === "Adult"
                          ? selected.adult_price
                          : selected.child_price,
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-7 flex items-center justify-between">
              <div>
                <p className="label">Quantity</p>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    className="grid size-9 place-items-center rounded-full border"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus />
                  </button>
                  <span className="w-5 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    className="grid size-9 place-items-center rounded-full border"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="label">Item total</p>
                <p className="mt-1 text-2xl font-bold text-[#1855df]">
                  {naira(selectedPrice * quantity)}
                </p>
              </div>
            </div>
            <button
              className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1855df] text-base hover:bg-[#0f38a8]"
              onClick={addToCart}
            >
              Add to cart
              <ShoppingBag className="size-5" />
            </button>
          </div>
        </div>
      </section>

      <footer
        id="visit"
        className="bg-[#102d2b] px-5 pb-6 pt-16 text-white sm:px-8 sm:pt-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.3fr_.7fr_.7fr_.8fr]">
            <div>
              <a href="#top" className="inline-flex items-center gap-3">
                <img
                  src="/blast-logo.png"
                  alt="Blast"
                  className="h-11 w-auto object-contain"
                />
                <span className="sr-only">Blast 2026</span>
              </a>
              <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
                Fresh Oil is a Word & Worship gathering for a people hungry for
                God, community and a fresh outpouring.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="http://www.instagram.com/4sqblast"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-9 place-items-center rounded-full border border-white/20 text-white/75 transition hover:border-[#ffd34b] hover:text-[#ffd34b]"
                >
                  <FaInstagram className="size-4" />
                </a>

                <a
                  href="https://www.facebook.com/4sqblast"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-9 place-items-center rounded-full border border-white/20 text-white/75 transition hover:border-[#ffd34b] hover:text-[#ffd34b]"
                >
                  <FaFacebookF className="size-4" />
                </a>

                <a
                  href="https://www.youtube.com/@4sqblast_"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-9 place-items-center rounded-full border border-white/20 text-white/75 transition hover:border-[#ffd34b] hover:text-[#ffd34b]"
                >
                  <FaYoutube className="size-4" />
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#ffd34b]">
                Explore
              </p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-white/65">
                <a href="#story" className="transition hover:text-white">
                  The gathering
                </a>
                <a href="#merchandise" className="transition hover:text-white">
                  Merchandise
                </a>
                <a href="#gallery" className="transition hover:text-white">
                  Moments with us
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#ffd34b]">
                Visit
              </p>
              <div className="mt-5 flex flex-col gap-3 text-sm leading-6 text-white/65">
                <p>Blast Arena</p>
                <p>
                  59 Akinwunmi Street,
                  <br />
                  Alagomeji-Yaba, Lagos State
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#ffd34b]">
                Get in touch
              </p>
              <div className="mt-5 flex flex-col gap-3 text-sm leading-6 text-white/65">
                <a
                  href="mailto:4sqblast.it@gmail.com"
                  className="transition hover:text-white"
                >
                  www.4sqblast.org
                </a>
                <p>19 — 22 November 2026</p>
                <a
                  href="#merchandise"
                  className="font-semibold text-[#ffd34b] transition hover:text-white"
                >
                  Shop the collection{" "}
                  <ArrowRight className="ml-1 inline size-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-3 pt-6 text-xs text-white/40 sm:flex-row">
            <p>© 2026 4SQ Blast. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <a href="/privacy" className="hover:text-white">
                Privacy
              </a>

              <a href="#" className="hover:text-white">
                Order information
              </a>

              <button
                type="button"
                onClick={() => router.push("/send")}
                className="text-white/20 transition hover:text-white/50 p-2"
                aria-label="Notification administration"
                title="Notification administration"
              >
                •
              </button>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-30 bg-[#102d2b]/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 z-40 flex h-full w-full max-w-md flex-col bg-[#f7f4ed] p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="eyebrow">Your bag</p>
                  <h2 className="mt-2 text-3xl font-bold">Merchandise</h2>
                </div>
                <button onClick={() => setCartOpen(false)}>
                  <X />
                </button>
              </div>
              <div className="my-8 flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="grid h-full place-items-center text-center">
                    <ShoppingBag className="mx-auto mb-4 size-10 text-[#1855df]" />
                    <p className="font-semibold">Your bag is waiting.</p>
                    <p className="mt-2 text-sm text-[#53615e]">
                      Choose a piece from the collection.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 rounded-2xl bg-white p-3"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="size-20 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between gap-2">
                            <div>
                              <p className="truncate font-semibold">
                                {item.product.name}
                              </p>
                              <p className="mt-1 text-xs text-[#53615e]">
                                {item.audience} · {item.size}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                setCart((items) =>
                                  items.filter(
                                    (cartItem) => cartItem.id !== item.id,
                                  ),
                                )
                              }
                              aria-label={`Remove ${item.product.name}`}
                            >
                              <Trash2 className="size-4 text-[#a75e55]" />
                            </button>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                className="grid size-6 place-items-center rounded-full border"
                                onClick={() => changeQuantity(item.id, -1)}
                              >
                                <Minus className="size-3" />
                              </button>
                              <span className="text-sm">{item.quantity}</span>
                              <button
                                className="grid size-6 place-items-center rounded-full border"
                                onClick={() => changeQuantity(item.id, 1)}
                              >
                                <Plus className="size-3" />
                              </button>
                            </div>
                            <p className="font-semibold">
                              {naira(
                                (item.audience === "Adult"
                                  ? item.product.adult_price
                                  : item.product.child_price) * item.quantity,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t border-[#d6ddd8] pt-5">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#1855df]">{naira(total)}</span>
                  </div>
                  <button
                    className="flex items-center justify-center mt-5 h-12 w-full rounded-full bg-[#1855df] hover:bg-[#0f38a8]"
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                  >
                    Continue to checkout <ArrowRight data-icon="inline-end" />
                  </button>
                  <p className="mt-3 text-center text-xs text-[#53615e]">
                    Secure order collection · Receipt required
                  </p>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutOpen && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-[#102d2b]/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[#f7f4ed] p-6 sm:p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="eyebrow">Almost there</p>
                  <h2 className="mt-2 text-3xl font-bold">
                    Complete your order
                  </h2>
                </div>

                <button
                  className="gap-2"
                  onClick={() => setCheckoutOpen(false)}
                >
                  <X />
                </button>
              </div>

              {submitted ? (
                <div className="py-14 text-center">
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#ffd34b] text-[#173fca]">
                    <Check />
                  </div>

                  <h3 className="mt-5 text-2xl font-bold">Order received.</h3>

                  <p className="mt-2 text-[#53615e]">
                    Thank you. The team will confirm your order after checking
                    the receipt.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-7 flex flex-col gap-5">
                    {/* Recipient */}
                    <div className="space-y-4">
                      <div>
                        <label className="label" htmlFor="recipient">
                          Recipient name
                        </label>

                        <input
                          id="recipient"
                          value={recipient}
                          onChange={(event) => setRecipient(event.target.value)}
                          placeholder="Who should receive the order?"
                          className="field"
                        />
                      </div>

                      <div>
                        <label className="label" htmlFor="contact">
                          Recipient contact
                        </label>

                        <input
                          id="contact"
                          type="tel"
                          value={contact}
                          onChange={(event) => setContact(event.target.value)}
                          placeholder="080 1234 5678"
                          className="field"
                        />
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="overflow-hidden rounded-2xl bg-[#1855df] text-white">
                      <div className="p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#ffd34b]">
                              Payment details
                            </p>

                            <h3 className="mt-2 text-xl font-bold">
                              Make your payment
                            </h3>
                          </div>

                          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10">
                            <span className="text-sm font-bold text-[#ffd34b]">
                              ₦
                            </span>
                          </div>
                        </div>

                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
                          Transfer the exact amount below to the account
                          provided, then upload your payment receipt.
                        </p>

                        <div className="mt-5 rounded-xl bg-[#0f3da8] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                                Bank
                              </p>
                              <p className="mt-1 font-semibold">GTBank</p>
                            </div>

                            <div className="text-right">
                              <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                                Account name
                              </p>
                              <p className="mt-1 font-semibold">Blast Church</p>
                            </div>
                          </div>

                          <div className="mt-4 border-t border-white/10 pt-4">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                              Account number
                            </p>

                            <div className="mt-2 flex items-center justify-between gap-3">
                              <p className="text-2xl font-bold tracking-[0.08em] text-[#ffd34b]">
                                25666798543
                              </p>

                              <button
                                type="button"
                                onClick={copyAccountNumber}
                                className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[#1855df] transition hover:bg-[#ffd34b]"
                                aria-label="Copy account number"
                              >
                                {copied ? (
                                  <Check className="size-4" />
                                ) : (
                                  <Copy className="size-4" />
                                )}
                              </button>
                            </div>

                            <p className="mt-2 text-xs text-white/50">
                              {copied
                                ? "Account number copied"
                                : "Tap the copy button to copy"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
                          <span className="text-sm text-white/70">
                            Amount to pay
                          </span>

                          <span className="text-2xl font-bold text-[#ffd34b]">
                            {naira(total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Receipt */}
                    <div>
                      <label className="label" htmlFor="receipt">
                        Payment receipt
                      </label>

                      <label
                        htmlFor="receipt"
                        className="mt-2 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-[#9eaaa4] bg-white p-4 text-sm transition hover:border-[#1855df]"
                      >
                        {isUploadingReceipt && (
                          <p className="mt-2 text-xs text-[#53615e]">
                            Compressing and uploading receipt...
                          </p>
                        )}

                        {receiptUrl && !isUploadingReceipt && (
                          <p className="mt-2 text-xs font-medium text-green-600">
                            Receipt ready ✓
                          </p>
                        )}

                        {receiptError && (
                          <p className="mt-2 text-xs font-medium text-red-500">
                            {receiptError}
                          </p>
                        )}
                      </label>
                      <input
                        id="receipt"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleReceiptChange}
                      />
                      {isUploadingReceipt && (
                        <p className="mt-2 text-xs text-[#53615e]">
                          Compressing and uploading receipt...
                        </p>
                      )}

                      {receiptUrl && !isUploadingReceipt && (
                        <p className="mt-2 text-xs font-medium text-green-600">
                          Receipt ready ✓
                        </p>
                      )}

                      {receiptError && (
                        <p className="mt-2 text-xs font-medium text-red-500">
                          {receiptError}
                        </p>
                      )}
                    </div>

                    {/* Order summary */}
                    <div className="rounded-2xl bg-[#e9dfca] p-5">
                      <div className="flex justify-between">
                        <span className="text-sm text-[#53615e]">
                          Order total
                        </span>

                        <span className="text-xl font-bold text-[#1855df]">
                          {naira(total)}
                        </span>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-[#53615e]">
                        Your receipt will be used to verify this order before
                        confirmation.
                      </p>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="button"
                    disabled={
                      !recipient.trim() ||
                      !receipt ||
                      !receiptUrl ||
                      isUploadingReceipt ||
                      isSubmitting
                    }
                    className={`mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full transition ${
                      !recipient.trim() ||
                      !receipt ||
                      !receiptUrl ||
                      isUploadingReceipt ||
                      isSubmitting
                        ? "cursor-not-allowed bg-[#b8c0bd] text-white"
                        : "bg-[#1855df] text-white hover:bg-[#0f38a8]"
                    }`}
                    onClick={handleSubmission}
                  >
                    {isUploadingReceipt ? (
                      <>
                        <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Preparing receipt...
                      </>
                    ) : isSubmitting ? (
                      <>
                        <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Submitting order...
                      </>
                    ) : (
                      <>
                        Submit order
                        <Check className="size-5" />
                      </>
                    )}
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
