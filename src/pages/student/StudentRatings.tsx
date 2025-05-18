
import { useState } from "react";
import { AppLayout } from "@/components/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { useAuth } from "@/contexts/AuthContext";
import { 
  previousSemesters, 
  studentEnrollments, 
  getActivityById, 
  getTeacherById 
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

const StudentRatings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState("");
  
  // Form state for rating
  const [formData, setFormData] = useState({
    activityRating: 0,
    teacherRating: 0,
    comment: "",
  });
  
  // Get completed enrollments that can be rated
  const ratableEnrollments = studentEnrollments.filter(
    (enrollment) => 
      enrollment.studentId === user?.id && 
      enrollment.completed && 
      !enrollment.rating
  );
  
  // Get already rated enrollments
  const ratedEnrollments = studentEnrollments.filter(
    (enrollment) => 
      enrollment.studentId === user?.id && 
      enrollment.rating
  );
  
  const handleOpenRatingDialog = (enrollmentId: string) => {
    setSelectedEnrollmentId(enrollmentId);
    setFormData({
      activityRating: 0,
      teacherRating: 0,
      comment: "",
    });
    setRatingDialogOpen(true);
  };
  
  const handleActivityRatingChange = (rating: number) => {
    setFormData({
      ...formData,
      activityRating: rating,
    });
  };
  
  const handleTeacherRatingChange = (rating: number) => {
    setFormData({
      ...formData,
      teacherRating: rating,
    });
  };
  
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      comment: e.target.value,
    });
  };
  
  const handleSubmitRating = () => {
    // In a real application, this would make an API call to submit the rating
    toast({
      title: "Valoración enviada",
      description: "Gracias por tus comentarios sobre la actividad",
    });
    setRatingDialogOpen(false);
  };
  
  // Get enrollment details
  const getEnrollmentDetails = (enrollmentId: string) => {
    const enrollment = studentEnrollments.find(e => e.id === enrollmentId);
    if (!enrollment) return null;
    
    const schedule = {
      id: "schedule-1",
      activityId: "act-1",
      teacherId: "teacher-1",
      semesterId: enrollment.semesterId,
      dayOfWeek: 1,
      startTime: "14:00",
      endTime: "16:00",
      location: "Campo Deportivo Norte",
      enrolledStudents: 20,
      maxCapacity: 25,
    };
    
    const activity = getActivityById(schedule.activityId);
    const teacher = getTeacherById(schedule.teacherId);
    const semester = previousSemesters.find(s => s.id === enrollment.semesterId);
    
    return { enrollment, schedule, activity, teacher, semester };
  };
  
  const selectedDetails = selectedEnrollmentId 
    ? getEnrollmentDetails(selectedEnrollmentId) 
    : null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Valoración de Actividades</h1>
        
        {/* Pending ratings section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Actividades por Valorar</h2>
          
          {ratableEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratableEnrollments.map((enrollment) => {
                const details = getEnrollmentDetails(enrollment.id);
                if (!details) return null;
                
                return (
                  <Card key={enrollment.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{details.activity?.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {details.semester?.name}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">
                        <span className="font-medium">Profesor:</span> {details.teacher?.name}
                      </p>
                      
                      <Button 
                        onClick={() => handleOpenRatingDialog(enrollment.id)}
                        className="w-full"
                      >
                        Valorar Actividad
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p>No tienes actividades pendientes por valorar.</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Previous ratings section */}
        {ratedEnrollments.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Valoraciones Enviadas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratedEnrollments.map((enrollment) => {
                const details = getEnrollmentDetails(enrollment.id);
                if (!details || !enrollment.rating) return null;
                
                return (
                  <Card key={enrollment.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{details.activity?.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {details.semester?.name}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="font-medium">Profesor: {details.teacher?.name}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Valoración de Actividad</p>
                          <StarRating 
                            readOnly 
                            initialRating={enrollment.rating.activityRating} 
                            size="sm" 
                          />
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-1">Valoración del Profesor</p>
                          <StarRating 
                            readOnly 
                            initialRating={enrollment.rating.teacherRating} 
                            size="sm" 
                          />
                        </div>
                      </div>
                      
                      {enrollment.rating.comment && (
                        <div className="bg-secondary p-3 rounded-md text-sm">
                          "{enrollment.rating.comment}"
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Enviado el {enrollment.rating.submittedDate.toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Rating Dialog */}
        {selectedDetails && (
          <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Valorar Actividad</DialogTitle>
                <DialogDescription>
                  Por favor, valora tu experiencia con esta actividad complementaria
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-6">
                <div>
                  <h3 className="font-bold text-lg">{selectedDetails.activity?.name}</h3>
                  <p className="text-muted-foreground">Profesor: {selectedDetails.teacher?.name}</p>
                  <p className="text-muted-foreground">{selectedDetails.semester?.name}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Valoración de la Actividad</p>
                    <StarRating
                      initialRating={formData.activityRating}
                      onChange={handleActivityRatingChange}
                      size="md"
                    />
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Valoración del Profesor</p>
                    <StarRating
                      initialRating={formData.teacherRating}
                      onChange={handleTeacherRatingChange}
                      size="md"
                    />
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Comentarios (opcional)</p>
                    <Textarea
                      placeholder="Comparte tu experiencia con la actividad y el profesor..."
                      value={formData.comment}
                      onChange={handleCommentChange}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setRatingDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmitRating}
                  disabled={formData.activityRating === 0 || formData.teacherRating === 0}
                >
                  Enviar Valoración
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppLayout>
  );
};

export default StudentRatings;
