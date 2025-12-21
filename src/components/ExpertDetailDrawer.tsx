import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User, Briefcase, Calendar, Hash, Award, MessageSquare, AlertTriangle, Star } from "lucide-react";

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg font-semibold">Detail Feedback Expert</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] pr-4">
          <div className="space-y-6">
            {/* Identity Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Identitas Respons
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">ID Feedback</p>
                  <p className="font-mono text-foreground">{feedback.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Tanggal</p>
                  <p className="text-foreground">{feedback.tanggal}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Nama Expert</p>
                  <p className="font-medium text-foreground">{feedback.nama}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Profesi</p>
                  <p className="text-foreground">{feedback.profesi}</p>
                </div>
                {feedback.gelar && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Gelar</p>
                    <p className="text-foreground">{feedback.gelar}</p>
                  </div>
                )}
                {feedback.pengalamanTahun && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Pengalaman</p>
                    <p className="text-foreground">{feedback.pengalamanTahun} tahun</p>
                  </div>
                )}
                {feedback.pendidikanTerakhir && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Pendidikan Terakhir</p>
                    <p className="text-foreground">{feedback.pendidikanTerakhir}</p>
                  </div>
                )}
                {feedback.perguruanTinggi && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Perguruan Tinggi</p>
                    <p className="text-foreground">{feedback.perguruanTinggi}</p>
                  </div>
                )}
                {feedback.programStudi && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-muted-foreground text-xs">Program Studi</p>
                    <p className="text-foreground">{feedback.programStudi}</p>
                  </div>
                )}
                <div className="space-y-1 col-span-2">
                  <p className="text-muted-foreground text-xs">Kategori Tes</p>
                  <Badge variant="outline">{feedback.kategoriTes}</Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Top 5 Recommendations */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                5 Rekomendasi Profesi Teratas
              </h3>
              <div className="space-y-2">
                {feedback.top5Recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground">{rec}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-muted-foreground">Status Top 5:</span>
                <Badge className={getTopNColor(feedback.topNStatus)}>
                  {feedback.topNStatus}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Likert Scores */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                Penilaian Likert (1-7)
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Akurasi Profil</p>
                  <Badge className={`${getScoreColor(feedback.akurasi)} text-base`}>
                    {feedback.akurasi}/7
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Logika Penjelasan</p>
                  <Badge className={`${getScoreColor(feedback.logika)} text-base`}>
                    {feedback.logika}/7
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Potensi Manfaat</p>
                  <Badge className={`${getScoreColor(feedback.manfaat)} text-base`}>
                    {feedback.manfaat}/7
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Kendala */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Kendala yang Dilaporkan
              </h3>
              {feedback.kendala.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {feedback.kendala.map((k, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {k}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Tidak ada kendala dilaporkan</p>
              )}
            </div>

            <Separator />

            {/* Masukan */}
            <div className="space-y-3">
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
                <p className="text-sm text-muted-foreground italic">Tidak ada masukan</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
