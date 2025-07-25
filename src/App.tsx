import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ListingUser from "./components/users/ListingUser";
import ListingProject from "./components/projects/ListingProject"; // Import the new component
import CreateProjectForm from "./components/projects/CreateProjectForm";
import EditProjectForm from "./components/projects/EditProjectForm";
import ProjectManagement from "./components/projects/ProjectManagement"; // Import ProjectManagement
import Layout from "./components/layout/Layout";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Index />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute> 
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects" 
        element={
          <ProtectedRoute requiredPermission="manage_project">
            <Layout>
              <ListingProject />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/userslisting" 
        element={
          <ProtectedRoute requiredPermission="manage_users">
            <Layout>
              <ListingUser />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects/create" 
        element={
          <ProtectedRoute requiredPermission="create_projects">
            <Layout>
              <CreateProjectForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/projects/edit/:id" 
        element={
          <ProtectedRoute requiredPermission="edit_projects">
            <Layout>
              <EditProjectForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/projectmanagement" 
        element={
          <ProtectedRoute requiredPermission="manage_project">
            <Layout>
              <ProjectManagement />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;