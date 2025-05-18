
// Common types used throughout the application

// Academic period (semester)
export type Semester = {
  id: string;
  name: string; // e.g., "February-June 2025"
  startDate: Date;
  endDate: Date;
  enrollmentOpen: boolean; // whether students can enroll in activities
  ratingOpen: boolean; // whether students can rate activities
};

// Teacher information
export type Teacher = {
  id: string;
  name: string;
  email: string;
  department?: string;
  activities: string[]; // IDs of activities this teacher can teach
};

// Activity category
export type ActivityCategory = {
  id: string;
  name: string;
  description?: string;
};

// Complementary activity
export type Activity = {
  id: string;
  code: string; // unique code
  name: string;
  description: string;
  categoryId: string;
  maxCapacity: number;
};

// Activity schedule
export type ActivitySchedule = {
  id: string;
  activityId: string;
  teacherId: string;
  semesterId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // format: "HH:MM"
  endTime: string; // format: "HH:MM"
  location: string;
  enrolledStudents: number;
  maxCapacity: number;
};

// Student enrollment
export type Enrollment = {
  id: string;
  studentId: string;
  scheduleId: string;
  semesterId: string;
  enrollmentDate: Date;
  attended: boolean;
  completed: boolean;
  rating?: ActivityRating;
};

// Activity rating
export type ActivityRating = {
  id: string;
  enrollmentId: string;
  activityRating: number; // 1-5 stars
  teacherRating: number; // 1-5 stars
  comment?: string;
  submittedDate: Date;
};
