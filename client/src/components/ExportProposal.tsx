import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileJson, FileText, Download } from "lucide-react";
import { toast } from "sonner";

interface ExportProposalProps {
  proposal: any;
}

export default function ExportProposal({ proposal }: ExportProposalProps) {
  const [isExporting, setIsExporting] = useState(false);

  const generateJSON = () => {
    return JSON.stringify(proposal, null, 2);
  };

  const generateCSV = () => {
    let csv = "Propuesta de Infraestructura de Red\n";
    csv += `Nombre,${proposal.name}\n`;
    csv += `Fecha,${new Date(proposal.createdAt).toLocaleDateString("es-ES")}\n`;
    csv += `Total Clientes,${proposal.totalClients || proposal.totalUsers}\n\n`;

    csv += "SEDES\n";
    csv += "Nombre,Clientes\n";
    proposal.sites?.forEach((site: any) => {
      csv += `${site.name},${site.clients || site.users}\n`;
    });
    csv += "\n";

    csv += "VLANS\n";
    csv += "VLAN ID,Área,Prioridad\n";
    proposal.calculations?.vlan?.forEach((vlan: any) => {
      csv += `${vlan.vlan},${vlan.area},${vlan.priority}\n`;
    });
    csv += "\n";

    csv += "ANCHO DE BANDA\n";
    csv += "Sede,Clientes,BW Requerido (Gbps),BW Recomendado (Gbps),BW Respaldo (Gbps)\n";
    proposal.calculations?.bandwidth?.forEach((bw: any) => {
      csv += `${bw.siteName},${bw.clients || bw.users},${bw.bwRequired},${bw.bwRecommended},${bw.bwBackup}\n`;
    });

    return csv;
  };

  const generateWord = async () => {
    try {
      // Crear HTML que se puede copiar a Word
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${proposal.name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2cm; line-height: 1.5; }
    h1 { color: #1976d2; border-bottom: 3px solid #1976d2; padding-bottom: 10px; }
    h2 { color: #1976d2; margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #e3f2fd; color: #1976d2; font-weight: bold; }
    .header { text-align: center; margin-bottom: 30px; }
    .section { margin: 20px 0; }
    .stats { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${proposal.name}</h1>
    <p><strong>Fecha:</strong> ${new Date(proposal.createdAt).toLocaleDateString("es-ES")}</p>
    <p><strong>Total de Clientes:</strong> ${proposal.totalClients || proposal.totalUsers}</p>
  </div>

  <h2>Información de Sedes</h2>
  <table>
    <tr>
      <th>Nombre de Sede</th>
      <th>Cantidad de Clientes</th>
    </tr>
    ${proposal.sites?.map((site: any) => `
    <tr>
      <td>${site.name}</td>
      <td>${site.clients || site.users}</td>
    </tr>
    `).join("")}
  </table>

  <h2>Configuración de VLANs</h2>
  <table>
    <tr>
      <th>VLAN ID</th>
      <th>Área</th>
      <th>Prioridad</th>
    </tr>
    ${proposal.calculations?.vlan?.map((vlan: any) => `
    <tr>
      <td>${vlan.vlan}</td>
      <td>${vlan.area}</td>
      <td>${vlan.priority}</td>
    </tr>
    `).join("")}
  </table>

  <h2>Cálculo de Ancho de Banda</h2>
  <table>
    <tr>
      <th>Sede</th>
      <th>Clientes</th>
      <th>BW Requerido (Gbps)</th>
      <th>BW Recomendado (Gbps)</th>
      <th>BW Respaldo (Gbps)</th>
    </tr>
    ${proposal.calculations?.bandwidth?.map((bw: any) => `
    <tr>
      <td>${bw.siteName}</td>
      <td>${bw.clients || bw.users}</td>
      <td>${bw.bwRequired}</td>
      <td>${bw.bwRecommended}</td>
      <td>${bw.bwBackup}</td>
    </tr>
    `).join("")}
  </table>

  <div class="stats">
    <h3>Resumen Ejecutivo</h3>
    <p><strong>Total de Sedes:</strong> ${proposal.sites?.length}</p>
    <p><strong>Total de Clientes:</strong> ${proposal.totalClients || proposal.totalUsers}</p>
    <p><strong>Total de VLANs:</strong> ${proposal.calculations?.vlan?.length || 0}</p>
    <p><strong>Ancho de Banda Total Recomendado:</strong> ${(proposal.calculations?.bandwidth?.reduce((sum: number, b: any) => sum + parseFloat(b.bwRecommended), 0) || 0).toFixed(2)} Gbps</p>
  </div>

  <p style="margin-top: 40px; color: #666; font-size: 12px;">
    <em>Documento generado por Calculadora de Infraestructura de Red - ${new Date().toLocaleDateString("es-ES")}</em>
  </p>
</body>
</html>
      `;

      const blob = new Blob([html], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${proposal.name.replace(/\s+/g, "-")}.doc`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Documento Word descargado");
    } catch (error) {
      toast.error("Error al generar documento Word");
    }
  };

  const handleExportJSON = () => {
    setIsExporting(true);
    try {
      const json = generateJSON();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${proposal.name.replace(/\s+/g, "-")}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Propuesta exportada a JSON");
    } catch (error) {
      toast.error("Error al exportar JSON");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const csv = generateCSV();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${proposal.name.replace(/\s+/g, "-")}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Propuesta exportada a CSV");
    } catch (error) {
      toast.error("Error al exportar CSV");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWord = () => {
    setIsExporting(true);
    try {
      generateWord();
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyJSON = () => {
    const json = generateJSON();
    navigator.clipboard.writeText(json);
    toast.success("JSON copiado al portapapeles");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar Propuesta</CardTitle>
        <CardDescription>
          Descarga tu propuesta en diferentes formatos compatibles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* JSON Export */}
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">JSON</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Formato estructurado para importar/cargar
                </p>
              </div>
              <FileJson className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportJSON}
                disabled={isExporting}
                size="sm"
                variant="outline"
                className="flex-1 gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar
              </Button>
              <Button
                onClick={handleCopyJSON}
                disabled={isExporting}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                Copiar
              </Button>
            </div>
          </div>

          {/* CSV Export */}
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">CSV</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Compatible con Excel y Google Sheets
                </p>
              </div>
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <Button
              onClick={handleExportCSV}
              disabled={isExporting}
              size="sm"
              variant="outline"
              className="w-full gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar CSV
            </Button>
          </div>

          {/* Word Export */}
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Word (.doc)</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Compatible con Microsoft Word
                </p>
              </div>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <Button
              onClick={handleExportWord}
              disabled={isExporting}
              size="sm"
              variant="outline"
              className="w-full gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar Word
            </Button>
          </div>

          {/* Text Export */}
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Texto Plano</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Formato legible en cualquier editor
                </p>
              </div>
              <FileText className="w-5 h-5 text-slate-600" />
            </div>
            <Button
              onClick={() => {
                const text = `
PROPUESTA DE INFRAESTRUCTURA DE RED
=====================================

Nombre: ${proposal.name}
Fecha: ${new Date(proposal.createdAt).toLocaleDateString("es-ES")}
Total de Clientes: ${proposal.totalClients || proposal.totalUsers}

SEDES
-----
${proposal.sites?.map((site: any) => `${site.name}: ${site.clients || site.users} clientes`).join("\n")}

VLANS
-----
${proposal.calculations?.vlan?.map((vlan: any) => `VLAN ${vlan.vlan} - ${vlan.area} (Prioridad: ${vlan.priority})`).join("\n")}

ANCHO DE BANDA
--------------
${proposal.calculations?.bandwidth?.map((bw: any) => `${bw.siteName}: ${bw.bwRecommended} Gbps (Recomendado)`).join("\n")}
                `;
                navigator.clipboard.writeText(text);
                toast.success("Texto copiado al portapapeles");
              }}
              disabled={isExporting}
              size="sm"
              variant="outline"
              className="w-full gap-2"
            >
              Copiar Texto
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Nota:</strong> Todos los formatos contienen la información completa de tu propuesta. Usa JSON para cargar propuestas guardadas, CSV para análisis en hojas de cálculo, y Word para documentos profesionales.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
