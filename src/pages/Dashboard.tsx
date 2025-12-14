import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  BookOpen,
  Star,
  TrendingUp,
  User as UserIcon,
  Award,
  Settings,
  Bell,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { StarRating } from '@/components/ui/star-rating';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SUBJECTS } from '@/lib/types';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Get user data from localStorage or use defaults
const getUserData = () => {
  const name = localStorage.getItem('userName') || 'User';
  const email = localStorage.getItem('userEmail') || 'user@university.tn';
  const roles = JSON.parse(localStorage.getItem('userRoles') || '["learner"]');
  const subjects = JSON.parse(localStorage.getItem('userSubjects') || '["1", "2"]');
  
  return {
    id: 'current',
    name,
    email,
    roles: roles as ('teacher' | 'learner')[],
    subjects,
    isTopTeacher: false,
    ratingAverage: 4.5,
    ratingCount: 12,
    rank: 25,
  };
};

interface BookedSession {
  id: string;
  teacherName: string;
  subject: string;
  date: string;
  time: string;
  sessionType: 'individual' | 'group';
  locationType: 'online' | 'in-person';
  status: 'scheduled' | 'pending';
  isTeaching: boolean;
  partners?: string[];
}

const MOCK_SESSIONS = [
  {
    id: 'mock-1',
    teacherName: 'Yassine Ben Ali',
    learnerName: 'You',
    subject: 'Algorithms',
    date: 'Today',
    time: '14:00',
    status: 'scheduled' as const,
    isTeaching: false,
  },
  {
    id: 'mock-2',
    teacherName: 'You',
    learnerName: 'Khaled Hamdi',
    subject: 'Linear Algebra',
    date: 'Tomorrow',
    time: '10:00',
    status: 'scheduled' as const,
    isTeaching: true,
  },
];

const PAST_SESSIONS = [
  {
    id: '4',
    teacherName: 'Amine Bouazizi',
    learnerName: 'You',
    subject: 'Physics',
    date: 'Dec 10',
    rated: true,
    rating: 5,
    isTeaching: false,
  },
  {
    id: '5',
    teacherName: 'You',
    learnerName: 'Rania Cherni',
    subject: 'Data Structures',
    date: 'Dec 8',
    rated: true,
    rating: 4,
    isTeaching: true,
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([]);
  const currentUser = getUserData();
  const userSubjects = SUBJECTS.filter((s) => currentUser.subjects.includes(s.id));

  useEffect(() => {
    // Load booked sessions from localStorage
    const stored = localStorage.getItem('bookedSessions');
    if (stored) {
      setBookedSessions(JSON.parse(stored));
    }
  }, []);

  const handleSessionAction = (sessionId: string, action: 'accept' | 'decline') => {
    if (action === 'accept') {
      toast.success('Session confirmed!');
    } else {
      toast.info('Session declined');
    }
  };

  // Combine mock sessions with booked sessions
  const allUpcomingSessions = [
    ...bookedSessions.map(session => ({
      id: session.id,
      teacherName: session.teacherName,
      learnerName: currentUser.name,
      subject: session.subject,
      date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: session.time,
      status: session.status,
      isTeaching: session.isTeaching,
      sessionType: session.sessionType,
      locationType: session.locationType,
      partners: session.partners,
    })),
    ...MOCK_SESSIONS,
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">
                  {currentUser.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome, {currentUser.name.split(' ')[0]}!
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {currentUser.roles.map((role) => (
                    <Badge key={role} variant="secondary" className="capitalize">
                      {role === 'teacher' ? 'Teacher' : 'Learner'}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="learning">My Learning</TabsTrigger>
              <TabsTrigger value="teaching">My Teaching</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Sessions this month</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{allUpcomingSessions.length + 6}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Your Rating</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-2xl font-bold text-foreground">
                            {currentUser.ratingAverage}
                          </p>
                          <StarRating rating={currentUser.ratingAverage} size="sm" />
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Star className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Rank</p>
                        <p className="text-2xl font-bold text-foreground mt-1">
                          #{currentUser.rank}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      5 more sessions to reach Top 20!
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Subjects</p>
                        <p className="text-2xl font-bold text-foreground mt-1">
                          {userSubjects.length}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-success" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Sessions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      My Schedule
                    </CardTitle>
                    <Link to="/sessions">
                      <Button variant="ghost" size="sm">
                        View All
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {allUpcomingSessions.length > 0 ? allUpcomingSessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              {session.isTeaching ? (
                                <Award className="w-5 h-5 text-primary" />
                              ) : (
                                <BookOpen className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{session.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {session.isTeaching ? 'Teaching ' : 'Learning from '}
                                {session.isTeaching ? session.learnerName : session.teacherName}
                                {'sessionType' in session && session.sessionType === 'group' && 'partners' in session && session.partners && session.partners.length > 0 && (
                                  <span className="text-primary"> (+{session.partners.length} others)</span>
                                )}
                              </p>
                              {'locationType' in session && session.locationType && (
                                <p className="text-xs text-muted-foreground">
                                  {session.locationType === 'online' ? '📹 Online' : '📍 In-person'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium text-foreground">{session.date}</p>
                              <p className="text-sm text-muted-foreground">{session.time}</p>
                            </div>
                            {session.status === 'pending' && session.isTeaching && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive"
                                  onClick={() => handleSessionAction(session.id, 'decline')}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleSessionAction(session.id, 'accept')}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                            {session.status === 'scheduled' && (
                              <Badge variant="outline" className="text-success border-success">
                                Confirmed
                              </Badge>
                            )}
                            {session.status === 'pending' && !session.isTeaching && (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No upcoming sessions</p>
                          <Link to="/search">
                            <Button variant="link" className="mt-2">Book a session</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Your Subjects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Your Teaching Subjects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {userSubjects.map((subject) => (
                        <Badge key={subject.id} variant="secondary" className="text-sm py-2 px-4">
                          {subject.name}
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm" className="rounded-full">
                        + Add Subject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="learning" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Learning Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {PAST_SESSIONS.filter((s) => !s.isTeaching).map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{session.subject}</p>
                            <p className="text-sm text-muted-foreground">
                              with {session.teacherName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{session.date}</span>
                          {session.rated ? (
                            <StarRating rating={session.rating} size="sm" />
                          ) : (
                            <Button size="sm" variant="outline">
                              Rate Session
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Link to="/search">
                      <Button className="bg-gradient-primary">Find More Teachers</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teaching" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Teaching Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {PAST_SESSIONS.filter((s) => s.isTeaching).map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Award className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{session.subject}</p>
                            <p className="text-sm text-muted-foreground">
                              Student: {session.learnerName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{session.date}</span>
                          <StarRating rating={session.rating} size="sm" showValue />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Teacher Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Teaching Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-xl bg-secondary/50">
                      <p className="text-2xl font-bold text-foreground">12</p>
                      <p className="text-sm text-muted-foreground">Total Sessions</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary/50">
                      <p className="text-2xl font-bold text-foreground">8</p>
                      <p className="text-sm text-muted-foreground">Unique Students</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary/50">
                      <p className="text-2xl font-bold text-foreground">240 DT</p>
                      <p className="text-sm text-muted-foreground">Earnings</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary/50">
                      <p className="text-2xl font-bold text-foreground">4.8</p>
                      <p className="text-sm text-muted-foreground">Avg Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}