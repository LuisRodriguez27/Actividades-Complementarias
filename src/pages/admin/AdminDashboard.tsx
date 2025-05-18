
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/layouts/app-layout";
import { activities, currentSchedules, teachers } from "@/lib/mock-data";

const AdminDashboard = () => {
  // Calculate stats
  const totalActivities = activities.length;
  const totalTeachers = teachers.length;
  const totalSchedules = currentSchedules.length;
  const totalCapacity = currentSchedules.reduce((sum, schedule) => sum + schedule.maxCapacity, 0);
  const enrolledStudents = currentSchedules.reduce((sum, schedule) => sum + schedule.enrolledStudents, 0);
  const capacityPercentage = Math.round((enrolledStudents / totalCapacity) * 100);

  // Find schedules with few spots left
  const almostFullSchedules = currentSchedules
    .filter(schedule => {
      const remainingSpots = schedule.maxCapacity - schedule.enrolledStudents;
      return remainingSpots <= 3 && remainingSpots > 0;
    })
    .slice(0, 3);

  // Find full schedules
  const fullSchedules = currentSchedules
    .filter(schedule => schedule.maxCapacity === schedule.enrolledStudents)
    .slice(0, 3);

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>
      
      {/* Dashboard cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Actividades</CardTitle>
            <CardDescription>Total en catálogo</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalActivities}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Profesores</CardTitle>
            <CardDescription>Activos este semestre</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalTeachers}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Horarios</CardTitle>
            <CardDescription>Total de horarios activos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalSchedules}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Ocupación</CardTitle>
            <CardDescription>Cupos ocupados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{capacityPercentage}%</p>
            <p className="text-sm text-muted-foreground mt-1">
              {enrolledStudents} de {totalCapacity} cupos
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Alerts section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Alertas</h2>
        
        {almostFullSchedules.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Horarios casi llenos:</h3>
            <div className="space-y-2">
              {almostFullSchedules.map(schedule => {
                const activity = activities.find(a => a.id === schedule.activityId);
                const teacher = teachers.find(t => t.id === schedule.teacherId);
                const remainingSpots = schedule.maxCapacity - schedule.enrolledStudents;
                
                return (
                  <div key={schedule.id} className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-md">
                    <p className="font-medium">{activity?.name} ({activity?.code})</p>
                    <p className="text-sm">Prof. {teacher?.name} • Quedan {remainingSpots} cupo{remainingSpots > 1 ? 's' : ''}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {fullSchedules.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Horarios llenos:</h3>
            <div className="space-y-2">
              {fullSchedules.map(schedule => {
                const activity = activities.find(a => a.id === schedule.activityId);
                const teacher = teachers.find(t => t.id === schedule.teacherId);
                
                return (
                  <div key={schedule.id} className="p-4 bg-red-500/10 border border-red-500/20 rounded-md">
                    <p className="font-medium">{activity?.name} ({activity?.code})</p>
                    <p className="text-sm">Prof. {teacher?.name} • No hay cupos disponibles</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {almostFullSchedules.length === 0 && fullSchedules.length === 0 && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
            <p>No hay alertas en este momento.</p>
          </div>
        )}
      </div>
      
      {/* Action links */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-xl">Crear Nuevo Profesor</CardTitle>
              <CardDescription>Añade un profesor al sistema</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-xl">Añadir Actividad</CardTitle>
              <CardDescription>Registra una nueva actividad complementaria</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-xl">Gestionar Horarios</CardTitle>
              <CardDescription>Configura los horarios del semestre</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
