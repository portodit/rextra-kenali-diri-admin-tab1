import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  MessageSquareText,
  ThumbsUp,
  Target,
  Smile,
  TrendingUp,
  TrendingDown,
  Lightbulb,
} from "lucide-react";

// Mock data for Mahasiswa feedback (Likert 1-7)
const mahasiswaFeedbackData = [
  { id: "MHS001", kemudahanTes: 6, relevansiRekomendasi: 5, kepuasanFitur: 6, kendala: ["Durasi tes terasa terlalu lama", "Tampilan atau navigasi membingungkan"] },
  { id: "MHS002", kemudahanTes: 7, relevansiRekomendasi: 7, kepuasanFitur: 6, kendala: [] },
  { id: "MHS003", kemudahanTes: 4, relevansiRekomendasi: 3, kepuasanFitur: 4, kendala: ["Ada pertanyaan yang membingungkan", "Penjelasan hasil tes terlalu panjang atau sulit dipahami", "Kendala lainnya"] },
  { id: "MHS004", kemudahanTes: 5, relevansiRekomendasi: 6, kepuasanFitur: 5, kendala: ["Tampilan atau navigasi membingungkan"] },
  { id: "MHS005", kemudahanTes: 7, relevansiRekomendasi: 6, kepuasanFitur: 7, kendala: [] },
  { id: "MHS006", kemudahanTes: 6, relevansiRekomendasi: 5, kepuasanFitur: 6, kendala: ["Durasi tes terasa terlalu lama"] },
  { id: "MHS007", kemudahanTes: 3, relevansiRekomendasi: 4, kepuasanFitur: 3, kendala: ["Mengalami error/bug (macet, loading lama, atau tidak bisa lanjut)", "Tampilan atau navigasi membingungkan", "Kendala lainnya"] },
  { id: "MHS008", kemudahanTes: 6, relevansiRekomendasi: 7, kepuasanFitur: 6, kendala: [] },
  { id: "MHS009", kemudahanTes: 5, relevansiRekomendasi: 5, kepuasanFitur: 5, kendala: ["Penjelasan hasil tes terlalu panjang atau sulit dipahami"] },
  { id: "MHS010", kemudahanTes: 7, relevansiRekomendasi: 6, kepuasanFitur: 7, kendala: [] },
  { id: "MHS011", kemudahanTes: 6, relevansiRekomendasi: 6, kepuasanFitur: 6, kendala: [] },
  { id: "MHS012", kemudahanTes: 2, relevansiRekomendasi: 2, kepuasanFitur: 2, kendala: ["Mengalami error/bug (macet, loading lama, atau tidak bisa lanjut)", "Ada pertanyaan yang membingungkan"] },
  { id: "MHS013", kemudahanTes: 7, relevansiRekomendasi: 7, kepuasanFitur: 7, kendala: [] },
  { id: "MHS014", kemudahanTes: 5, relevansiRekomendasi: 4, kepuasanFitur: 5, kendala: ["Durasi tes terasa terlalu lama"] },
  { id: "MHS015", kemudahanTes: 6, relevansiRekomendasi: 6, kepuasanFitur: 6, kendala: [] },
];

// Previous period mock data for trend calculation
const previousPeriodData = {
  totalFeedback: 12,
  avgKemudahan: 5.1,
  avgRelevansi: 4.8,
  avgKepuasan: 4.9,
};

const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  destructive: "hsl(var(--destructive))",
  muted: "hsl(var(--muted))",
};

const DONUT_COLORS = ["hsl(var(--success))", "hsl(var(--destructive))"];

interface MahasiswaVisualizationProps {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export function MahasiswaVisualization({ selectedCategory, onCategoryChange }: MahasiswaVisualizationProps) {
  const [timeRange, setTimeRange] = useState("all-time");

  // Calculate statistics
  const stats = useMemo(() => {
    const total = mahasiswaFeedbackData.length;
    const avgKemudahan = mahasiswaFeedbackData.reduce((sum, d) => sum + d.kemudahanTes, 0) / total;
    const avgRelevansi = mahasiswaFeedbackData.reduce((sum, d) => sum + d.relevansiRekomendasi, 0) / total;
    const avgKepuasan = mahasiswaFeedbackData.reduce((sum, d) => sum + d.kepuasanFitur, 0) / total;

    // Trend calculations
    const totalTrend = ((total - previousPeriodData.totalFeedback) / previousPeriodData.totalFeedback) * 100;
    const kemudahanTrend = ((avgKemudahan - previousPeriodData.avgKemudahan) / previousPeriodData.avgKemudahan) * 100;
    const relevansiTrend = ((avgRelevansi - previousPeriodData.avgRelevansi) / previousPeriodData.avgRelevansi) * 100;
    const kepuasanTrend = ((avgKepuasan - previousPeriodData.avgKepuasan) / previousPeriodData.avgKepuasan) * 100;

    return {
      total,
      avgKemudahan: avgKemudahan.toFixed(1),
      avgRelevansi: avgRelevansi.toFixed(1),
      avgKepuasan: avgKepuasan.toFixed(1),
      totalTrend: totalTrend.toFixed(0),
      kemudahanTrend: kemudahanTrend.toFixed(0),
      relevansiTrend: relevansiTrend.toFixed(0),
      kepuasanTrend: kepuasanTrend.toFixed(0),
    };
  }, []);

  // Prepare chart data for Likert scale distribution
  const prepareDistributionData = (key: "kemudahanTes" | "relevansiRekomendasi" | "kepuasanFitur") => {
    return [1, 2, 3, 4, 5, 6, 7].map((score) => ({
      score: score.toString(),
      label: score === 1 ? "1 (Sangat Tidak Setuju)" : score === 7 ? "7 (Sangat Setuju)" : score.toString(),
      count: mahasiswaFeedbackData.filter((d) => d[key] === score).length,
    }));
  };

  // Calculate positive percentage for insight
  const calculatePositivePercentage = (key: "kemudahanTes" | "relevansiRekomendasi" | "kepuasanFitur") => {
    const positiveCount = mahasiswaFeedbackData.filter((d) => d[key] >= 6).length;
    return Math.round((positiveCount / mahasiswaFeedbackData.length) * 100);
  };

  // Kendala analysis
  const kendalaAnalysis = useMemo(() => {
    const noKendala = mahasiswaFeedbackData.filter((d) => d.kendala.length === 0).length;
    const hasKendala = mahasiswaFeedbackData.length - noKendala;
    
    const kendalaTypes: Record<string, number> = {
      "Durasi tes terasa terlalu lama": 0,
      "Ada pertanyaan yang membingungkan": 0,
      "Mengalami error/bug (macet, loading lama, atau tidak bisa lanjut)": 0,
      "Penjelasan hasil tes terlalu panjang atau sulit dipahami": 0,
      "Tampilan atau navigasi membingungkan": 0,
      "Kendala lainnya": 0,
    };

    mahasiswaFeedbackData.forEach((d) => {
      d.kendala.forEach((k) => {
        if (kendalaTypes.hasOwnProperty(k)) {
          kendalaTypes[k]++;
        }
      });
    });

    const kendalaData = Object.entries(kendalaTypes)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      noKendala,
      hasKendala,
      hasKendalaPercentage: Math.round((hasKendala / mahasiswaFeedbackData.length) * 100),
      kendalaData,
    };
  }, []);

  // Donut chart data
  const donutData = [
    { name: "Tidak ada kendala", value: kendalaAnalysis.noKendala },
    { name: "Ada kendala", value: kendalaAnalysis.hasKendala },
  ];

  // Mini trend data for cards
  const miniTrendData = [
    { value: 10 }, { value: 12 }, { value: 11 }, { value: 14 }, { value: 13 }, { value: 15 }
  ];

  // Overview Card Component
  const OverviewCard = ({ 
    icon: Icon, 
    title, 
    value, 
    trend, 
    trendData 
  }: { 
    icon: React.ElementType; 
    title: string; 
    value: string | number; 
    trend: string; 
    trendData: { value: number }[];
  }) => {
    const trendNumber = parseFloat(trend);
    const isPositive = trendNumber >= 0;

    return (
      <Card className="border border-border/60 rounded-xl p-4 md:p-5 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground font-bold">{title}</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
            <div className={`flex items-center gap-1 text-xs ${isPositive ? "text-success" : "text-destructive"}`}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>
                {isPositive ? "Naik" : "Turun"} {Math.abs(trendNumber)}% dibanding minggu lalu
              </span>
            </div>
          </div>
        </div>
        {/* Mini chart positioned at bottom right */}
        <div className="absolute bottom-0 right-0 w-28 h-16 opacity-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"} 
                fill={isPositive ? "hsl(var(--success) / 0.3)" : "hsl(var(--destructive) / 0.3)"} 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  };

  // Insight Box Component
  const InsightBox = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-4 p-4 bg-muted/50 border border-muted-foreground/20 rounded-lg">
      <div className="flex items-start gap-2">
        <Lightbulb className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );

  // Custom Tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">Skor {label}</p>
          <p className="text-sm text-muted-foreground">{payload[0].value} respon</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Visualisasi Data Umpan Balik
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Ringkasan visual untuk memahami tren kemudahan, relevansi rekomendasi, kepuasan, dan kendala penggunaan.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewCard
          icon={MessageSquareText}
          title="Total Feedback"
          value={stats.total}
          trend={stats.totalTrend}
          trendData={miniTrendData}
        />
        <OverviewCard
          icon={ThumbsUp}
          title="Rata-rata Kemudahan Tes"
          value={`${stats.avgKemudahan}/7`}
          trend={stats.kemudahanTrend}
          trendData={miniTrendData}
        />
        <OverviewCard
          icon={Target}
          title="Rata-rata Relevansi Rekomendasi"
          value={`${stats.avgRelevansi}/7`}
          trend={stats.relevansiTrend}
          trendData={miniTrendData}
        />
        <OverviewCard
          icon={Smile}
          title="Rata-rata Kepuasan Keseluruhan"
          value={`${stats.avgKepuasan}/7`}
          trend={stats.kepuasanTrend}
          trendData={miniTrendData}
        />
      </div>

      {/* Control Section */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Kontrol Visualisasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Pilih Kategori Tes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tes-profil-karier">Tes Profil Karier</SelectItem>
                <SelectItem value="tes-riasec">Tes RIASEC</SelectItem>
                <SelectItem value="tes-kepribadian">Tes Kepribadian</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Rentang Waktu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">Sepanjang waktu</SelectItem>
                <SelectItem value="weekly">Mingguan</SelectItem>
                <SelectItem value="monthly">Bulanan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Tingkat Kemudahan */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Tingkat Kemudahan Menyelesaikan Tes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareDistributionData("kemudahanTes")} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="score" 
                    tick={{ fontSize: 11 }} 
                    className="text-muted-foreground"
                    label={{ value: "Skala Likert (1-7)", position: "bottom", offset: 0, fontSize: 11 }}
                  />
                  <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <InsightBox>
              <strong>Wawasan:</strong> Sebanyak <strong>{calculatePositivePercentage("kemudahanTes")}%</strong> mahasiswa menilai tes mudah diselesaikan (skor 6-7).
            </InsightBox>
          </CardContent>
        </Card>

        {/* Chart 2: Tingkat Relevansi */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Tingkat Relevansi Rekomendasi Profesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareDistributionData("relevansiRekomendasi")} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="score" 
                    tick={{ fontSize: 11 }} 
                    className="text-muted-foreground"
                    label={{ value: "Skala Likert (1-7)", position: "bottom", offset: 0, fontSize: 11 }}
                  />
                  <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <InsightBox>
              <strong>Wawasan:</strong> <strong>{calculatePositivePercentage("relevansiRekomendasi")}%</strong> mahasiswa merasa rekomendasi profesi sesuai dengan profil mereka.
            </InsightBox>
          </CardContent>
        </Card>

        {/* Chart 3: Tingkat Kepuasan */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Tingkat Kepuasan Keseluruhan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareDistributionData("kepuasanFitur")} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="score" 
                    tick={{ fontSize: 11 }} 
                    className="text-muted-foreground"
                    label={{ value: "Skala Likert (1-7)", position: "bottom", offset: 0, fontSize: 11 }}
                  />
                  <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill={CHART_COLORS.warning} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <InsightBox>
              <strong>Wawasan:</strong> <strong>{calculatePositivePercentage("kepuasanFitur")}%</strong> mahasiswa puas dengan Tes Profil Karier.
            </InsightBox>
          </CardContent>
        </Card>

        {/* Chart 4: Tingkat Kendala (Donut) */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Tingkat Kendala Penggunaan Fitur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {donutData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <InsightBox>
              <strong>Wawasan:</strong> <strong>{kendalaAnalysis.hasKendalaPercentage}%</strong> respon melaporkan setidaknya satu kendala dalam penggunaan.
            </InsightBox>
          </CardContent>
        </Card>
      </div>

      {/* Chart 5: Ragam Kendala (Full Width) */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Ragam Kendala Penggunaan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={kendalaAnalysis.kendalaData} 
                layout="vertical" 
                margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 10 }}
                  className="text-muted-foreground"
                  width={220}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value} respon`, "Jumlah"]}
                />
                <Bar dataKey="count" fill={CHART_COLORS.destructive} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <InsightBox>
            <strong>Wawasan:</strong> Kendala terbanyak adalah "{kendalaAnalysis.kendalaData[0]?.name}" dengan {kendalaAnalysis.kendalaData[0]?.count} laporan.
          </InsightBox>
        </CardContent>
      </Card>

      {/* Bonus: Stacked Bar Chart for Quick Comparison */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Perbandingan Komposisi Respon (Negatif – Netral – Positif)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: "Kemudahan",
                    negatif: mahasiswaFeedbackData.filter((d) => d.kemudahanTes <= 3).length,
                    netral: mahasiswaFeedbackData.filter((d) => d.kemudahanTes >= 4 && d.kemudahanTes <= 5).length,
                    positif: mahasiswaFeedbackData.filter((d) => d.kemudahanTes >= 6).length,
                  },
                  {
                    name: "Relevansi",
                    negatif: mahasiswaFeedbackData.filter((d) => d.relevansiRekomendasi <= 3).length,
                    netral: mahasiswaFeedbackData.filter((d) => d.relevansiRekomendasi >= 4 && d.relevansiRekomendasi <= 5).length,
                    positif: mahasiswaFeedbackData.filter((d) => d.relevansiRekomendasi >= 6).length,
                  },
                  {
                    name: "Kepuasan",
                    negatif: mahasiswaFeedbackData.filter((d) => d.kepuasanFitur <= 3).length,
                    netral: mahasiswaFeedbackData.filter((d) => d.kepuasanFitur >= 4 && d.kepuasanFitur <= 5).length,
                    positif: mahasiswaFeedbackData.filter((d) => d.kepuasanFitur >= 6).length,
                  },
                ]}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} className="text-muted-foreground" width={70} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-foreground capitalize">{value} (skor {value === "negatif" ? "1-3" : value === "netral" ? "4-5" : "6-7"})</span>}
                />
                <Bar dataKey="negatif" stackId="a" fill={CHART_COLORS.destructive} name="Negatif" />
                <Bar dataKey="netral" stackId="a" fill={CHART_COLORS.warning} name="Netral" />
                <Bar dataKey="positif" stackId="a" fill={CHART_COLORS.success} name="Positif" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <InsightBox>
            <strong>Wawasan:</strong> Secara keseluruhan, respon positif mendominasi di ketiga metrik dengan proporsi tertinggi pada aspek Kemudahan Tes.
          </InsightBox>
        </CardContent>
      </Card>
    </div>
  );
}
