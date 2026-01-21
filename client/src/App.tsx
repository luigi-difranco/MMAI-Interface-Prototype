import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Datasets from "@/pages/Datasets";
import DatasetDetail from "@/pages/DatasetDetail";
import Models from "@/pages/Models";
import UsersPage from "@/pages/Users";
import AuditLogs from "@/pages/AuditLogs";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType, adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-primary">Loading...</div>;

  if (!user) return <Redirect to="/login" />;
  
  if (adminOnly && user.role !== 'admin') {
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      <Route path="/datasets">
        <ProtectedRoute component={Datasets} />
      </Route>
      
      <Route path="/datasets/:id">
        <ProtectedRoute component={DatasetDetail} />
      </Route>
      
      <Route path="/models">
        <ProtectedRoute component={Models} />
      </Route>
      
      <Route path="/admin/users">
        <ProtectedRoute component={UsersPage} adminOnly />
      </Route>
      
      <Route path="/admin/audit">
        <ProtectedRoute component={AuditLogs} adminOnly />
      </Route>

      <Route path="/">
        <Redirect to="/login" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
