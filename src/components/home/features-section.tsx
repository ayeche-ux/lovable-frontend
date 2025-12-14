import { motion } from 'framer-motion';
import { Search, Calendar, Star, Trophy, Video, Shield } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Find Expert Peers',
    description: 'Search for student tutors by subject, rating, and availability. Find the perfect match for your learning style.',
  },
  {
    icon: Calendar,
    title: 'Easy Booking',
    description: 'Book sessions with just a few clicks. Choose from available time slots that fit your schedule.',
  },
  {
    icon: Star,
    title: 'Quality Ratings',
    description: 'Rate your sessions and help build a community of excellent peer tutors.',
  },
  {
    icon: Trophy,
    title: 'Monthly Rankings',
    description: 'Top 20 teachers each month earn the privilege to set their own prices and premium features.',
  },
  {
    icon: Video,
    title: 'Virtual Sessions',
    description: 'Connect with your tutor through video calls or in-person meetups, whatever works best.',
  },
  {
    icon: Shield,
    title: 'Safe & Verified',
    description: 'All students are verified university members, ensuring a trusted learning environment.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Everything you need to{' '}
            <span className="text-gradient">learn & teach</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our platform makes peer-to-peer learning simple, effective, and rewarding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
