import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Clock, MapPin, Video, Plus, Search, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SUBJECTS } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StudyGroup {
  id: string;
  subject: string;
  title: string;
  description: string;
  members: { name: string; avatar: string }[];
  maxMembers: number;
  date: string;
  time: string;
  location: 'online' | 'in-person';
  locationDetails: string;
  host: string;
}

const STUDY_GROUPS: StudyGroup[] = [
  {
    id: '1',
    subject: 'math',
    title: 'Calculus Study Session',
    description: 'Review group for integration and derivatives. Preparing for midterms together!',
    members: [
      { name: 'Youssef Ben Ali', avatar: 'YB' },
      { name: 'Fatma Trabelsi', avatar: 'FT' },
      { name: 'Khaled Mansour', avatar: 'KM' },
    ],
    maxMembers: 6,
    date: '2024-01-20',
    time: '15:00',
    location: 'online',
    locationDetails: 'Google Meet',
    host: 'Mariem Saidi'
  },
  {
    id: '2',
    subject: 'physics',
    title: 'Mechanics Lab Review',
    description: 'Review of Newtonian mechanics exercises and applications for engineering students.',
    members: [
      { name: 'Rim Bouazizi', avatar: 'RB' },
      { name: 'Amine Jebali', avatar: 'AJ' },
    ],
    maxMembers: 5,
    date: '2024-01-21',
    time: '10:00',
    location: 'in-person',
    locationDetails: 'National Library, Tunis',
    host: 'Nour Hamdi'
  },
  {
    id: '3',
    subject: 'french',
    title: 'Essay Writing Workshop',
    description: 'Perfect your essay writing technique with practical exercises.',
    members: [
      { name: 'Sarra Chaabane', avatar: 'SC' },
    ],
    maxMembers: 4,
    date: '2024-01-22',
    time: '14:00',
    location: 'online',
    locationDetails: 'Zoom',
    host: 'Amir Mejri'
  },
  {
    id: '4',
    subject: 'english',
    title: 'Speaking Practice',
    description: 'Improve your English speaking skills through conversation and debates.',
    members: [
      { name: 'Yasmine Gharbi', avatar: 'YG' },
      { name: 'Mohamed Riahi', avatar: 'MR' },
      { name: 'Ines Kacem', avatar: 'IK' },
      { name: 'Omar Sfaxi', avatar: 'OS' },
    ],
    maxMembers: 8,
    date: '2024-01-23',
    time: '17:00',
    location: 'in-person',
    locationDetails: 'Literary Cafe, La Marsa',
    host: 'Sami Belhadj'
  },
];

export default function StudyGroupsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const filteredGroups = STUDY_GROUPS.filter(group => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!group.title.toLowerCase().includes(query) && 
          !group.description.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (selectedSubject && group.subject !== selectedSubject) {
      return false;
    }
    return true;
  });

  const handleJoinGroup = (group: StudyGroup) => {
    toast.success(`You joined "${group.title}"!`, {
      description: `${group.date} at ${group.time} • ${group.locationDetails}`
    });
  };

  const handleCreateGroup = () => {
    toast.info('Coming soon!', {
      description: 'Create your own study group very soon.'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  Study Groups
                </h1>
                <p className="text-muted-foreground">
                  Join study groups or create your own
                </p>
              </div>
              <Button onClick={handleCreateGroup} className="bg-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedSubject === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSubject(null)}
              >
                All
              </Button>
              {SUBJECTS.slice(0, 5).map((subject) => (
                <Button
                  key={subject.id}
                  variant={selectedSubject === subject.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSubject(subject.id)}
                >
                  {subject.icon} {subject.name}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
          >
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{STUDY_GROUPS.length}</p>
                  <p className="text-sm text-muted-foreground">Active Groups</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">Lower Cost</p>
                  <p className="text-sm text-muted-foreground">Group sessions</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-secondary to-secondary/50 border-border">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">Collaborative</p>
                  <p className="text-sm text-muted-foreground">Learn together</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGroups.map((group, index) => {
              const subject = SUBJECTS.find(s => s.id === group.subject);
              const spotsLeft = group.maxMembers - group.members.length;
              
              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {subject?.icon} {subject?.name}
                            </Badge>
                            <Badge 
                              variant={group.location === 'online' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {group.location === 'online' ? (
                                <><Video className="w-3 h-3 mr-1" /> Online</>
                              ) : (
                                <><MapPin className="w-3 h-3 mr-1" /> In-person</>
                              )}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{group.title}</CardTitle>
                        </div>
                        <div className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          spotsLeft <= 2 
                            ? 'bg-destructive/10 text-destructive' 
                            : 'bg-primary/10 text-primary'
                        )}>
                          {spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(group.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })} at {group.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {group.location === 'online' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span>{group.locationDetails}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {group.members.slice(0, 4).map((member, i) => (
                              <Avatar key={i} className="w-8 h-8 border-2 border-background">
                                <AvatarFallback className="text-xs bg-secondary">
                                  {member.avatar}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {group.members.length > 4 && (
                              <div className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium">
                                +{group.members.length - 4}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {group.members.length}/{group.maxMembers} members
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleJoinGroup(group)}
                          disabled={spotsLeft === 0}
                        >
                          Join
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredGroups.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No groups found</h3>
              <p className="text-muted-foreground mb-4">
                Create your own study group!
              </p>
              <Button onClick={handleCreateGroup}>
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}