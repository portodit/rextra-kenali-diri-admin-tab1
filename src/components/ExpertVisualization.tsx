import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { TrendingUp, TrendingDown, Users, Target, Brain, Award, ChevronDown, Lightbulb, AlertTriangle } from "lucide-react";

interface ExpertVisualizationProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

// Mock data for expert feedback
const expertFeedbackData = [
  { akurasi: 6, logika: 7, manfaat: 6, topNStatus: "P1", kendala: [] },
  { akurasi: 5, logika: 5, manfaat: 6, topNStatus: "P3-5", kendala: ["Penjelasan hasil tes terlalu panjang"] },
  { akurasi: 6, logika: 6, manfaat: 7, topNStatus: "P3-5", kendala: [] },
  { akurasi: 7, logika: 7, manfaat: 7, topNStatus: "P1", kendala: [] },
  { akurasi: 3, logika: 4, manfaat: 4, topNStatus: "Tidak muncul", kendala: ["Ada pertanyaan yang membingungkan", "Penjelasan hasil tes sulit dipahami"] },
  { akurasi: 6, logika: 6, manfaat: 6, topNStatus: "P2", kendala: ["Durasi tes terasa terlalu lama"] },
  { akurasi: 7, logika: 6, manfaat: 7, topNStatus: "P1", kendala: [] },
  { akurasi: 7, logika: 7, manfaat: 6, topNStatus: "P1", kendala: [] },
  { akurasi: 5, logika: 5, manfaat: 5, topNStatus: "P2", kendala: [] },
  { akurasi: 4, logika: 4, manfaat: 5, topNStatus: "P3-5", kendala: ["Tampilan atau navigasi membingungkan"] },
];

// Mock participant data
const participantData = {
  weekly: [
    { name: "Sen", experts: 3, feedback: 2 },
    { name: "Sel", experts: 5, feedback: 4 },
    { name: "Rab", experts: 4, feedback: 3 },
    { name: "Kam", experts: 6, feedback: 5 },
    { name: "Jum", experts: 8, feedback: 7 },
    { name: "Sab", experts: 2, feedback: 2 },
    { name: "Min", experts: 1, feedback: 1 },
  ],
  monthly: [
    { name: "Week 1", experts: 15, feedback: 12 },
    { name: "Week 2", experts: 22, feedback: 18 },
    { name: "Week 3", experts: 28, feedback: 24 },
    { name: "Week 4", experts: 20, feedback: 16 },
  ],
  allTime: [
    { name: "Jan", experts: 45, feedback: 38 },
    { name: "Feb", experts: 52, feedback: 44 },
    { name: "Mar", experts: 68, feedback: 55 },
    { name: "Apr", experts: 75, feedback: 62 },
    { name: "Mei", experts: 82, feedback: 70 },
    { name: "Jun", experts: 90, feedback: 78 },
  ],
};

const COLORS = {
  primary: "#3B82F6",
  secondary: "#93C5FD",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
  pink: "#EC4899",
};

export function ExpertVisualization({ selectedCategory, onCategoryChange }: ExpertVisualizationProps) {
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "allTime">("monthly");

  // Calculate statistics
  const stats = useMemo(() => {
    const totalFeedback = expertFeedbackData.length;
    const avgAkurasi = expertFeedbackData.reduce((sum, d) => sum + d.akurasi, 0) / totalFeedback;
    const avgLogika = expertFeedbackData.reduce((sum, d) => sum + d.logika, 0) / totalFeedback;
    const avgManfaat = expertFeedbackData.reduce((sum, d) => sum + d.manfaat, 0) / totalFeedback;

    return {
      totalFeedback,
      avgAkurasi: avgAkurasi.toFixed(1),
      avgLogika: avgLogika.toFixed(1),
      avgManfaat: avgManfaat.toFixed(1),
    };
  }, []);

  // Distribution data for bar charts
  const prepareDistributionData = (field: "akurasi" | "logika" | "manfaat") => {
    const distribution = Array(7).fill(0);
    expertFeedbackData.forEach((item) => {
      distribution[item[field] - 1]++;
    });
    return distribution.map((count, index) => ({
      score: index + 1,
      count,
      percentage: ((count / expertFeedbackData.length) * 100).toFixed(1),
    }));
  };

  // Top N Status distribution
  const topNDistribution = useMemo(() => {
    const counts = { P1: 0, P2: 0, "P3-5": 0, "Tidak muncul": 0 };
    expertFeedbackData.forEach((item) => {
      counts[item.topNStatus as keyof typeof counts]++;
    });
    return [
      { name: "P1 (Peringkat 1)", value: counts.P1, color: COLORS.success },
      { name: "P2 (Peringkat 2)", value: counts.P2, color: COLORS.primary },
      { name: "P3-5 (Peringkat 3-5)", value: counts["P3-5"], color: COLORS.warning },
      { name: "Tidak Muncul", value: counts["Tidak muncul"], color: COLORS.danger },
    ];
  }, []);

  // Kendala distribution
  const kendalaDistribution = useMemo(() => {
    const kendalaCount: Record<string, number> = {};
    let noKendala = 0;
    expertFeedbackData.forEach((item) => {
      if (item.kendala.length === 0) {
        noKendala++;
      } else {
        item.kendala.forEach((k) => {
          kendalaCount[k] = (kendalaCount[k] || 0) + 1;
        });
      }
    });
    return {
      hasKendala: expertFeedbackData.length - noKendala,
      noKendala,
      details: Object.entries(kendalaCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    };
  }, []);

  const getPeriodLabel = () => {
    switch (timeRange) {
      case "weekly":
        return "Data untuk periode 16–22 Des 2025";
      case "monthly":
        return "Data untuk bulan Desember 2025";
      case "allTime":
        return "Ringkasan bulanan: Jan–Des 2025";
    }
  };

  const getParticipantData = () => {
    switch (timeRange) {
      case "weekly":
        return participantData.weekly;
      case "monthly":
        return participantData.monthly;
      case "allTime":
        return participantData.allTime;
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Structured Insight Component
  const StructuredInsight = ({ insight }: { insight: { ringkasan: string; detail: string; implikasi: string; aksi: string; catatan?: string } }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
        <div className="flex gap-2">
          <div className="flex-shrink-0">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
          </div>
          <div className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed flex-1">
            <p className="font-medium">{insight.ringkasan}</p>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mt-2 font-medium transition-colors"
            >
              <span>{isOpen ? "Sembunyikan detail" : "Lihat detail lengkap"}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2 pt-1">
                    <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
                      <strong>Detail:</strong> {insight.detail}
                    </motion.p>
                    <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                      <strong>Implikasi:</strong> {insight.implikasi}
                    </motion.p>
                    <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
                      <strong>Aksi Prioritas:</strong> {insight.aksi}
                    </motion.p>
                    {insight.catatan && (
                      <motion.p 
                        className="mt-2 text-amber-700 dark:text-amber-300 italic text-xs"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <strong>Catatan:</strong> {insight.catatan}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  // Insight Box Component (simple)
  const InsightBox = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
        <div className="flex gap-2">
          <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors"
            >
              <span>{isOpen ? "Sembunyikan wawasan" : "Lihat wawasan grafik"}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 pt-1">{children}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  // Rounded bar shape
  const RoundedBar = (props: any) => {
    const { x, y, width, height, fill } = props;
    const radius = Math.min(4, width / 2);
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill={fill} rx={radius} ry={radius} />
      </g>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Visualisasi Data Umpan Balik Expert</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Ringkasan visual untuk memahami tren akurasi, logika penjelasan, manfaat rekomendasi, dan validitas hasil asesmen dari perspektif expert.
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Kategori Tes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tes-profil-karier">Tes Profil Karier</SelectItem>
                <SelectItem value="tes-riasec">Tes RIASEC</SelectItem>
                <SelectItem value="tes-kepribadian">Tes Kepribadian</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Rentang Waktu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Mingguan</SelectItem>
                <SelectItem value="monthly">Bulanan</SelectItem>
                <SelectItem value="allTime">Sepanjang Waktu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Total Feedback</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.totalFeedback}</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> Naik 12% dibanding periode sebelumnya
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Rata-rata Akurasi</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.avgAkurasi}/7</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> Naik 5% dibanding periode sebelumnya
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Rata-rata Logika</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.avgLogika}/7</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> Naik 3% dibanding periode sebelumnya
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Rata-rata Manfaat</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.avgManfaat}/7</p>
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" /> Turun 2% dibanding periode sebelumnya
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart 1 & 2: Participant Trend & Top N Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart: Expert vs Feedback */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Tren Expert Tes vs Pengisi Feedback</CardTitle>
            <p className="text-sm text-muted-foreground">{getPeriodLabel()}</p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getParticipantData()}>
                  <defs>
                    <linearGradient id="expertAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expertFeedbackGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="experts" name="Expert Tes" stroke={COLORS.primary} fill="url(#expertAreaGradient)" strokeWidth={2} />
                  <Area type="monotone" dataKey="feedback" name="Pengisi Feedback" stroke={COLORS.success} fill="url(#expertFeedbackGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <InsightBox>
              Kenaikan jumlah expert yang melakukan validasi diikuti kenaikan pengisi feedback. Partisipasi feedback relatif sejalan dengan penggunaan tes.
            </InsightBox>
          </CardContent>
        </Card>

        {/* Pie Chart: Top N Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Distribusi Status Top 5</CardTitle>
            <p className="text-sm text-muted-foreground">{getPeriodLabel()}</p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topNDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {topNDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <InsightBox>
              Mayoritas profesi expert muncul di posisi P1 ({((topNDistribution[0].value / stats.totalFeedback) * 100).toFixed(0)}%), menunjukkan akurasi rekomendasi yang tinggi. 
              Expert yang profesinya tidak muncul di Top 5 perlu ditelusuri untuk meningkatkan kualitas pemetaan.
            </InsightBox>
          </CardContent>
        </Card>
      </div>

      {/* Chart 3, 4, 5: Score Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Akurasi Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Tingkat Akurasi Profil</CardTitle>
            <p className="text-sm text-muted-foreground">N = {stats.totalFeedback} respon</p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareDistributionData("akurasi")} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="score" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Jumlah" fill={COLORS.primary} shape={<RoundedBar />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <StructuredInsight
              insight={{
                ringkasan: "Mayoritas respon berada pada skor 6–7, menunjukkan akurasi profil dinilai baik oleh expert.",
                detail: "Skor tinggi terkonsentrasi dengan proporsi terbesar pada nilai 6 dan 7.",
                implikasi: "Pemetaan profil ke rekomendasi profesi sudah cukup akurat menurut validator.",
                aksi: "Pertahankan algoritma pemetaan, fokus pada kasus skor rendah untuk perbaikan.",
              }}
            />
          </CardContent>
        </Card>

        {/* Logika Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Tingkat Logika Penjelasan</CardTitle>
            <p className="text-sm text-muted-foreground">N = {stats.totalFeedback} respon</p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareDistributionData("logika")} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="score" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Jumlah" fill={COLORS.purple} shape={<RoundedBar />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <StructuredInsight
              insight={{
                ringkasan: "Penilaian logika penjelasan cenderung positif dengan skor rata-rata tinggi.",
                detail: "Sebaran skor terkonsentrasi pada nilai tinggi, menunjukkan penjelasan rekomendasi logis.",
                implikasi: "Expert menilai alasan dan penjelasan rekomendasi profesi sudah masuk akal.",
                aksi: "Tingkatkan kualitas penjelasan untuk kasus-kasus yang masih mendapat skor menengah.",
              }}
            />
          </CardContent>
        </Card>

        {/* Manfaat Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Tingkat Potensi Manfaat</CardTitle>
            <p className="text-sm text-muted-foreground">N = {stats.totalFeedback} respon</p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareDistributionData("manfaat")} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="score" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Jumlah" fill={COLORS.success} shape={<RoundedBar />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <StructuredInsight
              insight={{
                ringkasan: "Expert menilai rekomendasi berpotensi bermanfaat bagi mahasiswa.",
                detail: "Skor manfaat cenderung tinggi, menunjukkan expert percaya hasil tes dapat membantu mahasiswa.",
                implikasi: "Nilai manfaat yang tinggi mengindikasikan validitas dari perspektif praktisi profesional.",
                aksi: "Gunakan feedback expert untuk memperkuat narasi manfaat kepada mahasiswa.",
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Chart 6 & 7: Kendala */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kendala Pie Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Tingkat Kendala Expert</CardTitle>
            <p className="text-sm text-muted-foreground">{getPeriodLabel()}</p>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Tidak ada kendala", value: kendalaDistribution.noKendala, color: COLORS.primary },
                      { name: "Ada kendala", value: kendalaDistribution.hasKendala, color: COLORS.secondary },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill={COLORS.primary} />
                    <Cell fill={COLORS.secondary} />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <InsightBox>
              {kendalaDistribution.noKendala > kendalaDistribution.hasKendala
                ? "Sebagian besar expert tidak mengalami kendala. Pengalaman validasi relatif lancar."
                : "Proporsi expert yang mengalami kendala cukup signifikan. Perlu evaluasi proses validasi."}
            </InsightBox>
          </CardContent>
        </Card>

        {/* Kendala Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Ragam Kendala Expert</CardTitle>
            <p className="text-sm text-muted-foreground">{getPeriodLabel()}</p>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kendalaDistribution.details} layout="vertical" barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={180} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Jumlah" fill={COLORS.warning} shape={<RoundedBar />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <InsightBox>
              {kendalaDistribution.details.length > 0
                ? `Kendala paling dominan adalah "${kendalaDistribution.details[0]?.name}". Prioritaskan perbaikan pada area ini.`
                : "Tidak ada kendala yang dilaporkan oleh expert."}
            </InsightBox>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
