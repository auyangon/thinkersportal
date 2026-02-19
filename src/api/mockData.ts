import type { UserProfile, AttendanceRecord, AttendanceSummary, Exam, Result, Announcement, CourseInfo, SystemStats } from '@/types';

// Demo users for different roles
const demoUsers: Record<string, UserProfile> = {
  'admin@university.edu': {
    uid: 'admin-001',
    name: 'Dr. Thandar Win',
    email: 'admin@university.edu',
    role: 'admin',
    department: 'Administration',
  },
  'teacher@university.edu': {
    uid: 'teacher-001',
    name: 'Prof. Kyaw Zin Htet',
    email: 'teacher@university.edu',
    role: 'teacher',
    department: 'Computer Science',
  },
  'student@university.edu': {
    uid: 'student-001',
    name: 'Aung Myat Thu',
    email: 'student@university.edu',
    role: 'student',
    studentId: 'AUY-2024-0042',
    course: 'B.Sc. Computer Science',
  },
};

const defaultUser: UserProfile = {
  uid: 'student-default',
  name: 'Demo Student',
  email: 'demo@auy.edu.mm',
  role: 'student',
  studentId: 'AUY-2024-0001',
  course: 'B.Sc. Computer Science',
};

export function getMockUser(email: string): UserProfile {
  return demoUsers[email] || { ...defaultUser, email, name: email.split('@')[0] };
}

export function getMockAttendance(_email: string): AttendanceRecord[] {
  return [
    { id: 'att-1', studentEmail: _email, studentName: 'Aung Myat Thu', course: 'Data Structures', date: '2025-01-15', status: 'present', markedBy: 'Prof. Kyaw Zin Htet' },
    { id: 'att-2', studentEmail: _email, studentName: 'Aung Myat Thu', course: 'Data Structures', date: '2025-01-14', status: 'present', markedBy: 'Prof. Kyaw Zin Htet' },
    { id: 'att-3', studentEmail: _email, studentName: 'Aung Myat Thu', course: 'Algorithms', date: '2025-01-15', status: 'late', markedBy: 'Prof. Hla Myo' },
    { id: 'att-4', studentEmail: _email, studentName: 'Aung Myat Thu', course: 'Data Structures', date: '2025-01-13', status: 'absent', markedBy: 'Prof. Kyaw Zin Htet' },
    { id: 'att-5', studentEmail: _email, studentName: 'Aung Myat Thu', course: 'Database Systems', date: '2025-01-15', status: 'present', markedBy: 'Prof. Min Thant' },
    { id: 'att-6', studentEmail: _email, studentName: 'Aung Myat Thu', course: 'Algorithms', date: '2025-01-14', status: 'present', markedBy: 'Prof. Hla Myo' },
    { id: 'att-7', studentEmail: _email, studentName: 'Aung Myat Thu', course: 'Operating Systems', date: '2025-01-15', status: 'present', markedBy: 'Prof. Su Su Lwin' },
    { id: 'att-8', studentEmail: _email, studentName: 'Aung Myat Thu', course: 'Data Structures', date: '2025-01-12', status: 'present', markedBy: 'Prof. Kyaw Zin Htet' },
  ];
}

export function getMockAttendanceSummary(): AttendanceSummary {
  return { totalClasses: 48, present: 38, absent: 5, late: 5, percentage: 79.2 };
}

export function getMockExams(): Exam[] {
  return [
    { id: 'exam-1', title: 'Data Structures Mid-Term', course: 'Data Structures', date: '2025-02-10', time: '10:00 AM', duration: '2 hours', totalMarks: 100, createdBy: 'Prof. Kyaw Zin Htet', status: 'upcoming' },
    { id: 'exam-2', title: 'Algorithms Quiz 3', course: 'Algorithms', date: '2025-01-28', time: '2:00 PM', duration: '45 min', totalMarks: 30, createdBy: 'Prof. Hla Myo', status: 'upcoming' },
    { id: 'exam-3', title: 'Database Design Project', course: 'Database Systems', date: '2025-02-15', time: '9:00 AM', duration: '3 hours', totalMarks: 100, createdBy: 'Prof. Min Thant', status: 'upcoming' },
    { id: 'exam-4', title: 'OS Lab Practical', course: 'Operating Systems', date: '2025-01-20', time: '11:00 AM', duration: '1.5 hours', totalMarks: 50, createdBy: 'Prof. Su Su Lwin', status: 'completed' },
  ];
}

export function getMockResults(): Result[] {
  return [
    { id: 'res-1', examId: 'exam-10', examTitle: 'Algorithms Mid-Term', course: 'Algorithms', studentEmail: '', studentName: 'Aung Myat Thu', marksObtained: 82, totalMarks: 100, grade: 'A', date: '2025-01-05' },
    { id: 'res-2', examId: 'exam-11', examTitle: 'Data Structures Quiz 2', course: 'Data Structures', studentEmail: '', studentName: 'Aung Myat Thu', marksObtained: 27, totalMarks: 30, grade: 'A+', date: '2024-12-18' },
    { id: 'res-3', examId: 'exam-12', examTitle: 'Database Fundamentals', course: 'Database Systems', studentEmail: '', studentName: 'Aung Myat Thu', marksObtained: 71, totalMarks: 100, grade: 'B+', date: '2024-12-10' },
    { id: 'res-4', examId: 'exam-13', examTitle: 'OS Concepts Quiz', course: 'Operating Systems', studentEmail: '', studentName: 'Aung Myat Thu', marksObtained: 44, totalMarks: 50, grade: 'A', date: '2024-11-28' },
  ];
}

export function getMockAnnouncements(): Announcement[] {
  return [
    { id: 'ann-1', title: 'Spring Semester Registration Open', message: 'Registration for Spring 2025 is now open. Please complete your course selection by January 25th. Contact your academic advisor for guidance.', author: 'Dr. Thandar Win', authorRole: 'admin', date: '2025-01-15', priority: 'high', target: 'all' },
    { id: 'ann-2', title: 'Library Extended Hours', message: 'The AUY library will have extended hours during exam week: 7 AM - 12 AM. Study rooms can be reserved online.', author: 'Admin Office', authorRole: 'admin', date: '2025-01-14', priority: 'medium', target: 'all' },
    { id: 'ann-3', title: 'Data Structures Lab Rescheduled', message: 'The Data Structures lab originally scheduled for Friday has been moved to Monday 3 PM in Lab 204.', author: 'Prof. Kyaw Zin Htet', authorRole: 'teacher', date: '2025-01-13', priority: 'medium', target: 'students' },
    { id: 'ann-4', title: 'AUY Career Fair 2025', message: 'Annual Career Fair will be held on February 20th at the University Auditorium. 50+ companies participating. Bring your resume!', author: 'Placement Cell', authorRole: 'admin', date: '2025-01-12', priority: 'low', target: 'all' },
    { id: 'ann-5', title: 'Faculty Meeting — Jan 30', message: 'Mandatory faculty meeting on January 30th at 4 PM in Conference Room A. Agenda: Curriculum revision and evaluation methods.', author: 'Dr. Thandar Win', authorRole: 'admin', date: '2025-01-11', priority: 'high', target: 'teachers' },
  ];
}

export function getMockCourses(): CourseInfo[] {
  return [
    { id: 'crs-1', name: 'Data Structures & Algorithms', code: 'CS201', department: 'Computer Science', teacher: 'Prof. Kyaw Zin Htet', students: 65 },
    { id: 'crs-2', name: 'Database Management Systems', code: 'CS301', department: 'Computer Science', teacher: 'Prof. Min Thant', students: 58 },
    { id: 'crs-3', name: 'Operating Systems', code: 'CS302', department: 'Computer Science', teacher: 'Prof. Su Su Lwin', students: 52 },
    { id: 'crs-4', name: 'Computer Networks', code: 'CS401', department: 'Computer Science', teacher: 'Prof. Hla Myo', students: 45 },
    { id: 'crs-5', name: 'Machine Learning', code: 'CS501', department: 'Computer Science', teacher: 'Prof. Zaw Win Tun', students: 38 },
    { id: 'crs-6', name: 'Software Engineering', code: 'CS303', department: 'Computer Science', teacher: 'Prof. Kyaw Zin Htet', students: 60 },
  ];
}

export function getMockSystemStats(): SystemStats {
  return {
    totalUsers: 342,
    totalStudents: 285,
    totalTeachers: 47,
    totalCourses: 36,
    activeAnnouncements: 5,
    averageAttendance: 82.4,
  };
}

export function getMockAllUsers(): UserProfile[] {
  return [
    { uid: 'admin-001', name: 'Dr. Thandar Win', email: 'admin@university.edu', role: 'admin', department: 'Administration' },
    { uid: 'teacher-001', name: 'Prof. Kyaw Zin Htet', email: 'teacher@university.edu', role: 'teacher', department: 'Computer Science' },
    { uid: 'teacher-002', name: 'Prof. Min Thant', email: 'minthant@auy.edu.mm', role: 'teacher', department: 'Computer Science' },
    { uid: 'teacher-003', name: 'Prof. Su Su Lwin', email: 'susulwin@auy.edu.mm', role: 'teacher', department: 'Computer Science' },
    { uid: 'teacher-004', name: 'Prof. Hla Myo', email: 'hlamyo@auy.edu.mm', role: 'teacher', department: 'Computer Science' },
    { uid: 'student-001', name: 'Aung Myat Thu', email: 'student@university.edu', role: 'student', studentId: 'AUY-2024-0042', course: 'B.Sc. CS' },
    { uid: 'student-002', name: 'Aye Chan Myae', email: 'ayechan@auy.edu.mm', role: 'student', studentId: 'AUY-2024-0043', course: 'B.Sc. CS' },
    { uid: 'student-003', name: 'Thet Paing Soe', email: 'thetpaing@auy.edu.mm', role: 'student', studentId: 'AUY-2024-0044', course: 'B.Sc. CS' },
    { uid: 'student-004', name: 'Su Myat Noe', email: 'sumyat@auy.edu.mm', role: 'student', studentId: 'AUY-2024-0045', course: 'B.Sc. IT' },
    { uid: 'student-005', name: 'Kaung Htet Aung', email: 'kaunghtet@auy.edu.mm', role: 'student', studentId: 'AUY-2024-0046', course: 'B.Sc. IT' },
  ];
}
