
import { useState } from "react";
import { AppLayout } from "@/components/layouts/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { previousSemesters, studentEnrollments, getActivityById, getTeacherById } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { StarRating } from "@/components/ui/star-rating";
import {Download} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

const DayMap: { [key: number]: string } = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

const StudentHistory = () => {
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState<string>(
    previousSemesters[0]?.id || ""
  );
  
  // Get student's past enrollments
  const studentPastEnrollments = studentEnrollments.filter(
    (enrollment) => 
      enrollment.studentId === user?.id && 
      enrollment.semesterId !== "sem-2025-1" &&
      (selectedSemester === "" || enrollment.semesterId === selectedSemester)
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">Historial de Actividades</h1>
          
          <div className="w-full sm:w-64">
            <Select 
              value={selectedSemester} 
              onValueChange={setSelectedSemester}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar semestre" />
              </SelectTrigger>
              <SelectContent>
                {previousSemesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>
                    {semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {studentPastEnrollments.length > 0 ? (
          <div className="space-y-6">
            {studentPastEnrollments.map((enrollment) => {
              // Find the related schedule for this enrollment
              const schedule = {
                id: "schedule-1",
                activityId: "act-1",
                teacherId: "teacher-1",
                semesterId: "sem-2024-2",
                dayOfWeek: 1, // Monday
                startTime: "14:00",
                endTime: "16:00",
                location: "Campo Deportivo Norte",
                enrolledStudents: 20,
                maxCapacity: 25,
              };
              
              // Get activity and teacher information
              const activity = getActivityById(schedule.activityId);
              const teacher = getTeacherById(schedule.teacherId);
              
              // Find the semester information
              const semester = previousSemesters.find(
                (sem) => sem.id === enrollment.semesterId
              );
              
              return (
                <Card key={enrollment.id} className="overflow-hidden">
                  <div className="bg-primary/10 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h2 className="text-xl font-bold">{activity?.name}</h2>
                        <p className="text-sm text-muted-foreground">Código: {activity?.code}</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                          {semester?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-semibold">Profesor</h3>
                        <p>{teacher?.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">Día y Horario</h3>
                        <p>{DayMap[schedule.dayOfWeek]}, {schedule.startTime} - {schedule.endTime}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">Ubicación</h3>
                        <p>{schedule.location}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">Estado Final</h3>
                          <div className="mt-1">
                            {enrollment.completed ? (
                              <span className="bg-green-500/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm">
                                Completada
                              </span>
                            ) : (
                              <span className="bg-red-500/20 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-sm">
                                No completada
                              </span>
                            )}
                          </div>
                        </div>

                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Download size={16}/>
                          Descargar horario
                        </Button>
                        
                        {enrollment.rating && (
                          <div className="space-y-2">
                            <div>
                              <h3 className="text-sm font-semibold">Valoración de Actividad</h3>
                              <StarRating readOnly initialRating={enrollment.rating.activityRating} size="sm" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold">Valoración del Profesor</h3>
                              <StarRating readOnly initialRating={enrollment.rating.teacherRating} size="sm" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold mb-2">No hay registros para mostrar</h2>
              <p className="text-muted-foreground">
                No se encontraron actividades completadas para el semestre seleccionado.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default StudentHistory;
