import { useState, useMemo } from "react";
import { Search, Filter, LayoutGrid, List, RefreshCw, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SummaryChips } from "./SummaryChips";
import { UserCard } from "./UserCard";
import { UserTableView } from "./UserTableView";
import { UserDetailDrawer } from "./UserDetailDrawer";
import { generateMockUsers } from "./mockData";
import { MemberUser } from "./types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type ViewMode = "grid" | "table";

interface UserListTabProps {
  demoState: "loading" | "data" | "empty" | "error";
}

export function UserListTab({ demoState }: UserListTabProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [validityFilter, setValidityFilter] = useState("all");
  const [autoRenewFilter, setAutoRenewFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<MemberUser | null>(null);

  const mockUsers = useMemo(() => generateMockUsers(), []);
  const itemsPerPage = 12;

  const filteredUsers = useMemo(() => {
    if (demoState !== "data") return [];
    
    let filtered = [...mockUsers];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower) ||
          u.userId.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((u) => u.category === categoryFilter);
    }

    // Tier filter
    if (tierFilter !== "all") {
      filtered = filtered.filter((u) => u.tier === tierFilter);
    }

    // Validity filter
    if (validityFilter !== "all") {
      filtered = filtered.filter((u) => u.validityStatus === validityFilter);
    }

    // Auto-renew filter
    if (autoRenewFilter !== "all") {
      filtered = filtered.filter((u) =>
        autoRenewFilter === "active" ? u.autoRenew : !u.autoRenew
      );
    }

    // Sort
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => (b.endDate?.getTime() || 0) - (a.endDate?.getTime() || 0));
        break;
      case "expiring":
        filtered.sort((a, b) => a.remainingDays - b.remainingDays);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return filtered;
  }, [mockUsers, search, categoryFilter, tierFilter, validityFilter, autoRenewFilter, sortBy, demoState]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const summaryData = useMemo(() => ({
    totalUsers: mockUsers.length,
    rextraClub: mockUsers.filter((u) => u.category === "REXTRA Club").length,
    trialClub: mockUsers.filter((u) => u.category === "Trial Club").length,
    nonClub: mockUsers.filter((u) => u.category === "Non-Club").length,
    expiring: mockUsers.filter((u) => u.validityStatus === "Expiring").length,
  }), [mockUsers]);

  const hasActiveFilters = search || categoryFilter !== "all" || tierFilter !== "all" || validityFilter !== "all" || autoRenewFilter !== "all";

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setTierFilter("all");
    setValidityFilter("all");
    setAutoRenewFilter("all");
    setSortBy("recent");
    setCurrentPage(1);
  };

  // Loading State
  if (demoState === "loading") {
    return (
      <div className="space-y-6">
        <SummaryChips isLoading />
        <div className="flex flex-col md:flex-row gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (demoState === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-red-50 rounded-full p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Tidak dapat memuat data
        </h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Terjadi kesalahan saat memuat data pengguna. Silakan coba lagi.
        </p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  // Empty State (no data or no filter results)
  if (demoState === "empty" || (demoState === "data" && filteredUsers.length === 0)) {
    return (
      <div className="space-y-6">
        <SummaryChips data={{ totalUsers: 0, rextraClub: 0, trialClub: 0, nonClub: 0, expiring: 0 }} />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-slate-100 rounded-full p-4 mb-4">
            <Filter className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {hasActiveFilters ? "Tidak ada data sesuai filter" : "Belum ada pengguna"}
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            {hasActiveFilters
              ? "Coba ubah kriteria pencarian atau filter untuk melihat hasil lainnya."
              : "Data pengguna akan muncul di sini setelah ada yang terdaftar."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={resetFilters}>
              Reset Filter
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Daftar Pengguna</h2>
        <p className="text-sm text-muted-foreground">
          Monitoring status membership dan riwayat langganan pengguna
        </p>
      </div>

      {/* Summary Chips */}
      <SummaryChips data={summaryData} />

      {/* Control Bar */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, email, atau user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="REXTRA Club">REXTRA Club</SelectItem>
              <SelectItem value="Trial Club">Trial Club</SelectItem>
              <SelectItem value="Non-Club">Non-Club</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tier</SelectItem>
              <SelectItem value="Starter">Starter</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Max">Max</SelectItem>
            </SelectContent>
          </Select>

          <Select value={validityFilter} onValueChange={setValidityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Masa Berlaku" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Expiring">Expiring (≤7 hari)</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Select value={autoRenewFilter} onValueChange={setAutoRenewFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Auto-renew" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort & View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Terbaru aktif</SelectItem>
                <SelectItem value="expiring">Expiring dulu</SelectItem>
                <SelectItem value="name-asc">Nama A–Z</SelectItem>
                <SelectItem value="name-desc">Nama Z–A</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                Reset Filter
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="px-3"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              className="px-3"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* User List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedUsers.map((user) => (
            <UserCard key={user.id} user={user} onViewDetail={setSelectedUser} />
          ))}
        </div>
      ) : (
        <UserTableView users={paginatedUsers} onViewDetail={setSelectedUser} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Detail Drawer */}
      <UserDetailDrawer
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
