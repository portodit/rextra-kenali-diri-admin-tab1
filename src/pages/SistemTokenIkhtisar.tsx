import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HelpCircle,
  Search,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  CreditCard,
  Crown,
  Zap,
  AlertTriangle,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { toast } from "@/hooks/use-toast";

// Mock data for charts
const chartData = [
  { day: "Sen", masuk: 18500, keluar: 12300, topup: 12000, alokasi: 6500, pemakaian: 12300 },
  { day: "Sel", masuk: 22400, keluar: 15600, topup: 15000, alokasi: 7400, pemakaian: 15600 },
  { day: "Rab", masuk: 32450, keluar: 28120, topup: 22000, alokasi: 10450, pemakaian: 28120 },
  { day: "Kam", masuk: 28900, keluar: 19800, topup: 18000, alokasi: 10900, pemakaian: 19800 },
  { day: "Jum", masuk: 35200, keluar: 24500, topup: 25000, alokasi: 10200, pemakaian: 24500 },
  { day: "Sab", masuk: 19800, keluar: 14200, topup: 12000, alokasi: 7800, pemakaian: 14200 },
  { day: "Min", masuk: 15200, keluar: 10500, topup: 8000, alokasi: 7200, pemakaian: 10500 },
];

// Mock data for activity table
const activityData = [
  {
    id: "1",
    waktu: "14:32",
    tanggal: "20 Jan 2026",
    user: "john@example.com",
    userName: "John Doe",
    jenis: "IN" as const,
    sumber: "Top Up",
    refId: "TXN-2847",
    jumlah: 5000,
    saldoSetelah: 15000,
    status: "Berhasil" as const,
  },
  {
    id: "2",
    waktu: "14:28",
    tanggal: "20 Jan 2026",
    user: "maria@example.com",
    userName: "Maria Garcia",
    jenis: "OUT" as const,
    sumber: "Pemakaian",
    refId: "USE-9821",
    jumlah: 120,
    saldoSetelah: 8880,
    status: "Berhasil" as const,
  },
  {
    id: "3",
    waktu: "14:15",
    tanggal: "20 Jan 2026",
    user: "budi@example.com",
    userName: "Budi Santoso",
    jenis: "IN" as const,
    sumber: "Membership",
    refId: "MBR-4562",
    jumlah: 2000,
    saldoSetelah: 12000,
    status: "Berhasil" as const,
  },
  {
    id: "4",
    waktu: "13:58",
    tanggal: "20 Jan 2026",
    user: "siti@example.com",
    userName: "Siti Aminah",
    jenis: "OUT" as const,
    sumber: "Pemakaian",
    refId: "USE-9819",
    jumlah: 85,
    saldoSetelah: 4915,
    status: "Berhasil" as const,
  },
  {
    id: "5",
    waktu: "13:42",
    tanggal: "20 Jan 2026",
    user: "agus@example.com",
    userName: "Agus Prasetyo",
    jenis: "IN" as const,
    sumber: "Top Up",
    refId: "TXN-2846",
    jumlah: 10000,
    saldoSetelah: 25000,
    status: "Berhasil" as const,
  },
  {
    id: "6",
    waktu: "13:21",
    tanggal: "20 Jan 2026",
    user: "rina@example.com",
    userName: "Rina Wati",
    jenis: "OUT" as const,
    sumber: "Pemakaian",
    refId: "USE-9815",
    jumlah: 200,
    saldoSetelah: 3800,
    status: "Gagal" as const,
  },
  {
    id: "7",
    waktu: "12:55",
    tanggal: "20 Jan 2026",
    user: "doni@example.com",
    userName: "Doni Kusuma",
    jenis: "IN" as const,
    sumber: "Membership",
    refId: "MBR-4561",
    jumlah: 3500,
    saldoSetelah: 18500,
    status: "Berhasil" as const,
  },
  {
    id: "8",
    waktu: "12:30",
    tanggal: "20 Jan 2026",
    user: "lina@example.com",
    userName: "Lina Mariana",
    jenis: "IN" as const,
    sumber: "Top Up",
    refId: "TXN-2845",
    jumlah: 25000,
    saldoSetelah: 45000,
    status: "Berhasil" as const,
  },
];

// Mock alerts
const alertsData = [
  { id: "1", message: "3 transaksi top up gagal hari ini", type: "error", route: "/sistem-token/riwayat?status=gagal&sumber=topup" },
  { id: "2", message: "Lonjakan pemakaian +150% dari user @john", type: "warning", route: "/sistem-token/riwayat?user=john" },
  { id: "3", message: "Token membership belum dialokasikan untuk 5 user baru", type: "warning", route: "/sistem-token/membership" },
];

type ViewState = "loading" | "empty" | "error" | "data";
type TabType = "semua" | "topup" | "alokasi" | "pemakaian";

// KPI data per tab
const kpiDataByTab = {
  semua: {
    tokenMasuk: { value: 125450, delta: 12 },
    tokenKeluar: { value: 89320, delta: 8 },
    netFlow: { value: 36130, delta: 45 },
    topUpBerhasil: { value: 45, delta: 5 },
    alokasiMembership: { value: 78920, delta: 18 },
    pemakaianToken: { value: 89320, delta: 3 },
  },
  topup: {
    tokenMasuk: { value: 112000, delta: 15 },
    tokenKeluar: { value: 0, delta: 0 },
    netFlow: { value: 112000, delta: 15 },
    topUpBerhasil: { value: 45, delta: 5 },
    alokasiMembership: { value: 0, delta: 0 },
    pemakaianToken: { value: 0, delta: 0 },
  },
  alokasi: {
    tokenMasuk: { value: 60450, delta: 22 },
    tokenKeluar: { value: 0, delta: 0 },
    netFlow: { value: 60450, delta: 22 },
    topUpBerhasil: { value: 0, delta: 0 },
    alokasiMembership: { value: 60450, delta: 22 },
    pemakaianToken: { value: 0, delta: 0 },
  },
  pemakaian: {
    tokenMasuk: { value: 0, delta: 0 },
    tokenKeluar: { value: 125020, delta: 8 },
    netFlow: { value: -125020, delta: 8 },
    topUpBerhasil: { value: 0, delta: 0 },
    alokasiMembership: { value: 0, delta: 0 },
    pemakaianToken: { value: 125020, delta: 8 },
  },
};

export default function SistemTokenIkhtisar() {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<ViewState>("data");
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedTab, setSelectedTab] = useState<TabType>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [alertsExpanded, setAlertsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(Math.abs(num));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil disalin",
      description: `Reference ID ${text} telah disalin ke clipboard.`,
    });
  };

  // Get tab label for display
  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case "semua": return "Semua Aktivitas";
      case "topup": return "Top Up";
      case "alokasi": return "Alokasi Membership";
      case "pemakaian": return "Pemakaian Token";
    }
  };

  // Dynamic KPI cards based on selected tab
  const currentKpiData = kpiDataByTab[selectedTab];
  
  const kpiCards = useMemo(() => {
    const baseCards = [
      {
        key: "tokenMasuk",
        title: selectedTab === "topup" ? "Token dari Top Up" : 
               selectedTab === "alokasi" ? "Token dari Alokasi" : "Token Masuk",
        value: currentKpiData.tokenMasuk.value,
        delta: currentKpiData.tokenMasuk.delta,
        deltaPositive: true,
        icon: ArrowUpRight,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        tooltip: selectedTab === "topup" ? "Total token masuk dari transaksi top up" :
                 selectedTab === "alokasi" ? "Total token masuk dari alokasi membership" :
                 "Total token bertambah dari top up + alokasi + penyesuaian",
        show: selectedTab !== "pemakaian",
      },
      {
        key: "tokenKeluar",
        title: selectedTab === "pemakaian" ? "Total Pemakaian" : "Token Keluar",
        value: currentKpiData.tokenKeluar.value,
        delta: currentKpiData.tokenKeluar.delta,
        deltaPositive: false,
        icon: ArrowDownRight,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950/30",
        tooltip: "Total token berkurang dari pemakaian fitur",
        show: selectedTab === "semua" || selectedTab === "pemakaian",
      },
      {
        key: "netFlow",
        title: "Net Flow",
        value: currentKpiData.netFlow.value,
        delta: currentKpiData.netFlow.delta,
        deltaPositive: currentKpiData.netFlow.value >= 0,
        icon: currentKpiData.netFlow.value >= 0 ? TrendingUp : TrendingDown,
        color: currentKpiData.netFlow.value >= 0 ? "text-blue-600" : "text-red-600",
        bgColor: currentKpiData.netFlow.value >= 0 ? "bg-blue-50 dark:bg-blue-950/30" : "bg-red-50 dark:bg-red-950/30",
        tooltip: "Selisih token masuk dikurangi token keluar",
        show: true,
      },
      {
        key: "topUpBerhasil",
        title: "Top Up Berhasil",
        value: currentKpiData.topUpBerhasil.value,
        delta: currentKpiData.topUpBerhasil.delta,
        deltaPositive: true,
        icon: CreditCard,
        color: "text-violet-600",
        bgColor: "bg-violet-50 dark:bg-violet-950/30",
        tooltip: "Jumlah transaksi top up yang berhasil",
        isCount: true,
        show: selectedTab === "semua" || selectedTab === "topup",
      },
      {
        key: "alokasiMembership",
        title: "Alokasi Membership",
        value: currentKpiData.alokasiMembership.value,
        delta: currentKpiData.alokasiMembership.delta,
        deltaPositive: true,
        icon: Crown,
        color: "text-amber-600",
        bgColor: "bg-amber-50 dark:bg-amber-950/30",
        tooltip: "Total token masuk dari event membership",
        show: selectedTab === "semua" || selectedTab === "alokasi",
      },
      {
        key: "pemakaianToken",
        title: "Pemakaian Token",
        value: currentKpiData.pemakaianToken.value,
        delta: currentKpiData.pemakaianToken.delta,
        deltaPositive: true,
        icon: Zap,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-950/30",
        tooltip: "Total token keluar akibat konsumsi fitur",
        show: selectedTab === "semua" || selectedTab === "pemakaian",
      },
    ];

    return baseCards.filter(card => card.show && card.value !== 0);
  }, [selectedTab, currentKpiData]);

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const masuk = payload.find((p: any) => p.dataKey === "masuk")?.value || 0;
      const keluar = payload.find((p: any) => p.dataKey === "keluar")?.value || 0;
      const topup = payload.find((p: any) => p.dataKey === "topup")?.value || 0;
      const alokasi = payload.find((p: any) => p.dataKey === "alokasi")?.value || 0;
      const pemakaian = payload.find((p: any) => p.dataKey === "pemakaian")?.value || 0;
      const netFlow = masuk - keluar;
      
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-sm z-50">
          <p className="font-medium mb-2">{label}, 20 Jan 2026</p>
          <div className="space-y-1">
            {selectedTab === "semua" && (
              <>
                <p className="text-emerald-600">Token Masuk: +{formatNumber(masuk)}</p>
                <p className="text-red-600">Token Keluar: -{formatNumber(keluar)}</p>
                <p className={netFlow >= 0 ? "text-blue-600 font-medium" : "text-red-600 font-medium"}>
                  Net Flow: {netFlow >= 0 ? "+" : "-"}{formatNumber(netFlow)}
                </p>
              </>
            )}
            {selectedTab === "topup" && (
              <p className="text-violet-600">Top Up: +{formatNumber(topup)}</p>
            )}
            {selectedTab === "alokasi" && (
              <p className="text-amber-600">Alokasi: +{formatNumber(alokasi)}</p>
            )}
            {selectedTab === "pemakaian" && (
              <p className="text-orange-600">Pemakaian: -{formatNumber(pemakaian)}</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Get chart config based on tab
  const getChartConfig = () => {
    switch (selectedTab) {
      case "topup":
        return {
          areas: [
            { dataKey: "topup", name: "Top Up", stroke: "#8B5CF6", gradient: "colorTopup" }
          ],
          gradients: [
            { id: "colorTopup", color: "#8B5CF6" }
          ]
        };
      case "alokasi":
        return {
          areas: [
            { dataKey: "alokasi", name: "Alokasi Membership", stroke: "#F59E0B", gradient: "colorAlokasi" }
          ],
          gradients: [
            { id: "colorAlokasi", color: "#F59E0B" }
          ]
        };
      case "pemakaian":
        return {
          areas: [
            { dataKey: "pemakaian", name: "Pemakaian Token", stroke: "#F97316", gradient: "colorPemakaian" }
          ],
          gradients: [
            { id: "colorPemakaian", color: "#F97316" }
          ]
        };
      default:
        return {
          areas: [
            { dataKey: "masuk", name: "Token Masuk", stroke: "#3B82F6", gradient: "colorMasuk" },
            { dataKey: "keluar", name: "Token Keluar", stroke: "#F59E0B", gradient: "colorKeluar" }
          ],
          gradients: [
            { id: "colorMasuk", color: "#3B82F6" },
            { id: "colorKeluar", color: "#F59E0B" }
          ]
        };
    }
  };

  const chartConfig = getChartConfig();

  // Loading State
  const LoadingState = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Empty State
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Coins className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Belum Ada Aktivitas Token</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Aktivitas token akan muncul setelah ada top up, alokasi membership, atau pemakaian fitur.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate("/sistem-token/pengadaan")}>
          Ke Pengadaan Token
        </Button>
        <Button onClick={() => navigate("/sistem-token/membership")}>
          Ke Alokasi Membership
        </Button>
      </div>
    </div>
  );

  // Error State
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Gagal Memuat Data</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Terjadi kesalahan saat memuat data. Silakan coba lagi.
      </p>
      <Button onClick={() => setViewState("data")}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Coba Lagi
      </Button>
    </div>
  );

  return (
    <TooltipProvider>
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Breadcrumb - Hidden on mobile */}
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/sistem-token/ikhtisar">Sistem Token</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Ikhtisar Token</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Ikhtisar Token</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-none">
                Pantau pergerakan token masuk dan keluar, serta ringkasan pemakaian token pada periode tertentu.
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="cursor-help shrink-0 h-8 w-8 sm:h-9 sm:w-9">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs z-50 bg-popover">
                <p className="text-sm">
                  Token adalah unit mata uang dalam sistem REXTRA yang digunakan untuk mengakses fitur berbayar. 
                  Halaman ini menampilkan ringkasan pergerakan token termasuk top up, alokasi dari membership, dan pemakaian.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Control Bar - Mobile optimized */}
        <div className="space-y-3 sm:space-y-4">
          {/* Tabs - Fit content width */}
          <div className="flex justify-center">
            <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as TabType)}>
              <TabsList className="inline-flex h-10 p-1 bg-muted/60 rounded-xl">
                <TabsTrigger value="semua" className="text-xs sm:text-sm px-3 sm:px-4 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Semua</TabsTrigger>
                <TabsTrigger value="topup" className="text-xs sm:text-sm px-3 sm:px-4 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Top Up</TabsTrigger>
                <TabsTrigger value="alokasi" className="text-xs sm:text-sm px-3 sm:px-4 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Alokasi</TabsTrigger>
                <TabsTrigger value="pemakaian" className="text-xs sm:text-sm px-3 sm:px-4 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Pemakaian</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Search + Period + Status - Stacked on mobile */}
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari user, email, atau reference ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 sm:h-10"
              />
            </div>
            
            {/* Period + Status - Side by side */}
            <div className="flex gap-2 sm:gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="flex-1 h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="7d">7 Hari</SelectItem>
                  <SelectItem value="30d">30 Hari</SelectItem>
                  <SelectItem value="90d">90 Hari</SelectItem>
                  <SelectItem value="custom">Kustom</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1 h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="semua">Semua</SelectItem>
                  <SelectItem value="berhasil">Berhasil</SelectItem>
                  <SelectItem value="gagal">Gagal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Floating Demo State Toggle - Fixed position for dev only */}
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1 p-1 bg-card/95 backdrop-blur-sm border shadow-lg rounded-full">
          {(["data", "loading", "empty", "error"] as ViewState[]).map((state) => (
            <Button
              key={state}
              variant={viewState === state ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewState(state)}
              className={`text-xs h-7 px-2 rounded-full ${viewState === state ? "" : "text-muted-foreground"}`}
            >
              {state === "data" ? "📊" : state === "loading" ? "⏳" : state === "empty" ? "📭" : "❌"}
            </Button>
          ))}
        </div>

        {/* Content based on state */}
        {viewState === "loading" && <LoadingState />}
        {viewState === "empty" && <EmptyState />}
        {viewState === "error" && <ErrorState />}
        {viewState === "data" && (
          <>
            {/* KPI Cards */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Menampilkan data untuk: <span className="font-medium text-foreground">{getTabLabel(selectedTab)}</span>
              </p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {kpiCards.map((kpi) => (
                  <Card
                    key={kpi.key}
                    className="cursor-pointer hover:shadow-md transition-shadow min-w-0"
                  >
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                              {kpi.title}
                            </p>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="cursor-help shrink-0">
                                  <HelpCircle className="h-3 w-3 text-muted-foreground/60 hover:text-muted-foreground transition-colors" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="z-50 bg-popover">
                                <p className="text-xs max-w-[200px]">{kpi.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                            {kpi.key === "netFlow" && kpi.value < 0 && "-"}
                            {kpi.isCount ? kpi.value : formatNumber(kpi.value)}
                            <span className="text-sm sm:text-base lg:text-lg font-normal ml-1">
                              {kpi.isCount ? "trx" : "token"}
                            </span>
                          </p>
                          {kpi.delta > 0 && (
                            <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                              {kpi.deltaPositive ? (
                                <TrendingUp className="h-3 w-3 text-emerald-600 shrink-0" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-600 shrink-0" />
                              )}
                              <span className={kpi.deltaPositive ? "text-emerald-600" : "text-red-600"}>
                                {kpi.deltaPositive ? "+" : ""}{kpi.delta}%
                              </span>
                              <span className="text-muted-foreground hidden sm:inline">vs periode sblm</span>
                            </div>
                          )}
                        </div>
                        <div className={`p-1.5 sm:p-2 lg:p-2.5 rounded-lg shrink-0 ${kpi.bgColor}`}>
                          <kpi.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${kpi.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Modern Alerts Panel */}
            {alertsData.length > 0 && (
              <div className="rounded-xl border bg-gradient-to-r from-amber-50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20 overflow-hidden">
                <Collapsible open={alertsExpanded} onOpenChange={setAlertsExpanded}>
                  <CollapsibleTrigger asChild>
                    <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-amber-100/30 dark:hover:bg-amber-900/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">Perlu Ditinjau</p>
                          <p className="text-xs text-muted-foreground">{alertsData.length} item memerlukan perhatian</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0 font-semibold">
                          {alertsData.length}
                        </Badge>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${alertsExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-2">
                      {alertsData.map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-card/80 ring-1 ring-border/50 hover:ring-border transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${alert.type === "error" ? "bg-destructive" : "bg-amber-500"}`} />
                            <span className="text-sm text-foreground">
                              {alert.message}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-3 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 opacity-70 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => { e.stopPropagation(); navigate(alert.route); }}
                          >
                            Tinjau
                            <ExternalLink className="h-3 w-3 ml-1.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}

            {/* Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Grafik Tren: {getTabLabel(selectedTab)}
                </CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="cursor-help">
                      <HelpCircle className="h-4 w-4 text-muted-foreground/60 hover:text-muted-foreground transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="z-50 bg-popover max-w-xs">
                    <p className="text-xs">
                      Grafik ini menampilkan tren pergerakan token per hari sesuai filter yang dipilih. 
                      Hover pada titik data untuk melihat detail.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] lg:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        {chartConfig.gradients.map((g) => (
                          <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={g.color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        className="text-xs"
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `${value / 1000}k`}
                        className="text-xs"
                      />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend />
                      {chartConfig.areas.map((area) => (
                        <Area
                          key={area.dataKey}
                          type="monotone"
                          dataKey={area.dataKey}
                          name={area.name}
                          stroke={area.stroke}
                          strokeWidth={2}
                          fillOpacity={1}
                          fill={`url(#${area.gradient})`}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Activity Table - Simplified, no pagination */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Aktivitas Token Terbaru
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    8 pergerakan token terakhir
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                  onClick={() => navigate("/sistem-token/ledger")}
                >
                  Lihat Semua
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="min-w-[90px]">Waktu</TableHead>
                        <TableHead className="min-w-[130px]">User</TableHead>
                        <TableHead className="min-w-[60px] text-center">Tipe</TableHead>
                        <TableHead className="min-w-[100px]">Sumber</TableHead>
                        <TableHead className="min-w-[100px] hidden md:table-cell">Ref ID</TableHead>
                        <TableHead className="min-w-[90px] text-right">Jumlah</TableHead>
                        <TableHead className="min-w-[70px] text-center hidden sm:table-cell">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityData.slice(0, 8).map((item) => (
                        <TableRow 
                          key={item.id} 
                          className="hover:bg-muted/30 cursor-pointer group"
                          onClick={() => navigate(`/sistem-token/ledger?ref=${item.refId}`)}
                        >
                          <TableCell className="py-3">
                            <div className="text-sm font-medium">{item.waktu}</div>
                            <div className="text-xs text-muted-foreground">{item.tanggal.split(" ")[0]} {item.tanggal.split(" ")[1]}</div>
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="text-sm font-medium truncate max-w-[120px]">{item.userName}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[120px] hidden sm:block">{item.user}</div>
                          </TableCell>
                          <TableCell className="py-3 text-center">
                            <Badge
                              variant="outline"
                              className={
                                item.jenis === "IN"
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700 text-xs px-2"
                                  : "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-700 text-xs px-2"
                              }
                            >
                              {item.jenis === "IN" ? "↑" : "↓"} {item.jenis}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 text-sm">{item.sumber}</TableCell>
                          <TableCell className="py-3 hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                                {item.refId}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => { e.stopPropagation(); copyToClipboard(item.refId); }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 text-right">
                            <span
                              className={
                                item.jenis === "IN"
                                  ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                                  : "text-rose-600 dark:text-rose-400 font-semibold"
                              }
                            >
                              {item.jenis === "IN" ? "+" : "-"}
                              {formatNumber(item.jumlah)}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 text-center hidden sm:table-cell">
                            <Badge
                              variant="secondary"
                              className={
                                item.status === "Berhasil"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0"
                                  : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-0"
                              }
                            >
                              {item.status === "Berhasil" ? "✓" : "✗"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
    </TooltipProvider>
  );
}
