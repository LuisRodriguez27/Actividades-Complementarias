
import { Activity, ActivityCategory, ActivitySchedule, Enrollment, Semester, Teacher } from "@/types";

// Current academic period
export const currentSemester: Semester = {
  id: "sem-2025-1",
  name: "February-June 2025",
  startDate: new Date("2025-02-01"),
  endDate: new Date("2025-06-30"),
  enrollmentOpen: true,
  ratingOpen: false,
};

// Previous semesters
export const previousSemesters: Semester[] = [
  {
    id: "sem-2024-2",
    name: "August-December 2024",
    startDate: new Date("2024-08-01"),
    endDate: new Date("2024-12-15"),
    enrollmentOpen: false,
    ratingOpen: true,
  },
  {
    id: "sem-2024-1",
    name: "February-June 2024",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-06-30"),
    enrollmentOpen: false,
    ratingOpen: false,
  },
];

// Activity categories
export const activityCategories: ActivityCategory[] = [
  { id: "cat-1", name: "Deportes", description: "Actividades deportivas" },
  { id: "cat-2", name: "Arte y Cultura", description: "Actividades artísticas y culturales" },
  { id: "cat-3", name: "Tecnología", description: "Actividades relacionadas con la tecnología" },
  { id: "cat-4", name: "Idiomas", description: "Aprendizaje de idiomas" },
  { id: "cat-5", name: "Voluntariado", description: "Actividades de servicio comunitario" },
];

// Teachers
export const teachers: Teacher[] = [
  {
    id: "teacher-1",
    name: "Dr. Juan Pérez",
    email: "jperez@university.edu",
    department: "Deportes",
    activities: ["act-1", "act-2"],
  },
  {
    id: "teacher-2",
    name: "Mtra. María González",
    email: "mgonzalez@university.edu",
    department: "Arte y Cultura",
    activities: ["act-3", "act-4"],
  },
  {
    id: "teacher-3",
    name: "Ing. Carlos Rodríguez",
    email: "crodriguez@university.edu",
    department: "Tecnología",
    activities: ["act-5"],
  },
  {
    id: "teacher-4",
    name: "Lic. Ana López",
    email: "alopez@university.edu",
    department: "Idiomas",
    activities: ["act-6", "act-7"],
  },
];

// Activities
export const activities: Activity[] = [
  {
    id: "act-1",
    code: "DEP-001",
    name: "Fútbol",
    description: "Entrenamiento y práctica de fútbol",
    categoryId: "cat-1",
    maxCapacity: 25,
  },
  {
    id: "act-2",
    code: "DEP-002",
    name: "Baloncesto",
    description: "Entrenamiento y práctica de baloncesto",
    categoryId: "cat-1",
    maxCapacity: 20,
  },
  {
    id: "act-3",
    code: "ART-001",
    name: "Pintura",
    description: "Curso de técnicas de pintura",
    categoryId: "cat-2",
    maxCapacity: 15,
  },
  {
    id: "act-4",
    code: "ART-002",
    name: "Teatro",
    description: "Taller de actuación y expresión teatral",
    categoryId: "cat-2",
    maxCapacity: 18,
  },
  {
    id: "act-5",
    code: "TEC-001",
    name: "Programación Web",
    description: "Introducción al desarrollo web",
    categoryId: "cat-3",
    maxCapacity: 30,
  },
  {
    id: "act-6",
    code: "IDM-001",
    name: "Inglés Conversacional",
    description: "Práctica de conversación en inglés",
    categoryId: "cat-4",
    maxCapacity: 20,
  },
  {
    id: "act-7",
    code: "IDM-002",
    name: "Francés Básico",
    description: "Introducción al idioma francés",
    categoryId: "cat-4",
    maxCapacity: 20,
  },
];

// Activity schedules for current semester
export const currentSchedules: ActivitySchedule[] = [
  {
    id: "schedule-1",
    activityId: "act-1",
    teacherId: "teacher-1",
    semesterId: "sem-2025-1",
    dayOfWeek: 1, // Monday
    startTime: "14:00",
    endTime: "16:00",
    location: "Campo Deportivo Norte",
    enrolledStudents: 20,
    maxCapacity: 25,
  },
  {
    id: "schedule-2",
    activityId: "act-2",
    teacherId: "teacher-1",
    semesterId: "sem-2025-1",
    dayOfWeek: 3, // Wednesday
    startTime: "14:00",
    endTime: "16:00",
    location: "Gimnasio Principal",
    enrolledStudents: 15,
    maxCapacity: 20,
  },
  {
    id: "schedule-3",
    activityId: "act-3",
    teacherId: "teacher-2",
    semesterId: "sem-2025-1",
    dayOfWeek: 2, // Tuesday
    startTime: "10:00",
    endTime: "12:00",
    location: "Salón de Artes 101",
    enrolledStudents: 12,
    maxCapacity: 15,
  },
  {
    id: "schedule-4",
    activityId: "act-5",
    teacherId: "teacher-3",
    semesterId: "sem-2025-1",
    dayOfWeek: 4, // Thursday
    startTime: "16:00",
    endTime: "18:00",
    location: "Laboratorio de Computación 3",
    enrolledStudents: 30,
    maxCapacity: 30,
  },
  {
    id: "schedule-5",
    activityId: "act-6",
    teacherId: "teacher-4",
    semesterId: "sem-2025-1",
    dayOfWeek: 5, // Friday
    startTime: "12:00",
    endTime: "14:00",
    location: "Aula de Idiomas 2",
    enrolledStudents: 18,
    maxCapacity: 20,
  },
];

// Student enrollments
export const studentEnrollments: Enrollment[] = [
  {
    id: "enrollment-1",
    studentId: "2", // Student user ID
    scheduleId: "schedule-5",
    semesterId: "sem-2025-1",
    enrollmentDate: new Date("2025-01-15"),
    attended: false,
    completed: false,
  },
  {
    id: "enrollment-2",
    studentId: "2",
    scheduleId: "schedule-1", // From previous semester
    semesterId: "sem-2024-2",
    enrollmentDate: new Date("2024-08-10"),
    attended: true,
    completed: true,
    rating: {
      id: "rating-1",
      enrollmentId: "enrollment-2",
      activityRating: 4,
      teacherRating: 5,
      comment: "Excelente actividad, muy recomendable",
      submittedDate: new Date("2024-12-10"),
    },
  },
];

// Function to get available schedules for enrollment
export function getAvailableSchedules(): ActivitySchedule[] {
  return currentSchedules.filter(
    (schedule) => schedule.enrolledStudents < schedule.maxCapacity
  );
}

// Function to get an activity by ID
export function getActivityById(id: string): Activity | undefined {
  return activities.find((activity) => activity.id === id);
}

// Function to get a teacher by ID
export function getTeacherById(id: string): Teacher | undefined {
  return teachers.find((teacher) => teacher.id === id);
}

// Function to get a category by ID
export function getCategoryById(id: string): ActivityCategory | undefined {
  return activityCategories.find((category) => category.id === id);
}
