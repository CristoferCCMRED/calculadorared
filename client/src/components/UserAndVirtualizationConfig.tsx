import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserAndVirtualizationConfigProps {
  totalClients: number;
  onConfigChange: (config: any) => void;
}

export default function UserAndVirtualizationConfig({
  totalClients,
  onConfigChange,
}: UserAndVirtualizationConfigProps) {
  const [wiredPercentage, setWiredPercentage] = useState(70);
  const [virtualMachines, setVirtualMachines] = useState(0);
  const [hypervisor, setHypervisor] = useState("vmware");
  const [ramPerVM, setRamPerVM] = useState(8);
  const [storagePerVM, setStoragePerVM] = useState(100);
  const [clusterNodes, setClusterNodes] = useState(0);
  const [clusterType, setClusterType] = useState("kubernetes");

  const wiredUsers = Math.round((totalClients * wiredPercentage) / 100);
  const wifiUsers = totalClients - wiredUsers;
  const totalRAM = virtualMachines * ramPerVM;
  const totalStorage = virtualMachines * storagePerVM;

  const handleConfigChange = () => {
    onConfigChange({
      wiredUsers,
      wifiUsers,
      wiredPercentage,
      virtualMachines,
      hypervisor,
      ramPerVM,
      storagePerVM,
      totalRAM,
      totalStorage,
      clusterNodes,
      clusterType,
    });
  };

  // Trigger on any change
  useEffect(() => {
    handleConfigChange();
  }, [wiredPercentage, virtualMachines, hypervisor, ramPerVM, storagePerVM, clusterNodes, clusterType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      {/* Users Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Usuarios</CardTitle>
          <CardDescription>
            Define la distribución entre usuarios cableados y WiFi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Porcentaje de Usuarios Cableados</Label>
              <span className="text-lg font-bold text-blue-600">{wiredPercentage}%</span>
            </div>
            <Slider
              value={[wiredPercentage]}
              onValueChange={(value) => setWiredPercentage(value[0])}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-950">
              <CardContent className="pt-4">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  Usuarios Cableados
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {wiredUsers}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {wiredPercentage}%
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-950">
              <CardContent className="pt-4">
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  Usuarios WiFi
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {wifiUsers}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {100 - wiredPercentage}%
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 dark:bg-purple-950">
              <CardContent className="pt-4">
                <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                  Total Clientes
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {totalClients}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Info */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Nota:</strong> Los clientes cableados requieren puertos en switches. Los clientes WiFi requieren APs adicionales.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Virtualization Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Virtualización</CardTitle>
          <CardDescription>
            Define máquinas virtuales, hipervisores y clusters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vms">Máquinas Virtuales</Label>
              <Input
                id="vms"
                type="number"
                value={virtualMachines}
                onChange={(e) => setVirtualMachines(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="mt-1"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="hypervisor">Hipervisor</Label>
              <Select value={hypervisor} onValueChange={setHypervisor}>
                <SelectTrigger id="hypervisor" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vmware">VMware ESXi</SelectItem>
                  <SelectItem value="proxmox">Proxmox</SelectItem>
                  <SelectItem value="hyperv">Hyper-V</SelectItem>
                  <SelectItem value="kvm">KVM/QEMU</SelectItem>
                  <SelectItem value="xen">Xen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {virtualMachines > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ram-per-vm">RAM por VM (GB)</Label>
                  <Input
                    id="ram-per-vm"
                    type="number"
                    value={ramPerVM}
                    onChange={(e) => setRamPerVM(parseInt(e.target.value) || 0)}
                    placeholder="8"
                    className="mt-1"
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="storage-per-vm">Almacenamiento por VM (GB)</Label>
                  <Input
                    id="storage-per-vm"
                    type="number"
                    value={storagePerVM}
                    onChange={(e) => setStoragePerVM(parseInt(e.target.value) || 0)}
                    placeholder="100"
                    className="mt-1"
                    min="10"
                  />
                </div>
              </div>

              {/* VM Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-orange-50 dark:bg-orange-950">
                  <CardContent className="pt-4">
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                      RAM Total Requerida
                    </p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {totalRAM} GB
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 dark:bg-red-950">
                  <CardContent className="pt-4">
                    <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                      Almacenamiento Total
                    </p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                      {totalStorage} GB
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Cluster Configuration */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Configuración de Cluster (Opcional)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cluster-nodes">Nodos del Cluster</Label>
                <Input
                  id="cluster-nodes"
                  type="number"
                  value={clusterNodes}
                  onChange={(e) => setClusterNodes(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="mt-1"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="cluster-type">Tipo de Cluster</Label>
                <Select value={clusterType} onValueChange={setClusterType}>
                  <SelectTrigger id="cluster-type" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kubernetes">Kubernetes</SelectItem>
                    <SelectItem value="docker-swarm">Docker Swarm</SelectItem>
                    <SelectItem value="openstack">OpenStack</SelectItem>
                    <SelectItem value="proxmox-cluster">Proxmox Cluster</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {clusterNodes > 0 && (
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  <strong>Cluster {clusterType.toUpperCase()}:</strong> {clusterNodes} nodos configurados
                </p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Recomendación:</strong> Para {virtualMachines} VMs se requiere servidor con al menos {totalRAM + 16} GB RAM (incluido overhead del hipervisor).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
