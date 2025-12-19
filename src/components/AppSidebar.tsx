import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
  Fingerprint,
  GraduationCap,
  Users,
  Brain,
  Database,
  FileText,
  MessageSquare,
  Building2,
  Trophy,
  DollarSign,
  BarChart3,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  isCollapsed: boolean;
  isActive?: boolean;
  hasDropdown?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
}

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isCollapsed,
  isActive,
  hasDropdown,
  isOpen,
  onToggle,
  children,
}: SidebarItemProps) => {
  const content = (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
        "hover:bg-primary/10 hover:text-primary",
        isActive && "bg-primary/15 text-primary font-medium",
        !isActive && "text-muted-foreground"
      )}
      onClick={hasDropdown ? onToggle : undefined}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-sm">{label}</span>
          {hasDropdown && (
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          )}
        </>
      )}
    </div>
  );

  if (href && !hasDropdown) {
    return (
      <NavLink to={href} className="block">
        {content}
      </NavLink>
    );
  }

  return (
    <div>
      {content}
      {hasDropdown && isOpen && !isCollapsed && (
        <div className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
          {children}
        </div>
      )}
    </div>
  );
};

const SidebarDropdownItem = ({
  label,
  href,
  isActive,
}: {
  label: string;
  href: string;
  isActive?: boolean;
}) => {
  return (
    <NavLink
      to={href}
      className={cn(
        "block px-3 py-2 rounded-md text-sm transition-all duration-200",
        "hover:bg-primary/10 hover:text-primary",
        isActive && "bg-primary/15 text-primary font-medium",
        !isActive && "text-muted-foreground"
      )}
    >
      {label}
    </NavLink>
  );
};

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>(["kenali-diri"]);
  const location = useLocation();

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isDropdownOpen = (id: string) => openDropdowns.includes(id);

  return (
    <aside
      className={cn(
        "h-screen bg-background border-r border-border flex flex-col transition-all duration-300",
        isCollapsed ? "w-[72px]" : "w-[260px]",
        className
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <span className="font-semibold text-foreground">REXTRA</span>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">R</span>
            </div>
            <button
              onClick={() => setIsCollapsed(false)}
              className="h-6 w-6 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Category 1: Fitur Mahasiswa */}
        <div>
          {!isCollapsed && (
            <h3 className="px-3 mb-2 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
              Fitur Mahasiswa
            </h3>
          )}
          <div className="space-y-1">
            <SidebarItem
              icon={User}
              label="Akun Mahasiswa"
              href="/akun-mahasiswa"
              isCollapsed={isCollapsed}
              isActive={location.pathname === "/akun-mahasiswa"}
            />
            <SidebarItem
              icon={Fingerprint}
              label="Persona REXTRA"
              href="/persona-rextra"
              isCollapsed={isCollapsed}
              isActive={location.pathname === "/persona-rextra"}
            />
            <SidebarItem
              icon={GraduationCap}
              label="Pendidikan"
              href="/pendidikan"
              isCollapsed={isCollapsed}
              isActive={location.pathname === "/pendidikan"}
            />
            <SidebarItem
              icon={Users}
              label="REXTRA CLUB"
              isCollapsed={isCollapsed}
              hasDropdown
              isOpen={isDropdownOpen("rextra-club")}
              onToggle={() => toggleDropdown("rextra-club")}
            >
              <SidebarDropdownItem
                label="Komunitas"
                href="/rextra-club/komunitas"
                isActive={location.pathname === "/rextra-club/komunitas"}
              />
              <SidebarDropdownItem
                label="Event"
                href="/rextra-club/event"
                isActive={location.pathname === "/rextra-club/event"}
              />
            </SidebarItem>
            <SidebarItem
              icon={Brain}
              label="Kenali Diri"
              isCollapsed={isCollapsed}
              hasDropdown
              isOpen={isDropdownOpen("kenali-diri")}
              onToggle={() => toggleDropdown("kenali-diri")}
              isActive={location.pathname === "/" || location.pathname.startsWith("/kenali-diri")}
            >
              <SidebarDropdownItem
                label="Master Data"
                href="/kenali-diri/master-data"
                isActive={location.pathname === "/kenali-diri/master-data"}
              />
              <SidebarDropdownItem
                label="Hasil Tes"
                href="/"
                isActive={location.pathname === "/"}
              />
              <SidebarDropdownItem
                label="Umpan Balik"
                href="/kenali-diri/umpan-balik"
                isActive={location.pathname === "/kenali-diri/umpan-balik"}
              />
            </SidebarItem>
          </div>
        </div>

        {/* Category 2: Fitur Perusahaan */}
        <div>
          {!isCollapsed && (
            <h3 className="px-3 mb-2 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
              Fitur Perusahaan
            </h3>
          )}
          <div className="space-y-1">
            <SidebarItem
              icon={Building2}
              label="Profil Perusahaan"
              href="/profil-perusahaan"
              isCollapsed={isCollapsed}
              isActive={location.pathname === "/profil-perusahaan"}
            />
            <SidebarItem
              icon={FileText}
              label="Lowongan Kerja"
              href="/lowongan-kerja"
              isCollapsed={isCollapsed}
              isActive={location.pathname === "/lowongan-kerja"}
            />
          </div>
        </div>

        {/* Category 3: Performa Usaha */}
        <div>
          {!isCollapsed && (
            <h3 className="px-3 mb-2 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
              Performa Usaha
            </h3>
          )}
          <div className="space-y-1">
            <SidebarItem
              icon={Trophy}
              label="Capaian Pengguna"
              href="/capaian-pengguna"
              isCollapsed={isCollapsed}
              isActive={location.pathname === "/capaian-pengguna"}
            />
            <SidebarItem
              icon={DollarSign}
              label="Capaian Keuangan"
              href="/capaian-keuangan"
              isCollapsed={isCollapsed}
              isActive={location.pathname === "/capaian-keuangan"}
            />
            <SidebarItem
              icon={BarChart3}
              label="Visualisasi Performa"
              href="/visualisasi-performa"
              isCollapsed={isCollapsed}
              isActive={location.pathname === "/visualisasi-performa"}
            />
          </div>
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground/60 text-center">
            © 2025 REXTRA Admin
          </p>
        </div>
      )}
    </aside>
  );
}
