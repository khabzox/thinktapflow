import { CallToAction } from '@/components/LandingPage/CallToAction';
import { Footer } from '@/components/LandingPage/Footer';
import { Header } from '@/components/LandingPage/Header';
import { Hero } from '@/components/LandingPage/Hero';
import { LogoTicker } from '@/components/LandingPage/LogoTicker';
import { Pricing } from '@/components/LandingPage/Pricing';
import { ProductShowcase } from '@/components/LandingPage/ProductShowcase';
import { Testimonials } from '@/components/LandingPage/Testimonials';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <LogoTicker />
      <ProductShowcase />
      {/* <Pricing /> */}
      {/* <Testimonials /> */}
      <CallToAction />
      <Footer />
    </>
  );
}
