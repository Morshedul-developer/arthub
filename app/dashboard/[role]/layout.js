import DashboardShell from "../../../components/DashboardShell";
import AuthGuard from "../../../components/AuthGuard";

export default async function DashboardLayout({ children, params }) {
  const { role } = await params;
  return (
    <AuthGuard role={role}>
      <DashboardShell role={role}>{children}</DashboardShell>
    </AuthGuard>
  );
}
