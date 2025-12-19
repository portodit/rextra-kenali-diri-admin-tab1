import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExportDataDialog } from "@/components/ExportDataDialog";
import { BulkDeleteDialog } from "@/components/BulkDeleteDialog";
import { Download, FileSpreadsheet, Users, BarChart3, Trash2 } from "lucide-react";

const Index = () => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <FileSpreadsheet className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Kenali Diri</h1>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            <nav className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Mahasiswa
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Laporan
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground">Riwayat Tes Mahasiswa</h2>
          <p className="text-muted-foreground mt-1">
            Kelola dan ekspor data hasil tes mahasiswa pada fitur Kenali Diri
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-xl border border-border bg-card p-6 shadow-custom-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Peserta</p>
                <p className="text-2xl font-semibold text-foreground">1,248</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-custom-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <BarChart3 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tes Selesai</p>
                <p className="text-2xl font-semibold text-foreground">956</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-custom-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <FileSpreadsheet className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sedang Berjalan</p>
                <p className="text-2xl font-semibold text-foreground">292</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {/* Export Card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-custom-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Ekspor Data</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Unduh data hasil tes dalam format spreadsheet
                </p>
              </div>
              <Button onClick={() => setExportDialogOpen(true)} className="gap-2 shrink-0">
                <Download className="h-4 w-4" />
                Ekspor Data
              </Button>
            </div>
          </div>

          {/* Bulk Delete Card */}
          <div className="rounded-xl border border-destructive/20 bg-card p-6 shadow-custom-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Hapus Data Massal</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Hapus banyak data hasil tes sekaligus
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setBulkDeleteDialogOpen(true)} 
                className="gap-2 shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Massal
              </Button>
            </div>
          </div>
        </div>

        {/* Sample Table Preview */}
        <div className="mt-6 rounded-xl border border-border bg-card shadow-custom-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Data Terbaru</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Nama Mahasiswa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    NIM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Kategori Tes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: "Budi Santoso", nim: "2021001", category: "Tes Profil Karier", status: "Selesai", date: "18 Des 2025" },
                  { name: "Siti Rahayu", nim: "2021042", category: "Tes Profil Karier", status: "Selesai", date: "18 Des 2025" },
                  { name: "Ahmad Wijaya", nim: "2021089", category: "Tes Profil Karier", status: "Sedang Berjalan", date: "17 Des 2025" },
                  { name: "Dewi Lestari", nim: "2021015", category: "Tes Profil Karier", status: "Selesai", date: "17 Des 2025" },
                  { name: "Rizky Pratama", nim: "2021067", category: "Tes Profil Karier", status: "Dihentikan", date: "16 Des 2025" },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {item.nim}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {item.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "Selesai" 
                          ? "bg-success/10 text-success" 
                          : item.status === "Sedang Berjalan"
                          ? "bg-warning/10 text-warning"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Export Dialog */}
      <ExportDataDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} />
      
      {/* Bulk Delete Dialog */}
      <BulkDeleteDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen} dataCount={2000} />
    </div>
  );
};

export default Index;
