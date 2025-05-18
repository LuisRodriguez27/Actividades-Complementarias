
import { useState } from "react";
import { AppLayout } from "@/components/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { activities as mockActivities, activityCategories } from "@/lib/mock-data";
import { Activity } from "@/types";
import { useToast } from "@/hooks/use-toast";

const ActivityManagement = () => {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    categoryId: "",
    maxCapacity: 20,
  });
  
  const { toast } = useToast();

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter ? activity.categoryId === categoryFilter : true;
      
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreateDialog = () => {
    setEditingActivity(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      categoryId: "",
      maxCapacity: 20,
    });
    setCreateDialogOpen(true);
  };

  const handleOpenEditDialog = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      code: activity.code,
      name: activity.name,
      description: activity.description,
      categoryId: activity.categoryId,
      maxCapacity: activity.maxCapacity,
    });
    setCreateDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // For maxCapacity, convert string to number
    if (name === "maxCapacity") {
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

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      categoryId: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (editingActivity) {
      // Update existing activity
      const updatedActivities = activities.map((activity) =>
        activity.id === editingActivity.id
          ? { ...editingActivity, ...formData }
          : activity
      );
      setActivities(updatedActivities);
      toast({
        title: "Actividad actualizada",
        description: `Se actualizó la información de ${formData.name}`,
      });
    } else {
      // Create new activity
      const newActivity: Activity = {
        id: `act-${activities.length + 1}`,
        ...formData,
      };
      setActivities([...activities, newActivity]);
      toast({
        title: "Actividad creada",
        description: `Se ha añadido ${formData.name} al catálogo`,
      });
    }
    
    setCreateDialogOpen(false);
  };

  const handleDelete = (activityId: string) => {
    // In a real application, you would want to show a confirmation dialog
    const updatedActivities = activities.filter((activity) => activity.id !== activityId);
    setActivities(updatedActivities);
    toast({
      title: "Actividad eliminada",
      description: "La actividad ha sido eliminada del catálogo",
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = activityCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Sin categoría";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Catálogo de Actividades</h1>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Nueva Actividad
          </Button>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar actividades..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="sm:w-[200px]">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las categorías</SelectItem>
                {activityCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Activities table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Capacidad máx.</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.code}</TableCell>
                      <TableCell>{activity.name}</TableCell>
                      <TableCell>{getCategoryName(activity.categoryId)}</TableCell>
                      <TableCell>{activity.maxCapacity}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEditDialog(activity)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(activity.id)}
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
                      No se encontraron actividades.
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
                {editingActivity ? "Editar Actividad" : "Nueva Actividad"}
              </DialogTitle>
              <DialogDescription>
                {editingActivity
                  ? "Modifique los datos de la actividad complementaria."
                  : "Ingrese los datos de la nueva actividad complementaria."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="code">Código</Label>
                    <Input
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={handleCategoryChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {activityCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
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

export default ActivityManagement;
