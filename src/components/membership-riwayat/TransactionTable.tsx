import { Transaction } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Copy, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface TransactionTableProps {
  transactions: Transaction[];
  onViewDetail: (transaction: Transaction) => void;
}

export function TransactionTable({ transactions, onViewDetail }: TransactionTableProps) {
  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard");
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Berhasil":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Berhasil
          </Badge>
        );
      case "Menunggu":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Menunggu
          </Badge>
        );
      case "Gagal":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 text-xs">
            <XCircle className="h-3 w-3 mr-1" />
            Gagal
          </Badge>
        );
      case "Expired":
        return (
          <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-0 text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      case "Refund":
        return (
          <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 border-0 text-xs">
            Refund
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getEventTypeBadge = (eventType: string) => {
    const colors: Record<string, string> = {
      Purchase: "bg-sky-100 text-sky-700",
      Renewal: "bg-emerald-100 text-emerald-700",
      Upgrade: "bg-violet-100 text-violet-700",
      Downgrade: "bg-amber-100 text-amber-700",
      "Trial Start": "bg-indigo-100 text-indigo-700",
      "Trial End": "bg-slate-100 text-slate-600",
      Expired: "bg-red-100 text-red-700",
      Refund: "bg-orange-100 text-orange-700",
    };
    return (
      <Badge className={`${colors[eventType] || "bg-slate-100 text-slate-600"} hover:${colors[eventType]} border-0 text-xs`}>
        {eventType}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[140px]">Waktu</TableHead>
              <TableHead className="min-w-[180px]">User</TableHead>
              <TableHead className="min-w-[100px]">Event</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
              <TableHead className="min-w-[80px]">Durasi</TableHead>
              <TableHead className="min-w-[100px] text-right">Total Bayar</TableHead>
              <TableHead className="min-w-[100px]">Pembayaran</TableHead>
              <TableHead className="min-w-[100px]">Benefit</TableHead>
              <TableHead className="w-[60px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((trx) => (
              <TableRow 
                key={trx.id} 
                className="cursor-pointer hover:bg-sky-50/50"
                onClick={() => onViewDetail(trx)}
              >
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">
                      {format(trx.date, "dd/MM/yyyy", { locale: id })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(trx.date, "HH:mm", { locale: id })} WIB
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">{trx.user.name}</p>
                    <p className="text-xs text-muted-foreground">{trx.user.email}</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-mono text-muted-foreground">{trx.referenceId}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={(e) => handleCopy(trx.referenceId, e)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getEventTypeBadge(trx.eventType)}</TableCell>
                <TableCell>
                  <p className="text-sm">
                    {trx.statusBefore} → {trx.statusAfter}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{trx.duration}</p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm">{formatCurrency(trx.totalPaid)}</p>
                    {trx.promoCode && (
                      <p className="text-xs text-emerald-600">{trx.promoCode}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getPaymentStatusBadge(trx.paymentStatus)}</TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground">
                    {trx.tokenGiven > 0 && <p>+{trx.tokenGiven} token</p>}
                    {trx.pointsGiven > 0 && <p>+{trx.pointsGiven.toLocaleString("id-ID")} poin</p>}
                    {trx.tokenGiven === 0 && trx.pointsGiven === 0 && <p>-</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary"
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
