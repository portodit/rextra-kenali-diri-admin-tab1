import { MemberUser, JourneyEvent } from "./types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Crown, Award, Star, Zap, CircleDot, RefreshCw, 
  Coins, Gift, Lock, ExternalLink, Calendar, Clock, Circle 
} from "lucide-react";
import { generateMockJourneyEvents } from "./mockData";
import { useMemo } from "react";

interface UserDetailDrawerProps {
  user: MemberUser | null;
  open: boolean;
  onClose: () => void;
}

const tierIcons: Record<string, React.ElementType> = {
  Max: Crown,
  Pro: Award,
  Basic: Star,
  Starter: Zap,
  Standard: CircleDot,
};

export function UserDetailDrawer({ user, open, onClose }: UserDetailDrawerProps) {
  const journeyEvents = useMemo(() => 
    user ? generateMockJourneyEvents(user.id) : [], 
    [user]
  );

  if (!user) return null;

  const TierIcon = tierIcons[user.tier] || CircleDot;

  const getCategoryBadge = () => {
    switch (user.category) {
      case "REXTRA Club":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">REXTRA Club</Badge>;
      case "Trial Club":
        return <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 border-0">Trial Club</Badge>;
      case "Non-Club":
        return <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-0">Non-Club</Badge>;
    }
  };

  const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-4 md:p-6 border-b border-border">
          <SheetTitle className="text-left">{user.name}</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6 space-y-6">
            {/* Status Saat Ini */}
            <section className="border border-border/60 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Status Saat Ini
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary">
                  <TierIcon className="h-5 w-5" />
                  <span className="font-semibold text-lg">{user.tier} Plan</span>
                </div>
                {getCategoryBadge()}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Nama</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium truncate">{user.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">User ID</p>
                  <p className="font-medium font-mono text-xs">{user.userId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tanggal Mulai</p>
                  <p className="font-medium">{user.startDate.toLocaleDateString("id-ID")}</p>
                </div>
                {user.endDate && (
                  <>
                    <div>
                      <p className="text-muted-foreground">Tanggal Berakhir</p>
                      <p className="font-medium">{user.endDate.toLocaleDateString("id-ID")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sisa Durasi</p>
                      <p className={`font-medium ${
                        user.validityStatus === "Expired" ? "text-red-600" :
                        user.validityStatus === "Expiring" ? "text-amber-600" :
                        "text-foreground"
                      }`}>
                        {user.validityStatus === "Expired" 
                          ? `Expired ${Math.abs(user.remainingDays)} hari lalu`
                          : `${user.remainingDays} hari`}
                      </p>
                    </div>
                  </>
                )}
                <div className="col-span-2">
                  <p className="text-muted-foreground">Auto-renew</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <RefreshCw className={`h-4 w-4 ${user.autoRenew ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="font-medium">{user.autoRenew ? 'Aktif' : 'Nonaktif'}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefit Saat Ini */}
            <section className="border border-border/60 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Benefit Saat Ini
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Saldo Token</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{user.tokenBalance.toLocaleString("id-ID")} token</span>
                    <Button variant="link" size="sm" className="h-auto p-0 ml-2 text-xs">
                      Lihat Riwayat <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-violet-500" />
                    <span className="text-sm">Total Poin</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{user.pointsBalance.toLocaleString("id-ID")} poin</span>
                    <Button variant="link" size="sm" className="h-auto p-0 ml-2 text-xs">
                      Lihat Riwayat <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-sky-500" />
                    <span className="text-sm">Akses Fitur</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{user.entitlementCount} entitlement aktif</span>
                    <Button variant="link" size="sm" className="h-auto p-0 ml-2 text-xs">
                      Lihat Detail <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Timeline Journey */}
            <section className="border border-border/60 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Timeline Journey (Riwayat Langganan)
              </h3>

              <div className="relative">
                {journeyEvents.map((event, index) => (
                  <div key={event.id} className="flex gap-3 pb-6 last:pb-0">
                    {/* Timeline dot and line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        event.isFuture 
                          ? 'border-2 border-muted-foreground bg-background' 
                          : 'bg-primary'
                      }`} />
                      {index < journeyEvents.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border mt-1" />
                      )}
                    </div>

                    {/* Event content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{event.date.toLocaleDateString("id-ID")}</span>
                        {!event.isFuture && (
                          <>
                            <Clock className="h-3 w-3 ml-1" />
                            <span>{event.date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</span>
                          </>
                        )}
                      </div>
                      <p className={`font-medium ${event.isFuture ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {event.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: {event.statusBefore} → {event.statusAfter}
                      </p>
                      {event.duration && (
                        <p className="text-sm text-muted-foreground">Durasi: {event.duration}</p>
                      )}
                      {event.total && (
                        <p className="text-sm text-muted-foreground">Total: {formatCurrency(event.total)}</p>
                      )}
                      {event.promoCode && (
                        <p className="text-sm text-muted-foreground">
                          Promo: {event.promoCode} ({formatCurrency(event.promoDiscount || 0)})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Riwayat Transaksi Terakhir */}
            <section className="border border-border/60 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Riwayat Transaksi (10 terakhir)
              </h3>

              <div className="space-y-2">
                {journeyEvents
                  .filter((e) => !e.isFuture && e.total !== undefined)
                  .slice(0, 4)
                  .map((event) => (
                    <div key={event.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium">{event.title.split(" ")[0]}</p>
                        <p className="text-xs text-muted-foreground">{event.date.toLocaleDateString("id-ID")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{event.duration || "-"}</p>
                        <p className="text-xs text-muted-foreground">{event.total ? formatCurrency(event.total) : "-"}</p>
                      </div>
                    </div>
                  ))}
              </div>

              <Button variant="outline" size="sm" className="w-full">
                Lihat Semua Transaksi
                <ExternalLink className="h-3.5 w-3.5 ml-2" />
              </Button>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
