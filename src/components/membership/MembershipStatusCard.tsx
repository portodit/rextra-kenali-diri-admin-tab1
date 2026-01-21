import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Check, AlertCircle, Sparkles, Crown, Zap, Star } from "lucide-react";

export interface MembershipStatus {
  id: string;
  name: string;
  category: "paid" | "unpaid";
  isActive: boolean;
  emblem: string;
  price: number | null;
  tokenPerMonth: number | null;
  pointsActive: boolean;
  description: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  config: {
    mode: "auto" | "manual";
    basePrice: number;
    baseToken: number;
    discounts: { 3: number; 6: number; 12: number };
    bonusTokens: { 3: number; 6: number; 12: number };
    rewardMode: "default" | "custom";
    customRewards: { 1: number; 3: number; 6: number; 12: number };
  };
}

interface MembershipStatusCardProps {
  status: MembershipStatus;
  onSelect: () => void;
  isSelected?: boolean;
}

export function MembershipStatusCard({ status, onSelect, isSelected }: MembershipStatusCardProps) {
  const isPriceSet = status.price !== null && status.price > 0;
  const isTokenSet = status.tokenPerMonth !== null && status.tokenPerMonth > 0;
  const isPointsSet = status.pointsActive;
  const isComplete = status.category === "unpaid" || (isPriceSet && isTokenSet && isPointsSet);

  const formatPrice = (price: number | null) => {
    if (price === null || price === 0) return "Gratis";
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  // Tier-specific styling
  const getTierStyle = () => {
    switch (status.id) {
      case "standard":
        return {
          gradient: "bg-gradient-to-br from-slate-100 via-slate-50 to-gray-100",
          border: "border-slate-200",
          accent: "text-slate-600",
          icon: null,
          tagBg: "bg-slate-500",
        };
      case "starter":
        return {
          gradient: "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100",
          border: "border-amber-200",
          accent: "text-amber-600",
          icon: Star,
          tagBg: "bg-gradient-to-r from-amber-500 to-orange-500",
        };
      case "basic":
        return {
          gradient: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100",
          border: "border-emerald-200",
          accent: "text-emerald-600",
          icon: Zap,
          tagBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
        };
      case "pro":
        return {
          gradient: "bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-100",
          border: "border-blue-200",
          accent: "text-blue-600",
          icon: Sparkles,
          tagBg: "bg-gradient-to-r from-blue-500 to-indigo-500",
        };
      case "max":
        return {
          gradient: "bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100",
          border: "border-amber-300",
          accent: "text-amber-700",
          icon: Crown,
          tagBg: "bg-gradient-to-r from-amber-500 to-yellow-500",
        };
      default:
        return {
          gradient: "bg-card",
          border: "border-border",
          accent: "text-foreground",
          icon: null,
          tagBg: "bg-muted",
        };
    }
  };

  const tierStyle = getTierStyle();
  const TierIcon = tierStyle.icon;

  return (
    <div
      className={cn(
        "group relative w-full min-h-[200px] rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300",
        "hover:shadow-xl hover:scale-[1.02]",
        tierStyle.gradient,
        tierStyle.border,
        isSelected && "ring-2 ring-primary ring-offset-2 shadow-xl scale-[1.02]"
      )}
      onClick={onSelect}
    >
      <div className="absolute -top-2 right-4 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-white text-slate-600 border border-slate-200 shadow-sm">
        {status.id === "starter" ? "TRIAL CLUB" : status.category === "paid" ? "REXTRA CLUB" : "NON CLUB"}
      </div>

      {/* Status Indicator - Top Left */}
      <div className={cn(
        "absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium",
        status.isActive 
          ? "bg-success/20 text-success" 
          : "bg-destructive/20 text-destructive"
      )}>
        <span className={cn(
          "w-1.5 h-1.5 rounded-full",
          status.isActive ? "bg-success animate-pulse" : "bg-destructive"
        )} />
        {status.isActive ? "Aktif" : "Nonaktif"}
      </div>

      {/* Main Content */}
      <div className="mt-6 flex items-start gap-4">
        {/* Emblem with glow effect */}
        <div className="relative shrink-0">
          <div className={cn(
            "absolute inset-0 rounded-full blur-lg opacity-30",
            status.category === "paid" ? "bg-primary" : "bg-muted"
          )} />
          <img 
            src={status.emblem} 
            alt={status.name} 
            className="relative h-14 w-14 object-contain drop-shadow-lg"
          />
        </div>

        {/* Title & Icon */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold text-foreground tracking-tight truncate">
              {status.name}
            </h4>
            {TierIcon && (
              <TierIcon className={cn("h-4 w-4 shrink-0", tierStyle.accent)} />
            )}
          </div>
          
          {/* Price Display */}
          <div className="mt-1">
            <span className={cn("text-xl font-bold", tierStyle.accent)}>
              {formatPrice(status.price)}
            </span>
            {status.price !== null && status.price > 0 && (
              <span className="text-sm font-medium text-muted-foreground">/bulan</span>
            )}
            {status.price === null && status.category === "paid" && (
              <span className="text-sm text-muted-foreground italic ml-1">(Belum diset)</span>
            )}
          </div>
        </div>
      </div>

      {/* Features/Info Row */}
      <div className="mt-4 flex flex-wrap gap-2">
        {status.category === "paid" ? (
          <>
            <div className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium",
              isTokenSet ? "bg-background/80 text-foreground" : "bg-warning/10 text-warning"
            )}>
              <Zap className="h-3 w-3" />
              {isTokenSet ? `${status.tokenPerMonth} token` : "Token: -"}
            </div>
            <div className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium",
              isPointsSet ? "bg-background/80 text-foreground" : "bg-warning/10 text-warning"
            )}>
              <Star className="h-3 w-3" />
              Poin: {isPointsSet ? "✓" : "-"}
            </div>
          </>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background/80 text-xs font-medium text-muted-foreground">
            Akses dasar gratis
          </div>
        )}
      </div>

      {/* Setup Status */}
      <div className="mt-3">
        {isComplete ? (
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
            <Check className="h-3.5 w-3.5" />
            Konfigurasi lengkap
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {!isPriceSet && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-medium">
                <AlertCircle className="h-3 w-3" />
                Harga
              </span>
            )}
            {!isTokenSet && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-medium">
                <AlertCircle className="h-3 w-3" />
                Token
              </span>
            )}
            {!isPointsSet && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-medium">
                <AlertCircle className="h-3 w-3" />
                Poin
              </span>
            )}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <Button 
        size="sm" 
        className={cn(
          "w-full mt-4 gap-2 font-semibold transition-all",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "group-hover:shadow-lg"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <Settings className="h-4 w-4" />
        Kelola Paket
      </Button>
    </div>
  );
}
