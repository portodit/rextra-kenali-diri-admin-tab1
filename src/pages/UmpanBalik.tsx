import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  Download,
  Eye,
  Star,
  TrendingUp,
  Users,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ExportDataDialog } from "@/components/ExportDataDialog";
import { FeedbackDetailModal } from "@/components/FeedbackDetailModal";
import { FeedbackCharts } from "@/components/FeedbackCharts";

// Mock data for feedback
const feedbackData = [
  {
    id: "FB001",
    userName: "Dr. Ahmad Fauzi",
    userType: "expert",
    date: "2024-01-15",
    testType: "RIASEC",
    feedbackCategory: "Validasi Rekomendasi",
    rating: 5,
    accuracyScore: 92,
    status: "verified",
    comment: "Rekomendasi profesi sangat akurat dan sesuai dengan profil kepribadian.",
    professionMatch: true,
    careerInsight: true,
  },
  {
    id: "FB002",
    userName: "Siti Nurhaliza",
    userType: "student",
    date: "2024-01-14",
    testType: "Big Five",
    feedbackCategory: "Kualitas Asesmen",
    rating: 4,
    accuracyScore: 85,
    status: "pending",
    comment: "Hasil tes cukup membantu dalam memahami kepribadian saya.",
    professionMatch: true,
    careerInsight: false,
  },
  {
    id: "FB003",
    userName: "Prof. Bambang Sudarto",
    userType: "expert",
    date: "2024-01-13",
    testType: "DISC",
    feedbackCategory: "Validasi Profil",
    rating: 5,
    accuracyScore: 95,
    status: "verified",
    comment: "Identifikasi profil karier sangat komprehensif.",
    professionMatch: true,
    careerInsight: true,
  },
  {
    id: "FB004",
    userName: "Rina Wulandari",
    userType: "student",
    date: "2024-01-12",
    testType: "RIASEC",
    feedbackCategory: "Rekomendasi Profesi",
    rating: 3,
    accuracyScore: 70,
    status: "reviewed",
    comment: "Beberapa rekomendasi kurang sesuai dengan minat saya.",
    professionMatch: false,
    careerInsight: true,
  },
  {
    id: "FB005",
    userName: "Budi Santoso",
    userType: "student",
    date: "2024-01-11",
    testType: "Big Five",
    feedbackCategory: "Kualitas Asesmen",
    rating: 5,
    accuracyScore: 90,
    status: "verified",
    comment: "Sangat puas dengan hasil asesmen, sangat detail dan informatif.",
    professionMatch: true,
    careerInsight: true,
  },
  {
    id: "FB006",
    userName: "Dr. Maya Sari",
    userType: "expert",
    date: "2024-01-10",
    testType: "DISC",
    feedbackCategory: "Validasi Rekomendasi",
    rating: 4,
    accuracyScore: 88,
    status: "verified",
    comment: "Metodologi asesmen sudah baik, perlu sedikit penyesuaian.",
    professionMatch: true,
    careerInsight: true,
  },
  {
    id: "FB007",
    userName: "Andi Pratama",
    userType: "student",
    date: "2024-01-09",
    testType: "RIASEC",
    feedbackCategory: "Rekomendasi Profesi",
    rating: 4,
    accuracyScore: 82,
    status: "pending",
    comment: "Rekomendasi cukup membantu untuk perencanaan karier.",
    professionMatch: true,
    careerInsight: false,
  },
  {
    id: "FB008",
    userName: "Prof. Dewi Kusuma",
    userType: "expert",
    date: "2024-01-08",
    testType: "Big Five",
    feedbackCategory: "Validasi Profil",
    rating: 5,
    accuracyScore: 94,
    status: "verified",
    comment: "Profil kepribadian yang dihasilkan sangat akurat dan valid.",
    professionMatch: true,
    careerInsight: true,
  },
];

const categoryFilters = [
  { id: "all", label: "Semua" },
  { id: "expert", label: "Validasi Ahli" },
  { id: "student", label: "Real User" },
];

const feedbackTypeFilters = [
  { id: "all", label: "Semua Kategori" },
  { id: "Kualitas Asesmen", label: "Kualitas Asesmen" },
  { id: "Rekomendasi Profesi", label: "Rekomendasi Profesi" },
  { id: "Validasi Rekomendasi", label: "Validasi Rekomendasi" },
  { id: "Validasi Profil", label: "Validasi Profil" },
];

export default function UmpanBalik() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFeedbackType, setSelectedFeedbackType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<typeof feedbackData[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const itemsPerPage = 5;

  // Filter logic
  const filteredData = feedbackData.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.userType === selectedCategory;
    const matchesFeedbackType =
      selectedFeedbackType === "all" || item.feedbackCategory === selectedFeedbackType;
    const matchesSearch =
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.feedbackCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesFeedbackType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const handleViewDetail = (feedback: typeof feedbackData[0]) => {
    setSelectedFeedback(feedback);
    setIsDetailOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-success/10 text-success border-success/20">Terverifikasi</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case "reviewed":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Ditinjau</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUserTypeBadge = (type: string) => {
    return type === "expert" ? (
      <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">Expert</Badge>
    ) : (
      <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Mahasiswa</Badge>
    );
  };

  // Summary stats
  const totalFeedback = feedbackData.length;
  const averageRating = (feedbackData.reduce((sum, f) => sum + f.rating, 0) / totalFeedback).toFixed(1);
  const averageAccuracy = Math.round(feedbackData.reduce((sum, f) => sum + f.accuracyScore, 0) / totalFeedback);
  const positiveFeedback = feedbackData.filter((f) => f.rating >= 4).length;

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Umpan Balik Pengguna
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Kelola dan analisis feedback pengguna untuk evaluasi kualitas asesmen
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

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-xl bg-primary/10">
                  <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Total Feedback</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{totalFeedback}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-xl bg-amber-500/10">
                  <Star className="h-5 w-5 md:h-6 md:w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Rata-rata Rating</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{averageRating}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-xl bg-success/10">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-success" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Akurasi Rata-rata</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{averageAccuracy}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-xl bg-green-500/10">
                  <ThumbsUp className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Feedback Positif</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{positiveFeedback}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <FeedbackCharts data={feedbackData} />

        {/* Filter Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={selectedCategory === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(filter.id);
                    setCurrentPage(1);
                  }}
                  className="transition-all"
                >
                  {filter.id === "expert" && <Users className="h-4 w-4 mr-1" />}
                  {filter.id === "student" && <Users className="h-4 w-4 mr-1" />}
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Search and Additional Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, kategori, atau status..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Select
                value={selectedFeedbackType}
                onValueChange={(value) => {
                  setSelectedFeedbackType(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Kategori Feedback" />
                </SelectTrigger>
                <SelectContent>
                  {feedbackTypeFilters.map((filter) => (
                    <SelectItem key={filter.id} value={filter.id}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Table */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-lg">Riwayat Respon Umpan Balik</CardTitle>
              <p className="text-sm text-muted-foreground">
                Menampilkan {paginatedData.length} dari {filteredData.length} feedback
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="min-w-[800px] px-4 md:px-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={
                            paginatedData.length > 0 &&
                            paginatedData.every((item) => selectedItems.includes(item.id))
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="min-w-[150px]">Pengguna</TableHead>
                      <TableHead className="min-w-[100px]">Tipe</TableHead>
                      <TableHead className="min-w-[120px]">Tanggal</TableHead>
                      <TableHead className="min-w-[140px]">Kategori</TableHead>
                      <TableHead className="min-w-[100px]">Rating</TableHead>
                      <TableHead className="min-w-[100px]">Akurasi</TableHead>
                      <TableHead className="min-w-[120px]">Status</TableHead>
                      <TableHead className="min-w-[80px] text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((feedback) => (
                      <TableRow
                        key={feedback.id}
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => handleViewDetail(feedback)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedItems.includes(feedback.id)}
                            onCheckedChange={(checked) =>
                              handleSelectItem(feedback.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">{feedback.userName}</TableCell>
                        <TableCell>{getUserTypeBadge(feedback.userType)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(feedback.date).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>{feedback.feedbackCategory}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < feedback.rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
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
                        <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetail(feedback);
                            }}
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
              <p className="text-sm text-muted-foreground order-2 sm:order-1">
                Halaman {currentPage} dari {totalPages}
              </p>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                    className="w-9"
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
