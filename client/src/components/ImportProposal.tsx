import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileJson } from "lucide-react";
import { toast } from "sonner";

interface ImportProposalProps {
  onImport: (proposal: any) => void;
}

export default function ImportProposal({ onImport }: ImportProposalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const proposal = JSON.parse(content);

        // Validar estructura básica
        if (!proposal.name || !proposal.sites || !proposal.totalUsers) {
          toast.error("Formato de propuesta inválido");
          return;
        }

        onImport(proposal);
        toast.success("Propuesta importada correctamente");
      } catch (error) {
        toast.error("Error al cargar el archivo. Asegúrate que sea un JSON válido");
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const proposal = JSON.parse(content);

        if (!proposal.name || !proposal.sites || !proposal.totalUsers) {
          toast.error("Formato de propuesta inválido");
          return;
        }

        onImport(proposal);
        toast.success("Propuesta importada correctamente");
      } catch (error) {
        toast.error("Error al cargar el archivo. Asegúrate que sea un JSON válido");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cargar Propuesta</CardTitle>
        <CardDescription>
          Importa una propuesta guardada en formato JSON
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drag and Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileJson className="w-12 h-12 mx-auto mb-3 text-slate-400" />
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
            Arrastra tu archivo JSON aquí
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            o haz clic para seleccionar un archivo
          </p>
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="w-4 h-4" />
            Seleccionar Archivo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Info */}
        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-200 mb-2">
            <strong>Formatos soportados:</strong>
          </p>
          <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
            <li>• Archivos JSON (.json) exportados desde esta aplicación</li>
            <li>• Archivos con estructura de propuesta válida</li>
            <li>• Propuestas guardadas anteriormente</li>
          </ul>
        </div>

        {/* Example */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200 font-semibold mb-2">
            Estructura esperada del JSON:
          </p>
          <pre className="text-xs bg-white dark:bg-slate-900 p-2 rounded overflow-x-auto text-blue-900 dark:text-blue-100">
{`{
  "name": "Propuesta de Red",
  "sites": [
    {"id": "1", "name": "Sede 1", "users": 100}
  ],
  "totalUsers": 100,
  "createdAt": "2026-02-20T...",
  "calculations": {
    "vlan": [...],
    "bandwidth": [...]
  }
}`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
