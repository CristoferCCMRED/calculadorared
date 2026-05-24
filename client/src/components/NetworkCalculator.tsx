import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import VLANCalculator from "./VLANCalculator";
import IPCalculator from "./IPCalculator";
import BandwidthCalculator from "./BandwidthCalculator";
import VLANManager from "./VLANManager";
import ServicesManager from "./ServicesManager";
import FloorsManager from "./FloorsManager";
import InfrastructureCalculator from "./InfrastructureCalculator";
import TopologyDiagram from "./TopologyDiagram";
import UserAndVirtualizationConfig from "./UserAndVirtualizationConfig";
import CommandGenerator from "./CommandGenerator";

interface Site {
  id: string;
  name: string;
  clients: number;
}

interface NetworkCalculatorProps {
  onProposalCreate: (proposal: any) => void;
}

export default function NetworkCalculator({ onProposalCreate }: NetworkCalculatorProps) {
  const [sites, setSites] = useState<Site[]>([
    { id: "1", name: "Sede 1-A", clients: 530 },
    { id: "2", name: "Sede 1-B", clients: 300 },
    { id: "3", name: "Sede 2", clients: 1240 },
    { id: "4", name: "Sede 3", clients: 210 },
  ]);

  const [proposalName, setProposalName] = useState("Propuesta de Red Empresarial");
  const [activeTab, setActiveTab] = useState("vlan");
  const [userConfig, setUserConfig] = useState<any>(null);
  const [vlanConfig, setVlanConfig] = useState<any[]>([]);

  const addSite = () => {
    const newSite: Site = {
      id: Date.now().toString(),
      name: `Nueva Sede ${sites.length + 1}`,
      users: 100,
    };
    setSites([...sites, newSite]);
  };

  const removeSite = (id: string) => {
    if (sites.length === 1) {
      toast.error("Debe haber al menos una sede");
      return;
    }
    setSites(sites.filter((s) => s.id !== id));
  };

  const updateSite = (id: string, field: keyof Site, value: any) => {
    setSites(
      sites.map((s) =>
        s.id === id
          ? { ...s, [field]: field === "clients" ? Math.max(1, parseInt(value) || 0) : value }
          : s
      )
    );
  };

  const handleCreateProposal = () => {
    const totalUsers = sites.reduce((sum, s) => sum + s.clients, 0);

    const proposal = {
      name: proposalName,
      sites,
      totalClients: totalUsers,
      createdAt: new Date().toISOString(),
      calculations: {
        vlan: generateVLANConfig(),
        bandwidth: calculateBandwidth(),
      },
    };

    onProposalCreate(proposal);
    setProposalName("Propuesta de Red Empresarial");
  };

  const generateVLANConfig = () => {
    return [
      { vlan: 10, area: "TI", priority: "Alta" },
      { vlan: 20, area: "Administrativo", priority: "Media" },
      { vlan: 30, area: "Operaciones", priority: "Media-Alta" },
      { vlan: 40, area: "RRHH", priority: "Media" },
      { vlan: 50, area: "Invitados", priority: "Baja" },
      { vlan: 60, area: "VIP", priority: "Muy Alta" },
      { vlan: 70, area: "Servicios", priority: "Alta" },
      { vlan: 80, area: "Servidores", priority: "Muy Alta" },
      { vlan: 90, area: "Control Acceso", priority: "Alta" },
    ];
  };

  const calculateBandwidth = () => {
    return sites.map((site) => {
      const bwRequired = (site.clients * 5 * 0.7) / 1000; // Gbps
      const bwRecommended = bwRequired * 1.3;
      const bwBackup = bwRecommended * 0.5;

      return {
        siteName: site.name,
        clients: site.clients,
        bwRequired: bwRequired.toFixed(2),
        bwRecommended: bwRecommended.toFixed(2),
        bwBackup: bwBackup.toFixed(2),
      };
    });
  };

  const totalUsers = sites.reduce((sum, s) => sum + s.clients, 0);

  const handleUserConfigChange = (config: any) => {
    setUserConfig(config);
  };

  const handleVlanConfigChange = (vlans: any[]) => {
    setVlanConfig(vlans);
  };

  return (
    <div className="space-y-6">
      {/* Proposal Name */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Propuesta</CardTitle>
          <CardDescription>Define el nombre y las sedes de tu propuesta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="proposal-name">Nombre de la Propuesta</Label>
            <Input
              id="proposal-name"
              value={proposalName}
              onChange={(e) => setProposalName(e.target.value)}
              placeholder="Ej: Propuesta de Red Empresarial 2026"
              className="mt-1"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Sedes</Label>
              <Button onClick={addSite} size="sm" variant="outline" className="gap-1">
                <Plus className="w-4 h-4" />
                Agregar Sede
              </Button>
            </div>

            <div className="space-y-3">
              {sites.map((site) => (
                <div key={site.id} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label className="text-xs text-slate-500">Nombre</Label>
                    <Input
                      value={site.name}
                      onChange={(e) => updateSite(site.id, "name", e.target.value)}
                      placeholder="Nombre de la sede"
                      className="mt-1"
                    />
                  </div>
                  <div className="w-32">
                    <Label className="text-xs text-slate-500">Clientes</Label>
                    <Input
                      type="number"
                      value={site.clients}
                      onChange={(e) => updateSite(site.id, "clients", e.target.value)}
                      placeholder="0"
                      className="mt-1"
                      min="1"
                    />
                  </div>
                  <Button
                    onClick={() => removeSite(site.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Total de Clientes: <span className="text-blue-600 dark:text-blue-400">{totalUsers}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculators */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-full grid-cols-10 overflow-x-auto">
          <TabsTrigger value="vlan">VLANs</TabsTrigger>
          <TabsTrigger value="vlan-manager">Editar VLANs</TabsTrigger>
          <TabsTrigger value="ip">IP</TabsTrigger>
          <TabsTrigger value="bandwidth">Ancho BW</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="floors">Pisos</TabsTrigger>
          <TabsTrigger value="infrastructure">Equipos</TabsTrigger>
          <TabsTrigger value="topology">Topología</TabsTrigger>
          <TabsTrigger value="commands">Comandos</TabsTrigger>
        </TabsList>

        <TabsContent value="vlan" className="mt-6">
          <VLANCalculator />
        </TabsContent>

        <TabsContent value="vlan-manager" className="mt-6">
          <VLANManager />
        </TabsContent>

        <TabsContent value="ip" className="mt-6">
          <IPCalculator sites={sites} />
        </TabsContent>

        <TabsContent value="bandwidth" className="mt-6">
          <BandwidthCalculator sites={sites} />
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <ServicesManager />
        </TabsContent>

        <TabsContent value="floors" className="mt-6 space-y-4">
          {sites.map((site) => (
            <FloorsManager key={site.id} siteId={site.id} siteName={site.name} />
          ))}
        </TabsContent>

        <TabsContent value="infrastructure" className="mt-6">
          <InfrastructureCalculator
            totalUsers={totalUsers}
            totalFloors={sites.length * 3}
            totalWorkstations={totalUsers}
            sites={sites.length}
          />
        </TabsContent>

        <TabsContent value="topology" className="mt-6 space-y-4">
          {sites.map((site) => (
            <TopologyDiagram
              key={site.id}
              siteName={site.name}
              floors={3}
              workstations={site.clients}
              switches={Math.ceil(site.clients / 48)}
              firewalls={2}
              routers={2}
              cameras={Math.ceil(3 * 8)}
              aps={Math.ceil(site.clients / 30)}
            />
          ))}
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <UserAndVirtualizationConfig
            totalClients={totalUsers}
            onConfigChange={handleUserConfigChange}
          />
        </TabsContent>

        <TabsContent value="commands" className="mt-6">
          <CommandGenerator vlans={generateVLANConfig()} sites={sites} />
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button onClick={handleCreateProposal} size="lg" className="gap-2">
          <Save className="w-4 h-4" />
          Guardar Propuesta
        </Button>
      </div>
    </div>
  );
}
