import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  type: string;
  protocol: string;
  port: string;
  users: number;
  simultaneity: number;
  bandwidthPerUser: number;
  totalBandwidth: number;
  critical: boolean;
  description: string;
}

// Bandwidth requirements by service type (Mbps per user)
const SERVICE_BANDWIDTH: Record<string, number> = {
  "datos": 2,
  "telefonía-ip": 0.1,
  "videoconferencia": 3,
  "voz-ip": 0.15,
  "streaming": 5,
  "backup": 1,
  "dns": 0.01,
  "dhcp": 0.01,
  "ntp": 0.01,
  "ldap": 0.05,
  "correo": 0.5,
  "web": 1,
  "base-datos": 3,
  "vpn": 2,
  "iot": 0.1,
  "camaras": 2,
  "otro": 1,
};

const SERVICE_TYPES = Object.keys(SERVICE_BANDWIDTH).map((key) => ({
  value: key,
  label: key.charAt(0).toUpperCase() + key.slice(1).replace("-", " "),
}));

const PROTOCOLS = [
  { value: "tcp", label: "TCP" },
  { value: "udp", label: "UDP" },
  { value: "ipsec", label: "IPSec" },
  { value: "gre", label: "GRE" },
  { value: "http", label: "HTTP" },
  { value: "https", label: "HTTPS" },
  { value: "ssh", label: "SSH" },
  { value: "ftp", label: "FTP" },
  { value: "smtp", label: "SMTP" },
  { value: "pop3", label: "POP3" },
  { value: "imap", label: "IMAP" },
  { value: "dns", label: "DNS" },
  { value: "dhcp", label: "DHCP" },
];

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Internet General",
      type: "datos",
      protocol: "tcp",
      port: "80,443",
      users: 2280,
      simultaneity: 70,
      bandwidthPerUser: 2,
      totalBandwidth: 3192,
      critical: true,
      description: "Acceso a Internet para todos los usuarios",
    },
  ]);

  const [newService, setNewService] = useState<Partial<Service>>({
    type: "datos",
    protocol: "tcp",
    users: 100,
    simultaneity: 50,
    critical: false,
  });

  const calculateBandwidth = (
    type: string,
    users: number,
    simultaneity: number
  ): number => {
    const basePerUser = SERVICE_BANDWIDTH[type] || 1;
    const simultaneousUsers = (users * simultaneity) / 100;
    return basePerUser * simultaneousUsers;
  };

  const handleAddService = () => {
    if (!newService.name || !newService.type) {
      toast.error("Completa el nombre y tipo de servicio");
      return;
    }

    const totalBandwidth = calculateBandwidth(
      newService.type || "datos",
      newService.users || 100,
      newService.simultaneity || 50
    );

    const service: Service = {
      id: Date.now().toString(),
      name: newService.name,
      type: newService.type || "datos",
      protocol: newService.protocol || "tcp",
      port: newService.port || "0",
      users: newService.users || 100,
      simultaneity: newService.simultaneity || 50,
      bandwidthPerUser: SERVICE_BANDWIDTH[newService.type || "datos"] || 1,
      totalBandwidth,
      critical: newService.critical || false,
      description: newService.description || "",
    };

    setServices([...services, service]);
    setNewService({
      type: "datos",
      protocol: "tcp",
      users: 100,
      simultaneity: 50,
      critical: false,
    });
    toast.success(`Servicio "${service.name}" agregado con ${totalBandwidth.toFixed(2)} Mbps`);
  };

  const handleRemoveService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
    toast.success("Servicio eliminado");
  };

  const handleUpdateService = (id: string, field: keyof Service, value: any) => {
    setServices(
      services.map((s) => {
        if (s.id === id) {
          let updated = { ...s, [field]: value };

          // Recalculate bandwidth if users, simultaneity, or type changed
          if (["users", "simultaneity", "type"].includes(field)) {
            updated.totalBandwidth = calculateBandwidth(
              updated.type,
              updated.users,
              updated.simultaneity
            );
          }

          return updated;
        }
        return s;
      })
    );
  };

  const totalBandwidth = services.reduce((sum, s) => sum + s.totalBandwidth, 0);
  const criticalServices = services.filter((s) => s.critical).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-4">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
              Servicios Totales
            </p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {services.length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-950">
          <CardContent className="pt-4">
            <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
              Ancho de Banda Total
            </p>
            <p className="text-3xl font-bold text-red-900 dark:text-red-100">
              {totalBandwidth.toFixed(0)} Mbps
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {(totalBandwidth / 1000).toFixed(2)} Gbps
            </p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-950">
          <CardContent className="pt-4">
            <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
              Servicios Críticos
            </p>
            <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              {criticalServices}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Service */}
      <Card>
        <CardHeader>
          <CardTitle>Agregar Nuevo Servicio</CardTitle>
          <CardDescription>
            El ancho de banda se calcula automáticamente según el tipo y cantidad de usuarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service-name">Nombre del Servicio</Label>
              <Input
                id="service-name"
                value={newService.name || ""}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                placeholder="Ej: Telefonía IP"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="service-type">Tipo de Servicio</Label>
              <Select
                value={newService.type || "datos"}
                onValueChange={(value) => setNewService({ ...newService, type: value })}
              >
                <SelectTrigger id="service-type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="service-users">Usuarios</Label>
              <Input
                id="service-users"
                type="number"
                value={newService.users || 100}
                onChange={(e) =>
                  setNewService({ ...newService, users: parseInt(e.target.value) || 0 })
                }
                placeholder="100"
                className="mt-1"
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="service-simultaneity">Simultaneidad (%)</Label>
              <Input
                id="service-simultaneity"
                type="number"
                value={newService.simultaneity || 50}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    simultaneity: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="50"
                className="mt-1"
                min="0"
                max="100"
              />
            </div>

            <div>
              <Label htmlFor="service-protocol">Protocolo</Label>
              <Select
                value={newService.protocol || "tcp"}
                onValueChange={(value) => setNewService({ ...newService, protocol: value })}
              >
                <SelectTrigger id="service-protocol" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROTOCOLS.map((proto) => (
                    <SelectItem key={proto.value} value={proto.value}>
                      {proto.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service-port">Puerto(s)</Label>
              <Input
                id="service-port"
                value={newService.port || "0"}
                onChange={(e) => setNewService({ ...newService, port: e.target.value })}
                placeholder="80,443"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="service-description">Descripción</Label>
              <Input
                id="service-description"
                value={newService.description || ""}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="Descripción opcional"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newService.critical || false}
                onChange={(e) => setNewService({ ...newService, critical: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Marcar como servicio crítico</span>
            </label>
          </div>

          {/* Preview */}
          {newService.name && (
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Ancho de banda estimado:</strong>
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                    {calculateBandwidth(
                      newService.type || "datos",
                      newService.users || 100,
                      newService.simultaneity || 50
                    ).toFixed(2)}{" "}
                    Mbps
                  </p>
                </div>
                <Zap className="w-8 h-8 text-green-600" />
              </div>
            </div>
          )}

          <Button onClick={handleAddService} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Agregar Servicio
          </Button>
        </CardContent>
      </Card>

      {/* Services List */}
      <div className="space-y-3">
        {services.map((service) => (
          <Card key={service.id} className={service.critical ? "border-red-300 dark:border-red-700" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {service.name}
                    </h3>
                    {service.critical && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 text-xs font-semibold rounded">
                        CRÍTICO
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400">Tipo</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {service.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400">Usuarios</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {service.users}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400">Simultaneidad</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {service.simultaneity}%
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400">Puerto</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {service.port}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleRemoveService(service.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Bandwidth Display */}
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {service.bandwidthPerUser.toFixed(2)} Mbps/usuario × {service.users} usuarios × {service.simultaneity}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Ancho de banda</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {service.totalBandwidth.toFixed(2)} Mbps
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
          <strong>Cálculo automático de ancho de banda:</strong>
        </p>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          El ancho de banda se calcula como: (Mbps por usuario) × (Número de usuarios) × (Porcentaje de simultaneidad)
        </p>
      </div>
    </div>
  );
}
