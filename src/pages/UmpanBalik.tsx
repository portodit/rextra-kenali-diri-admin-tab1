import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ExportDataDialog } from "@/components/ExportDataDialog";
import { FeedbackDetailModal } from "@/components/FeedbackDetailModal";
import { FeedbackCharts } from "@/components/FeedbackCharts";

// Mock data for Mahasiswa feedback (Likert 1-7)
const mahasiswaFeedbackData = [
  {
    id: "MHS001",
    userName: "Siti Nurhaliza",
    kemudahanTes: 6,
    relevansiRekomendasi: 5,
    kepuasanFitur: 6,
    kendala: ["Waktu loading lama", "Tampilan kurang responsif"],
  },
  {
    id: "MHS002",
    userName: "Budi Santoso",
    kemudahanTes: 7,
    relevansiRekomendasi: 7,
    kepuasanFitur: 6,
    kendala: [],
  },
  {
    id: "MHS003",
    userName: "Rina Wulandari",
    kemudahanTes: 4,
    relevansiRekomendasi: 3,
    kepuasanFitur: 4,
    kendala: ["Pertanyaan membingungkan", "Hasil kurang akurat", "Tidak ada penjelasan detail"],
  },
  {
    id: "MHS004",
    userName: "Andi Pratama",
    kemudahanTes: 5,
    relevansiRekomendasi: 6,
    kepuasanFitur: 5,
    kendala: ["Navigasi kurang jelas"],
  },
  {
    id: "MHS005",
    userName: "Dewi Lestari",
    kemudahanTes: 7,
    relevansiRekomendasi: 6,
    kepuasanFitur: 7,
    kendala: [],
  },
  {
    id: "MHS006",
    userName: "Ahmad Rizki",
    kemudahanTes: 6,
    relevansiRekomendasi: 5,
    kepuasanFitur: 6,
    kendala: ["Loading terlalu lama"],
  },
  {
    id: "MHS007",
    userName: "Putri Handayani",
    kemudahanTes: 3,
    relevansiRekomendasi: 4,
    kepuasanFitur: 3,
    kendala: ["Error saat submit", "Halaman tidak responsive", "Data hilang"],
  },
  {
    id: "MHS008",
    userName: "Fajar Nugroho",
    kemudahanTes: 6,
    relevansiRekomendasi: 7,
    kepuasanFitur: 6,
    kendala: [],
  },
  {
    id: "MHS009",
    userName: "Maya Sari",
    kemudahanTes: 5,
    relevansiRekomendasi: 5,
    kepuasanFitur: 5,
    kendala: ["Font terlalu kecil"],
  },
  {
    id: "MHS010",
    userName: "Reza Firmansyah",
    kemudahanTes: 7,
    relevansiRekomendasi: 6,
    kepuasanFitur: 7,
    kendala: [],
  },
];

// Mock data for Validator feedback
const validatorFeedbackData = [
  {
    id: "VAL001",
    userName: "Dr. Ahmad Fauzi",
    date: "2024-01-15",
    testType: "RIASEC",
    feedbackCategory: "Validasi Rekomendasi",
    rating: 5,
    accuracyScore: 92,
    status: "verified",
    comment: "Rekomendasi profesi sangat akurat dan sesuai dengan profil kepribadian.",
    professionMatch: true,
    careerInsight: true,
    userType: "expert",
  },
  {
    id: "VAL002",
    userName: "Prof. Bambang Sudarto",
    date: "2024-01-13",
    testType: "DISC",
    feedbackCategory: "Validasi Profil",
    rating: 5,
    accuracyScore: 95,
    status: "verified",
    comment: "Identifikasi profil karier sangat komprehensif.",
    professionMatch: true,
    careerInsight: true,
    userType: "expert",
  },
  {
    id: "VAL003",
    userName: "Dr. Maya Sari",
    date: "2024-01-10",
    testType: "DISC",
    feedbackCategory: "Validasi Rekomendasi",
    rating: 4,
    accuracyScore: 88,
    status: "verified",
    comment: "Metodologi asesmen sudah baik, perlu sedikit penyesuaian.",
    professionMatch: true,
    careerInsight: true,
    userType: "expert",
  },
  {
    id: "VAL004",
    userName: "Prof. Dewi Kusuma",
    date: "2024-01-08",
    testType: "Big Five",
    feedbackCategory: "Validasi Profil",
    rating: 5,
    accuracyScore: 94,
    status: "verified",
    comment: "Profil kepribadian yang dihasilkan sangat akurat dan valid.",
    professionMatch: true,
    careerInsight: true,
    userType: "expert",
  },
];

type SortOption = "name-asc" | "name-desc" | "newest" | "oldest";
type KendalaFilter = "all" | "no-kendala" | "has-kendala";

export default function UmpanBalik() {
  // Main tab: Mahasiswa vs Validator
  const [mainTab, setMainTab] = useState<"mahasiswa" | "validator">("mahasiswa");
  
  // Sub tab for Mahasiswa: Data Mentah vs Visualisasi
  const [subTab, setSubTab] = useState<"data-mentah" | "visualisasi">("data-mentah");
  
  // Filter & search states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [kendalaFilter, setKendalaFilter] = useState<KendalaFilter>("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  
  // Modal states
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<typeof validatorFeedbackData[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Total data count (simulated large dataset)
  const totalDataCount = 10000;

  // Filter and sort Mahasiswa data
  const filteredMahasiswaData = useMemo(() => {
    let data = [...mahasiswaFeedbackData];
    
    // Search filter
    if (searchQuery) {
      data = data.filter((item) =>
        item.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Kendala filter
    if (kendalaFilter === "no-kendala") {
      data = data.filter((item) => item.kendala.length === 0);
    } else if (kendalaFilter === "has-kendala") {
      data = data.filter((item) => item.kendala.length > 0);
    }
    
    // Sort
    switch (sortOption) {
      case "name-asc":
        data.sort((a, b) => a.userName.localeCompare(b.userName));
        break;
      case "name-desc":
        data.sort((a, b) => b.userName.localeCompare(a.userName));
        break;
      case "newest":
        data.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "oldest":
        data.sort((a, b) => a.id.localeCompare(b.id));
        break;
    }
    
    return data;
  }, [searchQuery, sortOption, kendalaFilter]);

  const totalPages = Math.ceil(filteredMahasiswaData.length / rowsPerPage);
  const paginatedData = filteredMahasiswaData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  const handleKendalaChange = (value: KendalaFilter) => {
    setKendalaFilter(value);
    setCurrentPage(1);
  };

  // Score badge component for Likert 1-7
  const ScoreBadge = ({ score }: { score: number }) => {
    const getScoreColor = (s: number) => {
      if (s >= 6) return "bg-success/10 text-success border-success/20";
      if (s >= 4) return "bg-warning/10 text-warning border-warning/20";
      return "bg-destructive/10 text-destructive border-destructive/20";
    };

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={`${getScoreColor(score)} cursor-help font-medium`}>
              {score}/7
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Skala Likert 1-7</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Kendala chips component
  const KendalaChips = ({ kendala }: { kendala: string[] }) => {
    if (kendala.length === 0) {
      return (
        <Badge variant="outline" className="text-muted-foreground border-muted">
          Tidak ada kendala
        </Badge>
      );
    }

    const displayCount = 2;
    const visibleKendala = kendala.slice(0, displayCount);
    const hiddenCount = kendala.length - displayCount;

    return (
      <div className="flex flex-wrap gap-1">
        {visibleKendala.map((k, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {k}
          </Badge>
        ))}
        {hiddenCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="cursor-help text-xs">
                  +{hiddenCount}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  {kendala.slice(displayCount).map((k, i) => (
                    <p key={i}>{k}</p>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Umpan Balik Fitur Kenali Diri
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Menyajikan data respon umpan balik pengguna fitur Kenali Diri.
            </p>
          </div>
          <Button
            onClick={() => setIsExportOpen(true)}
            className="w-full md:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            <span>Ekspor Data</span>
          </Button>
        </div>

        {/* Button Group: Mahasiswa vs Validator */}
        <div className="inline-flex p-1 rounded-lg bg-muted/60 border border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMainTab("mahasiswa")}
            className={`rounded-md px-4 transition-all ${
              mainTab === "mahasiswa"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent"
            }`}
          >
            Mahasiswa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMainTab("validator")}
            className={`rounded-md px-4 transition-all ${
              mainTab === "validator"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent"
            }`}
          >
            Validator
          </Button>
        </div>

        {/* Tab Menu: Data Mentah vs Visualisasi (only for Mahasiswa) */}
        {mainTab === "mahasiswa" && (
          <div className="flex gap-6 border-b border-border">
            <button
              onClick={() => setSubTab("data-mentah")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                subTab === "data-mentah"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Data Mentah
              {subTab === "data-mentah" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
              )}
            </button>
            <button
              onClick={() => setSubTab("visualisasi")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                subTab === "visualisasi"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Visualisasi
              {subTab === "visualisasi" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
              )}
            </button>
          </div>
        )}

        {/* Content based on main tab */}
        {mainTab === "mahasiswa" ? (
          <div className="space-y-6">

            {subTab === "data-mentah" ? (
              <>
                {/* Filter & Search Section */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold">
                      Kontrol & Pencarian Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-3">
                      {/* Search Bar */}
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Ketik nama pengguna…"
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => handleSearchChange(e.target.value)}
                        />
                      </div>
                      
                      {/* Sort Dropdown */}
                      <Select
                        value={sortOption}
                        onValueChange={(value) => handleSortChange(value as SortOption)}
                      >
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name-asc">Nama pengguna A–Z</SelectItem>
                          <SelectItem value="name-desc">Nama pengguna Z–A</SelectItem>
                          <SelectItem value="newest">Feedback terbaru</SelectItem>
                          <SelectItem value="oldest">Feedback terlama</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Kendala Filter */}
                      <Select
                        value={kendalaFilter}
                        onValueChange={(value) => handleKendalaChange(value as KendalaFilter)}
                      >
                        <SelectTrigger className="w-full md:w-[180px]">
                          <SelectValue placeholder="Kendala" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua</SelectItem>
                          <SelectItem value="no-kendala">Tidak ada kendala</SelectItem>
                          <SelectItem value="has-kendala">Ada kendala</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto -mx-4 md:mx-0">
                      <div className="min-w-[700px] px-4 md:px-0">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="w-[100px]">ID Feedback</TableHead>
                              <TableHead className="min-w-[150px]">Pengguna</TableHead>
                              <TableHead className="text-center">Kemudahan Tes</TableHead>
                              <TableHead className="text-center">Relevansi Rekomendasi</TableHead>
                              <TableHead className="text-center">Kepuasan Fitur</TableHead>
                              <TableHead className="min-w-[200px]">Daftar Kendala</TableHead>
                              <TableHead className="text-center w-[80px]">Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedData.map((feedback) => (
                              <TableRow
                                key={feedback.id}
                                className="hover:bg-muted/30 transition-colors"
                              >
                                <TableCell className="font-mono text-sm text-muted-foreground">
                                  {feedback.id}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {feedback.userName}
                                </TableCell>
                                <TableCell className="text-center">
                                  <ScoreBadge score={feedback.kemudahanTes} />
                                </TableCell>
                                <TableCell className="text-center">
                                  <ScoreBadge score={feedback.relevansiRekomendasi} />
                                </TableCell>
                                <TableCell className="text-center">
                                  <ScoreBadge score={feedback.kepuasanFitur} />
                                </TableCell>
                                <TableCell>
                                  <KendalaChips kendala={feedback.kendala} />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-primary/10 hover:text-primary"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
                      <div className="flex items-center gap-3 order-2 sm:order-1">
                        <span className="text-sm text-muted-foreground">Rows per page:</span>
                        <Select
                          value={rowsPerPage.toString()}
                          onValueChange={(value) => {
                            setRowsPerPage(Number(value));
                            setCurrentPage(1);
                          }}
                        >
                          <SelectTrigger className="w-[80px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">
                          Menampilkan {paginatedData.length} dari {totalDataCount.toLocaleString("id-ID")} data
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 order-1 sm:order-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => p - 1)}
                          className="gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === totalPages || totalPages === 0}
                          onClick={() => setCurrentPage((p) => p + 1)}
                          className="gap-1"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              // Visualisasi Tab
              <FeedbackCharts data={validatorFeedbackData} />
            )}
          </div>
        ) : (
          // Validator Tab Content
          <div className="space-y-6">
            <FeedbackCharts data={validatorFeedbackData} />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Validasi Expert</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <div className="min-w-[800px] px-4 md:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>ID</TableHead>
                          <TableHead>Validator</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Kategori</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Akurasi</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validatorFeedbackData.map((feedback) => (
                          <TableRow
                            key={feedback.id}
                            className="hover:bg-muted/30 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedFeedback(feedback);
                              setIsDetailOpen(true);
                            }}
                          >
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              {feedback.id}
                            </TableCell>
                            <TableCell className="font-medium">
                              {feedback.userName}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(feedback.date).toLocaleDateString("id-ID")}
                            </TableCell>
                            <TableCell>{feedback.feedbackCategory}</TableCell>
                            <TableCell>
                              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                                {feedback.rating}/5
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      feedback.accuracyScore >= 80
                                        ? "bg-success"
                                        : feedback.accuracyScore >= 60
                                        ? "bg-warning"
                                        : "bg-destructive"
                                    }`}
                                    style={{ width: `${feedback.accuracyScore}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{feedback.accuracyScore}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-success/10 text-success border-success/20">
                                Terverifikasi
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedFeedback(feedback);
                                  setIsDetailOpen(true);
                                }}
                                className="hover:bg-primary/10 hover:text-primary"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Export Dialog */}
      <ExportDataDialog open={isExportOpen} onOpenChange={setIsExportOpen} />

      {/* Feedback Detail Modal */}
      <FeedbackDetailModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        feedback={selectedFeedback}
      />
    </DashboardLayout>
  );
}
