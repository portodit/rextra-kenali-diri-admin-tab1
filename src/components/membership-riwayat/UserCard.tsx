import { MemberUser } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, Calendar, Clock, ChevronRight } from "lucide-react";

// Import emblem assets
import emblemStarter from "@/assets/emblem-starter.png";
import emblemBasic from "@/assets/emblem-basic.png";
import emblemPro from "@/assets/emblem-pro.png";
import emblemMax from "@/assets/emblem-max.png";

interface UserCardProps {
  user: MemberUser;
  onViewDetail: (user: MemberUser) => void;
}

const tierConfig: Record<string, { 
  emblem: string; 
  bgSoft: string; 
  textColor: string;
  borderColor: string;
}> = {
  Max: { 
    emblem: emblemMax, 
    bgSoft: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200"
  },
  Pro: { 
    emblem: emblemPro, 
    bgSoft: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200"
  },
  Basic: { 
    emblem: emblemBasic, 
    bgSoft: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200"
  },
  Starter: { 
    emblem: emblemStarter, 
    bgSoft: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200"
  },
  Standard: { 
    emblem: emblemStarter, 
    bgSoft: "bg-slate-50",
    textColor: "text-slate-600",
    borderColor: "border-slate-200"
  },
};

const categoryConfig: Record<string, { bg: string; text: string; label: string }> = {
  "REXTRA Club": { 
    bg: "bg-gradient-to-r from-emerald-500 to-teal-500", 
    text: "text-white", 
    label: "REXTRA CLUB" 
  },
  "Trial Club": { 
    bg: "bg-gradient-to-r from-violet-500 to-purple-500", 
    text: "text-white", 
    label: "TRIAL CLUB" 
  },
  "Non-Club": { 
    bg: "bg-slate-500", 
    text: "text-white", 
    label: "NON CLUB" 
  },
};

export function UserCard({ user, onViewDetail }: UserCardProps) {
  const config = tierConfig[user.tier] || tierConfig.Standard;
  const catConfig = categoryConfig[user.category] || categoryConfig["Non-Club"];

  const getValidityStyle = () => {
    if (user.validityStatus === "Expired") {
      return { 
        bg: "bg-red-50", 
        border: "border-red-200",
        text: "text-red-600", 
        ring: "ring-red-300"
      };
    }
    if (user.validityStatus === "Expiring") {
      return { 
        bg: "bg-amber-50", 
        border: "border-amber-200",
        text: "text-amber-600", 
        ring: "ring-amber-300"
      };
    }
    return { 
      bg: "bg-muted/30", 
      border: "border-border/50",
      text: "text-foreground", 
      ring: "ring-primary/20"
    };
  };

  const validityStyle = getValidityStyle();

  return (
    <div 
      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
      onClick={() => onViewDetail(user)}
    >
      <div className="p-5">
        {/* Header: Avatar + Identity + Tier Emblem */}
        <div className="flex items-start gap-3">
          {/* Avatar with status ring */}
          <Avatar className={`h-11 w-11 ring-2 ring-offset-2 ring-offset-background shrink-0 ${validityStyle.ring}`}>
            <AvatarFallback className={`${config.bgSoft} ${config.textColor} font-semibold text-sm`}>
              {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate leading-tight text-[15px]">{user.name}</h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
            <p className="text-[10px] font-mono text-muted-foreground/60 mt-0.5">{user.userId}</p>
          </div>
          
          {/* Tier Emblem */}
          <div className="shrink-0">
            <img 
              src={config.emblem} 
              alt={user.tier} 
              className="h-11 w-11 object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Status Badges Row - Tier + Category side by side */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {/* Tier Badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${config.bgSoft} ${config.textColor} ${config.borderColor} border text-xs font-semibold`}>
            {user.tier}
          </span>
          
          {/* Category Badge */}
          <Badge className={`${catConfig.bg} ${catConfig.text} border-0 text-[10px] font-semibold px-2 py-0.5 shadow-sm`}>
            {catConfig.label}
          </Badge>
        </div>

        {/* Duration Info Box */}
        <div className={`mt-4 p-3 rounded-xl border ${validityStyle.bg} ${validityStyle.border}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {user.endDate ? user.endDate.toLocaleDateString("id-ID") : "Tidak terbatas"}
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
              <Clock className={`h-4 w-4 ${validityStyle.text}`} />
              <span className={`text-sm font-semibold ${validityStyle.text}`}>
                {user.validityStatus === "Expired" 
                  ? `Expired ${Math.abs(user.remainingDays)} hari lalu`
                  : `${user.remainingDays} hari tersisa`}
              </span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-4 justify-between text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(user);
          }}
        >
          <span className="text-sm font-medium">Lihat Detail</span>
          <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
