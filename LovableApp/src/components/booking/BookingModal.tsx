import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, User, Video, MapPin, Calendar, Clock, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Teacher, SUBJECTS } from '@/lib/types';

interface BookingModalProps {
  teacher: Teacher;
  isOpen: boolean;
  onClose: () => void;
}

type SessionType = 'individual' | 'group';
type LocationType = 'online' | 'in-person';

interface WaitingLearner {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  waitingSince: string;
}

const WAITING_LEARNERS: WaitingLearner[] = [
  { id: '1', name: 'Youssef Ben Ali', avatar: 'YB', subject: 'math', waitingSince: '2 hours' },
  { id: '2', name: 'Fatma Trabelsi', avatar: 'FT', subject: 'math', waitingSince: '30 min' },
  { id: '3', name: 'Khaled Mansour', avatar: 'KM', subject: 'physics', waitingSince: '1 hour' },
  { id: '4', name: 'Rim Bouazizi', avatar: 'RB', subject: 'french', waitingSince: '45 min' },
  { id: '5', name: 'Amine Jebali', avatar: 'AJ', subject: 'english', waitingSince: '15 min' },
];

const AVAILABLE_TIMES = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export function BookingModal({ teacher, isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState<SessionType | null>(null);
  const [locationType, setLocationType] = useState<LocationType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLearners, setSelectedLearners] = useState<string[]>([]);

  const teacherSubjects = teacher.subjects.map(id => SUBJECTS.find(s => s.id === id)).filter(Boolean);
  
  const matchingLearners = WAITING_LEARNERS.filter(learner => 
    teacher.subjects.includes(learner.subject)
  );

  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        num: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return dates;
  };

  const handleConfirm = () => {
    const learnerNames = selectedLearners.length > 0 
      ? WAITING_LEARNERS.filter(l => selectedLearners.includes(l.id)).map(l => l.name)
      : [];
    
    const subjectName = SUBJECTS.find(s => s.id === selectedSubject)?.name || 'Unknown';
    
    // Save session to localStorage
    const newSession = {
      id: `session-${Date.now()}`,
      teacherName: teacher.name,
      subject: subjectName,
      date: selectedDate,
      time: selectedTime,
      sessionType: sessionType,
      locationType: locationType,
      status: 'scheduled' as const,
      isTeaching: false,
      partners: learnerNames,
    };

    const existingSessions = JSON.parse(localStorage.getItem('bookedSessions') || '[]');
    localStorage.setItem('bookedSessions', JSON.stringify([...existingSessions, newSession]));
    
    toast.success(
      sessionType === 'group' 
        ? `Group session booked with ${teacher.name}!`
        : `Individual session booked with ${teacher.name}!`,
      {
        description: `${selectedDate} at ${selectedTime} • ${locationType === 'online' ? 'Online' : 'In-person'}`
      }
    );
    onClose();
    resetState();
  };

  const resetState = () => {
    setStep(1);
    setSessionType(null);
    setLocationType(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedSubject(null);
    setSelectedLearners([]);
  };

  const toggleLearner = (id: string) => {
    setSelectedLearners(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1: return sessionType !== null;
      case 2: return locationType !== null;
      case 3: return selectedSubject !== null;
      case 4: return sessionType === 'individual' || selectedLearners.length > 0;
      case 5: return selectedDate !== null && selectedTime !== null;
      default: return false;
    }
  };

  const totalSteps = sessionType === 'group' ? 5 : 4;
  const actualStep = sessionType === 'individual' && step > 3 ? step - 1 : step;

  return (
    <Dialog open={isOpen} onOpenChange={() => { onClose(); resetState(); }}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <div className="bg-gradient-primary p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Book with {teacher.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 mt-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  i < actualStep ? 'bg-primary-foreground' : 'bg-primary-foreground/30'
                )}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Session Type */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">How do you want to learn?</h3>
                <p className="text-sm text-muted-foreground">Choose your preferred learning style</p>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={() => setSessionType('individual')}
                    className={cn(
                      'p-6 rounded-2xl border-2 transition-all text-left group',
                      sessionType === 'individual'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors',
                      sessionType === 'individual' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                    )}>
                      <User className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">Individual</h4>
                    <p className="text-xs text-muted-foreground">Personalized 1-on-1 learning</p>
                  </button>

                  <button
                    onClick={() => setSessionType('group')}
                    className={cn(
                      'p-6 rounded-2xl border-2 transition-all text-left group relative overflow-hidden',
                      sessionType === 'group'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {matchingLearners.length > 0 && (
                      <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
                        {matchingLearners.length} waiting
                      </Badge>
                    )}
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors',
                      sessionType === 'group' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                    )}>
                      <Users className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">Group</h4>
                    <p className="text-xs text-muted-foreground">Learn with other students</p>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Location Type */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">Where do you want to learn?</h3>
                <p className="text-sm text-muted-foreground">Choose your session format</p>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={() => setLocationType('online')}
                    className={cn(
                      'p-6 rounded-2xl border-2 transition-all text-left',
                      locationType === 'online'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors',
                      locationType === 'online' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                    )}>
                      <Video className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">Online</h4>
                    <p className="text-xs text-muted-foreground">Via video call (Google Meet, Zoom)</p>
                  </button>

                  <button
                    onClick={() => setLocationType('in-person')}
                    className={cn(
                      'p-6 rounded-2xl border-2 transition-all text-left',
                      locationType === 'in-person'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors',
                      locationType === 'in-person' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                    )}>
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">In-Person</h4>
                    <p className="text-xs text-muted-foreground">Meet face to face</p>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Subject Selection */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">Which subject?</h3>
                <p className="text-sm text-muted-foreground">Select the subject you want to study</p>
                
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {teacherSubjects.map((subject) => subject && (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject.id)}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3',
                        selectedSubject === subject.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg',
                        selectedSubject === subject.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                      )}>
                        {subject.icon}
                      </div>
                      <span className="font-medium text-foreground">{subject.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Group Selection (only for group sessions) */}
            {step === 4 && sessionType === 'group' && (
              <motion.div
                key="step4-group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">Choose your study partners</h3>
                <p className="text-sm text-muted-foreground">
                  These students also want to learn {SUBJECTS.find(s => s.id === selectedSubject)?.name}
                </p>
                
                <div className="space-y-3 mt-6 max-h-64 overflow-y-auto">
                  {matchingLearners.filter(l => l.subject === selectedSubject).length > 0 ? (
                    matchingLearners.filter(l => l.subject === selectedSubject).map((learner) => (
                      <button
                        key={learner.id}
                        onClick={() => toggleLearner(learner.id)}
                        className={cn(
                          'w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4',
                          selectedLearners.includes(learner.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <div className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm',
                          selectedLearners.includes(learner.id) 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-foreground'
                        )}>
                          {learner.avatar}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-foreground">{learner.name}</p>
                          <p className="text-xs text-muted-foreground">Waiting for {learner.waitingSince}</p>
                        </div>
                        <div className={cn(
                          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                          selectedLearners.includes(learner.id)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground'
                        )}>
                          {selectedLearners.includes(learner.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 rounded-full bg-primary-foreground"
                            />
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No other students waiting for this subject</p>
                      <Button 
                        variant="link" 
                        onClick={() => setSessionType('individual')}
                        className="mt-2"
                      >
                        Switch to individual session
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4/5: Date & Time Selection */}
            {((step === 4 && sessionType === 'individual') || (step === 5 && sessionType === 'group')) && (
              <motion.div
                key="step-datetime"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">Choose date and time</h3>
                <p className="text-sm text-muted-foreground">Select a slot that works for you</p>
                
                <div className="space-y-4 mt-6">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {getDates().map((d) => (
                      <button
                        key={d.date}
                        onClick={() => setSelectedDate(d.date)}
                        className={cn(
                          'flex-shrink-0 w-16 p-3 rounded-xl border-2 transition-all text-center',
                          selectedDate === d.date
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <p className="text-xs text-muted-foreground uppercase">{d.day}</p>
                        <p className="text-lg font-bold text-foreground">{d.num}</p>
                        <p className="text-xs text-muted-foreground">{d.month}</p>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {AVAILABLE_TIMES.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          'p-3 rounded-xl border-2 transition-all text-center font-medium',
                          selectedTime === time
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50 text-foreground'
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <div />
            )}
            
            {((step === 4 && sessionType === 'individual') || (step === 5 && sessionType === 'group')) ? (
              <Button 
                onClick={handleConfirm}
                disabled={!canProceed()}
                className="bg-gradient-primary"
              >
                Confirm Booking
              </Button>
            ) : (
              <Button 
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}