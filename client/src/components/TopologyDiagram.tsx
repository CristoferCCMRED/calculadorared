import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface TopologyDiagramProps {
  siteName: string;
  floors: number;
  workstations: number;
  switches: number;
  firewalls: number;
  routers: number;
  cameras: number;
  aps: number;
}

export default function TopologyDiagram({
  siteName,
  floors,
  workstations,
  switches,
  firewalls,
  routers,
  cameras,
  aps,
}: TopologyDiagramProps) {
  const handleDownloadDiagram = () => {
    // Crear SVG del diagrama
    const svgContent = `
      <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="1200" height="800" fill="#f8f9fa"/>
        
        <!-- Title -->
        <text x="600" y="30" font-size="24" font-weight="bold" text-anchor="middle" fill="#1a1a1a">
          Topología de Red - ${siteName}
        </text>
        
        <!-- Internet -->
        <rect x="450" y="60" width="300" height="60" fill="#e3f2fd" stroke="#1976d2" stroke-width="2" rx="5"/>
        <text x="600" y="95" font-size="14" font-weight="bold" text-anchor="middle" fill="#1976d2">
          INTERNET
        </text>
        
        <!-- Firewalls -->
        <rect x="200" y="170" width="140" height="60" fill="#fff3e0" stroke="#f57c00" stroke-width="2" rx="5"/>
        <text x="270" y="200" font-size="12" font-weight="bold" text-anchor="middle" fill="#f57c00">
          Firewall HA
        </text>
        <text x="270" y="220" font-size="10" text-anchor="middle" fill="#666">
          x${firewalls}
        </text>
        
        <rect x="860" y="170" width="140" height="60" fill="#fff3e0" stroke="#f57c00" stroke-width="2" rx="5"/>
        <text x="930" y="200" font-size="12" font-weight="bold" text-anchor="middle" fill="#f57c00">
          Firewall HA
        </text>
        <text x="930" y="220" font-size="10" text-anchor="middle" fill="#666">
          x${firewalls}
        </text>
        
        <!-- Core Switches -->
        <rect x="350" y="280" width="140" height="60" fill="#f3e5f5" stroke="#7b1fa2" stroke-width="2" rx="5"/>
        <text x="420" y="310" font-size="12" font-weight="bold" text-anchor="middle" fill="#7b1fa2">
          Core L3
        </text>
        <text x="420" y="330" font-size="10" text-anchor="middle" fill="#666">
          VSS/Stack
        </text>
        
        <rect x="710" y="280" width="140" height="60" fill="#f3e5f5" stroke="#7b1fa2" stroke-width="2" rx="5"/>
        <text x="780" y="310" font-size="12" font-weight="bold" text-anchor="middle" fill="#7b1fa2">
          Core L3
        </text>
        <text x="780" y="330" font-size="10" text-anchor="middle" fill="#666">
          VSS/Stack
        </text>
        
        <!-- Distribution Switches -->
        <rect x="150" y="420" width="140" height="60" fill="#e8f5e9" stroke="#388e3c" stroke-width="2" rx="5"/>
        <text x="220" y="450" font-size="12" font-weight="bold" text-anchor="middle" fill="#388e3c">
          Distribución L3
        </text>
        <text x="220" y="470" font-size="10" text-anchor="middle" fill="#666">
          EtherChannel
        </text>
        
        <rect x="530" y="420" width="140" height="60" fill="#e8f5e9" stroke="#388e3c" stroke-width="2" rx="5"/>
        <text x="600" y="450" font-size="12" font-weight="bold" text-anchor="middle" fill="#388e3c">
          Distribución L3
        </text>
        <text x="600" y="470" font-size="10" text-anchor="middle" fill="#666">
          EtherChannel
        </text>
        
        <rect x="910" y="420" width="140" height="60" fill="#e8f5e9" stroke="#388e3c" stroke-width="2" rx="5"/>
        <text x="980" y="450" font-size="12" font-weight="bold" text-anchor="middle" fill="#388e3c">
          Distribución L3
        </text>
        <text x="980" y="470" font-size="10" text-anchor="middle" fill="#666">
          EtherChannel
        </text>
        
        <!-- Access Switches -->
        <rect x="50" y="560" width="120" height="60" fill="#e0f2f1" stroke="#00897b" stroke-width="2" rx="5"/>
        <text x="110" y="585" font-size="11" font-weight="bold" text-anchor="middle" fill="#00897b">
          Access L2
        </text>
        <text x="110" y="605" font-size="9" text-anchor="middle" fill="#666">
          x${switches}
        </text>
        
        <rect x="200" y="560" width="120" height="60" fill="#e0f2f1" stroke="#00897b" stroke-width="2" rx="5"/>
        <text x="260" y="585" font-size="11" font-weight="bold" text-anchor="middle" fill="#00897b">
          Access L2
        </text>
        <text x="260" y="605" font-size="9" text-anchor="middle" fill="#666">
          x${switches}
        </text>
        
        <rect x="350" y="560" width="120" height="60" fill="#e0f2f1" stroke="#00897b" stroke-width="2" rx="5"/>
        <text x="410" y="585" font-size="11" font-weight="bold" text-anchor="middle" fill="#00897b">
          Access L2
        </text>
        <text x="410" y="605" font-size="9" text-anchor="middle" fill="#666">
          x${switches}
        </text>
        
        <!-- End Devices -->
        <rect x="50" y="680" width="100" height="50" fill="#fce4ec" stroke="#c2185b" stroke-width="2" rx="5"/>
        <text x="100" y="705" font-size="11" font-weight="bold" text-anchor="middle" fill="#c2185b">
          PCs/Impresoras
        </text>
        <text x="100" y="720" font-size="9" text-anchor="middle" fill="#666">
          x${workstations}
        </text>
        
        <rect x="200" y="680" width="100" height="50" fill="#fff9c4" stroke="#f57f17" stroke-width="2" rx="5"/>
        <text x="250" y="705" font-size="11" font-weight="bold" text-anchor="middle" fill="#f57f17">
          Cámaras
        </text>
        <text x="250" y="720" font-size="9" text-anchor="middle" fill="#666">
          x${cameras}
        </text>
        
        <rect x="350" y="680" width="100" height="50" fill="#c8e6c9" stroke="#2e7d32" stroke-width="2" rx="5"/>
        <text x="400" y="705" font-size="11" font-weight="bold" text-anchor="middle" fill="#2e7d32">
          APs WiFi
        </text>
        <text x="400" y="720" font-size="9" text-anchor="middle" fill="#666">
          x${aps}
        </text>
        
        <!-- Routers -->
        <rect x="530" y="560" width="140" height="60" fill="#ede7f6" stroke="#512da8" stroke-width="2" rx="5"/>
        <text x="600" y="590" font-size="12" font-weight="bold" text-anchor="middle" fill="#512da8">
          Routers
        </text>
        <text x="600" y="610" font-size="10" text-anchor="middle" fill="#666">
          x${routers}
        </text>
        
        <!-- Servers -->
        <rect x="750" y="560" width="140" height="60" fill="#fbe9e7" stroke="#d84315" stroke-width="2" rx="5"/>
        <text x="820" y="590" font-size="12" font-weight="bold" text-anchor="middle" fill="#d84315">
          Servidores
        </text>
        <text x="820" y="610" font-size="10" text-anchor="middle" fill="#666">
          HA Cluster
        </text>
        
        <!-- Legend -->
        <text x="50" y="760" font-size="12" font-weight="bold" fill="#1a1a1a">Leyenda:</text>
        <rect x="50" y="770" width="15" height="15" fill="#f3e5f5" stroke="#7b1fa2" stroke-width="1"/>
        <text x="75" y="782" font-size="10" fill="#666">Core</text>
        
        <rect x="150" y="770" width="15" height="15" fill="#e8f5e9" stroke="#388e3c" stroke-width="1"/>
        <text x="175" y="782" font-size="10" fill="#666">Distribución</text>
        
        <rect x="330" y="770" width="15" height="15" fill="#e0f2f1" stroke="#00897b" stroke-width="1"/>
        <text x="355" y="782" font-size="10" fill="#666">Acceso</text>
        
        <rect x="450" y="770" width="15" height="15" fill="#fff3e0" stroke="#f57c00" stroke-width="1"/>
        <text x="475" y="782" font-size="10" fill="#666">Seguridad</text>
      </svg>
    `;

    // Descargar como SVG
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `topologia-${siteName.replace(/\s+/g, "-")}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Diagrama descargado");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Topología de Red</CardTitle>
            <CardDescription>
              Diagrama visual de la infraestructura para {siteName}
            </CardDescription>
          </div>
          <Button onClick={handleDownloadDiagram} className="gap-2">
            <Download className="w-4 h-4" />
            Descargar SVG
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* SVG Diagram */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 overflow-auto border border-slate-200 dark:border-slate-800">
          <svg viewBox="0 0 1200 800" className="w-full" xmlns="http://www.w3.org/2000/svg">
            {/* Background */}
            <rect width="1200" height="800" fill="#f8f9fa" className="dark:fill-slate-900" />

            {/* Title */}
            <text
              x="600"
              y="30"
              fontSize="24"
              fontWeight="bold"
              textAnchor="middle"
              fill="#1a1a1a"
              className="dark:fill-white"
            >
              Topología de Red - {siteName}
            </text>

            {/* Internet */}
            <rect x="450" y="60" width="300" height="60" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2" rx="5" />
            <text x="600" y="95" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#1976d2">
              INTERNET
            </text>

            {/* Firewalls */}
            <rect x="200" y="170" width="140" height="60" fill="#fff3e0" stroke="#f57c00" strokeWidth="2" rx="5" />
            <text x="270" y="200" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#f57c00">
              Firewall HA
            </text>
            <text x="270" y="220" fontSize="10" textAnchor="middle" fill="#666">
              x{firewalls}
            </text>

            <rect x="860" y="170" width="140" height="60" fill="#fff3e0" stroke="#f57c00" strokeWidth="2" rx="5" />
            <text x="930" y="200" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#f57c00">
              Firewall HA
            </text>
            <text x="930" y="220" fontSize="10" textAnchor="middle" fill="#666">
              x{firewalls}
            </text>

            {/* Core Switches */}
            <rect x="350" y="280" width="140" height="60" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2" rx="5" />
            <text x="420" y="310" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#7b1fa2">
              Core L3
            </text>
            <text x="420" y="330" fontSize="10" textAnchor="middle" fill="#666">
              VSS/Stack
            </text>

            <rect x="710" y="280" width="140" height="60" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2" rx="5" />
            <text x="780" y="310" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#7b1fa2">
              Core L3
            </text>
            <text x="780" y="330" fontSize="10" textAnchor="middle" fill="#666">
              VSS/Stack
            </text>

            {/* Distribution Switches */}
            <rect x="150" y="420" width="140" height="60" fill="#e8f5e9" stroke="#388e3c" strokeWidth="2" rx="5" />
            <text x="220" y="450" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#388e3c">
              Distribución L3
            </text>
            <text x="220" y="470" fontSize="10" textAnchor="middle" fill="#666">
              EtherChannel
            </text>

            <rect x="530" y="420" width="140" height="60" fill="#e8f5e9" stroke="#388e3c" strokeWidth="2" rx="5" />
            <text x="600" y="450" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#388e3c">
              Distribución L3
            </text>
            <text x="600" y="470" fontSize="10" textAnchor="middle" fill="#666">
              EtherChannel
            </text>

            <rect x="910" y="420" width="140" height="60" fill="#e8f5e9" stroke="#388e3c" strokeWidth="2" rx="5" />
            <text x="980" y="450" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#388e3c">
              Distribución L3
            </text>
            <text x="980" y="470" fontSize="10" textAnchor="middle" fill="#666">
              EtherChannel
            </text>

            {/* Access Switches */}
            <rect x="50" y="560" width="120" height="60" fill="#e0f2f1" stroke="#00897b" strokeWidth="2" rx="5" />
            <text x="110" y="585" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#00897b">
              Access L2
            </text>
            <text x="110" y="605" fontSize="9" textAnchor="middle" fill="#666">
              x{switches}
            </text>

            {/* End Devices */}
            <rect x="50" y="680" width="100" height="50" fill="#fce4ec" stroke="#c2185b" strokeWidth="2" rx="5" />
            <text x="100" y="705" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#c2185b">
              PCs/Impresoras
            </text>
            <text x="100" y="720" fontSize="9" textAnchor="middle" fill="#666">
              x{workstations}
            </text>

            <rect x="200" y="680" width="100" height="50" fill="#fff9c4" stroke="#f57f17" strokeWidth="2" rx="5" />
            <text x="250" y="705" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#f57f17">
              Cámaras
            </text>
            <text x="250" y="720" fontSize="9" textAnchor="middle" fill="#666">
              x{cameras}
            </text>

            <rect x="350" y="680" width="100" height="50" fill="#c8e6c9" stroke="#2e7d32" strokeWidth="2" rx="5" />
            <text x="400" y="705" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#2e7d32">
              APs WiFi
            </text>
            <text x="400" y="720" fontSize="9" textAnchor="middle" fill="#666">
              x{aps}
            </text>
          </svg>
        </div>

        {/* Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Nota:</strong> Este diagrama muestra la arquitectura jerárquica de tres capas (Core, Distribución, Acceso) con redundancia en todos los niveles críticos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
