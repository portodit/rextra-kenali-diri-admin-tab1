import { MemberUser } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, AlertTriangle, Crown, Zap, Star, Award, CircleDot } from "lucide-react";

interface UserCardProps {
  user: MemberUser;
  onViewDetail: (user: MemberUser) => void;
}

const tierIcons: Record<string, React.ElementType> = {
  Max: Crown,
  Pro: Award,
  Basic: Star,
  Starter: Zap,
  Standard: CircleDot,
};

const tierColors: Record<string, string> = {
  Max: "text-amber-600",
  Pro: "text-violet-600",
  Basic: "text-sky-600",
  Starter: "text-emerald-600",
  Standard: "text-slate-500",
};

export function UserCard({ user, onViewDetail }: UserCardProps) {
  const TierIcon = tierIcons[user.tier] || CircleDot;
  const tierColor = tierColors[user.tier] || "text-slate-500";

  const getCategoryBadge = () => {
    switch (user.category) {
      case "REXTRA Club":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs">REXTRA Club</Badge>;
      case "Trial Club":
        return <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 border-0 text-xs">Trial Club</Badge>;
      case "Non-Club":
        return <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-0 text-xs">Non-Club</Badge>;
    }
  };

  const getValidityBadge = () => {
    if (user.validityStatus === "Expired") {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 text-xs">Expired</Badge>;
    }
    if (user.validityStatus === "Expiring") {
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 text-xs">Akan berakhir</Badge>;
    }
    return null;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Rp 0";
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  const formatDuration = () => {
    if (user.lastPurchaseDuration === 0) return "";
    if (user.category === "Trial Club") return "(Trial)";
    return `/ ${user.lastPurchaseDuration} bulan`;
  };

  return (
    <div 
      className="bg-card border border-border rounded-2xl p-4 hover:border-sky-300 hover:bg-sky-50/50 hover:shadow-[0_0_20px_-3px_rgba(14,165,233,0.3)] transition-all duration-200 cursor-pointer"
      onClick={() => onViewDetail(user)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
          </div>
        </div>
      </div>

      {/* Tier & Category */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className={`flex items-center gap-1.5 ${tierColor}`}>
          <TierIcon className="h-4 w-4" />
          <span className="font-medium text-sm">{user.tier}</span>
        </div>
        {getCategoryBadge()}
        {getValidityBadge()}
      </div>

      {/* Contact */}
      <div className="space-y-1 mb-3 text-sm text-muted-foreground">
        <p className="truncate">{user.email}</p>
        <p className="font-mono text-xs">{user.userId}</p>
      </div>

      {/* Duration */}
      <div className="space-y-1 mb-3 text-sm">
        {user.endDate && (
          <>
            <p className="text-muted-foreground">
              Berakhir: {user.endDate.toLocaleDateString("id-ID")}
            </p>
            <p className={`font-medium ${
              user.validityStatus === "Expired" ? "text-red-600" :
              user.validityStatus === "Expiring" ? "text-amber-600" :
              "text-foreground"
            }`}>
              {user.validityStatus === "Expired" 
                ? `Expired ${Math.abs(user.remainingDays)} hari lalu`
                : `Sisa: ${user.remainingDays} hari`}
              {user.validityStatus === "Expiring" && (
                <AlertTriangle className="inline h-3.5 w-3.5 ml-1" />
              )}
            </p>
          </>
        )}
        {!user.endDate && user.category === "Non-Club" && (
          <p className="text-muted-foreground">Sisa: 0 hari</p>
        )}
      </div>

      {/* Price */}
      <div className="mb-3 text-sm">
        <p className="text-muted-foreground">
          {formatPrice(user.lastPurchasePrice)} {formatDuration()}
        </p>
        {user.autoRenew && (
          <div className="flex items-center gap-1 text-primary mt-1">
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Auto-renew ON</span>
          </div>
        )}
      </div>

      {/* Action */}
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={(e) => {
          e.stopPropagation();
          onViewDetail(user);
        }}
      >
        Lihat Detail
      </Button>
    </div>
  );
}
