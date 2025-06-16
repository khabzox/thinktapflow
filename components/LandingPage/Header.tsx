import ArrowRight from '/public/assets/arrow-right.svg';
import Logo from '/public/logo/logosaas-dark.png';
import Image from 'next/image';
import MenuIcon from '/public/assets/menu.svg';
import Link from 'next/link';
import { PrimaryBtn } from '@/components/common/btn';

export const Header = () => {
  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
        <p className="text-white/60 hidden md:block">
          Generate high-quality content 10x faster with AI-powered writing
        </p>
        <Link href={"/dashboard"} className="inline-flex gap-1 items-center">
          <p>Start creating free</p>
          <ArrowRight className="h-4 w-4 inline-flex justify-center items-center" />
        </Link>
      </div>

      <div className="py-5">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Image src={Logo} alt="ThinkTapFlow logo" height={40} width={40} />
                <span className="text-xl font-semibold tracking-tight">ThinkTapFlow</span>
              </div>
            </Link>
            <MenuIcon className="h-5 w-5 md:hidden" />
            <nav className="hidden md:flex gap-6 text-black/60 items-center">
              <Link href="#features">Features</Link>
              <Link href="#testimonials">Testimonials</Link>
              <Link href="#about">About</Link>
              <Link href="#help">Help</Link>
              <PrimaryBtn href={"/dashboard"} textContent={"Start Creating"} />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
