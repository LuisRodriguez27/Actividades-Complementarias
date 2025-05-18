
import { AppLayout } from "@/components/layouts/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currentSchedules, studentEnrollments, getActivityById, getTeacherById } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Clock, MapPin } from "lucide-react";

const DayMap: { [key: number]: string } = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

const StudentDashboard = () => {
  const { user } = useAuth();
  
  // Get current enrollment for the student
  const currentEnrollment = studentEnrollments.find(
    (enrollment) => enrollment.studentId === user?.id && enrollment.semesterId === "sem-2025-1"
  );
  
  // Get schedule details for the current enrollment
  const currentSchedule = currentEnrollment
    ? currentSchedules.find((schedule) => schedule.id === currentEnrollment.scheduleId)
    : null;
  
  // Get activity and teacher details
  const activity = currentSchedule
    ? getActivityById(currentSchedule.activityId)
    : null;
  
  const teacher = currentSchedule
    ? getTeacherById(currentSchedule.teacherId)
    : null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mi Horario Actual</h1>
        
        {currentSchedule && activity && teacher ? (
          <>
            <Card className="overflow-hidden border-2 border-primary/20">
              <div className="bg-primary/10 p-6">
                <h2 className="text-2xl font-bold">{activity.name}</h2>
                <p className="text-muted-foreground">Código: {activity.code}</p>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 text-accent" size={20} />
                    <div>
                      <h3 className="font-semibold">Día</h3>
                      <p>{DayMap[currentSchedule.dayOfWeek]}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 text-accent" size={20} />
                    <div>
                      <h3 className="font-semibold">Horario</h3>
                      <p>{currentSchedule.startTime} - {currentSchedule.endTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 text-accent" size={20} />
                    <div>
                      <h3 className="font-semibold">Ubicación</h3>
                      <p>{currentSchedule.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Descripción de la Actividad</h3>
                  <p>{activity.description}</p>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Profesor</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                      {teacher.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-sm text-muted-foreground">{teacher.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t flex flex-col sm:flex-row sm:justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Cupo</h3>
                    <p className="text-sm">
                      {currentSchedule.enrolledStudents}/{currentSchedule.maxCapacity} alumnos inscritos
                    </p>
                  </div>
                  
                  <div className="mt-2 sm:mt-0">
                    <h3 className="font-semibold mb-1">Estado</h3>
                    <span className="inline-block bg-green-500/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm">
                      Inscrito
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asistencias</CardTitle>
                  <CardDescription>Registro de asistencias a esta actividad</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6">
                    <p className="text-muted-foreground">El registro de asistencias comenzará pronto.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Calendario</CardTitle>
                  <CardDescription>Próximas sesiones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6">
                    <p className="text-muted-foreground">El calendario de sesiones estará disponible próximamente.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">No tienes actividades inscritas</h2>
              <p className="text-muted-foreground mb-6">
                Actualmente no estás inscrito en ninguna actividad complementaria para este semestre.
              </p>
              <div className="inline-block bg-primary/10 rounded-md p-4">
                <p>¿Deseas inscribirte a una actividad?</p>
                <a
                  href="/student/enrollment"
                  className="text-accent font-medium hover:underline"
                >
                  Ir a la sección de Reinscripción
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;
