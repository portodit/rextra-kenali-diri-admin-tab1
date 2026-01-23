import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, LayoutGrid, List, RefreshCw, AlertCircle, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
  const [filterOpen, setFilterOpen] = useState(false);

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

  const hasActiveFilters = categoryFilter !== "all" || tierFilter !== "all" || validityFilter !== "all" || autoRenewFilter !== "all" || sortBy !== "recent";
  
  const activeFilterCount = [
    categoryFilter !== "all",
    tierFilter !== "all", 
    validityFilter !== "all",
    autoRenewFilter !== "all",
    sortBy !== "recent"
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setTierFilter("all");
    setValidityFilter("all");
    setAutoRenewFilter("all");
    setSortBy("recent");
    setCurrentPage(1);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "recent": return "Terbaru";
      case "expiring": return "Expiring dulu";
      case "name-asc": return "Nama A–Z";
      case "name-desc": return "Nama Z–A";
      default: return "Urutkan";
    }
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
        <div className="bg-destructive/10 rounded-full p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
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
          <div className="bg-muted rounded-full p-4 mb-4">
            <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
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

      {/* Control Bar - Modern Filter Group */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, email, atau user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Group Button */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <Badge className="h-5 min-w-5 px-1.5 bg-primary text-primary-foreground rounded-full text-[10px]">
                    {activeFilterCount}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Filter & Urutkan</h4>
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      onClick={resetFilters}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="p-4 space-y-5 max-h-[400px] overflow-y-auto">
                {/* Kategori */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Kategori Membership</Label>
                  <RadioGroup value={categoryFilter} onValueChange={setCategoryFilter} className="grid gap-1.5">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="cat-all" />
                      <Label htmlFor="cat-all" className="text-sm font-normal cursor-pointer">Semua Kategori</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="REXTRA Club" id="cat-rextra" />
                      <Label htmlFor="cat-rextra" className="text-sm font-normal cursor-pointer">REXTRA Club</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Trial Club" id="cat-trial" />
                      <Label htmlFor="cat-trial" className="text-sm font-normal cursor-pointer">Trial Club</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Non-Club" id="cat-non" />
                      <Label htmlFor="cat-non" className="text-sm font-normal cursor-pointer">Non-Club</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Tier */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tier Plan</Label>
                  <RadioGroup value={tierFilter} onValueChange={setTierFilter} className="grid gap-1.5">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="tier-all" />
                      <Label htmlFor="tier-all" className="text-sm font-normal cursor-pointer">Semua Tier</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Max" id="tier-max" />
                      <Label htmlFor="tier-max" className="text-sm font-normal cursor-pointer">Max</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Pro" id="tier-pro" />
                      <Label htmlFor="tier-pro" className="text-sm font-normal cursor-pointer">Pro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Basic" id="tier-basic" />
                      <Label htmlFor="tier-basic" className="text-sm font-normal cursor-pointer">Basic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Starter" id="tier-starter" />
                      <Label htmlFor="tier-starter" className="text-sm font-normal cursor-pointer">Starter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Standard" id="tier-standard" />
                      <Label htmlFor="tier-standard" className="text-sm font-normal cursor-pointer">Standard</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Masa Berlaku */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Masa Berlaku</Label>
                  <RadioGroup value={validityFilter} onValueChange={setValidityFilter} className="grid gap-1.5">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="validity-all" />
                      <Label htmlFor="validity-all" className="text-sm font-normal cursor-pointer">Semua</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Aktif" id="validity-active" />
                      <Label htmlFor="validity-active" className="text-sm font-normal cursor-pointer">Aktif</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Expiring" id="validity-expiring" />
                      <Label htmlFor="validity-expiring" className="text-sm font-normal cursor-pointer">Expiring (≤7 hari)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Expired" id="validity-expired" />
                      <Label htmlFor="validity-expired" className="text-sm font-normal cursor-pointer">Expired</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Auto-Renew */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Auto-Renew</Label>
                  <RadioGroup value={autoRenewFilter} onValueChange={setAutoRenewFilter} className="grid gap-1.5">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="renew-all" />
                      <Label htmlFor="renew-all" className="text-sm font-normal cursor-pointer">Semua</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="renew-active" />
                      <Label htmlFor="renew-active" className="text-sm font-normal cursor-pointer">Aktif</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inactive" id="renew-inactive" />
                      <Label htmlFor="renew-inactive" className="text-sm font-normal cursor-pointer">Nonaktif</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Urutkan */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Urutkan</Label>
                  <RadioGroup value={sortBy} onValueChange={setSortBy} className="grid gap-1.5">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recent" id="sort-recent" />
                      <Label htmlFor="sort-recent" className="text-sm font-normal cursor-pointer">Terbaru aktif</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="expiring" id="sort-expiring" />
                      <Label htmlFor="sort-expiring" className="text-sm font-normal cursor-pointer">Expiring dulu</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="name-asc" id="sort-az" />
                      <Label htmlFor="sort-az" className="text-sm font-normal cursor-pointer">Nama A–Z</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="name-desc" id="sort-za" />
                      <Label htmlFor="sort-za" className="text-sm font-normal cursor-pointer">Nama Z–A</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="p-3 border-t bg-muted/30">
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => setFilterOpen(false)}
                >
                  Terapkan Filter
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* View Toggle */}
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

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Filter aktif:</span>
          {categoryFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {categoryFilter}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setCategoryFilter("all")} />
            </Badge>
          )}
          {tierFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {tierFilter}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setTierFilter("all")} />
            </Badge>
          )}
          {validityFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {validityFilter}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setValidityFilter("all")} />
            </Badge>
          )}
          {autoRenewFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs">
              Auto-renew: {autoRenewFilter === "active" ? "Aktif" : "Nonaktif"}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setAutoRenewFilter("all")} />
            </Badge>
          )}
          {sortBy !== "recent" && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {getSortLabel()}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setSortBy("recent")} />
            </Badge>
          )}
        </div>
      )}

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
