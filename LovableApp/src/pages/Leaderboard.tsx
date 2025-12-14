import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { StarRating } from '@/components/ui/star-rating';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_TEACHERS, SUBJECTS, User } from '@/lib/types';
import { Link } from 'react-router-dom';

// Sort teachers by total score (ratingAverage * ratingCount)
const rankedTeachers = [...MOCK_TEACHERS]
  .map((t) => ({
    ...t,
    totalScore: t.ratingAverage * t.ratingCount,
  }))
  .sort((a, b) => b.totalScore - a.totalScore);

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-amber-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-slate-400" />;
    case 3:
      return <Medal className="w-6 h-6 text-amber-700" />;
    default:
      return (
        <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">
          {rank}
        </span>
      );
  }
};

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/30';
    case 2:
      return 'bg-gradient-to-r from-slate-400/10 to-slate-400/5 border-slate-400/30';
    case 3:
      return 'bg-gradient-to-r from-amber-700/10 to-amber-700/5 border-amber-700/30';
    default:
      return 'bg-card border-border';
  }
};

export default function LeaderboardPage() {
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">{currentMonth}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Top Teachers Leaderboard
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The top 20 teachers each month earn the privilege to set their own prices. 
              Rankings are based on total score (rating × number of sessions).
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">20</div>
                <div className="text-sm text-muted-foreground">Premium Teachers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">4.7</div>
                <div className="text-sm text-muted-foreground">Avg Top Rating</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">1,200+</div>
                <div className="text-sm text-muted-foreground">Sessions This Month</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top 3 Podium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:grid grid-cols-3 gap-4 mb-12"
          >
            {/* 2nd Place */}
            <div className="pt-8">
              <TeacherPodiumCard teacher={rankedTeachers[1]} rank={2} />
            </div>
            {/* 1st Place */}
            <div>
              <TeacherPodiumCard teacher={rankedTeachers[0]} rank={1} />
            </div>
            {/* 3rd Place */}
            <div className="pt-12">
              <TeacherPodiumCard teacher={rankedTeachers[2]} rank={3} />
            </div>
          </motion.div>

          {/* Full Rankings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Full Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rankedTeachers.map((teacher, index) => (
                    <TeacherRankRow
                      key={teacher.id}
                      teacher={teacher}
                      rank={index + 1}
                      isTop20={index < 20}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function TeacherPodiumCard({ teacher, rank }: { teacher: User & { totalScore: number }; rank: number }) {
  const teacherSubjects = SUBJECTS.filter((s) => teacher.subjects.includes(s.id));

  return (
    <Link to={`/teacher/${teacher.id}`}>
      <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${getRankBg(rank)}`}>
        <CardContent className="p-6 text-center">
          {/* Rank Badge */}
          <div className="absolute top-4 left-4">
            {getRankIcon(rank)}
          </div>

          <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-primary-foreground">
              {teacher.name.charAt(0)}
            </span>
          </div>

          <h3 className="font-semibold text-foreground mb-1">{teacher.name}</h3>
          <StarRating rating={teacher.ratingAverage} size="sm" showValue className="justify-center" />

          <div className="flex flex-wrap gap-1 justify-center mt-3">
            {teacherSubjects.slice(0, 2).map((subject) => (
              <Badge key={subject.id} variant="secondary" className="text-xs">
                {subject.name}
              </Badge>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-2xl font-bold text-foreground">
              {teacher.totalScore.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Score</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function TeacherRankRow({
  teacher,
  rank,
  isTop20,
}: {
  teacher: User & { totalScore: number };
  rank: number;
  isTop20: boolean;
}) {
  const teacherSubjects = SUBJECTS.filter((s) => teacher.subjects.includes(s.id));

  return (
    <Link to={`/teacher/${teacher.id}`}>
      <div
        className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-secondary/50 ${getRankBg(rank)}`}
      >
        {/* Rank */}
        <div className="w-10 flex items-center justify-center">
          {getRankIcon(rank)}
        </div>

        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-primary-foreground">
            {teacher.name.charAt(0)}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground truncate">{teacher.name}</h3>
            {isTop20 && (
              <Badge variant="outline" className="text-xs border-accent text-accent">
                Premium
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={teacher.ratingAverage} size="sm" />
            <span className="text-xs text-muted-foreground">
              ({teacher.ratingCount} sessions)
            </span>
          </div>
        </div>

        {/* Subjects */}
        <div className="hidden sm:flex flex-wrap gap-1 max-w-[200px]">
          {teacherSubjects.slice(0, 2).map((subject) => (
            <Badge key={subject.id} variant="secondary" className="text-xs">
              {subject.name}
            </Badge>
          ))}
        </div>

        {/* Score */}
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">
            {teacher.totalScore.toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
      </div>
    </Link>
  );
}
