
import { useState } from "react";
import { AppLayout } from "@/components/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const StudentSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    phone: user?.phone || "",
    secondaryEmail: user?.secondaryEmail || "",
  });
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };
  
  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, this would make an API call to update the password
    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido actualizada exitosamente",
    });
    
    setFormData({
      ...formData,
      password: "",
      confirmPassword: "",
    });
  };
  
  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // In a real application, this would make an API call to update the profile
    toast({
      title: "Perfil actualizado",
      description: "La información de tu perfil ha sido actualizada",
    });
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Configuración de Cuenta</h1>
        
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Perfil</CardTitle>
            <CardDescription>
              Actualiza tus datos de contacto y foto de perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* User avatar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={uploadedImage || user?.photo} />
                    <AvatarFallback className="text-2xl">
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <Label htmlFor="photo" className="block mb-2">
                      Foto de perfil
                    </Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="max-w-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG o GIF. Tamaño máximo 1MB.
                    </p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                {/* Basic info */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" value={user?.name} disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Para cambiar tu nombre, contacta a administración.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primaryEmail">Correo institucional</Label>
                    <Input id="primaryEmail" value={user?.email} disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Tu correo institucional no puede ser cambiado.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryEmail">Correo secundario</Label>
                    <Input
                      id="secondaryEmail"
                      name="secondaryEmail"
                      type="email"
                      value={formData.secondaryEmail}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Para recibir notificaciones en caso de emergencia.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle>Cambiar Contraseña</CardTitle>
            <CardDescription>
              Actualiza tu contraseña para mantener tu cuenta segura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Nueva contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Mínimo 8 caracteres, incluye mayúsculas y números.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">Cambiar Contraseña</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default StudentSettings;
