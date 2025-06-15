import logo from '/public/logo/logosaas-dark.png';
import Image from 'next/image';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-12">
      <div className="container mx-auto px-4 flex flex-col items-center text-center gap-6">
        {/* Logo */}
        <div className="inline-flex relative before:content-[''] before:absolute before:inset-y-2 before:w-full before:blur before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)]">
          <Image src={logo} alt="ThinkTapFlow logo" height={40} className="relative z-10" />
        </div>

        {/* Navigation */}
        <nav>
          <ul className="flex flex-wrap justify-center gap-6">
            <li><a href="#features" className="hover:underline">Features</a></li>
            <li><a href="#testimonials" className="hover:underline">Testimonials</a></li>
            <li><a href="#about" className="hover:underline">About</a></li>
            <li><a href="#help" className="hover:underline">Help</a></li>
            <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/terms-of-service" className="hover:underline">Terms of Service</a></li>
          </ul>
        </nav>

        {/* Signature with GitHub link and tooltip */}
        <p className="text-xs text-[#A0A0A0] mt-2">
          &copy; {currentYear} All rights reserved. Made with ❤️ from{' '}
          <a
            href="https://github.com/khabzox"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline relative group"
          >
            Abdelkabir
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-white text-black text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap z-10">
              Visit my GitHub profile
            </span>
          </a>
        </p>
      </div>
    </footer>
  );
};
