import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MembershipStatus } from "./MembershipStatusCard";

interface EditMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: MembershipStatus | null;
  onSave: (data: Partial<MembershipStatus>) => void;
}

export function EditMetadataModal({
  isOpen,
  onClose,
  status,
  onSave,
}: EditMetadataModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status) {
      setName(status.name);
      setDescription(status.description || "");
      setIsActive(status.isActive);
      setErrors({});
    }
  }, [status, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Nama paket wajib diisi";
    } else if (name.length > 50) {
      newErrors.name = "Nama paket maksimal 50 karakter";
    }
    
    if (description.length > 120) {
      newErrors.description = "Deskripsi maksimal 120 karakter";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    onSave({
      name: name.trim(),
      description: description.trim(),
      isActive,
    });
  };

  if (!status) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Metadata Paket</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Paket *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama paket"
              className={errors.name ? "border-destructive" : ""}
            />
            <div className="flex justify-between">
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              <p className="text-xs text-muted-foreground ml-auto">{name.length}/50</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat paket membership"
              rows={3}
              className={errors.description ? "border-destructive" : ""}
            />
            <div className="flex justify-between">
              {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
              <p className="text-xs text-muted-foreground ml-auto">{description.length}/120</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="active">Status Aktif</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Paket yang nonaktif tidak akan tampil untuk pengguna
              </p>
            </div>
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
