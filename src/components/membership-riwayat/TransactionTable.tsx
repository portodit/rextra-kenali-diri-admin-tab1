import { Transaction } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Copy, CheckCircle2, Clock, XCircle, AlertCircle, Ban, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface TransactionTableProps {
  transactions: Transaction[];
  onViewDetail: (transaction: Transaction) => void;
}

// Map event types to Indonesian transaction types
const getTransactionType = (eventType: string): string => {
  const typeMap: Record<string, string> = {
    "Purchase": "First Purchase Club",
    "Renewal": "Renewal Club",
    "Upgrade": "Upgrade Club",
    "Downgrade": "Downgrade Club",
    "Trial Start": "Trial Club",
    "Trial End": "Trial End",
    "Expired": "Expired",
    "Refund": "Refund",
  };
  return typeMap[eventType] || eventType;
};

export function TransactionTable({ transactions, onViewDetail }: TransactionTableProps) {
  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard");
  };

  // Payment status with modern styling
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Berhasil":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Berhasil</span>
          </div>
        );
      case "Menunggu":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
            <Clock className="h-3.5 w-3.5" />
            <span>Menunggu</span>
          </div>
        );
      case "Gagal":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 text-xs font-medium">
            <XCircle className="h-3.5 w-3.5" />
            <span>Gagal</span>
          </div>
        );
      case "Dibatalkan":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-600 text-xs font-medium">
            <Ban className="h-3.5 w-3.5" />
            <span>Dibatalkan</span>
          </div>
        );
      case "Expired":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-400/10 text-slate-500 text-xs font-medium">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Expired</span>
          </div>
        );
      case "Refund":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-600 text-xs font-medium">
            <span>Refund</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
            <span>{status}</span>
          </div>
        );
    }
  };

  // Transaction type badge with modern gradient style
  const getTransactionTypeBadge = (eventType: string) => {
    const type = getTransactionType(eventType);
    const styles: Record<string, string> = {
      "First Purchase Club": "bg-gradient-to-r from-sky-500 to-blue-600 text-white",
      "Renewal Club": "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
      "Upgrade Club": "bg-gradient-to-r from-violet-500 to-purple-600 text-white",
      "Downgrade Club": "bg-gradient-to-r from-amber-500 to-orange-600 text-white",
      "Trial Club": "bg-gradient-to-r from-indigo-500 to-blue-600 text-white",
      "Trial End": "bg-slate-200 text-slate-700",
      "Expired": "bg-red-100 text-red-700",
      "Refund": "bg-orange-100 text-orange-700",
    };
    return (
      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm ${styles[type] || "bg-slate-100 text-slate-600"}`}>
        {type}
      </span>
    );
  };

  // Tier badge with modern pill style
  const getTierBadge = (tier: string) => {
    const styles: Record<string, string> = {
      "Max": "bg-amber-100 text-amber-700 ring-1 ring-amber-300",
      "Pro": "bg-violet-100 text-violet-700 ring-1 ring-violet-300",
      "Basic": "bg-sky-100 text-sky-700 ring-1 ring-sky-300",
      "Starter": "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300",
      "Standard": "bg-slate-100 text-slate-600 ring-1 ring-slate-300",
    };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${styles[tier] || "bg-slate-100 text-slate-600"}`}>
        {tier}
      </span>
    );
  };

  const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="min-w-[130px] font-semibold text-foreground">Transaksi ID</TableHead>
              <TableHead className="min-w-[100px] font-semibold text-foreground">Waktu</TableHead>
              <TableHead className="min-w-[120px] font-semibold text-foreground">Pengguna</TableHead>
              <TableHead className="min-w-[140px] font-semibold text-foreground">Jenis Transaksi</TableHead>
              <TableHead className="min-w-[140px] font-semibold text-foreground">Detail Status</TableHead>
              <TableHead className="min-w-[70px] font-semibold text-foreground">Durasi</TableHead>
              <TableHead className="min-w-[110px] text-right font-semibold text-foreground">Total Bayar</TableHead>
              <TableHead className="min-w-[110px] font-semibold text-foreground">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((trx) => (
              <TableRow 
                key={trx.id} 
                className="cursor-pointer hover:bg-sky-50/50 transition-colors"
                onClick={() => onViewDetail(trx)}
              >
                {/* Transaksi ID */}
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <code className="text-xs font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                      {trx.referenceId}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      onClick={(e) => handleCopy(trx.referenceId, e)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>

                {/* Waktu */}
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {format(trx.date, "dd MMM yy", { locale: id })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(trx.date, "HH:mm", { locale: id })}
                    </p>
                  </div>
                </TableCell>

                {/* Pengguna - just name */}
                <TableCell>
                  <p className="font-medium text-sm">{trx.user.name}</p>
                </TableCell>

                {/* Jenis Transaksi */}
                <TableCell>
                  {getTransactionTypeBadge(trx.eventType)}
                </TableCell>

                {/* Detail Status - tier change */}
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {getTierBadge(trx.statusBefore)}
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    {getTierBadge(trx.statusAfter)}
                  </div>
                </TableCell>

                {/* Durasi */}
                <TableCell>
                  <span className="text-sm">{trx.duration}</span>
                </TableCell>

                {/* Total Bayar */}
                <TableCell className="text-right">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm">{formatCurrency(trx.totalPaid)}</p>
                    {trx.promoCode && (
                      <p className="text-[10px] text-emerald-600 font-medium">{trx.promoCode}</p>
                    )}
                  </div>
                </TableCell>

                {/* Status Pembayaran */}
                <TableCell>
                  {getPaymentStatusBadge(trx.paymentStatus)}
                </TableCell>

                {/* Aksi */}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(trx);
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
  );
}