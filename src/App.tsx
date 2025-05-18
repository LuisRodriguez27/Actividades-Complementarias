
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

// Auth page
import Login from "./pages/Login";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherManagement from "./pages/admin/TeacherManagement";
import ActivityManagement from "./pages/admin/ActivityManagement";
import ScheduleManagement from "./pages/admin/ScheduleManagement";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentHistory from "./pages/student/StudentHistory";
import StudentEnrollment from "./pages/student/StudentEnrollment";
import StudentSettings from "./pages/student/StudentSettings";
import StudentRatings from "./pages/student/StudentRatings";

// Not found page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Route guard for authenticated routes
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Route guard for role-based routes
const RoleRoute = ({ 
  children, 
  allowedRole 
}: { 
  children: React.ReactNode;
  allowedRole: "admin" | "student";
}) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== allowedRole) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={user?.role === "admin" ? "/admin" : "/student"} />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Root redirect based on role */}
              <Route 
                path="/" 
                element={
                  <AuthRoute>
                    <RootRedirect />
                  </AuthRoute>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin" 
                element={
                  <RoleRoute allowedRole="admin">
                    <AdminDashboard />
                  </RoleRoute>
                } 
              />
              <Route 
                path="/admin/teachers" 
                element={
                  <RoleRoute allowedRole="admin">
                    <TeacherManagement />
                  </RoleRoute>
                } 
              />
              <Route 
                path="/admin/activities" 
                element={
                  <RoleRoute allowedRole="admin">
                    <ActivityManagement />
                  </RoleRoute>
                } 
              />
              <Route 
                path="/admin/schedules" 
                element={
                  <RoleRoute allowedRole="admin">
                    <ScheduleManagement />
                  </RoleRoute>
                } 
              />
              
              {/* Student routes */}
              <Route 
                path="/student" 
                element={
                  <RoleRoute allowedRole="student">
                    <StudentDashboard />
                  </RoleRoute>
                } 
              />
              <Route 
                path="/student/history" 
                element={
                  <RoleRoute allowedRole="student">
                    <StudentHistory />
                  </RoleRoute>
                } 
              />
              <Route 
                path="/student/enrollment" 
                element={
                  <RoleRoute allowedRole="student">
                    <StudentEnrollment />
                  </RoleRoute>
                } 
              />
              <Route 
                path="/student/settings" 
                element={
                  <RoleRoute allowedRole="student">
                    <StudentSettings />
                  </RoleRoute>
                } 
              />
              <Route 
                path="/student/ratings" 
                element={
                  <RoleRoute allowedRole="student">
                    <StudentRatings />
                  </RoleRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

// Helper component to redirect to the appropriate dashboard based on user role
const RootRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === "admin") {
    return <Navigate to="/admin" />;
  }
  
  return <Navigate to="/student" />;
};

export default App;
