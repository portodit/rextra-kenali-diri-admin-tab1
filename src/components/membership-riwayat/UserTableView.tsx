import { MemberUser } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Eye, AlertTriangle } from "lucide-react";

interface UserTableViewProps {
  users: MemberUser[];
  onViewDetail: (user: MemberUser) => void;
}

export function UserTableView({ users, onViewDetail }: UserTableViewProps) {
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "REXTRA Club":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs">REXTRA Club</Badge>;
      case "Trial Club":
        return <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 border-0 text-xs">Trial Club</Badge>;
      case "Non-Club":
        return <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-0 text-xs">Non-Club</Badge>;
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="min-w-[200px]">User</TableHead>
            <TableHead className="min-w-[100px]">Kategori</TableHead>
            <TableHead className="min-w-[80px]">Tier</TableHead>
            <TableHead className="min-w-[100px]">Berakhir</TableHead>
            <TableHead className="min-w-[100px]">Sisa Hari</TableHead>
            <TableHead className="min-w-[100px]">Auto-renew</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow 
              key={user.id} 
              className="cursor-pointer hover:bg-sky-50/50"
              onClick={() => onViewDetail(user)}
            >
              <TableCell>
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs font-mono text-muted-foreground">{user.userId}</p>
                </div>
              </TableCell>
              <TableCell>{getCategoryBadge(user.category)}</TableCell>
              <TableCell>
                <span className="font-medium">{user.tier}</span>
              </TableCell>
              <TableCell>
                {user.endDate ? user.endDate.toLocaleDateString("id-ID") : "-"}
              </TableCell>
              <TableCell>
                <span className={`font-medium flex items-center gap-1 ${
                  user.validityStatus === "Expired" ? "text-red-600" :
                  user.validityStatus === "Expiring" ? "text-amber-600" :
                  "text-foreground"
                }`}>
                  {user.validityStatus === "Expired" 
                    ? `${Math.abs(user.remainingDays)}`
                    : user.remainingDays}
                  {user.validityStatus === "Expiring" && (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  )}
                </span>
              </TableCell>
              <TableCell>
                {user.autoRenew ? (
                  <div className="flex items-center gap-1 text-primary">
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">ON</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">OFF</span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetail(user);
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
  );
}
