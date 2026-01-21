import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Activity, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState("");

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
    } catch (err) {
      setError("Invalid credentials. Try 'admin' or 'researcher'.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/20">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900">BioVault</h1>
          <p className="text-slate-500 mt-2">Clinical Data Governance Platform</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl"
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <input 
                {...form.register("username")}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="e.g. admin"
              />
              {form.formState.errors.username && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.username.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input 
                {...form.register("password")}
                type="password"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="••••••••"
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                {error}
              </div>
            )}

            <button
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold shadow-lg shadow-primary/25 hover:bg-blue-600 hover:shadow-xl hover:shadow-primary/30 active:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
            <p>Protected System. Authorized Access Only.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
