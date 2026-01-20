import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}: ConfirmationModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleClose = () => {
    setIsChecked(false);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    setIsChecked(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <DialogTitle>Konfirmasi Perubahan</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>
          
          <div className="flex items-start gap-3 mt-6 p-4 bg-muted/50 rounded-lg">
            <Checkbox
              id="confirm"
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(checked === true)}
            />
            <Label htmlFor="confirm" className="text-sm font-normal cursor-pointer leading-relaxed">
              Saya memahami dampak perubahan ini dan ingin melanjutkan.
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Batalkan
          </Button>
          <Button onClick={handleConfirm} disabled={!isChecked}>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
