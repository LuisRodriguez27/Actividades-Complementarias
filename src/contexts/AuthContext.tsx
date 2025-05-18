
import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  photo?: string;
  phone?: string;
  secondaryEmail?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Mock login function - in a real app, this would connect to a backend
  const login = async (email: string, password: string) => {
    // Mock user data - in a real app, this would come from the backend
    if (email === "admin@example.com" && password === "password") {
      setUser({
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
      });
    } else if (email === "student@example.com" && password === "password") {
      setUser({
        id: "2",
        name: "Juan Perez",
        email: "student@example.com",
        role: "student",
        photo: "",
        phone: "123456789",
        secondaryEmail: "backup@example.com",
      });
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
