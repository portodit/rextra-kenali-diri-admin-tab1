import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Eye, Trash2, Download, AlertTriangle, Code, Palette, PenTool, Megaphone, Settings, BarChart3, FileText, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Types
interface Profesi {
  id: string;
  nama: string;
  alias?: string;
  kategori: string;
  kategoriIcon: React.ElementType;
  subKategori: string[];
  riasec: string;
  diperbarui: string;
}

// Mock data for profesi
const mockProfesiData: Profesi[] = [
  {
    id: "1",
    nama: "Software Engineer",
    alias: "Pengembang Perangkat Lunak",
    kategori: "Teknologi",
    kategoriIcon: Code,
    subKategori: ["Backend", "Frontend", "Fullstack"],
    riasec: "IRC",
    diperbarui: "11 Jan 2026",
  },
  {
    id: "2",
    nama: "UI/UX Designer",
    alias: "Desainer Antarmuka",
    kategori: "Desain",
    kategoriIcon: Palette,
    subKategori: ["UI Design", "UX Research"],
    riasec: "AIS",
    diperbarui: "10 Jan 2026",
  },
  {
    id: "3",
    nama: "Product Manager",
    kategori: "Manajemen",
    kategoriIcon: Settings,
    subKategori: ["Product Strategy", "Agile"],
    riasec: "ECS",
    diperbarui: "09 Jan 2026",
  },
  {
    id: "4",
    nama: "Data Scientist",
    alias: "Ilmuwan Data",
    kategori: "Teknologi",
    kategoriIcon: Code,
    subKategori: ["Machine Learning", "Analytics", "Data Engineering"],
    riasec: "ICR",
    diperbarui: "08 Jan 2026",
  },
  {
    id: "5",
    nama: "Digital Marketing Specialist",
    kategori: "Marketing",
    kategoriIcon: Megaphone,
    subKategori: ["SEO", "SEM", "Social Media"],
    riasec: "ESA",
    diperbarui: "07 Jan 2026",
  },
  {
    id: "6",
    nama: "Content Writer",
    alias: "Penulis Konten",
    kategori: "Konten",
    kategoriIcon: PenTool,
    subKategori: ["Copywriting", "Technical Writing"],
    riasec: "AIC",
    diperbarui: "06 Jan 2026",
  },
  {
    id: "7",
    nama: "Business Analyst",
    kategori: "Bisnis",
    kategoriIcon: BarChart3,
    subKategori: ["Data Analysis", "Process Improvement"],
    riasec: "ICE",
    diperbarui: "05 Jan 2026",
  },
  {
    id: "8",
    nama: "DevOps Engineer",
    kategori: "Teknologi",
    kategoriIcon: Code,
    subKategori: ["CI/CD", "Cloud Infrastructure"],
    riasec: "IRC",
    diperbarui: "04 Jan 2026",
  },
  {
    id: "9",
    nama: "Graphic Designer",
    alias: "Desainer Grafis",
    kategori: "Desain",
    kategoriIcon: Palette,
    subKategori: ["Branding", "Print Design", "Digital Design"],
    riasec: "AIR",
    diperbarui: "03 Jan 2026",
  },
  {
    id: "10",
    nama: "Technical Writer",
    kategori: "Konten",
    kategoriIcon: FileText,
    subKategori: ["Documentation", "API Docs"],
    riasec: "CIR",
    diperbarui: "02 Jan 2026",
  },
];

// Categories for filter
const kategoriOptions = [
  "Semua kategori",
  "Teknologi",
  "Desain",
  "Marketing",
  "Manajemen",
  "Bisnis",
  "Konten",
];

const subKategoriOptions: Record<string, string[]> = {
  "Semua kategori": ["Semua sub-kategori"],
  Teknologi: ["Semua sub-kategori", "Backend", "Frontend", "Fullstack", "Machine Learning", "Analytics", "CI/CD", "Cloud Infrastructure"],
  Desain: ["Semua sub-kategori", "UI Design", "UX Research", "Branding", "Print Design", "Digital Design"],
  Marketing: ["Semua sub-kategori", "SEO", "SEM", "Social Media"],
  Manajemen: ["Semua sub-kategori", "Product Strategy", "Agile"],
  Bisnis: ["Semua sub-kategori", "Data Analysis", "Process Improvement"],
  Konten: ["Semua sub-kategori", "Copywriting", "Technical Writing", "Documentation", "API Docs"],
};

const riasecOptions = ["Semua", "R", "I", "A", "S", "E", "C"];

const sortOptions = [
  { value: "az", label: "A–Z (Nama Profesi)" },
  { value: "za", label: "Z–A (Nama Profesi)" },
  { value: "terbaru", label: "Terbaru Diubah" },
  { value: "kategori", label: "Kategori" },
];

// Tab types
type TabType = "profesi" | "perusahaan" | "istilah" | "artikel";

const KamusKarierMasterData = () => {
  const navigate = useNavigate();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>("profesi");

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("Semua kategori");
  const [subKategoriFilter, setSubKategoriFilter] = useState("Semua sub-kategori");
  const [riasecFilter, setRiasecFilter] = useState("Semua");
  const [sortOption, setSortOption] = useState("az");

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profesiToDelete, setProfesiToDelete] = useState<Profesi | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort data
  const filteredData = mockProfesiData
    .filter((item) => {
      const matchesSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.alias && item.alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.riasec.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesKategori =
        kategoriFilter === "Semua kategori" || item.kategori === kategoriFilter;
      const matchesSubKategori =
        subKategoriFilter === "Semua sub-kategori" ||
        item.subKategori.includes(subKategoriFilter);
      const matchesRiasec =
        riasecFilter === "Semua" || item.riasec.includes(riasecFilter);
      return matchesSearch && matchesKategori && matchesSubKategori && matchesRiasec;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "za":
          return b.nama.localeCompare(a.nama);
        case "terbaru":
          return new Date(b.diperbarui).getTime() - new Date(a.diperbarui).getTime();
        case "kategori":
          return a.kategori.localeCompare(b.kategori);
        default:
          return a.nama.localeCompare(b.nama);
      }
    });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedData.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  const handleDelete = (profesi: Profesi) => {
    setProfesiToDelete(profesi);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (profesiToDelete) {
      toast.success(`Profesi "${profesiToDelete.nama}" berhasil dihapus`);
      setDeleteDialogOpen(false);
      setProfesiToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    toast.success(`${selectedIds.length} profesi berhasil dihapus`);
    setSelectedIds([]);
    setBulkDeleteDialogOpen(false);
  };

  const handleExport = () => {
    toast.success("Data profesi berhasil diekspor");
  };

  const handleViewDetail = (profesi: Profesi) => {
    navigate(`/kamus-karier/master-data/profesi/${profesi.id}`);
  };

  const handleKategoriChange = (value: string) => {
    setKategoriFilter(value);
    setSubKategoriFilter("Semua sub-kategori");
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(item.id));

  const tabs: { id: TabType; label: string; disabled?: boolean }[] = [
    { id: "profesi", label: "Profesi" },
    { id: "perusahaan", label: "Perusahaan", disabled: true },
    { id: "istilah", label: "Istilah Dunia Kerja", disabled: true },
    { id: "artikel", label: "Artikel REXTRA", disabled: true },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Master Data Kamus Karier
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola data Kamus Karier agar siap tampil ke pengguna.
          </p>
        </div>

        {/* Tab Button Group */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-accent hover:text-accent-foreground",
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === "profesi" && (
          <div className="space-y-6">
            {/* Section 1: Kontrol & Pencarian Data Profesi */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-sm font-semibold text-foreground mb-4">
                Kontrol & Pencarian Data Profesi
              </h2>
              <div className="flex flex-wrap gap-3">
                {/* Filter Kategori */}
                <Select value={kategoriFilter} onValueChange={handleKategoriChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    {kategoriOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Filter Sub-kategori */}
                <Select value={subKategoriFilter} onValueChange={setSubKategoriFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sub-kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    {(subKategoriOptions[kategoriFilter] || ["Semua sub-kategori"]).map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Filter RIASEC */}
                <Select value={riasecFilter} onValueChange={setRiasecFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="RIASEC Dominan" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    {riasecOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt === "Semua" ? "Semua RIASEC" : opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Search Bar - Paling Kanan */}
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari profesi… (nama/alias/RIASEC)"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Tabel Data Profesi */}
            <div className="bg-card border border-border rounded-lg">
              {/* Table Header */}
              <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      Tabel Master Data Profesi
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Menampilkan {paginatedData.length} dari {totalItems} data profesi
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={selectedIds.length === 0}
                      className="gap-1.5"
                    >
                      <Trash2 className="h-4 w-4" />
                      Hapus Data
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExport}
                      className="gap-1.5"
                    >
                      <Download className="h-4 w-4" />
                      Ekspor Data
                    </Button>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Data Profesi
                </Button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                          className="rounded-[4px] border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </TableHead>
                      <TableHead className="min-w-[200px]">Nama Profesi</TableHead>
                      <TableHead className="min-w-[140px]">Kategori</TableHead>
                      <TableHead className="min-w-[160px]">Sub-kategori</TableHead>
                      <TableHead className="min-w-[80px]">RIASEC</TableHead>
                      <TableHead className="min-w-[110px]">Diperbarui</TableHead>
                      <TableHead className="w-[100px] text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      // Loading state
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        </TableRow>
                      ))
                    ) : paginatedData.length === 0 ? (
                      // Empty state
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <FileText className="h-10 w-10 mb-2 opacity-50" />
                            <p className="font-medium">
                              {searchQuery || kategoriFilter !== "Semua kategori"
                                ? "Tidak ada hasil yang cocok"
                                : "Belum ada data profesi"}
                            </p>
                            <p className="text-sm">
                              {searchQuery || kategoriFilter !== "Semua kategori"
                                ? "Coba ubah filter atau kata kunci pencarian"
                                : "Tambahkan data profesi untuk memulai"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      // Data rows
                      paginatedData.map((profesi) => {
                        const Icon = profesi.kategoriIcon;
                        const isSelected = selectedIds.includes(profesi.id);
                        return (
                          <TableRow
                            key={profesi.id}
                            className={cn(
                              "hover:bg-muted/50 transition-colors",
                              isSelected && "bg-primary/5"
                            )}
                          >
                            <TableCell>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handleSelectOne(profesi.id, checked as boolean)
                                }
                                className="rounded-[4px] border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-foreground">
                                  {profesi.nama}
                                </p>
                                {profesi.alias && (
                                  <p className="text-xs text-muted-foreground">
                                    {profesi.alias}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                <span>{profesi.kategori}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {profesi.subKategori.slice(0, 2).map((sub, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground"
                                  >
                                    {sub}
                                  </span>
                                ))}
                                {profesi.subKategori.length > 2 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                                    +{profesi.subKategori.length - 2}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-accent text-accent-foreground">
                                {profesi.riasec}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {profesi.diperbarui}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleViewDetail(profesi)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => handleDelete(profesi)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-border flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Halaman {currentPage} dari {totalPages}
                  </p>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={cn(
                            currentPage === 1 && "pointer-events-none opacity-50"
                          )}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className={cn(
                            currentPage === totalPages && "pointer-events-none opacity-50"
                          )}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Coming soon for other tabs */}
        {activeTab !== "profesi" && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <FileText className="h-12 w-12 mb-3 opacity-50" />
              <p className="font-medium text-lg">Segera Hadir</p>
              <p className="text-sm">
                Modul ini sedang dalam pengembangan.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Hapus profesi ini?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Anda akan menghapus profesi <strong>"{profesiToDelete?.nama}"</strong>. 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batalkan</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Hapus {selectedIds.length} profesi?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Anda akan menghapus <strong>{selectedIds.length} profesi</strong> yang dipilih. 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batalkan</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </DashboardLayout>
  );
};

export default KamusKarierMasterData;
