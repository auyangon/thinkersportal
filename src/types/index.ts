export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  course?: string;
  department?: string;
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  studentEmail: string;
  studentName: string;
  course: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: string;
}

export interface AttendanceSummary {
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface Exam {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  totalMarks: number;
  createdBy: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Result {
  id: string;
  examId: string;
  examTitle: string;
  course: string;
  studentEmail: string;
  studentName: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  author: string;
  authorRole: UserRole;
  date: string;
  priority: 'low' | 'medium' | 'high';
  target: 'all' | 'students' | 'teachers';
}

export interface CourseInfo {
  id: string;
  name: string;
  code: string;
  department: string;
  teacher: string;
  students: number;
}

export interface SystemStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  activeAnnouncements: number;
  averageAttendance: number;
}
