import {
  Bebas_Neue,
  Bellefair,
  DM_Sans,
  DM_Serif_Display,
  Inter,
  Manrope,
  Plus_Jakarta_Sans,
  Rethink_Sans,
  Roboto,
  Teko,
} from "next/font/google";

// NOTE:
// We use `variable` so existing template CSS variables (e.g. --td-ff-body) can be
// mapped to these font faces without rewriting the whole stylesheet.

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-dm-sans",
});

export const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  preload: false,
  variable: "--font-bebas-neue",
});

export const teko = Teko({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-teko",
});

export const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-rethink-sans",
});

export const bellefair = Bellefair({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  preload: false,
  variable: "--font-bellefair",
});

export const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  preload: false,
  variable: "--font-roboto",
});

export const fontVarsClassName = [
  inter.variable,
  plusJakarta.variable,
  dmSerif.variable,
  dmSans.variable,
  manrope.variable,
  bebasNeue.variable,
  teko.variable,
  rethinkSans.variable,
  bellefair.variable,
  roboto.variable,
].join(" ");


