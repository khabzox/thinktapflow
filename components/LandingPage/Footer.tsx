import logo from "/public/logo/logosaas-dark.png";
import Image from "next/image";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-12 text-sm text-[#BCBCBC]">
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
        {/* Logo */}
        <div className="relative inline-flex before:absolute before:inset-y-2 before:w-full before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:blur before:content-['']">
          <Image src={logo} alt="ThinkTapFlow logo" height={40} className="relative z-10" />
        </div>

        {/* Navigation */}
        <nav>
          <ul className="flex flex-wrap justify-center gap-6">
            <li>
              <a href="#features" className="hover:underline">
                Features
              </a>
            </li>
            <li>
              <a href="#testimonials" className="hover:underline">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#about" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#help" className="hover:underline">
                Help
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms-of-service" className="hover:underline">
                Terms of Service
              </a>
            </li>
          </ul>
        </nav>

        {/* Signature with GitHub link and tooltip */}
        <p className="mt-2 text-xs text-[#A0A0A0]">
          &copy; {currentYear} All rights reserved. Made with ❤️ from{" "}
          <a
            href="https://github.com/khabzox"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative text-white hover:underline"
          >
            Abdelkabir
            <span className="absolute -top-6 left-1/2 z-10 -translate-x-1/2 scale-0 whitespace-nowrap rounded bg-white px-2 py-1 text-[10px] text-black shadow-md transition-transform group-hover:scale-100">
              Visit my GitHub profile
            </span>
          </a>
        </p>
      </div>
    </footer>
  );
};
