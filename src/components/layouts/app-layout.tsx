
import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { NavLink, Navigate } from "react-router-dom";
import { Sun, Moon, LogOut, Menu, X } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const adminLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/teachers", label: "Profesores" },
    { to: "/admin/activities", label: "Actividades" },
    { to: "/admin/schedules", label: "Horarios" },
  ];

  const studentLinks = [
    { to: "/student", label: "Horario Actual" },
    { to: "/student/history", label: "Histórico" },
    { to: "/student/enrollment", label: "Reinscripción" },
    { to: "/student/settings", label: "Configuración" },
    { to: "/student/ratings", label: "Valoraciones" },
  ];

  const links = user?.role === "admin" ? adminLinks : studentLinks;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Instituto Tecnologico de Oaxaca</h1>
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-primary-foreground"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Desktop header navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-primary-foreground">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            <div className="flex items-center">
              <span className="mr-4">Hola, {user?.name}</span>
              <Button variant="ghost" size="icon" onClick={logout} className="text-primary-foreground">
                <LogOut size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden bg-primary text-primary-foreground py-2 px-4 shadow-md animate-fade-in">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-md ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-primary-foreground/10"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Button variant="ghost" onClick={toggleTheme} className="w-full justify-start">
                {isDarkMode ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
                {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
              </Button>
            </li>
            <li>
              <Button variant="ghost" onClick={logout} className="w-full justify-start text-left">
                <LogOut size={18} className="mr-2" />
                Cerrar Sesión
              </Button>
            </li>
          </ul>
        </nav>
      )}

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 bg-primary text-primary-foreground p-4">
          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-primary-foreground/10"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
