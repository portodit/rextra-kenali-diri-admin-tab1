import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  ChevronDown, 
  ChevronUp,
  AlertTriangle, 
  RefreshCw,
  X,
  Info,
  Crown,
  Users,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MembershipStatusCard, MembershipStatus } from "@/components/membership/MembershipStatusCard";
import { MembershipDetailSection } from "@/components/membership/MembershipDetailSection";
import { EditMetadataModal } from "@/components/membership/EditMetadataModal";
import { ConfirmationModal } from "@/components/membership/ConfirmationModal";

// Import emblems
import emblemStarter from "@/assets/emblem-starter.png";
import emblemBasic from "@/assets/emblem-basic.png";
import emblemPro from "@/assets/emblem-pro.png";
import emblemMax from "@/assets/emblem-max.png";

// Demo data
const demoStatuses: MembershipStatus[] = [
  {
    id: "standard",
    name: "Standard",
    category: "unpaid",
    isActive: true,
    emblem: emblemStarter,
    price: 0,
    tokenPerMonth: null,
    pointsActive: false,
    description: "Akses standar gratis untuk semua pengguna REXTRA.",
    lastUpdated: "20/01/2025 14:30",
    lastUpdatedBy: "Admin Eko",
    config: {
      mode: "auto",
      basePrice: 0,
      baseToken: 0,
      discounts: { 3: 0, 6: 0, 12: 0 },
      bonusTokens: { 3: 0, 6: 0, 12: 0 },
      rewardMode: "default",
      customRewards: { 1: 0, 3: 0, 6: 0, 12: 0 },
    },
  },
  {
    id: "starter",
    name: "Starter",
    category: "unpaid",
    isActive: true,
    emblem: emblemStarter,
    price: 0,
    tokenPerMonth: null,
    pointsActive: false,
    description: "Akses dasar untuk pengguna baru yang ingin mencoba fitur REXTRA.",
    lastUpdated: "20/01/2025 14:30",
    lastUpdatedBy: "Admin Eko",
    config: {
      mode: "auto",
      basePrice: 0,
      baseToken: 0,
      discounts: { 3: 0, 6: 0, 12: 0 },
      bonusTokens: { 3: 0, 6: 0, 12: 0 },
      rewardMode: "default",
      customRewards: { 1: 0, 3: 0, 6: 0, 12: 0 },
    },
  },
  {
    id: "basic",
    name: "Basic",
    category: "paid",
    isActive: true,
    emblem: emblemBasic,
    price: 180000,
    tokenPerMonth: 10,
    pointsActive: true,
    description: "Paket entry-level untuk mahasiswa tahun 1-2 yang berfokus pada penetapan tujuan karier.",
    lastUpdated: "19/01/2025 10:15",
    lastUpdatedBy: "Admin Sarah",
    config: {
      mode: "auto",
      basePrice: 180000,
      baseToken: 10,
      discounts: { 3: 10, 6: 15, 12: 20 },
      bonusTokens: { 3: 5, 6: 10, 12: 20 },
      rewardMode: "default",
      customRewards: { 1: 100, 3: 350, 6: 750, 12: 1600 },
    },
  },
  {
    id: "pro",
    name: "Pro",
    category: "paid",
    isActive: true,
    emblem: emblemPro,
    price: 300000,
    tokenPerMonth: 20,
    pointsActive: true,
    description: "Paket lengkap untuk mahasiswa yang serius mengembangkan karier dengan fitur premium.",
    lastUpdated: "18/01/2025 09:00",
    lastUpdatedBy: "Admin Eko",
    config: {
      mode: "auto",
      basePrice: 300000,
      baseToken: 20,
      discounts: { 3: 10, 6: 20, 12: 25 },
      bonusTokens: { 3: 10, 6: 15, 12: 30 },
      rewardMode: "custom",
      customRewards: { 1: 200, 3: 700, 6: 1500, 12: 3500 },
    },
  },
  {
    id: "max",
    name: "Max",
    category: "paid",
    isActive: false,
    emblem: emblemMax,
    price: null,
    tokenPerMonth: null,
    pointsActive: false,
    description: "Paket premium dengan akses unlimited untuk mahasiswa tingkat akhir dan fresh graduate.",
    lastUpdated: "15/01/2025 16:45",
    lastUpdatedBy: "Admin Eko",
    config: {
      mode: "manual",
      basePrice: 0,
      baseToken: 0,
      discounts: { 3: 0, 6: 0, 12: 0 },
      bonusTokens: { 3: 0, 6: 0, 12: 0 },
      rewardMode: "default",
      customRewards: { 1: 0, 3: 0, 6: 0, 12: 0 },
    },
  },
];

type DemoState = "data" | "loading" | "empty" | "error";
type SortOption = "name-asc" | "name-desc" | "updated";
type FilterOption = "all" | "paid" | "unpaid";

export default function MembershipStatusPage() {
  // Demo state
  const [demoState, setDemoState] = useState<DemoState>("data");
  const [showDemoToggle, setShowDemoToggle] = useState(false);
  
  // UI State
  const [isCalloutOpen, setIsCalloutOpen] = useState(false);
  
  // Selection state
  const [selectedStatus, setSelectedStatus] = useState<MembershipStatus | null>(null);
  const [isListCollapsed, setIsListCollapsed] = useState(false);

  // Data state (for simulating changes)
  const [statuses, setStatuses] = useState<MembershipStatus[]>(demoStatuses);
  
  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: string;
    data?: any;
    message: string;
  } | null>(null);

  // Filtered lists (no search/filter needed - static 5 items)
  const unpaidStatuses = statuses.filter(s => s.category === "unpaid");
  const paidStatuses = statuses.filter(s => s.category === "paid");

  const handleSelectStatus = (status: MembershipStatus) => {
    setSelectedStatus(status);
    setIsListCollapsed(true);
  };

  const handleBackToList = () => {
    setIsListCollapsed(false);
  };

  const handleExpandList = () => {
    setIsListCollapsed(false);
  };

  const handleEditMetadata = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveMetadata = (data: Partial<MembershipStatus>) => {
    if (!selectedStatus) return;
    
    const updated = statuses.map(s => 
      s.id === selectedStatus.id ? { ...s, ...data } : s
    );
    setStatuses(updated);
    setSelectedStatus({ ...selectedStatus, ...data });
    setIsEditModalOpen(false);
    toast({
      title: "Metadata berhasil disimpan",
      description: `Perubahan pada ${selectedStatus.name} telah disimpan.`,
    });
  };

  const handleSaveConfig = (config: MembershipStatus['config']) => {
    if (!selectedStatus) return;
    
    // Check if this requires confirmation
    if (selectedStatus.isActive && selectedStatus.category === "paid") {
      setPendingAction({
        type: "save-config",
        data: config,
        message: "Perubahan ini dapat mempengaruhi penawaran paket dan benefit pengguna. Pastikan perubahan sudah benar sebelum disimpan.",
      });
      setIsConfirmModalOpen(true);
      return;
    }
    
    executeSaveConfig(config);
  };

  const executeSaveConfig = (config: MembershipStatus['config']) => {
    if (!selectedStatus) return;
    
    const price = config.mode === "auto" ? config.basePrice : 0;
    const token = config.mode === "auto" ? config.baseToken : 0;
    
    const updated = statuses.map(s => 
      s.id === selectedStatus.id ? { 
        ...s, 
        config,
        price: price || null,
        tokenPerMonth: token || null,
        pointsActive: config.rewardMode === "custom" || (config.customRewards[1] > 0),
        lastUpdated: new Date().toLocaleString('id-ID', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', ''),
        lastUpdatedBy: "Current User",
      } : s
    );
    
    setStatuses(updated);
    setSelectedStatus(updated.find(s => s.id === selectedStatus.id) || null);
    toast({
      title: "Konfigurasi berhasil disimpan",
      description: `Perubahan konfigurasi ${selectedStatus.name} telah disimpan.`,
    });
  };

  const handleConfirmAction = () => {
    if (!pendingAction) return;
    
    if (pendingAction.type === "save-config" && pendingAction.data) {
      executeSaveConfig(pendingAction.data);
    }
    
    setIsConfirmModalOpen(false);
    setPendingAction(null);
  };

  const handleRetry = () => {
    setDemoState("loading");
    setTimeout(() => setDemoState("data"), 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/membership/fitur-hak-akses">Membership</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Status Membership</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Status Membership</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola status membership dan konfigurasi pembiayaan, token, serta reward poin per status.
          </p>
        </div>

        {/* Callout */}
        <Collapsible open={isCalloutOpen} onOpenChange={setIsCalloutOpen}>
          <Alert className="border-warning/30 bg-warning/5">
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 w-full text-left">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="font-medium text-sm text-warning flex-1">Catatan Penting</span>
                {isCalloutOpen ? (
                  <ChevronUp className="h-4 w-4 text-warning" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-warning" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <AlertDescription className="mt-2 text-sm text-muted-foreground">
                Perubahan konfigurasi dapat berdampak pada harga tampil, token benefit, dan perhitungan 
                reward pada pengalaman pengguna. Pastikan untuk memverifikasi semua perubahan sebelum menyimpan.
              </AlertDescription>
            </CollapsibleContent>
          </Alert>
        </Collapsible>

        {/* Loading State */}
        {demoState === "loading" && (
          <div className="space-y-6">
            {/* Search skeleton */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
            
            {/* Cards skeleton */}
            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <Skeleton className="h-44 rounded-2xl" />
                </div>
              </div>
              <div>
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <Skeleton className="h-44 rounded-2xl" />
                  <Skeleton className="h-44 rounded-2xl" />
                  <Skeleton className="h-44 rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {demoState === "error" && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <X className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Gagal memuat data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Terjadi kesalahan saat memuat data status membership. Coba beberapa saat lagi.
              </p>
              <Button onClick={handleRetry} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {demoState === "empty" && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Info className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Belum ada status membership</h3>
              <p className="text-sm text-muted-foreground mb-4">
              Mulai dengan menambahkan status membership pertama.
            </p>
            <Button className="gap-2">
              <Crown className="h-4 w-4" />
              Tambah Status
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Data State */}
      {demoState === "data" && (
        <>
          {/* Section A: List */}
          {!isListCollapsed ? (
            <div className="space-y-8">
              {/* Unpaid Group */}
              {unpaidStatuses.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100">
                      <Users className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">Free Tier</h3>
                      <p className="text-xs text-muted-foreground">{unpaidStatuses.length} paket gratis</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {unpaidStatuses.map((status) => (
                      <MembershipStatusCard
                        key={status.id}
                        status={status}
                        onSelect={() => handleSelectStatus(status)}
                        isSelected={selectedStatus?.id === status.id}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Paid Group */}
              {paidStatuses.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100">
                      <Crown className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">Premium Tier</h3>
                      <p className="text-xs text-muted-foreground">{paidStatuses.length} paket berbayar</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {paidStatuses.map((status) => (
                      <MembershipStatusCard
                        key={status.id}
                        status={status}
                        onSelect={() => handleSelectStatus(status)}
                        isSelected={selectedStatus?.id === status.id}
                      />
                    ))}
                  </div>
                </div>
              )}
              </div>
            ) : null}

            {/* Section B: Detail */}
            {selectedStatus && isListCollapsed && (
              <MembershipDetailSection
                status={selectedStatus}
                onBack={handleBackToList}
                onEditMetadata={handleEditMetadata}
                onSaveConfig={handleSaveConfig}
                onChangePackage={handleExpandList}
              />
            )}
          </>
        )}
      </div>

      {/* Demo State Toggle (Floating) */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDemoToggle(!showDemoToggle)}
          className="bg-background shadow-lg"
        >
          Demo: {demoState}
        </Button>
        {showDemoToggle && (
          <div className="absolute bottom-full right-0 mb-2 bg-background border rounded-lg shadow-lg p-2 flex flex-col gap-1 min-w-32">
            {(["data", "loading", "empty", "error"] as DemoState[]).map((state) => (
              <Button
                key={state}
                variant={demoState === state ? "default" : "ghost"}
                size="sm"
                className="justify-start"
                onClick={() => {
                  setDemoState(state);
                  setShowDemoToggle(false);
                }}
              >
                {state}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <EditMetadataModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        status={selectedStatus}
        onSave={handleSaveMetadata}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setPendingAction(null);
        }}
        onConfirm={handleConfirmAction}
        message={pendingAction?.message || ""}
      />
    </DashboardLayout>
  );
}
