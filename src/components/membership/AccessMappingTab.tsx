import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Search, 
  Plus, 
  Lock,
  Edit2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Power,
  PowerOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { AddEditMappingDrawer, MappingData } from "./AddEditMappingDrawer";

export interface EntitlementMapping {
  id: string;
  entitlementId: string;
  entitlementName: string;
  entitlementKey: string;
  objectType: "feature" | "subfeature";
  objectName: string;
  category: string;
  restriction: "unlimited" | "token" | "limit";
  tokenCost?: number;
  limitCount?: number;
  limitPeriod?: "daily" | "weekly" | "monthly";
  isActive: boolean;
  lastUpdated: string;
}

// Demo data
const demoMappings: EntitlementMapping[] = [
  {
    id: "1",
    entitlementId: "ent1",
    entitlementName: "Lihat Profil Karier",
    entitlementKey: "career_profile.view",
    objectType: "feature",
    objectName: "Profil Karier",
    category: "view",
    restriction: "unlimited",
    isActive: true,
    lastUpdated: "20/01/2025 14:30",
  },
  {
    id: "2",
    entitlementId: "ent2",
    entitlementName: "Gunakan AI Career Coach",
    entitlementKey: "ai_coach.use",
    objectType: "subfeature",
    objectName: "AI Career Coach",
    category: "use",
    restriction: "token",
    tokenCost: 5,
    isActive: true,
    lastUpdated: "19/01/2025 10:15",
  },
  {
    id: "3",
    entitlementId: "ent3",
    entitlementName: "Auto Fill CV",
    entitlementKey: "portfolio.auto_fill.use",
    objectType: "subfeature",
    objectName: "Auto Fill",
    category: "use",
    restriction: "limit",
    limitCount: 10,
    limitPeriod: "daily",
    isActive: true,
    lastUpdated: "18/01/2025 09:00",
  },
  {
    id: "4",
    entitlementId: "ent4",
    entitlementName: "Download Laporan",
    entitlementKey: "report.download",
    objectType: "feature",
    objectName: "Laporan",
    category: "download",
    restriction: "token",
    tokenCost: 10,
    isActive: false,
    lastUpdated: "17/01/2025 16:45",
  },
  {
    id: "5",
    entitlementId: "ent5",
    entitlementName: "Akses Premium Template",
    entitlementKey: "template.premium.view",
    objectType: "subfeature",
    objectName: "Premium Template",
    category: "view",
    restriction: "unlimited",
    isActive: true,
    lastUpdated: "16/01/2025 11:20",
  },
];

const categories = ["view", "use", "download", "edit", "delete"];

interface AccessMappingTabProps {
  packageId: string;
  packageName: string;
}

type DemoState = "data" | "loading" | "empty";

export function AccessMappingTab({ packageId, packageName }: AccessMappingTabProps) {
  const [demoState, setDemoState] = useState<DemoState>("data");
  const [mappings, setMappings] = useState<EntitlementMapping[]>(demoMappings);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMappingStatus, setFilterMappingStatus] = useState<string>("all");
  const [filterObjectType, setFilterObjectType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterRestriction, setFilterRestriction] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<EntitlementMapping | null>(null);

  // Filter and sort
  const filteredMappings = useMemo(() => {
    let result = [...mappings];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.entitlementName.toLowerCase().includes(q) ||
        m.entitlementKey.toLowerCase().includes(q)
      );
    }
    
    if (filterMappingStatus !== "all") {
      result = result.filter(m => 
        filterMappingStatus === "active" ? m.isActive : !m.isActive
      );
    }
    
    if (filterObjectType !== "all") {
      result = result.filter(m => m.objectType === filterObjectType);
    }
    
    if (filterCategory !== "all") {
      result = result.filter(m => m.category === filterCategory);
    }
    
    if (filterRestriction !== "all") {
      result = result.filter(m => m.restriction === filterRestriction);
    }
    
    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
        break;
      case "oldest":
        result.sort((a, b) => a.lastUpdated.localeCompare(b.lastUpdated));
        break;
      case "name-asc":
        result.sort((a, b) => a.entitlementName.localeCompare(b.entitlementName));
        break;
      case "name-desc":
        result.sort((a, b) => b.entitlementName.localeCompare(a.entitlementName));
        break;
      case "token-high":
        result.sort((a, b) => (b.tokenCost || 0) - (a.tokenCost || 0));
        break;
      case "token-low":
        result.sort((a, b) => (a.tokenCost || 0) - (b.tokenCost || 0));
        break;
    }
    
    return result;
  }, [mappings, searchQuery, filterMappingStatus, filterObjectType, filterCategory, filterRestriction, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredMappings.length / itemsPerPage);
  const paginatedMappings = filteredMappings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = useMemo(() => {
    const total = mappings.length;
    const unlimited = mappings.filter(m => m.restriction === "unlimited").length;
    const token = mappings.filter(m => m.restriction === "token").length;
    const limit = mappings.filter(m => m.restriction === "limit").length;
    return { total, unlimited, token, limit };
  }, [mappings]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedMappings.map(m => m.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkActivate = () => {
    setMappings(prev => prev.map(m => 
      selectedIds.has(m.id) ? { ...m, isActive: true } : m
    ));
    toast({
      title: `✓ ${selectedIds.size} mapping berhasil diaktifkan`,
    });
    setSelectedIds(new Set());
  };

  const handleBulkDeactivate = () => {
    setMappings(prev => prev.map(m => 
      selectedIds.has(m.id) ? { ...m, isActive: false } : m
    ));
    toast({
      title: `✓ ${selectedIds.size} mapping berhasil dinonaktifkan`,
    });
    setSelectedIds(new Set());
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "✓ Key disalin" });
  };

  const handleOpenAddDrawer = () => {
    setEditingMapping(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (mapping: EntitlementMapping) => {
    setEditingMapping(mapping);
    setIsDrawerOpen(true);
  };

  const handleSaveMapping = (data: MappingData) => {
    if (editingMapping) {
      // Update existing
      setMappings(prev => prev.map(m => 
        m.id === editingMapping.id 
          ? { 
              ...m, 
              restriction: data.restriction,
              tokenCost: data.tokenCost,
              limitCount: data.limitCount,
              limitPeriod: data.limitPeriod,
              isActive: data.isActive,
              lastUpdated: new Date().toLocaleString('id-ID', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).replace(',', ''),
            } 
          : m
      ));
      toast({ title: "✓ Mapping berhasil diperbarui" });
    } else {
      // Add new
      const newMapping: EntitlementMapping = {
        id: `new-${Date.now()}`,
        entitlementId: data.entitlementId,
        entitlementName: data.entitlementName,
        entitlementKey: data.entitlementKey,
        objectType: data.objectType as "feature" | "subfeature",
        objectName: data.objectName,
        category: data.category,
        restriction: data.restriction,
        tokenCost: data.tokenCost,
        limitCount: data.limitCount,
        limitPeriod: data.limitPeriod,
        isActive: data.isActive,
        lastUpdated: new Date().toLocaleString('id-ID', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', ''),
      };
      setMappings(prev => [newMapping, ...prev]);
      toast({ title: "✓ Mapping berhasil ditambahkan" });
    }
    setIsDrawerOpen(false);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterMappingStatus("all");
    setFilterObjectType("all");
    setFilterCategory("all");
    setFilterRestriction("all");
    setSortBy("newest");
  };

  const isAllSelected = paginatedMappings.length > 0 && 
    paginatedMappings.every(m => selectedIds.has(m.id));

  const getRestrictionBadge = (mapping: EntitlementMapping) => {
    switch (mapping.restriction) {
      case "unlimited":
        return (
          <Badge className="bg-muted text-muted-foreground border-border h-6 px-2.5 font-medium">
            Tanpa batas
          </Badge>
        );
      case "token":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 h-6 px-2.5 font-medium">
            Token
          </Badge>
        );
      case "limit":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20 h-6 px-2.5 font-medium">
            Limit
          </Badge>
        );
    }
  };

  const getParameter = (mapping: EntitlementMapping) => {
    switch (mapping.restriction) {
      case "unlimited":
        return <span className="text-muted-foreground">—</span>;
      case "token":
        return <span>{mapping.tokenCost} token/aksi</span>;
      case "limit":
        const periodLabel = mapping.limitPeriod === "daily" ? "hari" 
          : mapping.limitPeriod === "weekly" ? "minggu" : "bulan";
        return <span>{mapping.limitCount}x/{periodLabel}</span>;
    }
  };

  // Loading state
  if (demoState === "loading") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-72" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state (no mappings at all)
  if (demoState === "empty" || mappings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Belum ada mapping akses</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
          Mulai dengan menambahkan hak akses ke paket {packageName}.
        </p>
        <Button onClick={handleOpenAddDrawer} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Mapping
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-base font-semibold text-foreground">Konfigurasi Akses</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Atur hak akses yang tersedia pada paket ini beserta pembatasan token atau limit frekuensi.
          </p>
        </div>

        {/* Summary Chips */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="h-6 px-2.5 bg-background">
            Total mapping: {stats.total}
          </Badge>
          <Badge variant="outline" className="h-6 px-2.5 bg-background">
            Tanpa batas: {stats.unlimited}
          </Badge>
          <Badge variant="outline" className="h-6 px-2.5 bg-background">
            Token: {stats.token}
          </Badge>
          <Badge variant="outline" className="h-6 px-2.5 bg-background">
            Limit: {stats.limit}
          </Badge>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama hak akses atau key..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11"
              />
            </div>

            {/* Filters */}
            <Select value={filterMappingStatus} onValueChange={setFilterMappingStatus}>
              <SelectTrigger className="w-36 h-10">
                <SelectValue placeholder="Status Mapping" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Mapping Aktif</SelectItem>
                <SelectItem value="inactive">Mapping Nonaktif</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterObjectType} onValueChange={setFilterObjectType}>
              <SelectTrigger className="w-36 h-10">
                <SelectValue placeholder="Objek" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Objek</SelectItem>
                <SelectItem value="feature">Berbasis Fitur</SelectItem>
                <SelectItem value="subfeature">Berbasis Sub Fitur</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-36 h-10">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterRestriction} onValueChange={setFilterRestriction}>
              <SelectTrigger className="w-36 h-10">
                <SelectValue placeholder="Pembatasan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pembatasan</SelectItem>
                <SelectItem value="unlimited">Tanpa batas</SelectItem>
                <SelectItem value="token">Token</SelectItem>
                <SelectItem value="limit">Limit frekuensi</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 h-10">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="oldest">Terlama</SelectItem>
                <SelectItem value="name-asc">Nama A–Z</SelectItem>
                <SelectItem value="name-desc">Nama Z–A</SelectItem>
                <SelectItem value="token-high">Token Tertinggi</SelectItem>
                <SelectItem value="token-low">Token Terendah</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Button */}
          <Button onClick={handleOpenAddDrawer} className="gap-2 shrink-0 h-10">
            <Plus className="h-4 w-4" />
            Tambah Mapping
          </Button>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <span className="text-sm font-medium text-foreground">
              {selectedIds.size} item dipilih
            </span>
            <div className="flex gap-2 ml-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBulkActivate}
                className="gap-1.5"
              >
                <Power className="h-3.5 w-3.5" />
                Aktifkan ({selectedIds.size})
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBulkDeactivate}
                className="gap-1.5"
              >
                <PowerOff className="h-3.5 w-3.5" />
                Nonaktifkan ({selectedIds.size})
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        {filteredMappings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
            <h4 className="text-base font-medium text-foreground mb-2">Data tidak ditemukan</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Tidak ada mapping yang sesuai dengan filter.
            </p>
            <Button variant="outline" onClick={resetFilters}>
              Reset filter
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead className="font-semibold min-w-[200px]">Nama Hak Akses</TableHead>
                    <TableHead className="font-semibold min-w-[180px]">Key</TableHead>
                    <TableHead className="font-semibold min-w-[140px]">Objek</TableHead>
                    <TableHead className="font-semibold">Kategori</TableHead>
                    <TableHead className="font-semibold">Pembatasan</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Parameter</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold min-w-[140px]">Terakhir Diubah</TableHead>
                    <TableHead className="font-semibold w-20">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMappings.map((mapping) => (
                    <TableRow key={mapping.id} className="h-14">
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(mapping.id)}
                          onCheckedChange={(checked) => handleSelectItem(mapping.id, checked as boolean)}
                          aria-label={`Select ${mapping.entitlementName}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{mapping.entitlementName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <code className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {mapping.entitlementKey}
                          </code>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => handleCopyKey(mapping.entitlementKey)}
                                className="p-1 hover:bg-muted rounded"
                              >
                                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Salin key</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {mapping.objectType === "feature" ? "Fitur: " : "Sub Fitur: "}
                          {mapping.objectName}
                        </span>
                      </TableCell>
                      <TableCell className="capitalize">{mapping.category}</TableCell>
                      <TableCell>{getRestrictionBadge(mapping)}</TableCell>
                      <TableCell>{getParameter(mapping)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={cn(
                            "h-6",
                            mapping.isActive 
                              ? "bg-success/10 text-success border-success/20" 
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          )}
                        >
                          {mapping.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {mapping.lastUpdated}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenEditDrawer(mapping)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1}–
                  {Math.min(currentPage * itemsPerPage, filteredMappings.length)} of {filteredMappings.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && <span className="px-2 text-muted-foreground">…</span>}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Drawer */}
      <AddEditMappingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveMapping}
        editingMapping={editingMapping}
        packageName={packageName}
      />
    </TooltipProvider>
  );
}
