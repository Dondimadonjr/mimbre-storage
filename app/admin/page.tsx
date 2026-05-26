import { redirect } from "next/navigation";

import { getAdminAuthorization } from "@/lib/admin-auth";
import AdminDashboardClient from "./_components/AdminDashboardClient";

export default async function AdminPage() {
  const authorization = await getAdminAuthorization();

  if (authorization.status === "unauthenticated") {
    redirect("/admin/login");
  }

  if (!authorization.isAdmin) {
    redirect("/");
  }

  return <AdminDashboardClient />;
}
