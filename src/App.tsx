import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PesquisaComparativa from "./pages/PesquisaAvancada";
import ProfessorDashboard from "./pages/prof";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// Componente protetor para rotas que exigem professor
const ProtectedProfessorRoute = ({
  element,
}: {
  element: React.ReactElement;
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "professor" && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return element;
};

// Componente protetor para rotas que exigem admin
const ProtectedAdminRoute = ({
  element,
}: {
  element: React.ReactElement;
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return element;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/avancado" element={<PesquisaComparativa />} />
    <Route
      path="/professor"
      element={<ProtectedProfessorRoute element={<ProfessorDashboard />} />}
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
