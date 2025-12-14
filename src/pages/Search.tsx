import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { TeacherCard } from '@/components/teachers/teacher-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { MOCK_TEACHERS, SUBJECTS } from '@/lib/types';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');

  const filteredTeachers = useMemo(() => {
    return MOCK_TEACHERS.filter((teacher) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = teacher.name.toLowerCase().includes(query);
        const matchesSubjects = teacher.subjects.some((subId) => {
          const subject = SUBJECTS.find((s) => s.id === subId);
          return subject?.name.toLowerCase().includes(query);
        });
        if (!matchesName && !matchesSubjects) return false;
      }

      // Subject filter
      if (selectedSubject !== 'all' && !teacher.subjects.includes(selectedSubject)) {
        return false;
      }

      // Rating filter
      if (teacher.ratingAverage < minRating) {
        return false;
      }

      // Price filter
      if (priceFilter === 'free' && teacher.isTopTeacher && teacher.pricePerHour) {
        return false;
      }
      if (priceFilter === 'paid' && (!teacher.isTopTeacher || !teacher.pricePerHour)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedSubject, minRating, priceFilter]);

  const clearFilters = () => {
    setSelectedSubject('all');
    setMinRating(0);
    setPriceFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedSubject !== 'all' || minRating > 0 || priceFilter !== 'all' || searchQuery;

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
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Find Your Perfect Tutor
            </h1>
            <p className="text-muted-foreground">
              Search through our community of {MOCK_TEACHERS.length}+ peer tutors
            </p>
          </motion.div>

          {/* Search & Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col lg:flex-row gap-4 mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>

            <div className="flex gap-3">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[200px] h-12">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary">
                    {[selectedSubject !== 'all', minRating > 0, priceFilter !== 'all', searchQuery].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Extended Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-6 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground">Advanced Filters</h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Minimum Rating: {minRating.toFixed(1)}
                  </label>
                  <Slider
                    value={[minRating]}
                    onValueChange={([value]) => setMinRating(value)}
                    min={0}
                    max={5}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>5</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Price
                  </label>
                  <div className="flex gap-2">
                    {(['all', 'free', 'paid'] as const).map((option) => (
                      <Button
                        key={option}
                        variant={priceFilter === option ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPriceFilter(option)}
                        className="flex-1 capitalize"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredTeachers.length}</span> teachers found
            </p>
          </div>

          {filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher, index) => (
                <TeacherCard key={teacher.id} teacher={teacher} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No teachers found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
