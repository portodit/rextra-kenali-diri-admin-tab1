import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Edit,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Types
interface SubFitur {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
}

interface Fitur {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  status: "active" | "inactive";
  subFitur: SubFitur[];
  usedByEntitlements: string[];
}

interface KategoriAksi {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: "active" | "inactive";
  usedByEntitlements: number;
}

interface HakAkses {
  id: string;
  name: string;
  key: string;
  objectType: "fitur" | "sub_fitur";
  objectName: string;
  kategoriAksi: string;
  description: string;
  status: "active" | "inactive";
  usedByMappings: number;
}

// Mock data
const mockFiturData: Fitur[] = [
  {
    id: "1",
    name: "Portfolio",
    slug: "portfolio",
    icon: "📁",
    description: "Fitur untuk mengelola portfolio mahasiswa",
    status: "active",
    subFitur: [
      { id: "1-1", name: "Auto-fill Portfolio", slug: "auto_fill", status: "active" },
      { id: "1-2", name: "AI Check Portfolio", slug: "ai_check", status: "active" },
      { id: "1-3", name: "Export PDF", slug: "export_pdf", status: "active" },
    ],
    usedByEntitlements: ["portfolio.view", "portfolio.create", "portfolio.edit", "portfolio.auto_fill", "portfolio.ai_check"],
  },
  {
    id: "2",
    name: "CV Generator",
    slug: "cv_generator",
    icon: "📄",
    description: "Fitur untuk membuat CV otomatis",
    status: "active",
    subFitur: [
      { id: "2-1", name: "Template Premium", slug: "template_premium", status: "active" },
    ],
    usedByEntitlements: ["cv_generator.view", "cv_generator.create"],
  },
  {
    id: "3",
    name: "Kenali Diri",
    slug: "kenali_diri",
    icon: "🧠",
    description: "Fitur asesmen kepribadian dan minat",
    status: "active",
    subFitur: [],
    usedByEntitlements: ["kenali_diri.view", "kenali_diri.use"],
  },
];

const mockKategoriAksiData: KategoriAksi[] = [
  { id: "1", name: "Tampilan", slug: "view", description: "Akses untuk melihat data atau halaman", status: "active", usedByEntitlements: 12 },
  { id: "2", name: "Pembuatan", slug: "create", description: "Akses untuk membuat data baru", status: "active", usedByEntitlements: 8 },
  { id: "3", name: "Penggunaan", slug: "use", description: "Akses untuk menggunakan fitur", status: "active", usedByEntitlements: 15 },
  { id: "4", name: "Pengeditan", slug: "edit", description: "Akses untuk mengubah data", status: "active", usedByEntitlements: 6 },
  { id: "5", name: "Penghapusan", slug: "delete", description: "Akses untuk menghapus data", status: "inactive", usedByEntitlements: 0 },
];

const mockHakAksesData: HakAkses[] = [
  { id: "1", name: "Lihat Portfolio", key: "portfolio.view", objectType: "fitur", objectName: "Portfolio", kategoriAksi: "view", description: "Melihat halaman portfolio", status: "active", usedByMappings: 3 },
  { id: "2", name: "Buat Portfolio", key: "portfolio.create", objectType: "fitur", objectName: "Portfolio", kategoriAksi: "create", description: "Membuat portfolio baru", status: "active", usedByMappings: 2 },
  { id: "3", name: "Auto-fill Portfolio dengan AI", key: "portfolio.auto_fill.use", objectType: "sub_fitur", objectName: "Auto-fill Portfolio", kategoriAksi: "use", description: "Menggunakan fitur auto-fill AI", status: "active", usedByMappings: 1 },
  { id: "4", name: "AI Check Portfolio", key: "portfolio.ai_check.use", objectType: "sub_fitur", objectName: "AI Check Portfolio", kategoriAksi: "use", description: "Menggunakan fitur AI Check", status: "active", usedByMappings: 1 },
  { id: "5", name: "Lihat CV Generator", key: "cv_generator.view", objectType: "fitur", objectName: "CV Generator", kategoriAksi: "view", description: "Melihat halaman CV Generator", status: "active", usedByMappings: 3 },
];

// Helper function to generate slug from name
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .trim();
};

// Validate slug
const validateSlug = (slug: string): { valid: boolean; message: string } => {
  if (!slug) return { valid: false, message: "Slug wajib diisi." };
  if (/\s/.test(slug)) return { valid: false, message: "Slug harus huruf kecil tanpa spasi. Contoh: portfolio_builder." };
  if (/-/.test(slug)) return { valid: false, message: "Gunakan underscore, bukan dash (-). Contoh: portfolio_builder." };
  if (/[^a-z0-9_]/.test(slug)) return { valid: false, message: "Slug hanya boleh huruf kecil, angka, dan underscore." };
  if (/^[0-9]/.test(slug)) return { valid: false, message: "Slug tidak boleh diawali angka." };
  return { valid: true, message: "" };
};

export default function MembershipFiturHakAkses() {
  const [activeTab, setActiveTab] = useState<"fitur" | "hak-akses">("fitur");

  // Tab 1: Fitur & Sub Fitur state
  const [fiturData, setFiturData] = useState<Fitur[]>(mockFiturData);
  const [fiturSearch, setFiturSearch] = useState("");
  const [fiturStatusFilter, setFiturStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [expandedFitur, setExpandedFitur] = useState<string[]>([]);
  const [fiturModalOpen, setFiturModalOpen] = useState(false);
  const [subFiturModalOpen, setSubFiturModalOpen] = useState(false);
  const [editingFitur, setEditingFitur] = useState<Fitur | null>(null);
  const [editingSubFitur, setEditingSubFitur] = useState<{ fiturId: string; subFitur: SubFitur | null }>({ fiturId: "", subFitur: null });
  
  // Form states for Fitur
  const [fiturForm, setFiturForm] = useState({
    name: "",
    slug: "",
    icon: "",
    description: "",
    status: "active" as "active" | "inactive",
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [slugError, setSlugError] = useState("");

  // Form states for Sub Fitur
  const [subFiturForm, setSubFiturForm] = useState({
    fiturId: "",
    name: "",
    slug: "",
    status: "active" as "active" | "inactive",
  });
  const [subFiturSlugManuallyEdited, setSubFiturSlugManuallyEdited] = useState(false);
  const [subFiturSlugError, setSubFiturSlugError] = useState("");

  // Tab 2: Kategori Aksi state
  const [kategoriAksiData, setKategoriAksiData] = useState<KategoriAksi[]>(mockKategoriAksiData);
  const [kategoriAksiCollapsed, setKategoriAksiCollapsed] = useState(false);
  const [kategoriAksiModalOpen, setKategoriAksiModalOpen] = useState(false);
  const [editingKategoriAksi, setEditingKategoriAksi] = useState<KategoriAksi | null>(null);
  const [kategoriAksiForm, setKategoriAksiForm] = useState({
    name: "",
    slug: "",
    description: "",
    status: "active" as "active" | "inactive",
  });
  const [kategoriSlugManuallyEdited, setKategoriSlugManuallyEdited] = useState(false);
  const [kategoriSlugError, setKategoriSlugError] = useState("");

  // Tab 2: Hak Akses state
  const [hakAksesData, setHakAksesData] = useState<HakAkses[]>(mockHakAksesData);
  const [hakAksesSearch, setHakAksesSearch] = useState("");
  const [hakAksesStatusFilter, setHakAksesStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [hakAksesObjectFilter, setHakAksesObjectFilter] = useState<"all" | "fitur" | "sub_fitur">("all");
  const [hakAksesFiturFilter, setHakAksesFiturFilter] = useState<string>("all");
  const [hakAksesKategoriFilter, setHakAksesKategoriFilter] = useState<string>("all");
  const [hakAksesModalOpen, setHakAksesModalOpen] = useState(false);
  const [editingHakAkses, setEditingHakAkses] = useState<HakAkses | null>(null);
  const [hakAksesForm, setHakAksesForm] = useState({
    objectType: "fitur" as "fitur" | "sub_fitur",
    fiturId: "",
    subFiturId: "",
    kategoriAksiId: "",
    name: "",
    description: "",
    status: "active" as "active" | "inactive",
  });
  const [hakAksesConfirmChecked, setHakAksesConfirmChecked] = useState(false);

  // Filter fitur data
  const filteredFiturData = fiturData.filter((fitur) => {
    const matchesSearch = fitur.name.toLowerCase().includes(fiturSearch.toLowerCase()) ||
      fitur.slug.toLowerCase().includes(fiturSearch.toLowerCase());
    const matchesStatus = fiturStatusFilter === "all" || fitur.status === fiturStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter hak akses data
  const filteredHakAksesData = hakAksesData.filter((hakAkses) => {
    const matchesSearch = hakAkses.name.toLowerCase().includes(hakAksesSearch.toLowerCase()) ||
      hakAkses.key.toLowerCase().includes(hakAksesSearch.toLowerCase()) ||
      hakAkses.objectName.toLowerCase().includes(hakAksesSearch.toLowerCase());
    const matchesStatus = hakAksesStatusFilter === "all" || hakAkses.status === hakAksesStatusFilter;
    const matchesObject = hakAksesObjectFilter === "all" || hakAkses.objectType === hakAksesObjectFilter;
    const matchesFitur = hakAksesFiturFilter === "all" || hakAkses.key.startsWith(hakAksesFiturFilter);
    const matchesKategori = hakAksesKategoriFilter === "all" || hakAkses.kategoriAksi === hakAksesKategoriFilter;
    return matchesSearch && matchesStatus && matchesObject && matchesFitur && matchesKategori;
  });

  // Toggle expand row
  const toggleExpand = (id: string) => {
    setExpandedFitur((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Open add fitur modal
  const openAddFiturModal = () => {
    setEditingFitur(null);
    setFiturForm({ name: "", slug: "", icon: "", description: "", status: "active" });
    setSlugManuallyEdited(false);
    setSlugError("");
    setFiturModalOpen(true);
  };

  // Open edit fitur modal
  const openEditFiturModal = (fitur: Fitur) => {
    setEditingFitur(fitur);
    setFiturForm({
      name: fitur.name,
      slug: fitur.slug,
      icon: fitur.icon,
      description: fitur.description,
      status: fitur.status,
    });
    setSlugManuallyEdited(true);
    setSlugError("");
    setFiturModalOpen(true);
  };

  // Handle fitur name change with auto-slug
  const handleFiturNameChange = (name: string) => {
    setFiturForm((prev) => ({ ...prev, name }));
    if (!slugManuallyEdited) {
      const autoSlug = generateSlug(name);
      setFiturForm((prev) => ({ ...prev, slug: autoSlug }));
      const validation = validateSlug(autoSlug);
      setSlugError(validation.valid ? "" : validation.message);
    }
  };

  // Handle fitur slug change
  const handleFiturSlugChange = (slug: string) => {
    setSlugManuallyEdited(true);
    setFiturForm((prev) => ({ ...prev, slug }));
    const validation = validateSlug(slug);
    setSlugError(validation.valid ? "" : validation.message);
  };

  // Save fitur
  const saveFitur = () => {
    const validation = validateSlug(fiturForm.slug);
    if (!validation.valid) {
      setSlugError(validation.message);
      return;
    }
    
    if (!fiturForm.name.trim()) {
      toast.error("Nama fitur wajib diisi");
      return;
    }

    if (editingFitur) {
      setFiturData((prev) =>
        prev.map((f) =>
          f.id === editingFitur.id
            ? { ...f, ...fiturForm }
            : f
        )
      );
      toast.success("Perubahan berhasil disimpan");
    } else {
      const newFitur: Fitur = {
        id: Date.now().toString(),
        ...fiturForm,
        subFitur: [],
        usedByEntitlements: [],
      };
      setFiturData((prev) => [...prev, newFitur]);
      toast.success("Fitur berhasil ditambahkan");
    }
    setFiturModalOpen(false);
  };

  // Open add sub fitur modal
  const openAddSubFiturModal = (fiturId: string) => {
    setEditingSubFitur({ fiturId, subFitur: null });
    setSubFiturForm({ fiturId, name: "", slug: "", status: "active" });
    setSubFiturSlugManuallyEdited(false);
    setSubFiturSlugError("");
    setSubFiturModalOpen(true);
  };

  // Open edit sub fitur modal
  const openEditSubFiturModal = (fiturId: string, subFitur: SubFitur) => {
    setEditingSubFitur({ fiturId, subFitur });
    setSubFiturForm({
      fiturId,
      name: subFitur.name,
      slug: subFitur.slug,
      status: subFitur.status,
    });
    setSubFiturSlugManuallyEdited(true);
    setSubFiturSlugError("");
    setSubFiturModalOpen(true);
  };

  // Handle sub fitur name change with auto-slug
  const handleSubFiturNameChange = (name: string) => {
    setSubFiturForm((prev) => ({ ...prev, name }));
    if (!subFiturSlugManuallyEdited) {
      const autoSlug = generateSlug(name);
      setSubFiturForm((prev) => ({ ...prev, slug: autoSlug }));
      const validation = validateSlug(autoSlug);
      setSubFiturSlugError(validation.valid ? "" : validation.message);
    }
  };

  // Handle sub fitur slug change
  const handleSubFiturSlugChange = (slug: string) => {
    setSubFiturSlugManuallyEdited(true);
    setSubFiturForm((prev) => ({ ...prev, slug }));
    const validation = validateSlug(slug);
    setSubFiturSlugError(validation.valid ? "" : validation.message);
  };

  // Get fitur slug by id
  const getFiturSlugById = (fiturId: string) => {
    const fitur = fiturData.find((f) => f.id === fiturId);
    return fitur?.slug || "";
  };

  // Save sub fitur
  const saveSubFitur = () => {
    const validation = validateSlug(subFiturForm.slug);
    if (!validation.valid) {
      setSubFiturSlugError(validation.message);
      return;
    }

    if (!subFiturForm.name.trim()) {
      toast.error("Nama sub fitur wajib diisi");
      return;
    }

    if (editingSubFitur.subFitur) {
      setFiturData((prev) =>
        prev.map((f) =>
          f.id === editingSubFitur.fiturId
            ? {
                ...f,
                subFitur: f.subFitur.map((sf) =>
                  sf.id === editingSubFitur.subFitur!.id
                    ? { ...sf, name: subFiturForm.name, slug: subFiturForm.slug, status: subFiturForm.status }
                    : sf
                ),
              }
            : f
        )
      );
      toast.success("Perubahan berhasil disimpan");
    } else {
      const newSubFitur: SubFitur = {
        id: Date.now().toString(),
        name: subFiturForm.name,
        slug: subFiturForm.slug,
        status: subFiturForm.status,
      };
      setFiturData((prev) =>
        prev.map((f) =>
          f.id === subFiturForm.fiturId
            ? { ...f, subFitur: [...f.subFitur, newSubFitur] }
            : f
        )
      );
      toast.success("Sub fitur berhasil ditambahkan");
    }
    setSubFiturModalOpen(false);
  };

  // Kategori Aksi handlers
  const openAddKategoriAksiModal = () => {
    setEditingKategoriAksi(null);
    setKategoriAksiForm({ name: "", slug: "", description: "", status: "active" });
    setKategoriSlugManuallyEdited(false);
    setKategoriSlugError("");
    setKategoriAksiModalOpen(true);
  };

  const openEditKategoriAksiModal = (kategori: KategoriAksi) => {
    setEditingKategoriAksi(kategori);
    setKategoriAksiForm({
      name: kategori.name,
      slug: kategori.slug,
      description: kategori.description,
      status: kategori.status,
    });
    setKategoriSlugManuallyEdited(true);
    setKategoriSlugError("");
    setKategoriAksiModalOpen(true);
  };

  const handleKategoriNameChange = (name: string) => {
    setKategoriAksiForm((prev) => ({ ...prev, name }));
    if (!kategoriSlugManuallyEdited) {
      const autoSlug = generateSlug(name);
      setKategoriAksiForm((prev) => ({ ...prev, slug: autoSlug }));
      const validation = validateSlug(autoSlug);
      setKategoriSlugError(validation.valid ? "" : validation.message);
    }
  };

  const handleKategoriSlugChange = (slug: string) => {
    setKategoriSlugManuallyEdited(true);
    setKategoriAksiForm((prev) => ({ ...prev, slug }));
    const validation = validateSlug(slug);
    setKategoriSlugError(validation.valid ? "" : validation.message);
  };

  const saveKategoriAksi = () => {
    const validation = validateSlug(kategoriAksiForm.slug);
    if (!validation.valid) {
      setKategoriSlugError(validation.message);
      return;
    }

    if (!kategoriAksiForm.name.trim()) {
      toast.error("Nama kategori aksi wajib diisi");
      return;
    }

    if (editingKategoriAksi) {
      setKategoriAksiData((prev) =>
        prev.map((k) =>
          k.id === editingKategoriAksi.id
            ? { ...k, ...kategoriAksiForm }
            : k
        )
      );
      toast.success("Perubahan berhasil disimpan");
    } else {
      const newKategori: KategoriAksi = {
        id: Date.now().toString(),
        ...kategoriAksiForm,
        usedByEntitlements: 0,
      };
      setKategoriAksiData((prev) => [...prev, newKategori]);
      toast.success("Kategori aksi berhasil ditambahkan");
    }
    setKategoriAksiModalOpen(false);
  };

  // Hak Akses handlers
  const openAddHakAksesModal = () => {
    const activeKategori = kategoriAksiData.filter((k) => k.status === "active");
    if (activeKategori.length === 0) {
      toast.error("Tambahkan kategori aksi terlebih dahulu.");
      return;
    }
    setEditingHakAkses(null);
    setHakAksesForm({
      objectType: "fitur",
      fiturId: "",
      subFiturId: "",
      kategoriAksiId: "",
      name: "",
      description: "",
      status: "active",
    });
    setHakAksesConfirmChecked(false);
    setHakAksesModalOpen(true);
  };

  const openEditHakAksesModal = (hakAkses: HakAkses) => {
    setEditingHakAkses(hakAkses);
    // Find the fitur and sub fitur IDs
    const parts = hakAkses.key.split(".");
    const fitur = fiturData.find((f) => f.slug === parts[0]);
    let subFitur: SubFitur | undefined;
    if (hakAkses.objectType === "sub_fitur" && fitur && parts.length > 2) {
      subFitur = fitur.subFitur.find((sf) => sf.slug === parts[1]);
    }
    
    setHakAksesForm({
      objectType: hakAkses.objectType,
      fiturId: fitur?.id || "",
      subFiturId: subFitur?.id || "",
      kategoriAksiId: kategoriAksiData.find((k) => k.slug === hakAkses.kategoriAksi)?.id || "",
      name: hakAkses.name,
      description: hakAkses.description,
      status: hakAkses.status,
    });
    setHakAksesConfirmChecked(false);
    setHakAksesModalOpen(true);
  };

  // Generate hak akses key preview
  const getHakAksesKeyPreview = () => {
    const fitur = fiturData.find((f) => f.id === hakAksesForm.fiturId);
    if (!fitur) return "";
    
    const kategori = kategoriAksiData.find((k) => k.id === hakAksesForm.kategoriAksiId);
    if (!kategori) return "";

    if (hakAksesForm.objectType === "fitur") {
      return `${fitur.slug}.${kategori.slug}`;
    } else {
      const subFitur = fitur.subFitur.find((sf) => sf.id === hakAksesForm.subFiturId);
      if (!subFitur) return "";
      return `${fitur.slug}.${subFitur.slug}.${kategori.slug}`;
    }
  };

  const saveHakAkses = () => {
    if (!hakAksesForm.fiturId || !hakAksesForm.kategoriAksiId || !hakAksesForm.name.trim()) {
      toast.error("Lengkapi semua field yang wajib diisi");
      return;
    }

    if (hakAksesForm.objectType === "sub_fitur" && !hakAksesForm.subFiturId) {
      toast.error("Pilih sub fitur");
      return;
    }

    const key = getHakAksesKeyPreview();
    const fitur = fiturData.find((f) => f.id === hakAksesForm.fiturId);
    const kategori = kategoriAksiData.find((k) => k.id === hakAksesForm.kategoriAksiId);

    if (editingHakAkses) {
      if (editingHakAkses.usedByMappings > 0 && !hakAksesConfirmChecked) {
        toast.error("Centang konfirmasi untuk menyimpan perubahan");
        return;
      }
      setHakAksesData((prev) =>
        prev.map((h) =>
          h.id === editingHakAkses.id
            ? {
                ...h,
                name: hakAksesForm.name,
                key,
                objectType: hakAksesForm.objectType,
                objectName: hakAksesForm.objectType === "fitur" 
                  ? fitur!.name 
                  : fitur!.subFitur.find((sf) => sf.id === hakAksesForm.subFiturId)?.name || "",
                kategoriAksi: kategori!.slug,
                description: hakAksesForm.description,
                status: hakAksesForm.status,
              }
            : h
        )
      );
      toast.success("Perubahan berhasil disimpan");
    } else {
      const newHakAkses: HakAkses = {
        id: Date.now().toString(),
        name: hakAksesForm.name,
        key,
        objectType: hakAksesForm.objectType,
        objectName: hakAksesForm.objectType === "fitur"
          ? fitur!.name
          : fitur!.subFitur.find((sf) => sf.id === hakAksesForm.subFiturId)?.name || "",
        kategoriAksi: kategori!.slug,
        description: hakAksesForm.description,
        status: hakAksesForm.status,
        usedByMappings: 0,
      };
      setHakAksesData((prev) => [...prev, newHakAkses]);
      toast.success("Hak akses berhasil ditambahkan");
    }
    setHakAksesModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fitur & Hak Akses</h1>
          <p className="text-muted-foreground mt-1">
            Kelola master fitur, sub fitur, dan hak akses untuk konfigurasi membership.
          </p>
        </div>

        {/* Tab Menu */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab("fitur")}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === "fitur"
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >
            Fitur & Sub Fitur
          </button>
          <button
            onClick={() => setActiveTab("hak-akses")}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === "hak-akses"
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >
            Hak Akses
          </button>
        </div>

        {/* Tab Content: Fitur & Sub Fitur */}
        {activeTab === "fitur" && (
          <div className="space-y-6">
            {/* Section Header */}
            <div>
              <h2 className="text-lg font-semibold">Fitur & Sub Fitur</h2>
              <p className="text-sm text-muted-foreground">
                Kelola master fitur dan sub fitur sebagai dasar pembentukan entitlement/hak akses.
              </p>
            </div>

            {/* Callout */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200">Catatan Penting</p>
                  <ul className="list-disc list-inside text-amber-700 dark:text-amber-300 space-y-1">
                    <li>Data fitur & sub fitur akan menjadi referensi pada Tab Hak Akses untuk membentuk entitlement.</li>
                    <li>Data ini juga menjadi referensi pada halaman konfigurasi akses membership untuk mapping entitlement ke paket.</li>
                    <li>Nama dan slug harus konsisten dan tidak diubah sembarangan karena berdampak langsung pada struktur hak akses.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari fitur berdasarkan nama atau slug…"
                  value={fiturSearch}
                  onChange={(e) => setFiturSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={fiturStatusFilter} onValueChange={(v) => setFiturStatusFilter(v as typeof fiturStatusFilter)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={openAddFiturModal}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Fitur
              </Button>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="w-[60px]">Ikon</TableHead>
                    <TableHead>Nama Fitur</TableHead>
                    <TableHead>Slug Fitur</TableHead>
                    <TableHead className="text-center">Sub Fitur</TableHead>
                    <TableHead className="text-center">Digunakan</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="w-[80px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiturData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="space-y-3">
                          <p className="text-muted-foreground">Belum ada fitur</p>
                          <Button variant="outline" size="sm" onClick={openAddFiturModal}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Fitur
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFiturData.map((fitur) => (
                      <>
                        <TableRow key={fitur.id} className="group">
                          <TableCell>
                            <button
                              onClick={() => toggleExpand(fitur.id)}
                              className="p-1 hover:bg-muted rounded"
                            >
                              {expandedFitur.includes(fitur.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </TableCell>
                          <TableCell>
                            <span className="text-xl">{fitur.icon || "—"}</span>
                          </TableCell>
                          <TableCell className="font-medium">{fitur.name}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                              {fitur.slug}
                            </code>
                          </TableCell>
                          <TableCell className="text-center">{fitur.subFitur.length}</TableCell>
                          <TableCell className="text-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help underline decoration-dotted">
                                  {fitur.usedByEntitlements.length} entitlements
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="font-medium mb-1">Entitlements:</p>
                                <ul className="text-xs space-y-0.5">
                                  {fitur.usedByEntitlements.slice(0, 5).map((e) => (
                                    <li key={e}>{e}</li>
                                  ))}
                                  {fitur.usedByEntitlements.length > 5 && (
                                    <li className="text-muted-foreground">
                                      +{fitur.usedByEntitlements.length - 5} lainnya
                                    </li>
                                  )}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={fitur.status === "active" ? "default" : "secondary"}>
                              {fitur.status === "active" ? "Aktif" : "Nonaktif"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditFiturModal(fitur)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        {/* Expanded Sub Fitur Panel */}
                        {expandedFitur.includes(fitur.id) && (
                          <TableRow>
                            <TableCell colSpan={8} className="bg-muted/30 p-0">
                              <div className="p-4 pl-12">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-sm font-medium">Sub Fitur</h4>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openAddSubFiturModal(fitur.id)}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Sub Fitur
                                  </Button>
                                </div>
                                {fitur.subFitur.length === 0 ? (
                                  <div className="text-center py-6 bg-background rounded-lg border border-dashed">
                                    <p className="font-medium text-sm">Belum ada sub fitur</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Sub fitur membantu membentuk struktur akses yang lebih spesifik.
                                    </p>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="mt-3"
                                      onClick={() => openAddSubFiturModal(fitur.id)}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Tambah Sub Fitur Pertama
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="border rounded-lg overflow-hidden bg-background">
                                    <Table>
                                      <TableHeader>
                                        <TableRow className="bg-muted/50">
                                          <TableHead>Nama Sub Fitur</TableHead>
                                          <TableHead>Slug Sub Fitur</TableHead>
                                          <TableHead>Preview Key</TableHead>
                                          <TableHead className="text-center">Status</TableHead>
                                          <TableHead className="w-[80px]">Aksi</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {fitur.subFitur.map((sf) => (
                                          <TableRow key={sf.id}>
                                            <TableCell className="font-medium">{sf.name}</TableCell>
                                            <TableCell>
                                              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                                {sf.slug}
                                              </code>
                                            </TableCell>
                                            <TableCell>
                                              <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                                                {fitur.slug}.{sf.slug}
                                              </code>
                                            </TableCell>
                                            <TableCell className="text-center">
                                              <Badge variant={sf.status === "active" ? "default" : "secondary"}>
                                                {sf.status === "active" ? "Aktif" : "Nonaktif"}
                                              </Badge>
                                            </TableCell>
                                            <TableCell>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditSubFiturModal(fitur.id, sf)}
                                              >
                                                <Edit className="h-4 w-4" />
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Tab Content: Hak Akses */}
        {activeTab === "hak-akses" && (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-lg font-semibold">Hak Akses Fitur</h2>
              <p className="text-sm text-muted-foreground">
                Kelola master entitlement sebagai dasar penyusunan hak akses dan konfigurasi membership.
              </p>
            </div>

            {/* Callout */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200">Catatan Penting</p>
                  <ul className="list-disc list-inside text-amber-700 dark:text-amber-300 space-y-1">
                    <li>Kategori aksi adalah standar aksi yang dipakai saat membentuk entitlement.</li>
                    <li>Entitlement dibentuk dari kombinasi objek (Fitur/Sub Fitur) dan kategori aksi.</li>
                    <li>Perubahan slug pada kategori aksi atau entitlement yang sudah digunakan dapat mempengaruhi konsistensi aturan akses.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 1: Kategori Aksi */}
            <Collapsible open={!kategoriAksiCollapsed} onOpenChange={(open) => setKategoriAksiCollapsed(!open)}>
              <div className="border rounded-lg">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {kategoriAksiCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <h3 className="font-semibold">Kategori Aksi</h3>
                      <span className="text-sm text-muted-foreground">
                        ({kategoriAksiData.length} kategori)
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddKategoriAksiModal();
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Tambah Kategori
                    </Button>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t p-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Kelola daftar kategori aksi sebagai standar penamaan aksi pada hak akses.
                    </p>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead>Nama Kategori</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead className="text-center">Digunakan</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="w-[80px]">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {kategoriAksiData.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                <p className="text-muted-foreground">Belum ada kategori aksi</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={openAddKategoriAksiModal}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Tambah Kategori
                                </Button>
                              </TableCell>
                            </TableRow>
                          ) : (
                            kategoriAksiData.map((kategori) => (
                              <TableRow key={kategori.id}>
                                <TableCell className="font-medium">{kategori.name}</TableCell>
                                <TableCell>
                                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                    {kategori.slug}
                                  </code>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                                  {kategori.description || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                  {kategori.usedByEntitlements} entitlements
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant={kategori.status === "active" ? "default" : "secondary"}>
                                    {kategori.status === "active" ? "Aktif" : "Nonaktif"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openEditKategoriAksiModal(kategori)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Section 2: Master Hak Akses */}
            <div className="space-y-4">
              <h3 className="font-semibold">Master Hak Akses</h3>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama hak akses, key, fitur, atau sub fitur…"
                    value={hakAksesSearch}
                    onChange={(e) => setHakAksesSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={hakAksesStatusFilter} onValueChange={(v) => setHakAksesStatusFilter(v as typeof hakAksesStatusFilter)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={hakAksesObjectFilter} onValueChange={(v) => setHakAksesObjectFilter(v as typeof hakAksesObjectFilter)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Objek Kontrol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Objek</SelectItem>
                    <SelectItem value="fitur">Berbasis Fitur</SelectItem>
                    <SelectItem value="sub_fitur">Berbasis Sub Fitur</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={hakAksesFiturFilter} onValueChange={setHakAksesFiturFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Fitur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Fitur</SelectItem>
                    {fiturData.map((f) => (
                      <SelectItem key={f.id} value={f.slug}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={hakAksesKategoriFilter} onValueChange={setHakAksesKategoriFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Kategori Aksi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {kategoriAksiData.filter((k) => k.status === "active").map((k) => (
                      <SelectItem key={k.id} value={k.slug}>{k.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={openAddHakAksesModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Hak Akses
                </Button>
              </div>

              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Nama Hak Akses</TableHead>
                      <TableHead>Key Hak Akses</TableHead>
                      <TableHead>Objek</TableHead>
                      <TableHead>Kategori Aksi</TableHead>
                      <TableHead className="text-center">Digunakan</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="w-[80px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHakAksesData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="space-y-3">
                            <p className="text-muted-foreground">Belum ada hak akses</p>
                            <p className="text-sm text-muted-foreground">
                              Tambahkan hak akses untuk dapat dipetakan ke paket membership.
                            </p>
                            <Button variant="outline" size="sm" onClick={openAddHakAksesModal}>
                              <Plus className="h-4 w-4 mr-2" />
                              Tambah Hak Akses
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredHakAksesData.map((hakAkses) => (
                        <TableRow key={hakAkses.id}>
                          <TableCell className="font-medium">{hakAkses.name}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                              {hakAkses.key}
                            </code>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {hakAkses.objectType === "fitur" ? "Fitur" : "Sub Fitur"}: {hakAkses.objectName}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{hakAkses.kategoriAksi}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {hakAkses.usedByMappings} mapping
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={hakAkses.status === "active" ? "default" : "secondary"}>
                              {hakAkses.status === "active" ? "Aktif" : "Nonaktif"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditHakAksesModal(hakAkses)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Tambah/Edit Fitur */}
      <Dialog open={fiturModalOpen} onOpenChange={setFiturModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingFitur ? "Edit Fitur" : "Tambah Fitur Baru"}</DialogTitle>
            <DialogDescription>
              Fitur digunakan sebagai induk sub fitur dan dasar pembentukan kode hak akses.
              <br />
              Slug akan menjadi bagian dari kode hak akses, contoh: portfolio.view, portfolio.create.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Fitur *</Label>
              <Input
                placeholder="Portofolio"
                value={fiturForm.name}
                onChange={(e) => handleFiturNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug Fitur *</Label>
              <Input
                placeholder="portfolio"
                value={fiturForm.slug}
                onChange={(e) => handleFiturSlugChange(e.target.value)}
                className={cn("font-mono", slugError && "border-destructive")}
              />
              {slugError && (
                <p className="text-xs text-destructive">{slugError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Ikon (emoji)</Label>
              <Input
                placeholder="📁"
                value={fiturForm.icon}
                onChange={(e) => setFiturForm((prev) => ({ ...prev, icon: e.target.value }))}
                maxLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                placeholder="Dokumentasi kegiatan dan prestasi."
                value={fiturForm.description}
                onChange={(e) => setFiturForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Status *</Label>
              <RadioGroup
                value={fiturForm.status}
                onValueChange={(v) => setFiturForm((prev) => ({ ...prev, status: v as "active" | "inactive" }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="fitur-active" />
                  <Label htmlFor="fitur-active" className="cursor-pointer">Aktif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive" id="fitur-inactive" />
                  <Label htmlFor="fitur-inactive" className="cursor-pointer">Nonaktif</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFiturModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={saveFitur}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Tambah/Edit Sub Fitur */}
      <Dialog open={subFiturModalOpen} onOpenChange={setSubFiturModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSubFitur.subFitur ? "Edit Sub Fitur" : "Tambah Sub Fitur"}
            </DialogTitle>
            <DialogDescription>
              Sub fitur akan menjadi bagian dari kode hak akses yang lebih spesifik.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fitur Induk *</Label>
              <Select
                value={subFiturForm.fiturId}
                onValueChange={(v) => setSubFiturForm((prev) => ({ ...prev, fiturId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih fitur induk" />
                </SelectTrigger>
                <SelectContent>
                  {fiturData.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nama Sub Fitur *</Label>
              <Input
                placeholder="Auto-fill Portofolio"
                value={subFiturForm.name}
                onChange={(e) => handleSubFiturNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug Sub Fitur *</Label>
              <Input
                placeholder="auto_fill"
                value={subFiturForm.slug}
                onChange={(e) => handleSubFiturSlugChange(e.target.value)}
                className={cn("font-mono", subFiturSlugError && "border-destructive")}
              />
              {subFiturSlugError && (
                <p className="text-xs text-destructive">{subFiturSlugError}</p>
              )}
            </div>
            {/* Preview Key */}
            {subFiturForm.fiturId && subFiturForm.slug && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Preview kode hak akses:</p>
                <code className="text-sm font-mono text-primary">
                  {getFiturSlugById(subFiturForm.fiturId)}.{subFiturForm.slug}
                </code>
                <p className="text-xs text-muted-foreground mt-1">(Fitur induk + sub fitur)</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Status *</Label>
              <RadioGroup
                value={subFiturForm.status}
                onValueChange={(v) => setSubFiturForm((prev) => ({ ...prev, status: v as "active" | "inactive" }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="subfitur-active" />
                  <Label htmlFor="subfitur-active" className="cursor-pointer">Aktif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive" id="subfitur-inactive" />
                  <Label htmlFor="subfitur-inactive" className="cursor-pointer">Nonaktif</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubFiturModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={saveSubFitur}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Tambah/Edit Kategori Aksi */}
      <Dialog open={kategoriAksiModalOpen} onOpenChange={setKategoriAksiModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingKategoriAksi ? "Edit Kategori Aksi" : "Tambah Kategori Aksi"}
            </DialogTitle>
            <DialogDescription>
              Kategori aksi akan digunakan sebagai standar pilihan aksi pada pembuatan hak akses.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {editingKategoriAksi && editingKategoriAksi.usedByEntitlements > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Kategori ini digunakan oleh {editingKategoriAksi.usedByEntitlements} entitlement. 
                    Mengubah slug akan mempengaruhi kode hak akses yang sudah ada.
                  </p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Nama Kategori *</Label>
              <Input
                placeholder="Tampilan"
                value={kategoriAksiForm.name}
                onChange={(e) => handleKategoriNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input
                placeholder="view"
                value={kategoriAksiForm.slug}
                onChange={(e) => handleKategoriSlugChange(e.target.value)}
                className={cn("font-mono", kategoriSlugError && "border-destructive")}
              />
              {kategoriSlugError && (
                <p className="text-xs text-destructive">{kategoriSlugError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                placeholder="Akses untuk melihat data atau halaman"
                value={kategoriAksiForm.description}
                onChange={(e) => setKategoriAksiForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Status *</Label>
              <RadioGroup
                value={kategoriAksiForm.status}
                onValueChange={(v) => setKategoriAksiForm((prev) => ({ ...prev, status: v as "active" | "inactive" }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="kategori-active" />
                  <Label htmlFor="kategori-active" className="cursor-pointer">Aktif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive" id="kategori-inactive" />
                  <Label htmlFor="kategori-inactive" className="cursor-pointer">Nonaktif</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setKategoriAksiModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={saveKategoriAksi}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drawer: Tambah/Edit Hak Akses */}
      <Sheet open={hakAksesModalOpen} onOpenChange={setHakAksesModalOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <SheetTitle>
              {editingHakAkses ? "Edit Hak Akses" : "Tambah Hak Akses"}
            </SheetTitle>
            <SheetDescription>
              Hak akses dibentuk dari kombinasi objek (Fitur/Sub Fitur) dan kategori aksi.
              Pastikan pilihan benar karena akan menjadi key entitlement.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-6">
            {editingHakAkses && editingHakAkses.usedByMappings > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Hak akses ini sudah digunakan pada {editingHakAkses.usedByMappings} mapping. 
                    Perubahan key dapat mempengaruhi konfigurasi paket membership.
                  </p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Tipe Objek *</Label>
              <RadioGroup
                value={hakAksesForm.objectType}
                onValueChange={(v) => setHakAksesForm((prev) => ({ 
                  ...prev, 
                  objectType: v as "fitur" | "sub_fitur",
                  subFiturId: "" 
                }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fitur" id="obj-fitur" />
                  <Label htmlFor="obj-fitur" className="cursor-pointer">Berbasis Fitur</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sub_fitur" id="obj-subfitur" />
                  <Label htmlFor="obj-subfitur" className="cursor-pointer">Berbasis Sub Fitur</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Fitur Induk *</Label>
              <Select
                value={hakAksesForm.fiturId}
                onValueChange={(v) => setHakAksesForm((prev) => ({ ...prev, fiturId: v, subFiturId: "" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih fitur" />
                </SelectTrigger>
                <SelectContent>
                  {fiturData.filter((f) => f.status === "active").map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hakAksesForm.objectType === "sub_fitur" && hakAksesForm.fiturId && (
              <div className="space-y-2">
                <Label>Sub Fitur *</Label>
                <Select
                  value={hakAksesForm.subFiturId}
                  onValueChange={(v) => setHakAksesForm((prev) => ({ ...prev, subFiturId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sub fitur" />
                  </SelectTrigger>
                  <SelectContent>
                    {fiturData
                      .find((f) => f.id === hakAksesForm.fiturId)
                      ?.subFitur.filter((sf) => sf.status === "active")
                      .map((sf) => (
                        <SelectItem key={sf.id} value={sf.id}>{sf.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Kategori Aksi *</Label>
              <Select
                value={hakAksesForm.kategoriAksiId}
                onValueChange={(v) => setHakAksesForm((prev) => ({ ...prev, kategoriAksiId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori aksi" />
                </SelectTrigger>
                <SelectContent>
                  {kategoriAksiData.filter((k) => k.status === "active").map((k) => (
                    <SelectItem key={k.id} value={k.id}>{k.name} ({k.slug})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Preview Key */}
            {getHakAksesKeyPreview() && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Preview Key Hak Akses:</p>
                <code className="text-sm font-mono text-primary font-semibold">
                  {getHakAksesKeyPreview()}
                </code>
              </div>
            )}
            <div className="space-y-2">
              <Label>Nama Hak Akses *</Label>
              <Input
                placeholder="Auto-fill Portfolio dengan AI"
                value={hakAksesForm.name}
                onChange={(e) => setHakAksesForm((prev) => ({ ...prev, name: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Nama ini akan ditampilkan di UI untuk user</p>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                placeholder="Menggunakan fitur auto-fill AI untuk mengisi portfolio"
                value={hakAksesForm.description}
                onChange={(e) => setHakAksesForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Status *</Label>
              <RadioGroup
                value={hakAksesForm.status}
                onValueChange={(v) => setHakAksesForm((prev) => ({ ...prev, status: v as "active" | "inactive" }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="hakakses-active" />
                  <Label htmlFor="hakakses-active" className="cursor-pointer">Aktif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive" id="hakakses-inactive" />
                  <Label htmlFor="hakakses-inactive" className="cursor-pointer">Nonaktif</Label>
                </div>
              </RadioGroup>
            </div>
            {editingHakAkses && editingHakAkses.usedByMappings > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirm-change"
                  checked={hakAksesConfirmChecked}
                  onCheckedChange={(checked) => setHakAksesConfirmChecked(checked as boolean)}
                />
                <Label htmlFor="confirm-change" className="text-sm cursor-pointer">
                  Saya memahami dampak perubahan ini
                </Label>
              </div>
            )}
          </div>
          <SheetFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setHakAksesModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={saveHakAkses}>Simpan</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
