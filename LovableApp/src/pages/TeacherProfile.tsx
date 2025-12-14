import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Award,
  Clock,
  Calendar,
  Star,
  ArrowLeft,
  MessageCircle,
  DollarSign,
  BookOpen,
  Check,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { StarRating } from '@/components/ui/star-rating';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_TEACHERS, SUBJECTS } from '@/lib/types';
import { toast } from 'sonner';

const TIME_SLOTS = [
  { id: '1', time: '09:00 AM', available: true },
  { id: '2', time: '10:00 AM', available: true },
  { id: '3', time: '11:00 AM', available: false },
  { id: '4', time: '02:00 PM', available: true },
  { id: '5', time: '03:00 PM', available: true },
  { id: '6', time: '04:00 PM', available: false },
];

const MOCK_REVIEWS = [
  { id: '1', learnerName: 'Alice Smith', rating: 5, comment: 'Excellent explanation! Made linear algebra so much easier to understand.', date: '2 days ago' },
  { id: '2', learnerName: 'Bob Johnson', rating: 5, comment: 'Very patient and knowledgeable. Highly recommend!', date: '1 week ago' },
  { id: '3', learnerName: 'Carol Davis', rating: 4, comment: 'Great session, helped me prepare for my exam.', date: '2 weeks ago' },
];

export default function TeacherProfilePage() {
  const { id } = useParams<{ id: string }>();
  const teacher = MOCK_TEACHERS.find((t) => t.id === id);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  if (!teacher) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Teacher not found</h1>
          <Link to="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  const teacherSubjects = SUBJECTS.filter((s) => teacher.subjects.includes(s.id));

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      id: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  const handleBookSession = () => {
    if (!selectedDate || !selectedSlot || !selectedSubject) {
      toast.error('Please select a date, time, and subject');
      return;
    }
    toast.success('Session request sent!', {
      description: `Your booking request has been sent to ${teacher.name}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Profile Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-primary flex items-center justify-center">
                        {teacher.avatar ? (
                          <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-full h-full rounded-2xl object-cover"
                          />
                        ) : (
                          <UserIcon className="w-12 h-12 text-primary-foreground" />
                        )}
                      </div>
                      {teacher.isTopTeacher && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center shadow-md">
                          <Award className="w-4 h-4 text-accent-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h1 className="text-2xl font-bold text-foreground">{teacher.name}</h1>
                          <div className="flex items-center gap-3 mt-2">
                            <StarRating rating={teacher.ratingAverage} showValue />
                            <span className="text-sm text-muted-foreground">
                              ({teacher.ratingCount} reviews)
                            </span>
                          </div>
                        </div>
                        {teacher.isTopTeacher && (
                          <Badge className="bg-gradient-accent text-accent-foreground">
                            Top Teacher
                          </Badge>
                        )}
                      </div>

                      {teacher.bio && (
                        <p className="text-muted-foreground mt-4">{teacher.bio}</p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-4">
                        {teacherSubjects.map((subject) => (
                          <Badge key={subject.id} variant="secondary">
                            {subject.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {teacher.ratingCount}
                      </div>
                      <div className="text-sm text-muted-foreground">Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {teacher.ratingAverage.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {teacher.isTopTeacher && teacher.pricePerHour
                          ? `$${teacher.pricePerHour}`
                          : 'Free'}
                      </div>
                      <div className="text-sm text-muted-foreground">Per Hour</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Student Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {MOCK_REVIEWS.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-xl bg-secondary/50 border border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">
                            {review.learnerName}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                      <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Booking Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Book a Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Subject Selection */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Select Subject
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {teacherSubjects.map((subject) => (
                        <Badge
                          key={subject.id}
                          variant={selectedSubject === subject.id ? 'default' : 'outline'}
                          className={`cursor-pointer transition-all ${
                            selectedSubject === subject.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-secondary'
                          }`}
                          onClick={() => setSelectedSubject(subject.id)}
                        >
                          {selectedSubject === subject.id && <Check className="w-3 h-3 mr-1" />}
                          {subject.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Select Date
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {dates.slice(0, 8).map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setSelectedDate(d.id)}
                          className={`p-2 rounded-xl text-center transition-all ${
                            selectedDate === d.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          <div className="text-xs font-medium">{d.day}</div>
                          <div className="text-lg font-bold">{d.date}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Select Time
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => slot.available && setSelectedSlot(slot.id)}
                          disabled={!slot.available}
                          className={`p-3 rounded-xl text-sm font-medium transition-all ${
                            !slot.available
                              ? 'bg-muted text-muted-foreground cursor-not-allowed'
                              : selectedSlot === slot.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary hover:bg-secondary/80 text-foreground'
                          }`}
                        >
                          <Clock className="w-4 h-4 inline mr-2" />
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Session Price</span>
                      <span className="text-xl font-bold text-foreground">
                        {teacher.isTopTeacher && teacher.pricePerHour
                          ? `$${teacher.pricePerHour}`
                          : 'Free'}
                      </span>
                    </div>
                    {!teacher.isTopTeacher && (
                      <p className="text-xs text-success mt-1">
                        Free for the first month!
                      </p>
                    )}
                  </div>

                  <Button
                    className="w-full bg-gradient-primary hover:opacity-90 h-12"
                    onClick={handleBookSession}
                  >
                    Book Session
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
