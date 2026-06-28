import DashboardShell from "../../../components/DashboardShell";

export default async function DashboardLayout({ children, params }) {
  const { role } = await params;
  return <DashboardShell role={role}>{children}</DashboardShell>;
}
