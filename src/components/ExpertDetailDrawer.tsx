import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User, Award, MessageSquare, AlertTriangle, Star, Target, Brain, TrendingUp } from "lucide-react";

interface ExpertFeedback {
  id: string;
  nama: string;
  profesi: string;
  gelar?: string;
  pengalamanTahun?: number;
  pendidikanTerakhir?: string;
  perguruanTinggi?: string;
  programStudi?: string;
  kategoriTes: string;
  top5Recommendations: string[];
  topNStatus: "P1" | "P2" | "P3-5" | "Tidak muncul";
  akurasi: number;
  logika: number;
  manfaat: number;
  kendala: string[];
  masukan: string;
  tanggal: string;
}

interface ExpertDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: ExpertFeedback | null;
}

export function ExpertDetailDrawer({ open, onOpenChange, feedback }: ExpertDetailDrawerProps) {
  if (!feedback) return null;

  const getScoreColor = (score: number) => {
    if (score >= 6) return "bg-success/10 text-success border-success/20";
    if (score >= 4) return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  const getTopNColor = (status: string) => {
    switch (status) {
      case "P1":
        return "bg-success/10 text-success border-success/20";
      case "P2":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "P3-5":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatPendidikan = (pendidikan?: string) => {
    switch (pendidikan) {
      case "S1":
        return "Sarjana (S1)";
      case "S2":
        return "Magister (S2)";
      case "S3":
        return "Doktor (S3)";
      case "D3":
        return "Diploma III (D3)";
      case "D4":
        return "Diploma IV (D4)";
      default:
        return pendidikan || "-";
    }
  };

  const formatPengalaman = (tahun?: number) => {
    if (!tahun) return "-";
    if (tahun < 3) return `${tahun} tahun (< 3 tahun)`;
    if (tahun <= 5) return `${tahun} tahun (3–5 tahun)`;
    if (tahun <= 10) return `${tahun} tahun (6–10 tahun)`;
    return `${tahun} tahun (> 10 tahun)`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col h-full">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="text-lg font-semibold text-foreground">
              Detail Feedback Expert
            </SheetTitle>
          </SheetHeader>
          <Separator />
        </div>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6 pb-6">
            {/* Section 1: Identitas Responden */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Identitas Responden
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {/* ID Feedback */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">ID Feedback</p>
                  <p className="font-mono font-medium text-foreground">{feedback.id}</p>
                </div>
                
                {/* Tanggal */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tanggal</p>
                  <p className="text-foreground">{feedback.tanggal}</p>
                </div>
                
                {/* Nama Expert */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Nama Expert</p>
                  <p className="font-medium text-foreground">{feedback.nama}</p>
                </div>
                
                {/* Profesi */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Profesi</p>
                  <p className="text-foreground">{feedback.profesi}</p>
                </div>
                
                {/* Gelar */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Gelar</p>
                  <p className="text-foreground">{feedback.gelar || "-"}</p>
                </div>
                
                {/* Pengalaman */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Pengalaman</p>
                  <Badge variant="secondary" className="font-normal">
                    {formatPengalaman(feedback.pengalamanTahun)}
                  </Badge>
                </div>
                
                {/* Pendidikan Terakhir */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Pendidikan Terakhir</p>
                  <Badge variant="secondary" className="font-normal">
                    {formatPendidikan(feedback.pendidikanTerakhir)}
                  </Badge>
                </div>
                
                {/* Perguruan Tinggi */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Perguruan Tinggi</p>
                  <p className="text-foreground">{feedback.perguruanTinggi || "-"}</p>
                </div>
                
                {/* Program Studi - Full Width */}
                <div className="space-y-1 col-span-2">
                  <p className="text-xs text-muted-foreground">Program Studi</p>
                  <p className="text-foreground">{feedback.programStudi || "-"}</p>
                </div>
                
                {/* Kategori Tes - Full Width with Badge */}
                <div className="space-y-1 col-span-2">
                  <p className="text-xs text-muted-foreground">Kategori Tes</p>
                  <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                    {feedback.kategoriTes}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Section 2: 5 Rekomendasi Profesi Teratas */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  5 Rekomendasi Profesi Teratas
                </h3>
                <Badge className={`${getTopNColor(feedback.topNStatus)} font-medium`}>
                  {feedback.topNStatus}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {feedback.top5Recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Penilaian Likert (1-7) */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                Penilaian Likert (1–7)
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Akurasi Profil */}
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <Target className="h-3.5 w-3.5" />
                    <p className="text-xs">Akurasi Profil</p>
                  </div>
                  <Badge className={`${getScoreColor(feedback.akurasi)} text-sm font-semibold px-3 py-1`}>
                    {feedback.akurasi}/7
                  </Badge>
                </div>
                
                {/* Logika Penjelasan */}
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <Brain className="h-3.5 w-3.5" />
                    <p className="text-xs">Logika Penjelasan</p>
                  </div>
                  <Badge className={`${getScoreColor(feedback.logika)} text-sm font-semibold px-3 py-1`}>
                    {feedback.logika}/7
                  </Badge>
                </div>
                
                {/* Potensi Manfaat */}
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <p className="text-xs">Potensi Manfaat</p>
                  </div>
                  <Badge className={`${getScoreColor(feedback.manfaat)} text-sm font-semibold px-3 py-1`}>
                    {feedback.manfaat}/7
                  </Badge>
                </div>
              </div>
            </div>

            {/* Section 4: Kendala yang Dilaporkan */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Kendala yang Dilaporkan
              </h3>
              
              {feedback.kendala.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {feedback.kendala.map((k, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary" 
                      className="text-xs bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15"
                    >
                      {k}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Tidak ada kendala dilaporkan
                </p>
              )}
            </div>

            {/* Section 5: Masukan / Saran Perbaikan */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Masukan / Saran Perbaikan
              </h3>
              
              {feedback.masukan ? (
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {feedback.masukan}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Tidak ada masukan tertulis.
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
