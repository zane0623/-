import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Stats } from '@/components/home/Stats';
import { Testimonials } from '@/components/home/Testimonials';
import { CTA } from '@/components/home/CTA';

// Force dynamic rendering to avoid ToastProvider issues during static generation
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedProducts />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <CTA />
    </>
  );
}


