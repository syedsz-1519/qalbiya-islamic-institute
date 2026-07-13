export interface Course {
  id: string;
  title: string;
  category: 'women' | 'kids';
  flagship: boolean;
  duration: string;
  schedule: string;
  instructor: string;
  description: string;
  longDescription: string;
  outline: string[];
  benefits: string[];
  imagePrompt: string; // Used to describe the image we generate/show
  bgGradient: string;
  formId?: string; // Optional Google Form ID if initialized
  formUrl?: string; // Google Form publish/responder link
  isNew?: boolean;
}

export interface UserEnrollment {
  courseId: string;
  enrolledAt: string;
  status: 'enrolled' | 'completed';
  formResponseId?: string; // Track if they filled the intake form
}

export interface FormResponse {
  responseId: string;
  submittedAt: string;
  answers: {
    question: string;
    answer: string;
  }[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: 'admin' | 'student';
  enrollments: UserEnrollment[];
  bookmarks: string[];
  progress: Record<string, string[]>; // courseId -> list of completed lessons
  bio?: string;
  studyBackground?: string;
  ageGroup?: string;
  goals?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  courseId?: string;
  createdAt: string;
}

