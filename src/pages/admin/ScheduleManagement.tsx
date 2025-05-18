
import { useState } from "react";
import { AppLayout } from "@/components/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Edit, Trash } from "lucide-react";
import { 
  currentSchedules as mockSchedules, 
  activities, 
  teachers, 
  currentSemester,
  getActivityById,
  getTeacherById
} from "@/lib/mock-data";
import { ActivitySchedule } from "@/types";
import { useToast } from "@/hooks/use-toast";

const days = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState<ActivitySchedule[]>(mockSchedules);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ActivitySchedule | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    activityId: "",
    teacherId: "",
    dayOfWeek: 1,
    startTime: "08:00",
    endTime: "10:00",
    location: "",
    maxCapacity: 20,
    enrolledStudents: 0,
  });
  
  const { toast } = useToast();

  const filteredSchedules = schedules.filter(
    (schedule) => {
      const activity = getActivityById(schedule.activityId);
      const teacher = getTeacherById(schedule.teacherId);
      
      return (
        !searchQuery ||
        activity?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity?.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  );

  const handleOpenCreateDialog = () => {
    setEditingSchedule(null);
    setFormData({
      activityId: "",
      teacherId: "",
      dayOfWeek: 1,
      startTime: "08:00",
      endTime: "10:00",
      location: "",
      maxCapacity: 20,
      enrolledStudents: 0,
    });
    setCreateDialogOpen(true);
  };

  const handleOpenEditDialog = (schedule: ActivitySchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      activityId: schedule.activityId,
      teacherId: schedule.teacherId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      location: schedule.location,
      maxCapacity: schedule.maxCapacity,
      enrolledStudents: schedule.enrolledStudents,
    });
    setCreateDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // For numeric inputs, convert string to number
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // If we're changing the activity, check if we need to update maxCapacity
    if (name === "activityId") {
      const activity = getActivityById(value);
      if (activity && !editingSchedule) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          maxCapacity: activity.maxCapacity,
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (editingSchedule) {
      // Update existing schedule
      const updatedSchedules = schedules.map((schedule) =>
        schedule.id === editingSchedule.id
          ? { ...editingSchedule, ...formData, semesterId: currentSemester.id }
          : schedule
      );
      setSchedules(updatedSchedules);
      toast({
        title: "Horario actualizado",
        description: "Se han guardado los cambios al horario",
      });
    } else {
      // Create new schedule
      const newSchedule: ActivitySchedule = {
        id: `schedule-${schedules.length + 1}`,
        ...formData,
        semesterId: currentSemester.id,
      };
      setSchedules([...schedules, newSchedule]);
      toast({
        title: "Horario creado",
        description: "Se ha añadido el nuevo horario",
      });
    }
    
    setCreateDialogOpen(false);
  };

  const handleDelete = (scheduleId: string) => {
    // In a real application, you would want to show a confirmation dialog
    const updatedSchedules = schedules.filter((schedule) => schedule.id !== scheduleId);
    setSchedules(updatedSchedules);
    toast({
      title: "Horario eliminado",
      description: "El horario ha sido eliminado",
    });
  };

  // Filter teachers for a given activity
  const getEligibleTeachers = (activityId: string) => {
    return teachers.filter(teacher => teacher.activities.includes(activityId));
  };

  // Helper to format day of week
  const getDayName = (day: number) => {
    return days.find(d => d.value === day)?.label || "Desconocido";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestión de Horarios</h1>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Horario
          </Button>
        </div>

        {/* Current semester info */}
        <div className="bg-secondary p-4 rounded-md">
          <p className="font-bold">Semestre actual: {currentSemester.name}</p>
          <p className="text-sm text-muted-foreground">
            {currentSemester.enrollmentOpen
              ? "Inscripciones abiertas"
              : "Inscripciones cerradas"}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar horarios..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Schedules table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actividad</TableHead>
                  <TableHead>Profesor</TableHead>
                  <TableHead>Día</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Cupos</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((schedule) => {
                    const activity = getActivityById(schedule.activityId);
                    const teacher = getTeacherById(schedule.teacherId);
                    
                    return (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">
                          {activity ? `${activity.name} (${activity.code})` : "Desconocida"}
                        </TableCell>
                        <TableCell>{teacher?.name || "Desconocido"}</TableCell>
                        <TableCell>{getDayName(schedule.dayOfWeek)}</TableCell>
                        <TableCell>{`${schedule.startTime} - ${schedule.endTime}`}</TableCell>
                        <TableCell>{schedule.location}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            schedule.enrolledStudents === schedule.maxCapacity 
                              ? "text-red-500" 
                              : schedule.enrolledStudents > schedule.maxCapacity * 0.8 
                              ? "text-amber-500" 
                              : "text-green-500"
                          }`}>
                            {schedule.enrolledStudents}/{schedule.maxCapacity}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEditDialog(schedule)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(schedule.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No se encontraron horarios.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? "Editar Horario" : "Nuevo Horario"}
              </DialogTitle>
              <DialogDescription>
                {editingSchedule
                  ? "Modifique los datos del horario."
                  : "Ingrese los datos del nuevo horario."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="activity">Actividad</Label>
                    <Select
                      value={formData.activityId}
                      onValueChange={(value) => handleSelectChange("activityId", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una actividad" />
                      </SelectTrigger>
                      <SelectContent>
                        {activities.map((activity) => (
                          <SelectItem key={activity.id} value={activity.id}>
                            {activity.name} ({activity.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Profesor</Label>
                    <Select
                      value={formData.teacherId}
                      onValueChange={(value) => handleSelectChange("teacherId", value)}
                      disabled={!formData.activityId}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un profesor" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.activityId ? (
                          getEligibleTeachers(formData.activityId).length > 0 ? (
                            getEligibleTeachers(formData.activityId).map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>
                              No hay profesores disponibles
                            </SelectItem>
                          )
                        ) : (
                          <SelectItem value="" disabled>
                            Seleccione una actividad primero
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="day">Día</Label>
                    <Select
                      value={String(formData.dayOfWeek)}
                      onValueChange={(value) => handleSelectChange("dayOfWeek", parseInt(value))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un día" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day.value} value={String(day.value)}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Hora de inicio</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Hora de fin</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxCapacity">Capacidad máxima</Label>
                    <Input
                      id="maxCapacity"
                      name="maxCapacity"
                      type="number"
                      min="1"
                      value={formData.maxCapacity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="enrolledStudents">Alumnos inscritos</Label>
                    <Input
                      id="enrolledStudents"
                      name="enrolledStudents"
                      type="number"
                      min="0"
                      max={formData.maxCapacity}
                      value={formData.enrolledStudents}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default ScheduleManagement;
