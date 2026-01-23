import { MemberUser } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, AlertTriangle, Crown, Zap, Star, Award, CircleDot, Calendar, Clock } from "lucide-react";

interface UserCardProps {
  user: MemberUser;
  onViewDetail: (user: MemberUser) => void;
}

const tierConfig: Record<string, { icon: React.ElementType; gradient: string; bg: string }> = {
  Max: { icon: Crown, gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50" },
  Pro: { icon: Award, gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50" },
  Basic: { icon: Star, gradient: "from-sky-500 to-blue-600", bg: "bg-sky-50" },
  Starter: { icon: Zap, gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50" },
  Standard: { icon: CircleDot, gradient: "from-slate-400 to-slate-500", bg: "bg-slate-50" },
};

export function UserCard({ user, onViewDetail }: UserCardProps) {
  const config = tierConfig[user.tier] || tierConfig.Standard;
  const TierIcon = config.icon;

  const getCategoryStyle = () => {
    switch (user.category) {
      case "REXTRA Club":
        return "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm";
      case "Trial Club":
        return "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-sm";
      case "Non-Club":
        return "bg-slate-200 text-slate-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getValidityStyle = () => {
    if (user.validityStatus === "Expired") {
      return { bg: "bg-red-500/10", text: "text-red-600", label: "Expired" };
    }
    if (user.validityStatus === "Expiring") {
      return { bg: "bg-amber-500/10", text: "text-amber-600", label: "Segera Berakhir" };
    }
    return null;
  };

  const validityStyle = getValidityStyle();

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  return (
    <div 
      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
      onClick={() => onViewDetail(user)}
    >
      {/* Tier Accent Bar */}
      <div className={`h-1 bg-gradient-to-r ${config.gradient}`} />
      
      <div className="p-4 space-y-4">
        {/* Header: Avatar + Identity */}
        <div className="flex items-start gap-3">
          <Avatar className={`h-12 w-12 ring-2 ring-offset-2 ring-offset-background ${user.validityStatus === "Expired" ? "ring-red-300" : user.validityStatus === "Expiring" ? "ring-amber-300" : "ring-primary/20"}`}>
            <AvatarFallback className={`${config.bg} text-foreground font-semibold`}>
              {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate leading-tight">{user.name}</h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
            <p className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">{user.userId}</p>
          </div>
        </div>

        {/* Tier & Category Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tier Badge with icon */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${config.gradient} text-white text-xs font-semibold shadow-sm`}>
            <TierIcon className="h-3.5 w-3.5" />
            <span>{user.tier}</span>
          </div>
          
          {/* Category Badge */}
          <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${getCategoryStyle()}`}>
            {user.category}
          </span>
          
          {/* Validity Warning */}
          {validityStyle && (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${validityStyle.bg} ${validityStyle.text} text-xs font-medium`}>
              <AlertTriangle className="h-3 w-3" />
              {validityStyle.label}
            </span>
          )}
        </div>

        {/* Duration Info */}
        <div className={`p-3 rounded-xl ${user.validityStatus === "Expired" ? "bg-red-50" : user.validityStatus === "Expiring" ? "bg-amber-50" : "bg-muted/50"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {user.endDate ? `Berakhir ${user.endDate.toLocaleDateString("id-ID")}` : "Tidak ada masa berlaku"}
              </span>
            </div>
            {user.autoRenew && (
              <div className="flex items-center gap-1 text-primary">
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Auto</span>
              </div>
            )}
          </div>
          
          {user.endDate && (
            <div className="mt-2 flex items-center gap-2">
              <Clock className={`h-4 w-4 ${user.validityStatus === "Expired" ? "text-red-500" : user.validityStatus === "Expiring" ? "text-amber-500" : "text-foreground"}`} />
              <span className={`text-sm font-semibold ${user.validityStatus === "Expired" ? "text-red-600" : user.validityStatus === "Expiring" ? "text-amber-600" : "text-foreground"}`}>
                {user.validityStatus === "Expired" 
                  ? `Expired ${Math.abs(user.remainingDays)} hari lalu`
                  : `Sisa ${user.remainingDays} hari`}
              </span>
            </div>
          )}
        </div>

        {/* Price Info */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-lg font-bold text-foreground">{formatPrice(user.lastPurchasePrice)}</p>
            {user.lastPurchaseDuration > 0 && user.category !== "Trial Club" && (
              <p className="text-xs text-muted-foreground">/ {user.lastPurchaseDuration} bulan</p>
            )}
            {user.category === "Trial Club" && (
              <p className="text-xs text-violet-600 font-medium">Trial Period</p>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(user);
            }}
          >
            Lihat Detail
          </Button>
        </div>
      </div>
    </div>
  );
}