import { PageLayout } from "@/components/layout/PageLayout";
import { useUsers, useCreateUser } from "@/hooks/use-users";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, User, Shield, Building } from "lucide-react";
import { type InsertUser } from "@shared/routes";

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "password123", // Default for prototype
      role: "researcher",
      fullName: "",
      institution: "",
      isActive: true,
    }
  });

  const onSubmit = async (data: InsertUser) => {
    await createUser.mutateAsync(data);
    setIsOpen(false);
    form.reset();
  };

  return (
    <PageLayout title="User Management" action={
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input {...form.register("username")} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input {...form.register("fullName")} className="w-full p-2 border rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Institution</label>
              <input {...form.register("institution")} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select {...form.register("role")} className="w-full p-2 border rounded">
                <option value="researcher">Researcher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="w-full py-2 bg-primary text-white rounded font-bold mt-4">Create User</button>
          </form>
        </DialogContent>
      </Dialog>
    }>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Institution</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading...</td></tr>
            ) : (
              users?.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.fullName}</p>
                        <p className="text-xs text-slate-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      <span className="capitalize">{user.role}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Building className="w-4 h-4 text-slate-400" />
                      {user.institution}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.isActive ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                      {user.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-primary hover:underline font-medium text-xs">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}
