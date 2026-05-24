import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import NetworkCalculator from "@/components/NetworkCalculator";
import ProposalManager from "@/components/ProposalManager";
import ExportProposal from "@/components/ExportProposal";
import ImportProposal from "@/components/ImportProposal";
import DeviceDetectionManager from "@/components/DeviceDetectionManager";
import NetworkValidationTool from "@/components/NetworkValidationTool";
import AdvancedTopologyDiagram from "@/components/AdvancedTopologyDiagram";
import TerminalIntegration from "@/components/TerminalIntegration";
import AIHelpChat from "@/components/AIHelpChat";
import ConfigurationReport from "@/components/ConfigurationReport";

export default function Home() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("calculator");
  const [selectedProposal, setSelectedProposal] = useState<any>(null);

  const addProposal = (proposal: any) => {
    const newProposal = {
      id: Date.now(),
      ...proposal,
      createdAt: new Date().toISOString(),
    };
    setProposals([newProposal, ...proposals]);
    toast.success("Propuesta creada exitosamente");
  };

  const deleteProposal = (id: number) => {
    setProposals(proposals.filter((p) => p.id !== id));
    setSelectedProposal(null);
    toast.success("Propuesta eliminada");
  };

  const importProposal = (proposal: any) => {
    const newProposal = {
      id: Date.now(),
      ...proposal,
      createdAt: proposal.createdAt || new Date().toISOString(),
    };
    setProposals([newProposal, ...proposals]);
    setActiveTab("proposals");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Calculadora de Infraestructura de Red
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Diseña y calcula propuestas de red empresarial con VLSM, VLANs, ancho de banda, equipos y topología
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 md:grid-cols-10 mb-8 overflow-x-auto">
            <TabsTrigger value="calculator" className="text-xs">Calculadora</TabsTrigger>
            <TabsTrigger value="proposals" className="text-xs">Propuestas ({proposals.length})</TabsTrigger>
            <TabsTrigger value="devices" className="text-xs">Dispositivos</TabsTrigger>
            <TabsTrigger value="validation" className="text-xs">Validación</TabsTrigger>
            <TabsTrigger value="topology" className="text-xs">Topología</TabsTrigger>
            <TabsTrigger value="terminal" className="text-xs">Terminal</TabsTrigger>
            <TabsTrigger value="help" className="text-xs">Ayuda IA</TabsTrigger>
            <TabsTrigger value="report" disabled={!selectedProposal} className="text-xs">Informe</TabsTrigger>
            <TabsTrigger value="import" className="text-xs">Cargar</TabsTrigger>
            <TabsTrigger value="export" disabled={!selectedProposal} className="text-xs">Exportar</TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <NetworkCalculator onProposalCreate={addProposal} />
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            {proposals.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      No hay propuestas guardadas
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Crea una nueva propuesta en la pestaña Calculadora
                    </p>
                    <Button onClick={() => setActiveTab("calculator")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Propuesta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    onClick={() => setSelectedProposal(proposal)}
                    className="cursor-pointer"
                  >
                    <ProposalManager
                      proposal={proposal}
                      onDelete={() => deleteProposal(proposal.id)}
                      onExport={() => {
                        setSelectedProposal(proposal);
                        setActiveTab("export");
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Import Tab */}
          <TabsContent value="import" className="space-y-6">
            <ImportProposal onImport={importProposal} />
          </TabsContent>

          {/* Device Detection Tab */}
          <TabsContent value="devices" className="space-y-6">
            <DeviceDetectionManager />
          </TabsContent>

          {/* Network Validation Tab */}
          <TabsContent value="validation" className="space-y-6">
            <NetworkValidationTool />
          </TabsContent>

          {/* Topology Tab */}
          <TabsContent value="topology" className="space-y-6">
            {selectedProposal ? (
              <AdvancedTopologyDiagram
                siteName={selectedProposal.name}
                clients={selectedProposal.totalClients || selectedProposal.totalUsers || 100}
                floors={selectedProposal.sites?.length || 1}
              />
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Selecciona una propuesta
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Crea una propuesta para ver la topología
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Terminal Tab */}
          <TabsContent value="terminal" className="space-y-6">
            <TerminalIntegration
              deviceName={selectedProposal?.name || "Device"}
              deviceIP="192.168.1.1"
            />
          </TabsContent>

          {/* Help Chat Tab */}
          <TabsContent value="help" className="space-y-6">
            <div className="h-[600px]">
              <AIHelpChat />
            </div>
          </TabsContent>

          {/* Report Tab */}
          <TabsContent value="report" className="space-y-6">
            {selectedProposal ? (
              <ConfigurationReport
                siteName={selectedProposal.name}
                clients={selectedProposal.totalClients || selectedProposal.totalUsers || 0}
                buildings={selectedProposal.sites?.length || 0}
                vlans={selectedProposal.calculations?.vlan || []}
                bandwidth={selectedProposal.calculations?.bandwidth?.[0] || {}}
                devices={selectedProposal.devices || []}
                topology={selectedProposal.topology || {}}
                timestamp={selectedProposal.createdAt}
              />
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Selecciona una propuesta
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Crea una propuesta para generar un informe
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            {selectedProposal ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Propuesta Seleccionada</CardTitle>
                    <CardDescription>{selectedProposal.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Sedes:</strong> {selectedProposal.sites?.length}
                      </p>
                      <p>
                        <strong>Total Clientes:</strong> {selectedProposal.totalClientes || selectedProposal.totalUsers}
                      </p>
                      <p>
                        <strong>Fecha:</strong>{" "}
                        {new Date(selectedProposal.createdAt).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <ExportProposal proposal={selectedProposal} />
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Selecciona una propuesta
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Ve a la pestaña "Propuestas" y selecciona una para exportarla
                    </p>
                    <Button onClick={() => setActiveTab("proposals")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Ver Propuestas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
