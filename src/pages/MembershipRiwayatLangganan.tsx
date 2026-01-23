import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, AlertCircle, RefreshCw } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { UserListTab } from "@/components/membership-riwayat/UserListTab";
import { TransactionHistoryTab } from "@/components/membership-riwayat/TransactionHistoryTab";

type DemoState = "loading" | "data" | "empty" | "error";

export default function MembershipRiwayatLangganan() {
  const [activeTab, setActiveTab] = useState("users");
  const [demoState, setDemoState] = useState<DemoState>("data");
  const [calloutOpen, setCalloutOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Dashboard &gt; Membership &gt; Riwayat Langganan
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Riwayat Langganan
          </h1>
          <p className="text-muted-foreground">
            Pantau kondisi membership pengguna dan jejak perubahan statusnya
          </p>

          {/* Collapsible Callout */}
          <Collapsible open={calloutOpen} onOpenChange={setCalloutOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 p-0 h-auto text-sm text-muted-foreground hover:text-foreground hover:bg-transparent"
              >
                <Info className="h-4 w-4 text-primary" />
                <span>Catatan Penting</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${calloutOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-3 bg-sky-50 border border-sky-200 rounded-lg text-sm text-sky-800">
                Halaman ini untuk monitoring dan audit trail. Perubahan status membership mengikuti event transaksi sistem.
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto w-full justify-start">
            <TabsTrigger
              value="users"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
            >
              Daftar Pengguna
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
            >
              Riwayat Transaksi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <UserListTab demoState={demoState} />
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            <TransactionHistoryTab demoState={demoState} />
          </TabsContent>
        </Tabs>

        {/* Demo State Toggle */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-card border border-border rounded-lg shadow-lg p-2 flex gap-2">
            {(["loading", "data", "empty", "error"] as DemoState[]).map((state) => (
              <Button
                key={state}
                size="sm"
                variant={demoState === state ? "default" : "outline"}
                onClick={() => setDemoState(state)}
                className="text-xs capitalize"
              >
                {state}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
