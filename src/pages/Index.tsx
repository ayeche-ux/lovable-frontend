import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturesSection } from '@/components/home/features-section';
import { HowItWorksSection } from '@/components/home/how-it-works-section';
import { TopTeachersSection } from '@/components/home/top-teachers-section';
import { CTASection } from '@/components/home/cta-section';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TopTeachersSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
