import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-slate-50/50">
      {/* Sidebar */}
      <AppSidebar className="fixed left-0 top-0 z-40" />

      {/* Main Content Area */}
      <div className="flex-1 ml-[260px] transition-all duration-300">
        {/* Top Navbar */}
        <TopNavbar className="sticky top-0 z-30" />

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
