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
import { TestDetailModal } from "@/components/TestDetailModal";
import { 
  Download, 
  Search, 
  Eye, 
  Trash2, 
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  SlidersHorizontal
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
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<typeof sampleData[0] | null>(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState("semua");
  
  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date>();
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
    
    if (activeTab !== "semua") {
      data = data.filter(item => {
        if (activeTab === "selesai") return item.status === "Selesai";
        if (activeTab === "berjalan") return item.status === "Sedang Berjalan";
        if (activeTab === "dihentikan") return item.status === "Dihentikan";
        return true;
      });
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
  }, [searchQuery, categoryFilter, sortBy, activeTab]);

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

  const handleViewDetail = (item: typeof sampleData[0]) => {
    setSelectedDetailItem(item);
    setDetailModalOpen(true);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      case "Sedang Berjalan":
        return "bg-amber-50 text-amber-600 border border-amber-200";
      case "Dihentikan":
        return "bg-red-50 text-red-500 border border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const tabs = [
    { id: "semua", label: "Semua Data" },
    { id: "selesai", label: "Selesai" },
    { id: "berjalan", label: "Sedang Berjalan" },
    { id: "dihentikan", label: "Dihentikan" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">
                Riwayat Tes Kenali Diri
              </h1>
              <span className="inline-flex items-center justify-center h-6 min-w-[40px] px-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {totalData}
              </span>
            </div>
            <p className="text-muted-foreground mt-1">
              Menyajikan data hasil tes Kenali Diri user <span className="font-medium text-primary">REXTRA</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setBulkDeleteDialogOpen(true)}
              className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
            >
              <Trash2 className="h-4 w-4" />
              Hapus Data Massal
            </Button>
            <Button onClick={() => setExportDialogOpen(true)} className="gap-2">
              <Download className="h-4 w-4" />
              Ekspor Data
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 bg-muted/50 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Left: Counter and Selected */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Total <span className="font-medium text-foreground">{filteredData.length}</span> data
            </span>
            {selectedItems.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
                {selectedItems.length} dipilih
              </span>
            )}
          </div>

          {/* Right: Search and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama pengguna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 w-[220px] bg-background border-input"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 gap-2 bg-background",
                    startDate && "text-foreground"
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : "Pilih Tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border shadow-lg" align="end">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-9 w-[160px] bg-background">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <SelectValue placeholder="Urutkan" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="name-asc">Nama A-Z</SelectItem>
                <SelectItem value="name-desc">Nama Z-A</SelectItem>
                <SelectItem value="start-date">Tanggal Mulai</SelectItem>
                <SelectItem value="end-date">Tanggal Selesai</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="h-9 gap-2 bg-background">
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-4 text-left w-12">
                    <Checkbox
                      checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="rounded-[4px] border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </th>
                  <th className="px-4 py-4 text-left">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                      ID Tes
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                      Nama Pengguna
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Kategori Tes
                    </span>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                      Status
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Hasil Tes
                    </span>
                  </th>
                  <th className="px-4 py-4 text-center w-24">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Aksi
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={cn(
                      "border-b border-border/50 hover:bg-muted/30 transition-colors",
                      selectedItems.includes(item.id) && "bg-primary/5"
                    )}
                  >
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                        className="rounded-[4px] border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-muted-foreground">
                        #{item.id}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-foreground">
                        {item.name}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-muted-foreground">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                        getStatusStyle(item.status)
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-foreground">
                        {item.result}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 rounded-full"
                          onClick={() => handleViewDetail(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
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
          <div className="px-4 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Go to page */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Tampilkan</span>
              <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                <SelectTrigger className="w-[65px] h-8 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span>dari {totalData} data</span>
            </div>

            {/* Center: Navigation */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-9 w-9 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-9 px-5 gap-2 rounded-full"
              >
                Next Page
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Right: Page indicator */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Page</span>
              <Input 
                type="text"
                value={currentPage.toString().padStart(2, '0')}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1 && val <= totalPages) {
                    setCurrentPage(val);
                  }
                }}
                className="w-12 h-8 text-center bg-background"
              />
              <span className="text-muted-foreground">of {totalPages}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ExportDataDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} />
      <BulkDeleteDialog 
        open={bulkDeleteDialogOpen} 
        onOpenChange={setBulkDeleteDialogOpen} 
        dataCount={selectedItems.length || 2000} 
      />
      <SingleDeleteDialog
        open={singleDeleteDialogOpen}
        onOpenChange={setSingleDeleteDialogOpen}
        userName={deleteItemName}
      />
      <TestDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        testData={selectedDetailItem ? {
          id: selectedDetailItem.id,
          userName: selectedDetailItem.name,
          startTime: `10.00 WIB ${selectedDetailItem.startDate}`,
          endTime: selectedDetailItem.endDate !== "-" ? `11.00 WIB ${selectedDetailItem.endDate}` : "-",
          status: selectedDetailItem.status as "Selesai" | "Sedang Berjalan" | "Dihentikan",
          result: `Profil Kode ${selectedDetailItem.result}`,
        } : undefined}
      />
    </div>
  );
};

export default Index;
