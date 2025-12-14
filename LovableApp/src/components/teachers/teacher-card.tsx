import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User as UserIcon, Award, Clock, Calendar } from 'lucide-react';
import { StarRating } from '@/components/ui/star-rating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, SUBJECTS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { BookingModal } from '@/components/booking/BookingModal';

interface TeacherCardProps {
  teacher: User;
  index?: number;
}

export function TeacherCard({ teacher, index = 0 }: TeacherCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const teacherSubjects = SUBJECTS.filter((s) => teacher.subjects.includes(s.id));

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className="group relative bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20"
      >
        {teacher.isTopTeacher && (
          <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center shadow-md">
            <Award className="w-5 h-5 text-accent-foreground" />
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
              {teacher.avatar ? (
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <UserIcon className="w-8 h-8 text-primary-foreground" />
              )}
            </div>
            {teacher.isTopTeacher && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
                <span className="text-[10px] text-success-foreground font-bold">✓</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{teacher.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={teacher.ratingAverage} size="sm" showValue />
              <span className="text-xs text-muted-foreground">
                ({teacher.ratingCount} avis)
              </span>
            </div>
          </div>
        </div>

        {teacher.bio && (
          <p className="text-sm text-muted-foreground mt-4 line-clamp-2">{teacher.bio}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mt-4">
          {teacherSubjects.slice(0, 3).map((subject) => (
            <Badge
              key={subject.id}
              variant="secondary"
              className="text-xs font-normal"
            >
              {subject.icon} {subject.name}
            </Badge>
          ))}
          {teacherSubjects.length > 3 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{teacherSubjects.length - 3} autres
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            {teacher.isTopTeacher && teacher.pricePerHour ? (
              <div className="flex items-center gap-1 text-sm">
                <span className="font-semibold text-foreground">
                  {teacher.pricePerHour} DT/h
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-sm">
                <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                  Gratuit
                </span>
              </div>
            )}
            {teacher.availability && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{teacher.availability.length} créneaux</span>
              </div>
            )}
          </div>

          <Button 
            size="sm" 
            onClick={() => setIsBookingOpen(true)}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Réserver
          </Button>
        </div>
      </motion.div>

      <BookingModal 
        teacher={teacher} 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </>
  );
}
