export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: ('teacher' | 'learner')[];
  subjects: string[];
  isTopTeacher: boolean;
  ratingAverage: number;
  ratingCount: number;
  pricePerHour?: number;
  bio?: string;
  availability?: { day: string; time: string; location?: string }[];
}

// Alias for clarity
export type Teacher = User;

export interface Subject {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export interface Session {
  id: string;
  teacherId: string;
  learnerId: string;
  subjectId: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'scheduled' | 'completed' | 'canceled';
  teacher?: User;
  learner?: User;
  subject?: Subject;
}

export interface Rating {
  id: string;
  sessionId: string;
  teacherId: string;
  learnerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export const SUBJECTS: Subject[] = [
  { id: 'math', name: 'Mathematics', category: 'Sciences', icon: '📐' },
  { id: 'physics', name: 'Physics', category: 'Sciences', icon: '⚛️' },
  { id: 'chemistry', name: 'Chemistry', category: 'Sciences', icon: '🧪' },
  { id: 'biology', name: 'Biology', category: 'Sciences', icon: '🧬' },
  { id: 'french', name: 'French', category: 'Languages', icon: '📚' },
  { id: 'english', name: 'English', category: 'Languages', icon: '🇬🇧' },
  { id: 'arabic', name: 'Arabic', category: 'Languages', icon: '📖' },
  { id: 'history', name: 'History', category: 'Humanities', icon: '🏛️' },
  { id: 'philosophy', name: 'Philosophy', category: 'Humanities', icon: '🤔' },
  { id: 'cs', name: 'Computer Science', category: 'Tech', icon: '💻' },
  { id: 'economics', name: 'Economics', category: 'Business', icon: '📈' },
];

// Mock data for teachers with Tunisian university student names
export const MOCK_TEACHERS: User[] = [
  {
    id: '1',
    name: 'Yassine Ben Ali',
    email: 'yassine@enit.tn',
    avatar: '',
    roles: ['teacher', 'learner'],
    subjects: ['math', 'physics'],
    isTopTeacher: true,
    ratingAverage: 4.9,
    ratingCount: 47,
    pricePerHour: 18,
    bio: 'Engineering student at ENIT with 3 years of tutoring experience. I make complex concepts simple!',
    availability: [
      { day: 'Monday', time: '10:00-12:00', location: 'Tunis Centre' },
      { day: 'Wednesday', time: '14:00-16:00', location: 'Online' },
    ],
  },
  {
    id: '2',
    name: 'Mariem Trabelsi',
    email: 'mariem@fst.tn',
    avatar: '',
    roles: ['teacher'],
    subjects: ['french', 'philosophy'],
    isTopTeacher: true,
    ratingAverage: 4.8,
    ratingCount: 52,
    pricePerHour: 15,
    bio: 'Literature student at FST. Passionate about French literature and philosophy.',
    availability: [
      { day: 'Tuesday', time: '13:00-17:00', location: 'La Marsa' },
      { day: 'Thursday', time: '10:00-14:00', location: 'Online' },
    ],
  },
  {
    id: '3',
    name: 'Amine Bouazizi',
    email: 'amine@insat.tn',
    avatar: '',
    roles: ['teacher', 'learner'],
    subjects: ['physics', 'chemistry'],
    isTopTeacher: false,
    ratingAverage: 4.6,
    ratingCount: 23,
    pricePerHour: 12,
    bio: 'Science enthusiast at INSAT. Helping others understand the universe!',
    availability: [
      { day: 'Monday', time: '14:00-18:00', location: 'Sfax' },
    ],
  },
  {
    id: '4',
    name: 'Nour El Houda Jebali',
    email: 'nour@ihec.tn',
    avatar: '',
    roles: ['teacher'],
    subjects: ['english', 'french'],
    isTopTeacher: true,
    ratingAverage: 4.95,
    ratingCount: 38,
    pricePerHour: 20,
    bio: 'Business student at IHEC. Bilingual English-French, preparing for international exams.',
    availability: [
      { day: 'Tuesday', time: '09:00-13:00', location: 'Sousse' },
      { day: 'Saturday', time: '10:00-14:00', location: 'Online' },
    ],
  },
  {
    id: '5',
    name: 'Mohamed Sahli',
    email: 'mohamed@esprit.tn',
    avatar: '',
    roles: ['teacher', 'learner'],
    subjects: ['cs', 'math'],
    isTopTeacher: false,
    ratingAverage: 4.4,
    ratingCount: 15,
    pricePerHour: 15,
    bio: 'Computer science student at ESPRIT. Expert in programming and algorithms!',
    availability: [
      { day: 'Wednesday', time: '15:00-17:00', location: 'Ariana' },
    ],
  },
  {
    id: '6',
    name: 'Fatma Gharbi',
    email: 'fatma@fmp.tn',
    avatar: '',
    roles: ['teacher'],
    subjects: ['biology', 'chemistry'],
    isTopTeacher: true,
    ratingAverage: 4.85,
    ratingCount: 41,
    pricePerHour: 18,
    bio: 'Medical student at FMP. Making biology and chemistry fun and easy to understand!',
    availability: [
      { day: 'Tuesday', time: '10:00-14:00', location: 'Ben Arous' },
      { day: 'Thursday', time: '10:00-14:00', location: 'Online' },
    ],
  },
];
