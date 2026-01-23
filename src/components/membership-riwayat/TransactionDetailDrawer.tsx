import { Transaction } from "./types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Copy, CheckCircle2, Clock, XCircle, AlertCircle, Ban,
  FileText, Receipt, ExternalLink, Coins, Gift, 
  CreditCard, Wallet, Building2
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface TransactionDetailDrawerProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

export function TransactionDetailDrawer({ transaction, open, onClose }: TransactionDetailDrawerProps) {
  if (!transaction) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard");
  };

  const formatCurrency = (value: number) => {
    const prefix = value < 0 ? "-" : "";
    return `${prefix}Rp ${Math.abs(value).toLocaleString("id-ID")}`;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: Record<string, { icon: React.ReactNode; className: string }> = {
      "Berhasil": { icon: <CheckCircle2 className="h-3.5 w-3.5" />, className: "bg-emerald-100 text-emerald-700" },
      "Menunggu": { icon: <Clock className="h-3.5 w-3.5" />, className: "bg-amber-100 text-amber-700" },
      "Gagal": { icon: <XCircle className="h-3.5 w-3.5" />, className: "bg-red-100 text-red-700" },
      "Dibatalkan": { icon: <Ban className="h-3.5 w-3.5" />, className: "bg-slate-200 text-slate-700" },
      "Expired": { icon: <AlertCircle className="h-3.5 w-3.5" />, className: "bg-slate-100 text-slate-500" },
      "Refund": { icon: null, className: "bg-violet-100 text-violet-700" },
    };
    const config = statusConfig[status] || { icon: null, className: "bg-slate-100 text-slate-600" };
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.className}`}>
        {config.icon}
        <span>{status}</span>
      </div>
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    if (method.includes("E-Wallet") || method.includes("QRIS")) return <Wallet className="h-5 w-5" />;
    if (method.includes("Bank") || method.includes("Virtual Account")) return <Building2 className="h-5 w-5" />;
    if (method.includes("Credit")) return <CreditCard className="h-5 w-5" />;
    return <CreditCard className="h-5 w-5" />;
  };

  const getTimelineStatusStyle = (status: string, isLast: boolean) => {
    if (status.includes("gagal") || status.includes("Gagal")) {
      return { dot: "bg-red-500", text: "text-red-600 font-medium" };
    }
    if (status.includes("kadaluarsa") || status.includes("Expired")) {
      return { dot: "bg-slate-400", text: "text-slate-500" };
    }
    if (status.includes("dibatalkan") || status.includes("Dibatalkan")) {
      return { dot: "bg-slate-400", text: "text-slate-500" };
    }
    if (status.includes("berhasil") || status.includes("diaktifkan") || status.includes("diberikan") || status.includes("diperbarui") || status.includes("diperpanjang")) {
      return { dot: "bg-emerald-500", text: "text-emerald-600 font-medium" };
    }
    if (isLast) {
      return { dot: "bg-primary", text: "text-foreground font-medium" };
    }
    return { dot: "bg-slate-300", text: "text-muted-foreground" };
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        {/* Sticky Header */}
        <SheetHeader className="p-4 md:p-6 border-b border-border bg-card">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <SheetTitle className="text-left text-lg">Detail Transaksi</SheetTitle>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {transaction.referenceId}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCopy(transaction.referenceId)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {getPaymentStatusBadge(transaction.paymentStatus)}
          </div>
          <p className="text-xs text-muted-foreground text-left">
            {format(transaction.date, "EEEE, dd MMMM yyyy • HH:mm:ss", { locale: id })} WIB
          </p>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6 space-y-5">
            {/* Ringkasan Transaksi */}
            <section className="bg-muted/30 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Ringkasan Transaksi
              </h3>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">User</p>
                  <p className="font-medium">{transaction.user.name}</p>
                  <p className="text-xs text-muted-foreground">{transaction.user.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">User ID</p>
                  <p className="font-mono text-xs">{transaction.user.userId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Jenis Transaksi</p>
                  <p className="font-medium">{transaction.eventType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Kategori</p>
                  <p className="font-medium">{transaction.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status Perubahan</p>
                  <p className="font-medium">{transaction.statusBefore} → {transaction.statusAfter}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Durasi</p>
                  <p className="font-medium">{transaction.duration}</p>
                </div>
              </div>
            </section>

            {/* Breakdown Harga */}
            <section className="bg-muted/30 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Breakdown Harga
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Harga Dasar</span>
                  <span>{formatCurrency(transaction.basePrice)}</span>
                </div>
                
                {transaction.durationDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Diskon Durasi</span>
                    <span>-{formatCurrency(transaction.durationDiscount)}</span>
                  </div>
                )}
                
                {transaction.promoCode && transaction.promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Promo ({transaction.promoCode})</span>
                    <span>-{formatCurrency(transaction.promoDiscount)}</span>
                  </div>
                )}

                {transaction.adminFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biaya Admin</span>
                    <span>+{formatCurrency(transaction.adminFee)}</span>
                  </div>
                )}

                <Separator className="my-2" />

                <div className="flex justify-between font-bold text-base">
                  <span>Total Bayar</span>
                  <span className={transaction.totalPaid < 0 ? "text-violet-600" : ""}>
                    {formatCurrency(transaction.totalPaid)}
                  </span>
                </div>
              </div>
            </section>

            {/* Pembayaran - Modern Card */}
            <section className="rounded-xl border border-border overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Pembayaran
                </h3>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Payment Method Card */}
                <div className="flex items-center gap-4 p-3 bg-muted/40 rounded-lg">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {getPaymentMethodIcon(transaction.paymentMethod)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{transaction.paymentMethod}</p>
                    {transaction.paymentGatewayRef && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <code className="text-[11px] font-mono text-muted-foreground">
                          {transaction.paymentGatewayRef}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => handleCopy(transaction.paymentGatewayRef!)}
                        >
                          <Copy className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Timeline - Modern */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Status Timeline
                  </p>
                  <div className="relative pl-4">
                    {/* Vertical line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-muted via-muted to-transparent" />
                    
                    <div className="space-y-3">
                      {transaction.paymentTimeline.map((item, index) => {
                        const isLast = index === transaction.paymentTimeline.length - 1;
                        const style = getTimelineStatusStyle(item.status, isLast);
                        return (
                          <div key={index} className="relative flex items-start gap-3">
                            {/* Dot */}
                            <div className={`absolute -left-4 top-1.5 h-3 w-3 rounded-full ${style.dot} ring-2 ring-background`} />
                            
                            {/* Content */}
                            <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                              <p className={`text-sm ${style.text}`}>{item.status}</p>
                              <span className="text-xs text-muted-foreground font-mono shrink-0">
                                {item.time}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefit Diberikan */}
            {(transaction.tokenGiven !== 0 || transaction.pointsGiven !== 0) && (
              <section className="bg-muted/30 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Benefit Diberikan
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {/* Token */}
                  <div className="bg-card rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Coins className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-xs text-muted-foreground">Token</span>
                    </div>
                    <p className={`text-lg font-bold ${transaction.tokenGiven < 0 ? 'text-red-600' : transaction.tokenGiven > 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                      {transaction.tokenGiven > 0 ? '+' : ''}{transaction.tokenGiven}
                    </p>
                  </div>

                  {/* Poin */}
                  <div className="bg-card rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Gift className="h-4 w-4 text-violet-600" />
                      </div>
                      <span className="text-xs text-muted-foreground">Poin</span>
                    </div>
                    <p className={`text-lg font-bold ${transaction.pointsGiven < 0 ? 'text-red-600' : transaction.pointsGiven > 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                      {transaction.pointsGiven > 0 ? '+' : ''}{transaction.pointsGiven.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Dokumen */}
            <section className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Dokumen
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="justify-start h-auto py-3">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  <div className="text-left">
                    <p className="text-xs font-medium">Invoice</p>
                    <p className="text-[10px] text-muted-foreground">Download PDF</p>
                  </div>
                </Button>
                <Button variant="outline" size="sm" className="justify-start h-auto py-3">
                  <Receipt className="h-4 w-4 mr-2 text-primary" />
                  <div className="text-left">
                    <p className="text-xs font-medium">Receipt</p>
                    <p className="text-[10px] text-muted-foreground">Download PDF</p>
                  </div>
                </Button>
              </div>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}