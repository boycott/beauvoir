import { Oswald } from "next/font/google";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button"
import Link from "next/link";

const oswald = Oswald({
  variable: "--font-oswald-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function Header () {
  return (
    <header className="flex my-4 mx-auto max-w-6xl justify-between items-center">
      <h1 className={`${oswald.className} antialiased font-bold text-orange-600 dark:text-orange-700 hover:text-black dark:hover:text-white text-[2.5rem] tracking-[.15em]`}><a href="https://recipe4.life">RECIPE FOR LIFE</a></h1>
      <div className="flex gap-2">
        <ThemeSwitcher />
      </div>
    </header>
  )
}