
import { useState } from "react";
import { AppLayout } from "@/components/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Check } from "lucide-react";
import { activities, currentSchedules, activityCategories, getActivityById, getTeacherById, currentSemester } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const dayMap: { [key: number]: string } = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

const StudentEnrollment = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState("all");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const { toast } = useToast();
  
  // Sort schedules: available first, then by enrollment percentage
  const sortedSchedules = [...currentSchedules].sort((a, b) => {
    // Check if full
    const aFull = a.enrolledStudents >= a.maxCapacity;
    const bFull = b.enrolledStudents >= b.maxCapacity;
    
    if (aFull && !bFull) return 1;
    if (!aFull && bFull) return -1;
    
    // Then sort by enrollment percentage (lower percentage first)
    const aPercentage = a.enrolledStudents / a.maxCapacity;
    const bPercentage = b.enrolledStudents / b.maxCapacity;
    return aPercentage - bPercentage;
  });
  
  // Apply filters
  const filteredSchedules = sortedSchedules.filter((schedule) => {
    const activity = getActivityById(schedule.activityId);
    const teacher = getTeacherById(schedule.teacherId);
    
    const matchesSearch =
      !searchQuery ||
      (activity &&
        (activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (teacher && teacher.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || 
      (activity && activity.categoryId === categoryFilter);
    
    const matchesDay = dayFilter === "all" || 
      schedule.dayOfWeek === parseInt(dayFilter);
    
    return matchesSearch && matchesCategory && matchesDay;
  });
  
  const handleEnrollment = (scheduleId: string) => {
    setSelectedScheduleId(scheduleId);
    setEnrollDialogOpen(true);
  };
  
  const confirmEnrollment = () => {
    // In a real application, this would make an API call to enroll the student
    toast({
      title: "Inscripción exitosa",
      description: "Has sido inscrito en la actividad complementaria",
    });
    setEnrollDialogOpen(false);
  };
  
  const getScheduleDetails = (scheduleId: string) => {
    const schedule = currentSchedules.find(s => s.id === scheduleId);
    if (!schedule) return null;
    
    const activity = getActivityById(schedule.activityId);
    const teacher = getTeacherById(schedule.teacherId);
    
    return { schedule, activity, teacher };
  };
  
  const selectedDetails = selectedScheduleId ? getScheduleDetails(selectedScheduleId) : null;

  // Format active filters for display
  const activeFilters = [];
  if (categoryFilter !== "all") {
    const category = activityCategories.find(c => c.id === categoryFilter);
    if (category) activeFilters.push(`Categoría: ${category.name}`);
  }
  if (dayFilter !== "all") {
    activeFilters.push(`Día: ${dayMap[parseInt(dayFilter)]}`);
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">Reinscripción</h1>
          
          <div className="flex items-center space-x-2">
            <p className={`text-sm ${currentSemester.enrollmentOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {currentSemester.enrollmentOpen ? 'Inscripciones abiertas' : 'Inscripciones cerradas'}
            </p>
            <span className={`w-3 h-3 rounded-full ${currentSemester.enrollmentOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar por nombre, código o profesor..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter button */}
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setFilterDialogOpen(true)}
          >
            <Filter size={16} />
            Filtrar
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        </div>
        
        {/* Active filters display */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {filter}
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                setCategoryFilter("all");
                setDayFilter("all");
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
        
        {/* Schedule cards */}
        {filteredSchedules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSchedules.map((schedule) => {
              const activity = getActivityById(schedule.activityId);
              const teacher = getTeacherById(schedule.teacherId);
              const category = activity
                ? activityCategories.find(c => c.id === activity.categoryId)
                : null;
              
              const availableSpots = schedule.maxCapacity - schedule.enrolledStudents;
              const isFull = availableSpots <= 0;
              
              return (
                <Card key={schedule.id} className={`overflow-hidden border-2 ${isFull ? 'border-red-500/20' : 'border-green-500/20'}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{activity?.name}</CardTitle>
                        <CardDescription>Código: {activity?.code}</CardDescription>
                      </div>
                      {category && (
                        <Badge variant="outline" className="ml-2">
                          {category.name}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-semibold">Profesor</h3>
                        <p>{teacher?.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">Día y Horario</h3>
                        <p>{dayMap[schedule.dayOfWeek]}, {schedule.startTime} - {schedule.endTime}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">Ubicación</h3>
                        <p>{schedule.location}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">Cupos</h3>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className={`h-2.5 rounded-full ${isFull ? 'bg-red-500' : schedule.enrolledStudents / schedule.maxCapacity > 0.8 ? 'bg-amber-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(100, (schedule.enrolledStudents / schedule.maxCapacity) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">
                            {schedule.enrolledStudents}/{schedule.maxCapacity}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      {isFull ? (
                        <div className="bg-red-500/10 text-red-700 dark:text-red-400 px-4 py-2 rounded-md text-sm">
                          No hay cupos disponibles
                        </div>
                      ) : (
                        <div className="bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-2 rounded-md text-sm">
                          {availableSpots} cupo{availableSpots !== 1 ? 's' : ''} disponible{availableSpots !== 1 ? 's' : ''}
                        </div>
                      )}
                      
                      <Button
                        onClick={() => handleEnrollment(schedule.id)}
                        disabled={isFull || !currentSemester.enrollmentOpen}
                      >
                        Inscribirse
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold mb-2">No se encontraron actividades</h2>
              <p className="text-muted-foreground">
                No hay actividades que coincidan con tus criterios de búsqueda.
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Filter dialog */}
        <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filtrar Actividades</DialogTitle>
              <DialogDescription>
                Selecciona opciones para filtrar las actividades disponibles.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoría</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {activityCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Día de la semana</label>
                <Select value={dayFilter} onValueChange={setDayFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los días" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los días</SelectItem>
                    {Object.entries(dayMap).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setCategoryFilter("all");
                  setDayFilter("all");
                }}
              >
                Limpiar
              </Button>
              <Button onClick={() => setFilterDialogOpen(false)}>
                Aplicar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Enrollment confirmation dialog */}
        <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Confirmar Inscripción</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas inscribirte en esta actividad?
              </DialogDescription>
            </DialogHeader>
            
            {selectedDetails && (
              <div className="py-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-lg">{selectedDetails.activity?.name}</h3>
                        <p className="text-sm text-muted-foreground">Código: {selectedDetails.activity?.code}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-semibold">Profesor:</span> {selectedDetails.teacher?.name}
                        </div>
                        <div>
                          <span className="font-semibold">Horario:</span> {dayMap[selectedDetails.schedule.dayOfWeek]}, {selectedDetails.schedule.startTime} - {selectedDetails.schedule.endTime}
                        </div>
                        <div>
                          <span className="font-semibold">Ubicación:</span> {selectedDetails.schedule.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <p className="mt-4 text-sm">
                  Al confirmar, te inscribirás en esta actividad para el semestre {currentSemester.name}.
                </p>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEnrollDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmEnrollment}>
                <Check className="mr-2 h-4 w-4" />
                Confirmar Inscripción
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default StudentEnrollment;
