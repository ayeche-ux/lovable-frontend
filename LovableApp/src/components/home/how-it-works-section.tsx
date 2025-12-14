import { motion } from 'framer-motion';
import { UserPlus, Search, CalendarCheck, Star } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Create Your Profile',
    description: 'Sign up and choose whether you want to learn, teach, or both. Select your subjects of expertise.',
  },
  {
    icon: Search,
    number: '02',
    title: 'Find Your Match',
    description: 'Search for peer tutors by subject, rating, and availability. View profiles and read reviews.',
  },
  {
    icon: CalendarCheck,
    number: '03',
    title: 'Book a Session',
    description: 'Select a time slot and book your learning session. Connect via video call or meet in person.',
  },
  {
    icon: Star,
    number: '04',
    title: 'Learn & Rate',
    description: 'Complete your session and rate your experience. Help build our community of great tutors.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started in minutes and begin your peer learning journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}

              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-card border-2 border-border flex items-center justify-center shadow-lg">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center text-xs font-bold text-accent-foreground shadow-md">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
