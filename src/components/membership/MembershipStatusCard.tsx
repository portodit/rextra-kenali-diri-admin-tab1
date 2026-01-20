import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Check, AlertCircle } from "lucide-react";

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
    if (price === null || price === 0) return "Rp0";
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  // Card gradient based on tier
  const getCardGradient = () => {
    switch (status.id) {
      case "standard":
        return "bg-gradient-to-br from-slate-50 via-gray-50/50 to-slate-100/30";
      case "starter":
        return "bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/30";
      case "basic":
        return "bg-gradient-to-br from-emerald-50 via-green-50/50 to-teal-100/30";
      case "pro":
        return "bg-gradient-to-br from-cyan-50 via-sky-50/50 to-blue-100/30";
      case "max":
        return "bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-100/30";
      default:
        return "bg-card";
    }
  };

  return (
    <div
      className={cn(
        "relative w-full min-h-[180px] rounded-2xl border p-4 cursor-pointer transition-all duration-300",
        "hover:shadow-lg hover:scale-[1.02] hover:border-primary/40",
        getCardGradient(),
        isSelected && "ring-2 ring-primary shadow-lg border-primary/50"
      )}
      onClick={onSelect}
    >
      {/* Header: Emblem + Name + Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={status.emblem} 
              alt={status.name} 
              className="h-12 w-12 object-contain drop-shadow-md"
            />
          </div>
          <div>
            <h4 className="text-lg font-bold text-foreground tracking-tight">{status.name}</h4>
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] font-medium h-5 px-2",
                status.category === "paid" 
                  ? "bg-primary/10 text-primary border-primary/20" 
                  : "bg-muted text-muted-foreground border-muted"
              )}
            >
              {status.category === "paid" ? "Paid Membership" : "Unpaid Membership"}
            </Badge>
          </div>
        </div>
        
        <Badge 
          variant="outline"
          className={cn(
            "text-xs shrink-0",
            status.isActive 
              ? "bg-success/10 text-success border-success/20" 
              : "bg-destructive/10 text-destructive border-destructive/20"
          )}
        >
          {status.isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      </div>

      {/* Price & Token Info */}
      <div className="space-y-1 mb-3">
        <p className="text-xl font-bold text-foreground">
          {formatPrice(status.price)}
          {status.price !== null && status.price > 0 && (
            <span className="text-sm font-normal text-muted-foreground">/bulan</span>
          )}
          {status.price === null && status.category === "paid" && (
            <span className="text-sm font-normal text-muted-foreground italic ml-1">(Belum diset)</span>
          )}
        </p>
        
        {status.category === "paid" && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              {isTokenSet ? `${status.tokenPerMonth} token/bulan` : "Token: Belum diset"}
            </span>
            <span>•</span>
            <span>
              Poin: {isPointsSet ? "Aktif" : "Belum diset"}
            </span>
          </div>
        )}
        
        {status.category === "unpaid" && (
          <p className="text-sm text-muted-foreground">Akses gratis tanpa token & poin</p>
        )}
      </div>

      {/* Setup Status Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {status.category === "paid" ? (
          isComplete ? (
            <Badge className="bg-success/10 text-success border-success/20 text-[10px] font-medium h-5 px-2 gap-1">
              <Check className="h-3 w-3" />
              Lengkap
            </Badge>
          ) : (
            <>
              {!isPriceSet && (
                <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-medium h-5 px-2 gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Harga belum diset
                </Badge>
              )}
              {!isTokenSet && (
                <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-medium h-5 px-2 gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Token belum diset
                </Badge>
              )}
              {!isPointsSet && (
                <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-medium h-5 px-2 gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Poin belum diset
                </Badge>
              )}
            </>
          )
        ) : (
          <Badge className="bg-success/10 text-success border-success/20 text-[10px] font-medium h-5 px-2 gap-1">
            <Check className="h-3 w-3" />
            Lengkap
          </Badge>
        )}
      </div>

      {/* CTA */}
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full gap-2 bg-background/80 hover:bg-background"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <Settings className="h-3.5 w-3.5" />
        Konfigurasi
      </Button>
    </div>
  );
}
