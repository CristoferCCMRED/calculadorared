import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface TopologyNode {
  id: string;
  label: string;
  type: 'internet' | 'firewall' | 'router' | 'switch' | 'ap' | 'server' | 'client';
  x: number;
  y: number;
  color: string;
}

interface TopologyLink {
  from: string;
  to: string;
  label: string;
  bandwidth?: string;
}

interface TopologySuggestion {
  id: string;
  name: string;
  description: string;
  nodes: TopologyNode[];
  links: TopologyLink[];
  pros: string[];
  cons: string[];
  recommendedFor: string;
}

interface AdvancedTopologyDiagramProps {
  siteName: string;
  clients: number;
  floors: number;
}

export default function AdvancedTopologyDiagram({
  siteName,
  clients,
  floors,
}: AdvancedTopologyDiagramProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('hierarchical');

  // Calculate device counts based on clients
  const switches = Math.ceil(clients / 48);
  const firewalls = Math.max(2, Math.ceil(clients / 500));
  const routers = Math.max(2, Math.ceil(clients / 1000));
  const aps = Math.ceil(clients / 30);
  const servers = Math.max(3, Math.ceil(clients / 100));

  // Topology Suggestions
  const topologySuggestions: TopologySuggestion[] = [
    {
      id: 'hierarchical',
      name: 'Topología Jerárquica (3 Capas)',
      description: 'Diseño clásico con capas de Core, Distribution y Access',
      nodes: [
        { id: 'internet', label: 'Internet', type: 'internet', x: 50, y: 10, color: '#3b82f6' },
        { id: 'fw1', label: `Firewall 1`, type: 'firewall', x: 30, y: 25, color: '#ef4444' },
        { id: 'fw2', label: `Firewall 2`, type: 'firewall', x: 70, y: 25, color: '#ef4444' },
        { id: 'core1', label: 'Core Switch 1', type: 'switch', x: 30, y: 40, color: '#8b5cf6' },
        { id: 'core2', label: 'Core Switch 2', type: 'switch', x: 70, y: 40, color: '#8b5cf6' },
        ...Array.from({ length: Math.min(switches, 4) }, (_, i) => ({
          id: `dist${i}`,
          label: `Distribution Switch ${i + 1}`,
          type: 'switch' as const,
          x: 15 + i * 20,
          y: 55,
          color: '#06b6d4',
        })),
        ...Array.from({ length: Math.min(switches, 6) }, (_, i) => ({
          id: `access${i}`,
          label: `Access Switch ${i + 1}`,
          type: 'switch' as const,
          x: 10 + i * 15,
          y: 70,
          color: '#10b981',
        })),
        { id: 'ap1', label: `AP Cluster (${aps})`, type: 'ap', x: 50, y: 85, color: '#f59e0b' },
        { id: 'servers', label: `Servidores (${servers})`, type: 'server', x: 50, y: 100, color: '#6366f1' },
      ],
      links: [
        { from: 'internet', to: 'fw1', label: 'WAN 1' },
        { from: 'internet', to: 'fw2', label: 'WAN 2' },
        { from: 'fw1', to: 'core1', label: '10 Gbps' },
        { from: 'fw2', to: 'core2', label: '10 Gbps' },
        { from: 'core1', to: 'core2', label: 'Trunk' },
        ...Array.from({ length: Math.min(switches, 4) }, (_, i) => ({
          from: i % 2 === 0 ? 'core1' : 'core2',
          to: `dist${i}`,
          label: '10 Gbps',
        })),
        { from: 'core1', to: 'ap1', label: '5 Gbps' },
        { from: 'core2', to: 'servers', label: '10 Gbps' },
      ],
      pros: [
        'Escalabilidad excelente',
        'Redundancia en todas las capas',
        'Fácil de mantener y expandir',
        'Separación clara de funciones',
      ],
      cons: [
        'Mayor costo inicial',
        'Más complejo de configurar',
        'Requiere más dispositivos',
      ],
      recommendedFor: 'Empresas medianas a grandes con múltiples sedes',
    },
    {
      id: 'mesh',
      name: 'Topología Malla (Mesh)',
      description: 'Máxima redundancia con múltiples caminos',
      nodes: [
        { id: 'internet', label: 'Internet', type: 'internet', x: 50, y: 10, color: '#3b82f6' },
        { id: 'fw1', label: 'Firewall 1', type: 'firewall', x: 20, y: 30, color: '#ef4444' },
        { id: 'fw2', label: 'Firewall 2', type: 'firewall', x: 50, y: 30, color: '#ef4444' },
        { id: 'fw3', label: 'Firewall 3', type: 'firewall', x: 80, y: 30, color: '#ef4444' },
        { id: 'router1', label: 'Router 1', type: 'router', x: 20, y: 50, color: '#8b5cf6' },
        { id: 'router2', label: 'Router 2', type: 'router', x: 50, y: 50, color: '#8b5cf6' },
        { id: 'router3', label: 'Router 3', type: 'router', x: 80, y: 50, color: '#8b5cf6' },
        { id: 'ap1', label: `APs (${aps})`, type: 'ap', x: 50, y: 70, color: '#f59e0b' },
        { id: 'servers', label: `Servidores (${servers})`, type: 'server', x: 50, y: 90, color: '#6366f1' },
      ],
      links: [
        { from: 'internet', to: 'fw1', label: 'WAN' },
        { from: 'internet', to: 'fw2', label: 'WAN' },
        { from: 'internet', to: 'fw3', label: 'WAN' },
        { from: 'fw1', to: 'router1', label: '10 Gbps' },
        { from: 'fw2', to: 'router2', label: '10 Gbps' },
        { from: 'fw3', to: 'router3', label: '10 Gbps' },
        { from: 'router1', to: 'router2', label: '10 Gbps' },
        { from: 'router2', to: 'router3', label: '10 Gbps' },
        { from: 'router1', to: 'router3', label: '10 Gbps' },
        { from: 'router1', to: 'ap1', label: '5 Gbps' },
        { from: 'router2', to: 'ap1', label: '5 Gbps' },
        { from: 'router3', to: 'servers', label: '10 Gbps' },
      ],
      pros: [
        'Redundancia máxima',
        'Sin punto único de fallo',
        'Mejor rendimiento bajo carga',
        'Fácil recuperación ante fallos',
      ],
      cons: [
        'Muy costosa',
        'Compleja de configurar',
        'Requiere muchos dispositivos',
        'Difícil de mantener',
      ],
      recommendedFor: 'Centros de datos y aplicaciones críticas',
    },
    {
      id: 'star',
      name: 'Topología Estrella (Star)',
      description: 'Diseño simple con un punto central',
      nodes: [
        { id: 'internet', label: 'Internet', type: 'internet', x: 50, y: 10, color: '#3b82f6' },
        { id: 'fw', label: 'Firewall', type: 'firewall', x: 50, y: 25, color: '#ef4444' },
        { id: 'core', label: 'Core Switch', type: 'switch', x: 50, y: 40, color: '#8b5cf6' },
        ...Array.from({ length: Math.min(switches, 3) }, (_, i) => ({
          id: `access${i}`,
          label: `Access Switch ${i + 1}`,
          type: 'switch' as const,
          x: 20 + i * 30,
          y: 60,
          color: '#10b981',
        })),
        { id: 'ap1', label: `APs (${aps})`, type: 'ap', x: 20, y: 80, color: '#f59e0b' },
        { id: 'servers', label: `Servidores (${servers})`, type: 'server', x: 50, y: 80, color: '#6366f1' },
        { id: 'clients', label: `Clientes (${clients})`, type: 'client', x: 80, y: 80, color: '#14b8a6' },
      ],
      links: [
        { from: 'internet', to: 'fw', label: 'WAN' },
        { from: 'fw', to: 'core', label: '10 Gbps' },
        ...Array.from({ length: Math.min(switches, 3) }, (_, i) => ({
          from: 'core',
          to: `access${i}`,
          label: '1 Gbps',
        })),
        { from: 'core', to: 'ap1', label: '5 Gbps' },
        { from: 'core', to: 'servers', label: '10 Gbps' },
        { from: 'core', to: 'clients', label: 'Acceso' },
      ],
      pros: [
        'Muy simple y económica',
        'Fácil de instalar y mantener',
        'Bajo costo inicial',
        'Ideal para pequeñas redes',
      ],
      cons: [
        'Punto único de fallo',
        'Escalabilidad limitada',
        'Cuello de botella en el core',
        'Poca redundancia',
      ],
      recommendedFor: 'Pequeñas oficinas y sucursales',
    },
    {
      id: 'collapsed-core',
      name: 'Topología Core Colapsado',
      description: 'Combinación de 2 capas para balance costo-rendimiento',
      nodes: [
        { id: 'internet', label: 'Internet', type: 'internet', x: 50, y: 10, color: '#3b82f6' },
        { id: 'fw1', label: 'Firewall 1', type: 'firewall', x: 30, y: 25, color: '#ef4444' },
        { id: 'fw2', label: 'Firewall 2', type: 'firewall', x: 70, y: 25, color: '#ef4444' },
        { id: 'core1', label: 'Core/Dist 1', type: 'switch', x: 30, y: 45, color: '#8b5cf6' },
        { id: 'core2', label: 'Core/Dist 2', type: 'switch', x: 70, y: 45, color: '#8b5cf6' },
        ...Array.from({ length: Math.min(switches, 4) }, (_, i) => ({
          id: `access${i}`,
          label: `Access ${i + 1}`,
          type: 'switch' as const,
          x: 15 + i * 20,
          y: 65,
          color: '#10b981',
        })),
        { id: 'ap1', label: `APs (${aps})`, type: 'ap', x: 50, y: 80, color: '#f59e0b' },
        { id: 'servers', label: `Servidores (${servers})`, type: 'server', x: 50, y: 100, color: '#6366f1' },
      ],
      links: [
        { from: 'internet', to: 'fw1', label: 'WAN' },
        { from: 'internet', to: 'fw2', label: 'WAN' },
        { from: 'fw1', to: 'core1', label: '10 Gbps' },
        { from: 'fw2', to: 'core2', label: '10 Gbps' },
        { from: 'core1', to: 'core2', label: 'Trunk' },
        ...Array.from({ length: Math.min(switches, 4) }, (_, i) => ({
          from: i % 2 === 0 ? 'core1' : 'core2',
          to: `access${i}`,
          label: '1 Gbps',
        })),
        { from: 'core1', to: 'ap1', label: '5 Gbps' },
        { from: 'core2', to: 'servers', label: '10 Gbps' },
      ],
      pros: [
        'Buen balance costo-rendimiento',
        'Redundancia adecuada',
        'Escalable a mediano plazo',
        'Más simple que 3 capas',
      ],
      cons: [
        'Menos redundancia que 3 capas',
        'Escalabilidad moderada',
        'Más caro que estrella',
      ],
      recommendedFor: 'Empresas medianas con crecimiento esperado',
    },
  ];

  const currentSuggestion = topologySuggestions.find(s => s.id === selectedSuggestion);

  const renderSVGTopology = (suggestion: TopologySuggestion) => {
    const width = 800;
    const height = 600;

    return (
      <svg width="100%" height="600" viewBox={`0 0 ${width} ${height}`} className="border rounded-lg bg-white dark:bg-slate-900">
        {/* Background */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />

        {/* Links */}
        {suggestion.links.map((link, idx) => {
          const fromNode = suggestion.nodes.find(n => n.id === link.from);
          const toNode = suggestion.nodes.find(n => n.id === link.to);
          if (!fromNode || !toNode) return null;

          const x1 = (fromNode.x / 100) * width;
          const y1 = (fromNode.y / 100) * height;
          const x2 = (toNode.x / 100) * width;
          const y2 = (toNode.y / 100) * height;

          return (
            <g key={`link-${idx}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#64748b"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <text
                x={(x1 + x2) / 2}
                y={(y1 + y2) / 2 - 5}
                textAnchor="middle"
                fontSize="12"
                fill="#475569"
                className="pointer-events-none"
              >
                {link.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {suggestion.nodes.map((node) => {
          const x = (node.x / 100) * width;
          const y = (node.y / 100) * height;
          const size = 40;

          return (
            <g key={node.id}>
              <circle cx={x} cy={y} r={size} fill={node.color} opacity="0.8" />
              <circle cx={x} cy={y} r={size} fill="none" stroke={node.color} strokeWidth="2" />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dy="0.3em"
                fontSize="11"
                fill="white"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {node.label.split(' ')[0]}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const handleDownloadTopology = () => {
    if (!currentSuggestion) return;

    const svg = document.querySelector('svg');
    if (!svg) {
      toast.error('Error al descargar topología');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${siteName}-${currentSuggestion.name.replace(/\s+/g, '-')}.png`;
      link.click();
      toast.success('Topología descargada');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Topología de Red Avanzada - {siteName}</CardTitle>
          <CardDescription>
            Diseño GNS3-style con múltiples sugerencias de topología
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Topology Suggestions */}
          <Tabs value={selectedSuggestion} onValueChange={setSelectedSuggestion}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              {topologySuggestions.map(suggestion => (
                <TabsTrigger key={suggestion.id} value={suggestion.id} className="text-xs">
                  {suggestion.name.split('(')[0].trim()}
                </TabsTrigger>
              ))}
            </TabsList>

            {topologySuggestions.map(suggestion => (
              <TabsContent key={suggestion.id} value={suggestion.id} className="space-y-4">
                {/* Topology Diagram */}
                <div className="border rounded-lg overflow-hidden">
                  {renderSVGTopology(suggestion)}
                </div>

                {/* Description and Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Descripción
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {suggestion.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      ✅ Ventajas
                    </h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      {suggestion.pros.map((pro, idx) => (
                        <li key={idx}>• {pro}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      ❌ Desventajas
                    </h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      {suggestion.cons.map((con, idx) => (
                        <li key={idx}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended For */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Recomendado para:</strong> {suggestion.recommendedFor}
                  </p>
                </div>

                {/* Device Summary */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <Card className="bg-slate-50 dark:bg-slate-800">
                    <CardContent className="pt-4">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Switches</p>
                      <p className="text-lg font-bold">{switches}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-slate-800">
                    <CardContent className="pt-4">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Firewalls</p>
                      <p className="text-lg font-bold">{firewalls}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-slate-800">
                    <CardContent className="pt-4">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Routers</p>
                      <p className="text-lg font-bold">{routers}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-slate-800">
                    <CardContent className="pt-4">
                      <p className="text-xs text-slate-600 dark:text-slate-400">APs</p>
                      <p className="text-lg font-bold">{aps}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-slate-800">
                    <CardContent className="pt-4">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Servidores</p>
                      <p className="text-lg font-bold">{servers}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={handleDownloadTopology} className="gap-2">
                    <Download className="w-4 h-4" />
                    Descargar Topología
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Exportar a GNS3
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
