import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { SUBJECTS } from '@/lib/types';
import { toast } from 'sonner';

type AuthMode = 'login' | 'signup' | 'role-select' | 'subject-select';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      // Store the user's name for later use
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      setMode('role-select');
    }
  };

  const handleRoleSelect = () => {
    if (roles.length === 0) {
      toast.error('Please select at least one role');
      return;
    }
    localStorage.setItem('userRoles', JSON.stringify(roles));
    if (roles.includes('teacher')) {
      setMode('subject-select');
    } else {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    }
  };

  const handleSubjectSelect = () => {
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }
    localStorage.setItem('userSubjects', JSON.stringify(selectedSubjects));
    toast.success('Account created successfully!');
    navigate('/dashboard');
  };

  const toggleRole = (role: string) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const subjectsByCategory = SUBJECTS.reduce((acc, subject) => {
    if (!acc[subject.category]) acc[subject.category] = [];
    acc[subject.category].push(subject);
    return acc;
  }, {} as Record<string, typeof SUBJECTS>);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {(mode === 'role-select' || mode === 'subject-select') && (
            <button
              onClick={() => setMode(mode === 'subject-select' ? 'role-select' : 'signup')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Peer<span className="text-gradient">Teach</span>
            </span>
          </Link>

          {(mode === 'login' || mode === 'signup') && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-muted-foreground mb-8">
                {mode === 'login'
                  ? 'Sign in to continue learning'
                  : 'Join thousands of students learning together'}
              </p>

              <form onSubmit={handleInitialSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 h-11">
                  {mode === 'login' ? 'Sign In' : 'Continue'}
                </Button>
              </form>

              <p className="mt-6 text-center text-muted-foreground">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-primary font-medium hover:underline"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </>
          )}

          {mode === 'role-select' && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                How do you want to use PeerTeach?
              </h1>
              <p className="text-muted-foreground mb-8">
                You can always change this later
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => toggleRole('learner')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    roles.includes('learner')
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">I want to learn</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Find peer tutors and book learning sessions
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        roles.includes('learner')
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground/30'
                      }`}
                    >
                      {roles.includes('learner') && (
                        <Check className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => toggleRole('teacher')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    roles.includes('teacher')
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">I want to teach</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Share your knowledge and help other students
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        roles.includes('teacher')
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground/30'
                      }`}
                    >
                      {roles.includes('teacher') && (
                        <Check className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                </button>
              </div>

              <Button
                onClick={handleRoleSelect}
                className="w-full mt-8 bg-gradient-primary hover:opacity-90 h-11"
              >
                Continue
              </Button>
            </>
          )}

          {mode === 'subject-select' && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                What subjects can you teach?
              </h1>
              <p className="text-muted-foreground mb-8">
                Select all subjects you're comfortable teaching
              </p>

              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                {Object.entries(subjectsByCategory).map(([category, subjects]) => (
                  <div key={category}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject) => (
                        <Badge
                          key={subject.id}
                          variant={selectedSubjects.includes(subject.id) ? 'default' : 'outline'}
                          className={`cursor-pointer transition-all ${
                            selectedSubjects.includes(subject.id)
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-secondary'
                          }`}
                          onClick={() => toggleSubject(subject.id)}
                        >
                          {selectedSubjects.includes(subject.id) && (
                            <Check className="w-3 h-3 mr-1" />
                          )}
                          {subject.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleSubjectSelect}
                className="w-full mt-8 bg-gradient-primary hover:opacity-90 h-11"
              >
                Create Account
              </Button>
            </>
          )}
        </motion.div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-primary items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Join 2,500+ students learning together
          </h2>
          <p className="text-primary-foreground/80">
            Connect with peers, share knowledge, and excel in your studies with PeerTeach.
          </p>

          {/* Floating Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary-foreground">14</div>
              <div className="text-xs text-primary-foreground/70">Subjects</div>
            </div>
            <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary-foreground">500+</div>
              <div className="text-xs text-primary-foreground/70">Teachers</div>
            </div>
            <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary-foreground">4.9</div>
              <div className="text-xs text-primary-foreground/70">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
