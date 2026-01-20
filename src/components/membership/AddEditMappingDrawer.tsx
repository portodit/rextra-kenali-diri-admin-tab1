import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  RefreshCw, 
  Check,
  ChevronsUpDown,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EntitlementMapping } from "./AccessMappingTab";

export interface MappingData {
  entitlementId: string;
  entitlementName: string;
  entitlementKey: string;
  objectType: string;
  objectName: string;
  category: string;
  restriction: "unlimited" | "token" | "limit";
  tokenCost?: number;
  limitCount?: number;
  limitPeriod?: "daily" | "weekly" | "monthly";
  isActive: boolean;
  notes?: string;
}

// Demo entitlements for autocomplete
const demoEntitlements = [
  { id: "e1", name: "Lihat Dashboard", key: "dashboard.view", objectType: "feature", objectName: "Dashboard", category: "view" },
  { id: "e2", name: "Gunakan AI Analysis", key: "ai.analysis.use", objectType: "subfeature", objectName: "AI Analysis", category: "use" },
  { id: "e3", name: "Download Report", key: "report.download", objectType: "feature", objectName: "Report", category: "download" },
  { id: "e4", name: "Edit Profil", key: "profile.edit", objectType: "feature", objectName: "Profil", category: "edit" },
  { id: "e5", name: "Akses Portfolio Builder", key: "portfolio.builder.use", objectType: "subfeature", objectName: "Portfolio Builder", category: "use" },
  { id: "e6", name: "Lihat Career Path", key: "career_path.view", objectType: "feature", objectName: "Career Path", category: "view" },
  { id: "e7", name: "Gunakan Resume Parser", key: "resume.parser.use", objectType: "subfeature", objectName: "Resume Parser", category: "use" },
];

interface AddEditMappingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MappingData) => void;
  editingMapping: EntitlementMapping | null;
  packageName: string;
}

export function AddEditMappingDrawer({
  isOpen,
  onClose,
  onSave,
  editingMapping,
  packageName,
}: AddEditMappingDrawerProps) {
  const isEditing = !!editingMapping;
  
  // Form state
  const [selectedEntitlement, setSelectedEntitlement] = useState<typeof demoEntitlements[0] | null>(null);
  const [restriction, setRestriction] = useState<"unlimited" | "token" | "limit">("unlimited");
  const [tokenCost, setTokenCost] = useState<number>(1);
  const [limitCount, setLimitCount] = useState<number>(10);
  const [limitPeriod, setLimitPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState("");
  
  // UI state
  const [entitlementOpen, setEntitlementOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [originalRestriction, setOriginalRestriction] = useState<string | null>(null);

  // Reset form when opening/closing
  useEffect(() => {
    if (isOpen) {
      if (editingMapping) {
        // Load editing data
        setSelectedEntitlement({
          id: editingMapping.entitlementId,
          name: editingMapping.entitlementName,
          key: editingMapping.entitlementKey,
          objectType: editingMapping.objectType,
          objectName: editingMapping.objectName,
          category: editingMapping.category,
        });
        setRestriction(editingMapping.restriction);
        setTokenCost(editingMapping.tokenCost || 1);
        setLimitCount(editingMapping.limitCount || 10);
        setLimitPeriod(editingMapping.limitPeriod || "daily");
        setIsActive(editingMapping.isActive);
        setOriginalRestriction(editingMapping.restriction);
      } else {
        // Reset to defaults
        setSelectedEntitlement(null);
        setRestriction("unlimited");
        setTokenCost(1);
        setLimitCount(10);
        setLimitPeriod("daily");
        setIsActive(true);
        setOriginalRestriction(null);
      }
      setNotes("");
      setErrors({});
      setShowConfirmation(false);
      setConfirmChecked(false);
    }
  }, [isOpen, editingMapping]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedEntitlement) {
      newErrors.entitlement = "Pilih hak akses terlebih dahulu";
    }
    
    if (restriction === "token") {
      if (tokenCost < 1 || tokenCost > 1000) {
        newErrors.tokenCost = "Biaya token harus 1–1.000";
      }
      if (!Number.isInteger(tokenCost)) {
        newErrors.tokenCost = "Biaya token harus bilangan bulat";
      }
    }
    
    if (restriction === "limit") {
      if (limitCount < 1 || limitCount > 10000) {
        newErrors.limitCount = "Limit harus 1–10.000";
      }
      if (!Number.isInteger(limitCount)) {
        newErrors.limitCount = "Limit harus bilangan bulat";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isRiskyChange = () => {
    if (!isEditing) return false;
    
    // Risky if: restriction type changed, or significant parameter change, or deactivating
    if (originalRestriction && originalRestriction !== restriction) return true;
    if (editingMapping?.isActive && !isActive) return true;
    
    return false;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    // Check for risky changes
    if (isRiskyChange() && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }
    
    if (showConfirmation && !confirmChecked) return;
    
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    
    onSave({
      entitlementId: selectedEntitlement!.id,
      entitlementName: selectedEntitlement!.name,
      entitlementKey: selectedEntitlement!.key,
      objectType: selectedEntitlement!.objectType,
      objectName: selectedEntitlement!.objectName,
      category: selectedEntitlement!.category,
      restriction,
      tokenCost: restriction === "token" ? tokenCost : undefined,
      limitCount: restriction === "limit" ? limitCount : undefined,
      limitPeriod: restriction === "limit" ? limitPeriod : undefined,
      isActive,
      notes,
    });
    
    setIsSaving(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Mapping" : "Tambah Mapping"}
          </SheetTitle>
          <SheetDescription>
            {isEditing 
              ? `Edit konfigurasi akses untuk paket ${packageName}`
              : `Tambahkan hak akses baru ke paket ${packageName}`
            }
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Entitlement Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Hak Akses <span className="text-destructive">*</span>
            </Label>
            {isEditing ? (
              <div className="p-3 bg-muted/50 rounded-lg border">
                <p className="font-medium text-sm">{selectedEntitlement?.name}</p>
                <code className="text-xs text-muted-foreground font-mono">
                  {selectedEntitlement?.key}
                </code>
              </div>
            ) : (
              <Popover open={entitlementOpen} onOpenChange={setEntitlementOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={entitlementOpen}
                    className={cn(
                      "w-full justify-between h-11",
                      errors.entitlement && "border-destructive"
                    )}
                  >
                    {selectedEntitlement ? (
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{selectedEntitlement.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {selectedEntitlement.key}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Pilih hak akses...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[460px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Cari hak akses..." className="h-10" />
                    <CommandList>
                      <CommandEmpty>Tidak ada hak akses yang cocok.</CommandEmpty>
                      <CommandGroup>
                        {demoEntitlements.map((ent) => (
                          <CommandItem
                            key={ent.id}
                            value={ent.name}
                            onSelect={() => {
                              setSelectedEntitlement(ent);
                              setEntitlementOpen(false);
                              setErrors(prev => ({ ...prev, entitlement: "" }));
                            }}
                            className="flex flex-col items-start py-3"
                          >
                            <div className="flex items-center w-full">
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedEntitlement?.id === ent.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex-1">
                                <p className="font-medium">{ent.name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{ent.key}</p>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
            {errors.entitlement && (
              <p className="text-xs text-destructive">{errors.entitlement}</p>
            )}
          </div>

          {/* Preview Object (read-only) */}
          {selectedEntitlement && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Preview Objek</Label>
              <div className="p-3 bg-muted/30 rounded-lg border text-sm">
                <p>
                  <span className="text-muted-foreground">Tipe: </span>
                  <span className="capitalize">
                    {selectedEntitlement.objectType === "feature" ? "Fitur" : "Sub Fitur"}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Nama: </span>
                  {selectedEntitlement.objectName}
                </p>
                <p>
                  <span className="text-muted-foreground">Kategori Aksi: </span>
                  <span className="capitalize">{selectedEntitlement.category}</span>
                </p>
              </div>
            </div>
          )}

          {/* Restriction Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Pembatasan <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={restriction}
              onValueChange={(v) => setRestriction(v as typeof restriction)}
              className="grid grid-cols-3 gap-3"
            >
              <Label
                htmlFor="r-unlimited"
                className={cn(
                  "flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors",
                  restriction === "unlimited" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:bg-muted/50"
                )}
              >
                <RadioGroupItem value="unlimited" id="r-unlimited" className="sr-only" />
                <span className="text-sm font-medium">Tanpa batas</span>
              </Label>
              <Label
                htmlFor="r-token"
                className={cn(
                  "flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors",
                  restriction === "token" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:bg-muted/50"
                )}
              >
                <RadioGroupItem value="token" id="r-token" className="sr-only" />
                <span className="text-sm font-medium">Token</span>
              </Label>
              <Label
                htmlFor="r-limit"
                className={cn(
                  "flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors",
                  restriction === "limit" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:bg-muted/50"
                )}
              >
                <RadioGroupItem value="limit" id="r-limit" className="sr-only" />
                <span className="text-sm font-medium">Limit frekuensi</span>
              </Label>
            </RadioGroup>
          </div>

          {/* Token Cost (conditional) */}
          {restriction === "token" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Biaya token per aksi <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                value={tokenCost}
                onChange={(e) => setTokenCost(Number(e.target.value))}
                placeholder="1"
                min={1}
                max={1000}
                className={cn("w-40", errors.tokenCost && "border-destructive")}
              />
              {errors.tokenCost && (
                <p className="text-xs text-destructive">{errors.tokenCost}</p>
              )}
              <p className="text-xs text-muted-foreground">Min: 1, Max: 1.000</p>
            </div>
          )}

          {/* Limit Settings (conditional) */}
          {restriction === "limit" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Jumlah limit <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  value={limitCount}
                  onChange={(e) => setLimitCount(Number(e.target.value))}
                  placeholder="10"
                  min={1}
                  max={10000}
                  className={cn(errors.limitCount && "border-destructive")}
                />
                {errors.limitCount && (
                  <p className="text-xs text-destructive">{errors.limitCount}</p>
                )}
                <p className="text-xs text-muted-foreground">Min: 1, Max: 10.000</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Periode <span className="text-destructive">*</span>
                </Label>
                <Select value={limitPeriod} onValueChange={(v) => setLimitPeriod(v as typeof limitPeriod)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Harian</SelectItem>
                    <SelectItem value="weekly">Mingguan</SelectItem>
                    <SelectItem value="monthly">Bulanan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="text-sm font-medium">Status Mapping</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isActive ? "Mapping aktif pada paket ini" : "Mapping tidak aktif"}
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Catatan internal (opsional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan..."
              rows={3}
            />
          </div>

          {/* Risky Change Confirmation */}
          {showConfirmation && (
            <Alert className="border-warning/30 bg-warning/5">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="space-y-3">
                <p className="text-sm">
                  Perubahan pembatasan akan mempengaruhi akses user pada paket ini. 
                  Pastikan nilai baru sudah benar sebelum menyimpan.
                </p>
                <div className="flex items-start gap-2">
                  <Checkbox 
                    id="confirm-risk"
                    checked={confirmChecked}
                    onCheckedChange={(c) => setConfirmChecked(c as boolean)}
                  />
                  <label htmlFor="confirm-risk" className="text-sm cursor-pointer leading-tight">
                    Saya memahami dampak perubahan ini dan telah memverifikasi nilai baru.
                  </label>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <SheetFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Batalkan
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSaving || (showConfirmation && !confirmChecked)}
            className="gap-2 min-w-28"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
