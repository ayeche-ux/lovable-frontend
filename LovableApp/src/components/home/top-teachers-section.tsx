import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeacherCard } from '@/components/teachers/teacher-card';
import { MOCK_TEACHERS } from '@/lib/types';

export function TopTeachersSection() {
  const topTeachers = MOCK_TEACHERS.filter((t) => t.isTopTeacher).slice(0, 3);

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-accent">This Month's Champions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Top Rated Teachers
            </h2>
          </div>
          <Link to="/leaderboard">
            <Button variant="outline" className="group">
              View Leaderboard
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topTeachers.map((teacher, index) => (
            <TeacherCard key={teacher.id} teacher={teacher} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
