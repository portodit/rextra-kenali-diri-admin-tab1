import { Users, Crown, Zap, UserX, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryData {
  totalUsers: number;
  rextraClub: number;
  trialClub: number;
  nonClub: number;
  expiring: number;
}

interface SummaryChipsProps {
  data?: SummaryData;
  isLoading?: boolean;
}

export function SummaryChips({ data, isLoading }: SummaryChipsProps) {
  const chips = [
    {
      label: "Total Pengguna",
      value: data?.totalUsers ?? 0,
      icon: Users,
      bgColor: "bg-slate-50",
      iconColor: "text-slate-600",
    },
    {
      label: "REXTRA Club",
      value: data?.rextraClub ?? 0,
      icon: Crown,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Trial Club",
      value: data?.trialClub ?? 0,
      icon: Zap,
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "Non-Club",
      value: data?.nonClub ?? 0,
      icon: UserX,
      bgColor: "bg-slate-50",
      iconColor: "text-slate-500",
    },
    {
      label: "Expiring ≤7 hari",
      value: data?.expiring ?? 0,
      icon: AlertTriangle,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {chips.map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {chips.map((chip) => (
        <div
          key={chip.label}
          className={`${chip.bgColor} rounded-xl p-3 md:p-4 border border-border/50`}
        >
          <div className="flex items-center gap-2 mb-1">
            <chip.icon className={`h-4 w-4 ${chip.iconColor}`} />
            <span className="text-xs font-medium text-muted-foreground truncate">
              {chip.label}
            </span>
          </div>
          <p className="text-lg md:text-xl font-semibold text-foreground">
            {chip.value.toLocaleString("id-ID")}
          </p>
        </div>
      ))}
    </div>
  );
}
