import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Edit2, 
  RefreshCw, 
  Save,
  X,
  Info,
  AlertTriangle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MembershipStatus } from "./MembershipStatusCard";
import { toast } from "@/hooks/use-toast";

interface MembershipDetailSectionProps {
  status: MembershipStatus;
  onBack: () => void;
  onEditMetadata: () => void;
  onSaveConfig: (config: MembershipStatus['config']) => void;
}

export function MembershipDetailSection({
  status,
  onBack,
  onEditMetadata,
  onSaveConfig,
}: MembershipDetailSectionProps) {
  const [activeTab, setActiveTab] = useState("pembiayaan");
  const [config, setConfig] = useState(status.config);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset config when status changes
  useEffect(() => {
    setConfig(status.config);
    setHasChanges(false);
    setErrors({});
  }, [status.id]);

  const updateConfig = (updates: Partial<typeof config>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const handleModeChange = (mode: "auto" | "manual") => {
    if (hasChanges) {
      if (!confirm("Perubahan belum disimpan. Lanjut mengganti mode akan membatalkan perubahan saat ini.")) {
        return;
      }
    }
    updateConfig({ mode });
    setHasChanges(false);
  };

  const handleRewardModeChange = (rewardMode: "default" | "custom") => {
    updateConfig({ rewardMode });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (config.mode === "auto") {
      if (config.basePrice < 1 || config.basePrice > 1000000000) {
        newErrors.basePrice = "Harga harus antara Rp 1 - Rp 1.000.000.000";
      }
      if (config.baseToken < 1 || config.baseToken > 1000000) {
        newErrors.baseToken = "Token harus antara 1 - 1.000.000";
      }
      
      Object.entries(config.discounts).forEach(([dur, val]) => {
        if (val < 0 || val > 80) {
          newErrors[`discount_${dur}`] = "Diskon maksimal 80%";
        }
      });
      
      Object.entries(config.bonusTokens).forEach(([dur, val]) => {
        if (val < 0 || val > 200) {
          newErrors[`bonus_${dur}`] = "Bonus maksimal 200%";
        }
      });
    }
    
    if (config.rewardMode === "custom") {
      Object.entries(config.customRewards).forEach(([dur, val]) => {
        if (val < 0 || val > 10000000) {
          newErrors[`reward_${dur}`] = "Poin maksimal 10.000.000";
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast({
        variant: "destructive",
        title: "Validasi gagal",
        description: "Periksa kembali nilai yang dimasukkan.",
      });
      return;
    }
    
    setIsSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    onSaveConfig(config);
    setHasChanges(false);
    setIsSaving(false);
  };

  const handleReset = () => {
    setConfig(status.config);
    setHasChanges(false);
    setErrors({});
  };

  const handleCancel = () => {
    if (hasChanges && !confirm("Perubahan belum disimpan. Yakin ingin membatalkan?")) {
      return;
    }
    onBack();
  };

  // Calculate preview
  const preview = useMemo(() => {
    if (config.mode !== "auto") return null;
    
    const durations = [1, 3, 6, 12] as const;
    return durations.map(dur => {
      const discount = dur === 1 ? 0 : config.discounts[dur as 3 | 6 | 12];
      const bonus = dur === 1 ? 0 : config.bonusTokens[dur as 3 | 6 | 12];
      
      const totalPrice = Math.round(config.basePrice * dur * (1 - discount / 100));
      const pricePerMonth = Math.round(totalPrice / dur);
      const totalToken = Math.round(config.baseToken * dur * (1 + bonus / 100));
      const tokenPerMonth = Math.round(totalToken / dur * 10) / 10;
      
      return {
        duration: dur,
        totalPrice,
        pricePerMonth,
        totalToken,
        tokenPerMonth,
      };
    });
  }, [config]);

  // Check for review indicator
  const needsReview = useMemo(() => {
    if (!preview || config.mode !== "auto") return false;
    const month12 = preview.find(p => p.duration === 12);
    if (!month12) return false;
    
    const priceDropPercent = ((config.basePrice - month12.pricePerMonth) / config.basePrice) * 100;
    const tokenBoostPercent = ((month12.tokenPerMonth - config.baseToken) / config.baseToken) * 100;
    
    return priceDropPercent > 60 || tokenBoostPercent > 200;
  }, [preview, config]);

  const isUnpaid = status.category === "unpaid";

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={handleCancel}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">
          Detail Paket: {status.name}
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-muted-foreground">
            {status.category === "paid" ? "Paid Membership" : "Unpaid Membership"}
          </span>
          <span className="text-muted-foreground">•</span>
          <Badge 
            variant="outline"
            className={cn(
              "text-xs",
              status.isActive 
                ? "bg-success/10 text-success border-success/20" 
                : "bg-destructive/10 text-destructive border-destructive/20"
            )}
          >
            {status.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left Column - Summary */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ringkasan Paket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Nama Paket</Label>
              <p className="text-sm font-medium">{status.name}</p>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Kategori</Label>
              <p className="text-sm font-medium capitalize">{status.category} Membership</p>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Status</Label>
              <div className="mt-1">
                <Badge 
                  variant="outline"
                  className={cn(
                    status.isActive 
                      ? "bg-success/10 text-success border-success/20" 
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  )}
                >
                  {status.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            </div>
            
            {status.description && (
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Deskripsi</Label>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{status.description}</p>
              </div>
            )}
            
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Terakhir Diubah</Label>
              <p className="text-xs text-muted-foreground mt-1">
                {status.lastUpdated} WIB
                <br />
                oleh {status.lastUpdatedBy}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full gap-2" 
              size="sm"
              onClick={onEditMetadata}
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit Metadata
            </Button>
          </CardContent>
        </Card>

        {/* Right Column - Configuration Tabs */}
        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-fit mb-6">
                <TabsTrigger value="pembiayaan" className="px-6">Pembiayaan & Token</TabsTrigger>
                <TabsTrigger value="reward" className="px-6">Reward Poin</TabsTrigger>
              </TabsList>

              {/* Tab 1: Pembiayaan & Token */}
              <TabsContent value="pembiayaan" className="space-y-6 mt-0">
                {isUnpaid ? (
                  <Alert className="bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Konfigurasi pembiayaan & token hanya berlaku untuk Paid Membership.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {/* Mode Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Mode Pengaturan</Label>
                      <RadioGroup 
                        value={config.mode} 
                        onValueChange={(v) => handleModeChange(v as "auto" | "manual")}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="auto" id="mode-auto" />
                          <Label htmlFor="mode-auto" className="font-normal cursor-pointer">
                            Otomatis (Rule-Based)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="manual" id="mode-manual" />
                          <Label htmlFor="mode-manual" className="font-normal cursor-pointer">
                            Manual (Fixed Value)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {config.mode === "auto" ? (
                      <>
                        {/* Block A: Parameter Dasar */}
                        <Card className="bg-muted/30 border-border/50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">A. Parameter Dasar Paket</CardTitle>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm">Harga Bulanan (1 bulan) *</Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                                <Input
                                  type="number"
                                  value={config.basePrice}
                                  onChange={(e) => updateConfig({ basePrice: Number(e.target.value) })}
                                  className={cn("pl-10", errors.basePrice && "border-destructive")}
                                />
                              </div>
                              {errors.basePrice && <p className="text-xs text-destructive">{errors.basePrice}</p>}
                              <p className="text-xs text-muted-foreground">Min: Rp 1, Max: Rp 1.000.000.000</p>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Token Bulanan *</Label>
                              <Input
                                type="number"
                                value={config.baseToken}
                                onChange={(e) => updateConfig({ baseToken: Number(e.target.value) })}
                                className={cn(errors.baseToken && "border-destructive")}
                              />
                              {errors.baseToken && <p className="text-xs text-destructive">{errors.baseToken}</p>}
                              <p className="text-xs text-muted-foreground">Min: 1, Max: 1.000.000</p>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Block B: Diskon */}
                        <Card className="bg-muted/30 border-border/50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">B. Diskon Harga Berdasarkan Durasi</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                              {([3, 6, 12] as const).map((dur) => (
                                <div key={dur} className="space-y-2">
                                  <Label className="text-sm">{dur} bulan</Label>
                                  <div className="relative">
                                    <Input
                                      type="number"
                                      value={config.discounts[dur]}
                                      onChange={(e) => updateConfig({ 
                                        discounts: { ...config.discounts, [dur]: Number(e.target.value) } 
                                      })}
                                      className={cn("pr-8", errors[`discount_${dur}`] && "border-destructive")}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                                  </div>
                                  {errors[`discount_${dur}`] && <p className="text-xs text-destructive">{errors[`discount_${dur}`]}</p>}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Block C: Bonus Token */}
                        <Card className="bg-muted/30 border-border/50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">C. Bonus Token Berdasarkan Durasi</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                              {([3, 6, 12] as const).map((dur) => (
                                <div key={dur} className="space-y-2">
                                  <Label className="text-sm">{dur} bulan</Label>
                                  <div className="relative">
                                    <Input
                                      type="number"
                                      value={config.bonusTokens[dur]}
                                      onChange={(e) => updateConfig({ 
                                        bonusTokens: { ...config.bonusTokens, [dur]: Number(e.target.value) } 
                                      })}
                                      className={cn("pr-8", errors[`bonus_${dur}`] && "border-destructive")}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                                  </div>
                                  {errors[`bonus_${dur}`] && <p className="text-xs text-destructive">{errors[`bonus_${dur}`]}</p>}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Block D: Formula */}
                        <Card className="bg-muted/30 border-border/50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">D. Rumus (Read-only)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-background rounded-md p-3 font-mono text-xs text-muted-foreground space-y-1">
                              <p>Harga total = (Harga bulanan × Durasi) × (1 − Diskon%)</p>
                              <p>Token total = (Token bulanan × Durasi) × (1 + Bonus%)</p>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Block E: Preview */}
                        <Card className="bg-muted/30 border-border/50">
                          <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-semibold">E. Preview Hasil</CardTitle>
                            {needsReview && (
                              <Badge className="bg-warning/10 text-warning border-warning/20 gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Perlu Review
                              </Badge>
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2 font-medium">Durasi</th>
                                    <th className="text-right py-2 font-medium">Harga Total</th>
                                    <th className="text-right py-2 font-medium">/bulan</th>
                                    <th className="text-right py-2 font-medium">Token Total</th>
                                    <th className="text-right py-2 font-medium">/bulan</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {preview?.map((row) => (
                                    <tr key={row.duration} className="border-b border-border/50">
                                      <td className="py-2">{row.duration} bulan</td>
                                      <td className="text-right py-2">{formatCurrency(row.totalPrice)}</td>
                                      <td className="text-right py-2 text-muted-foreground">{formatCurrency(row.pricePerMonth)}</td>
                                      <td className="text-right py-2">{row.totalToken}</td>
                                      <td className="text-right py-2 text-muted-foreground">{row.tokenPerMonth}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            {!needsReview && (
                              <div className="mt-3 flex items-center gap-2 text-sm text-success">
                                <Check className="h-4 w-4" />
                                Normal
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </>
                    ) : (
                      /* Manual Mode */
                      <Card className="bg-muted/30 border-border/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold">Konfigurasi Manual per Durasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 font-medium">Durasi</th>
                                  <th className="text-left py-2 font-medium">Harga Total (Rp)</th>
                                  <th className="text-left py-2 font-medium">Token Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {([1, 3, 6, 12] as const).map((dur) => (
                                  <tr key={dur} className="border-b border-border/50">
                                    <td className="py-3">{dur} bulan</td>
                                    <td className="py-3">
                                      <Input type="number" placeholder="0" className="w-40" />
                                    </td>
                                    <td className="py-3">
                                      <Input type="number" placeholder="0" className="w-32" />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Tab 2: Reward Poin */}
              <TabsContent value="reward" className="space-y-6 mt-0">
                {isUnpaid ? (
                  <Alert className="bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Konfigurasi reward poin hanya berlaku untuk Paid Membership.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Mode Reward</Label>
                      <RadioGroup 
                        value={config.rewardMode} 
                        onValueChange={(v) => handleRewardModeChange(v as "default" | "custom")}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="default" id="reward-default" />
                          <Label htmlFor="reward-default" className="font-normal cursor-pointer">
                            Default
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="custom" id="reward-custom" />
                          <Label htmlFor="reward-custom" className="font-normal cursor-pointer">
                            Kustom
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {config.rewardMode === "default" ? (
                      <Card className="bg-muted/30 border-border/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold">Preview Reward Default</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Rate default: 1 poin per Rp 1.000 pembelian
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 font-medium">Durasi</th>
                                  <th className="text-right py-2 font-medium">Estimasi Poin</th>
                                </tr>
                              </thead>
                              <tbody>
                                {preview?.map((row) => (
                                  <tr key={row.duration} className="border-b border-border/50">
                                    <td className="py-2">{row.duration} bulan</td>
                                    <td className="text-right py-2">{Math.floor(row.totalPrice / 1000)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="bg-muted/30 border-border/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold">Konfigurasi Reward Kustom</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {([1, 3, 6, 12] as const).map((dur) => (
                              <div key={dur} className="space-y-2">
                                <Label className="text-sm">{dur} bulan</Label>
                                <Input
                                  type="number"
                                  value={config.customRewards[dur]}
                                  onChange={(e) => updateConfig({ 
                                    customRewards: { ...config.customRewards, [dur]: Number(e.target.value) } 
                                  })}
                                  placeholder="0"
                                  className={cn(errors[`reward_${dur}`] && "border-destructive")}
                                />
                                {errors[`reward_${dur}`] && <p className="text-xs text-destructive">{errors[`reward_${dur}`]}</p>}
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-3">Poin: Min 0, Max 10.000.000 per durasi</p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>

            {/* Action Footer */}
            {!isUnpaid && (
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Batalkan
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  disabled={!hasChanges || isSaving}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className="gap-2 min-w-32"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
