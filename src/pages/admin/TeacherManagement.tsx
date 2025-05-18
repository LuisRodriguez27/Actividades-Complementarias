
import { useState } from "react";
import { AppLayout } from "@/components/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash } from "lucide-react";
import { teachers as mockTeachers, activities } from "@/lib/mock-data";
import { Teacher } from "@/types";
import { useToast } from "@/hooks/use-toast";

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    activities: [] as string[],
  });
  
  const { toast } = useToast();

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreateDialog = () => {
    setEditingTeacher(null);
    setFormData({
      name: "",
      email: "",
      department: "",
      activities: [],
    });
    setCreateDialogOpen(true);
  };

  const handleOpenEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      department: teacher.department || "",
      activities: teacher.activities,
    });
    setCreateDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleActivityToggle = (activityId: string, checked: boolean) => {
    setFormData({
      ...formData,
      activities: checked
        ? [...formData.activities, activityId]
        : formData.activities.filter((id) => id !== activityId),
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (editingTeacher) {
      // Update existing teacher
      const updatedTeachers = teachers.map((teacher) =>
        teacher.id === editingTeacher.id
          ? { ...editingTeacher, ...formData }
          : teacher
      );
      setTeachers(updatedTeachers);
      toast({
        title: "Profesor actualizado",
        description: `Se actualizó la información de ${formData.name}`,
      });
    } else {
      // Create new teacher
      const newTeacher: Teacher = {
        id: `teacher-${teachers.length + 1}`,
        ...formData,
      };
      setTeachers([...teachers, newTeacher]);
      toast({
        title: "Profesor creado",
        description: `Se ha añadido ${formData.name} al sistema`,
      });
    }
    
    setCreateDialogOpen(false);
  };

  const handleDelete = (teacherId: string) => {
    // In a real application, you would want to show a confirmation dialog
    const updatedTeachers = teachers.filter((teacher) => teacher.id !== teacherId);
    setTeachers(updatedTeachers);
    toast({
      title: "Profesor eliminado",
      description: "El profesor ha sido eliminado del sistema",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestión de Profesores</h1>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Profesor
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar profesores..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Teachers table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Actividades Asignadas</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.department || "-"}</TableCell>
                      <TableCell>
                        {teacher.activities.length > 0
                          ? teacher.activities.map((actId) => {
                              const activity = activities.find((a) => a.id === actId);
                              return (
                                <span
                                  key={actId}
                                  className="inline-block bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs mr-1 mb-1"
                                >
                                  {activity?.name}
                                </span>
                              );
                            })
                          : "Ninguna"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEditDialog(teacher)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(teacher.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No se encontraron profesores.
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
                {editingTeacher ? "Editar Profesor" : "Nuevo Profesor"}
              </DialogTitle>
              <DialogDescription>
                {editingTeacher
                  ? "Modifique los datos del profesor y sus actividades asignadas."
                  : "Ingrese los datos del nuevo profesor y asigne actividades."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Actividades que puede impartir</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`activity-${activity.id}`}
                          checked={formData.activities.includes(activity.id)}
                          onCheckedChange={(checked) =>
                            handleActivityToggle(activity.id, !!checked)
                          }
                        />
                        <Label
                          htmlFor={`activity-${activity.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {activity.name} ({activity.code})
                        </Label>
                      </div>
                    ))}
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

export default TeacherManagement;
