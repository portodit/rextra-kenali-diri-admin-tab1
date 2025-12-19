import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ExportDataDialog } from "@/components/ExportDataDialog";
import { BulkDeleteDialog } from "@/components/BulkDeleteDialog";
import { SingleDeleteDialog } from "@/components/SingleDeleteDialog";
import { 
  Download, 
  Search, 
  Eye, 
  Trash2, 
  CalendarIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Sample data
const sampleData = [
  { id: "KD-001", name: "Budi Santoso", category: "Tes Profil Karier", status: "Selesai", result: "RIA", startDate: "2025-12-18", endDate: "2025-12-18" },
  { id: "KD-002", name: "Siti Rahayu", category: "Tes Profil Karier", status: "Selesai", result: "SEC", startDate: "2025-12-18", endDate: "2025-12-18" },
  { id: "KD-003", name: "Ahmad Wijaya", category: "Tes Profil Karier", status: "Sedang Berjalan", result: "-", startDate: "2025-12-17", endDate: "-" },
  { id: "KD-004", name: "Dewi Lestari", category: "Tes Profil Karier", status: "Selesai", result: "AIR", startDate: "2025-12-17", endDate: "2025-12-17" },
  { id: "KD-005", name: "Rizky Pratama", category: "Tes Profil Karier", status: "Dihentikan", result: "-", startDate: "2025-12-16", endDate: "2025-12-16" },
  { id: "KD-006", name: "Anisa Putri", category: "Tes Profil Karier", status: "Selesai", result: "CRE", startDate: "2025-12-16", endDate: "2025-12-16" },
  { id: "KD-007", name: "Fajar Nugroho", category: "Tes Profil Karier", status: "Selesai", result: "IAS", startDate: "2025-12-15", endDate: "2025-12-15" },
  { id: "KD-008", name: "Rina Marlina", category: "Tes Profil Karier", status: "Sedang Berjalan", result: "-", startDate: "2025-12-15", endDate: "-" },
  { id: "KD-009", name: "Hendro Kusuma", category: "Tes Profil Karier", status: "Selesai", result: "ESC", startDate: "2025-12-14", endDate: "2025-12-14" },
  { id: "KD-010", name: "Maya Sari", category: "Tes Profil Karier", status: "Selesai", result: "RCS", startDate: "2025-12-14", endDate: "2025-12-14" },
  { id: "KD-011", name: "Yoga Permana", category: "Tes Profil Karier", status: "Dihentikan", result: "-", startDate: "2025-12-13", endDate: "2025-12-13" },
  { id: "KD-012", name: "Lina Kartika", category: "Tes Profil Karier", status: "Selesai", result: "ARI", startDate: "2025-12-13", endDate: "2025-12-13" },
];

const Index = () => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [singleDeleteDialogOpen, setSingleDeleteDialogOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState("");
  
  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  
  // Selection states
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalData = 120;

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...sampleData];
    
    if (searchQuery) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter && categoryFilter !== "all") {
      data = data.filter(item => item.category === categoryFilter);
    }
    
    if (sortBy) {
      switch (sortBy) {
        case "name-asc":
          data.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          data.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "start-date":
          data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
          break;
        case "end-date":
          data.sort((a, b) => {
            if (a.endDate === "-") return 1;
            if (b.endDate === "-") return -1;
            return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
          });
          break;
      }
    }
    
    return data;
  }, [searchQuery, categoryFilter, sortBy]);

  const paginatedData = filteredData.slice(0, itemsPerPage);
  const totalPages = Math.ceil(totalData / itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const handleDelete = (name: string) => {
    setDeleteItemName(name);
    setSingleDeleteDialogOpen(true);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-emerald-100 text-emerald-700 border border-emerald-300";
      case "Sedang Berjalan":
        return "bg-amber-100 text-amber-700 border border-amber-300";
      case "Dihentikan":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Riwayat Tes Kenali Diri
          </h1>
          <p className="text-muted-foreground mt-1">
            Menyajikan <span className="font-medium text-foreground">{totalData}</span> data hasil tes Kenali Diri user <span className="font-medium text-primary">REXTRA</span>.
          </p>
        </div>

        {/* Controls: Search & Export */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ketikkan nama pengguna"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-background border-input hover:border-primary/50 focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {selectedItems.length > 0 && (
              <Button 
                variant="outline"
                onClick={() => setBulkDeleteDialogOpen(true)}
                className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Hapus ({selectedItems.length})
              </Button>
            )}
            <Button onClick={() => setExportDialogOpen(true)} className="gap-2">
              <Download className="h-4 w-4" />
              Ekspor Data
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Date Range Filter */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Rentang Tanggal</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-10 justify-start text-left font-normal bg-background border-input hover:border-primary/50",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border shadow-custom-lg" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Kategori Tes</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-10 bg-background border-input hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Pilih Kategori Tes" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border shadow-custom-lg">
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="Tes Profil Karier">Tes Profil Karier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Result Filter */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Hasil Tes</label>
            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger className="h-10 bg-background border-input hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Pilih Hasil Tes" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border shadow-custom-lg">
                <SelectItem value="all">Semua Hasil</SelectItem>
                <SelectItem value="RIA">RIA</SelectItem>
                <SelectItem value="SEC">SEC</SelectItem>
                <SelectItem value="AIR">AIR</SelectItem>
                <SelectItem value="CRE">CRE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Urutkan</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-10 bg-background border-input hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Urutkan berdasarkan" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border shadow-custom-lg">
                <SelectItem value="name-asc">Nama User A-Z</SelectItem>
                <SelectItem value="name-desc">Nama User Z-A</SelectItem>
                <SelectItem value="start-date">Tanggal Mulai</SelectItem>
                <SelectItem value="end-date">Tanggal Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-border bg-card shadow-custom-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/70">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                    ID Tes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                    Nama Pengguna
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                    Kategori Tes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                    Status Tes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                    Hasil Tes
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors bg-background">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                        className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {item.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {item.category}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                        getStatusStyle(item.status)
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {item.result}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(item.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-4 py-3 border-t border-border bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Tampilkan</span>
                <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                  <SelectTrigger className="w-[70px] h-8 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">data</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Menampilkan <span className="font-medium text-foreground">{Math.min(itemsPerPage, filteredData.length)}</span> dari <span className="font-medium text-foreground">{totalData}</span> data hasil tes
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 px-3 gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
                <span className="px-2 text-muted-foreground">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  className="h-8 w-8 p-0"
                >
                  {totalPages}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-3 gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ExportDataDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} />
      <BulkDeleteDialog 
        open={bulkDeleteDialogOpen} 
        onOpenChange={setBulkDeleteDialogOpen} 
        dataCount={selectedItems.length} 
      />
      <SingleDeleteDialog
        open={singleDeleteDialogOpen}
        onOpenChange={setSingleDeleteDialogOpen}
        userName={deleteItemName}
      />
    </div>
  );
};

export default Index;
