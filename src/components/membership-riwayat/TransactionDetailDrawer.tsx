import { Transaction } from "./types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Copy, CheckCircle2, Clock, XCircle, AlertCircle,
  FileText, Receipt, ExternalLink, Circle, Coins, Gift
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

  const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Berhasil":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Berhasil
          </Badge>
        );
      case "Menunggu":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
            <Clock className="h-3 w-3 mr-1" />
            Menunggu
          </Badge>
        );
      case "Gagal":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
            <XCircle className="h-3 w-3 mr-1" />
            Gagal
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-4 md:p-6 border-b border-border">
          <SheetTitle className="text-left">Detail Transaksi</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6 space-y-6">
            {/* Ringkasan Transaksi */}
            <section className="border border-border/60 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Ringkasan Transaksi
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground">Reference ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">{transaction.referenceId}</span>
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

                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground">Waktu</span>
                  <span className="font-medium">
                    {format(transaction.date, "dd/MM/yyyy HH:mm:ss", { locale: id })} WIB
                  </span>
                </div>

                <Separator />

                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground">User</span>
                  <div className="text-right">
                    <p className="font-medium">{transaction.user.name}</p>
                    <p className="text-xs text-muted-foreground">{transaction.user.email}</p>
                    <p className="text-xs font-mono text-muted-foreground">{transaction.user.userId}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground">Event Type</span>
                  <Badge variant="secondary">{transaction.eventType}</Badge>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground">Status Perubahan</span>
                  <span className="font-medium">{transaction.statusBefore} → {transaction.statusAfter}</span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground">Kategori</span>
                  <span className="font-medium">{transaction.category}</span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground">Durasi</span>
                  <span className="font-medium">{transaction.duration}</span>
                </div>
              </div>
            </section>

            {/* Breakdown Harga */}
            <section className="border border-border/60 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Breakdown Harga
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Harga Dasar ({transaction.statusAfter}/{transaction.duration})</span>
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
                    <span>Promo Code ({transaction.promoCode})</span>
                    <span>-{formatCurrency(transaction.promoDiscount)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(transaction.basePrice - transaction.durationDiscount - transaction.promoDiscount)}</span>
                </div>

                {transaction.adminFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biaya Admin</span>
                    <span>+{formatCurrency(transaction.adminFee)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-base">
                  <span>Total Bayar</span>
                  <span>{formatCurrency(transaction.totalPaid)}</span>
                </div>
              </div>
            </section>

            {/* Detail Promo Code */}
            {transaction.promoCode && (
              <section className="border border-border/60 rounded-lg p-4 space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Detail Promo Code
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kode</span>
                    <span className="font-mono font-medium">{transaction.promoCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jenis</span>
                    <span>Diskon flat</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nominal</span>
                    <span className="text-emerald-600">-{formatCurrency(transaction.promoDiscount)}</span>
                  </div>
                </div>

                <Button variant="link" size="sm" className="p-0 h-auto text-xs text-muted-foreground">
                  → Lihat Detail Promo (Coming Soon)
                </Button>
              </section>
            )}

            {/* Pembayaran */}
            <section className="border border-border/60 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Pembayaran
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Metode</span>
                  <span className="font-medium">{transaction.paymentMethod}</span>
                </div>

                {transaction.paymentGatewayRef && (
                  <div className="flex items-start justify-between">
                    <span className="text-muted-foreground">Gateway Ref</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{transaction.paymentGatewayRef}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(transaction.paymentGatewayRef!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <Separator />

                <div>
                  <p className="text-muted-foreground mb-2">Status Timeline:</p>
                  <div className="space-y-2">
                    {transaction.paymentTimeline.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <Circle className={`h-2 w-2 ${
                          index === transaction.paymentTimeline.length - 1 
                            ? 'fill-primary text-primary' 
                            : 'fill-muted-foreground text-muted-foreground'
                        }`} />
                        <span className="text-muted-foreground">{item.time}</span>
                        <span>-</span>
                        <span>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Benefit Diberikan */}
            <section className="border border-border/60 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Benefit Diberikan
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Token</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-emerald-600">
                      {transaction.tokenGiven > 0 ? `+${transaction.tokenGiven} token` : "-"}
                    </span>
                    {transaction.tokenGiven > 0 && (
                      <Button variant="link" size="sm" className="h-auto p-0 ml-2 text-xs">
                        Lihat di Ledger <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-violet-500" />
                    <span className="text-sm">Poin Reward</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-emerald-600">
                      {transaction.pointsGiven > 0 ? `+${transaction.pointsGiven.toLocaleString("id-ID")} poin` : "-"}
                    </span>
                    {transaction.pointsGiven > 0 && (
                      <Button variant="link" size="sm" className="h-auto p-0 ml-2 text-xs">
                        Lihat Riwayat <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Dokumen */}
            <section className="border border-border/60 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Dokumen
              </h3>

              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Invoice
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Receipt className="h-4 w-4 mr-2" />
                  Receipt
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
              </div>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
