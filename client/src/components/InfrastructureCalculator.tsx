import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface InfrastructureCalculatorProps {
  totalUsers: number;
  totalFloors: number;
  totalWorkstations: number;
  sites: number;
}

interface Equipment {
  name: string;
  quantity: number;
  model: string;
  specs: string;
  purpose: string;
}

export default function InfrastructureCalculator({
  totalUsers,
  totalFloors,
  totalWorkstations,
  sites,
}: InfrastructureCalculatorProps) {
  // Cálculos de equipos
  const switchesAcceso = Math.ceil(totalWorkstations / 48); // 1 switch por 48 puertos
  const switchesDistribucion = Math.ceil(sites / 2) + 1; // 1 por cada 2 sedes + 1 core
  const switchesCore = 2; // Redundancia
  const firewalls = sites * 2; // 2 por sede (activo-pasivo)
  const routers = sites * 2; // 2 por sede para redundancia
  const cameras = Math.ceil(totalFloors * 8); // 8 cámaras por piso
  const aps = Math.ceil(totalWorkstations / 30); // 1 AP por 30 usuarios

  const equipmentList: Equipment[] = [
    {
      name: "Switches de Acceso (L2)",
      quantity: switchesAcceso,
      model: "Cisco Catalyst 2960X-48TS-L",
      specs: "48 puertos Gigabit + 2 SFP, PoE+",
      purpose: "Conectar dispositivos finales (PCs, impresoras, cámaras)",
    },
    {
      name: "Switches de Distribución (L3)",
      quantity: switchesDistribucion,
      model: "Cisco Catalyst 3650-24TS",
      specs: "24 puertos Gigabit + 4 SFP, Routing",
      purpose: "Agregación y routing inter-VLAN",
    },
    {
      name: "Switches Core (L3)",
      quantity: switchesCore,
      model: "Cisco Catalyst 6500 VSS",
      specs: "10 Gbps, Redundancia VSS",
      purpose: "Núcleo de la red con alta disponibilidad",
    },
    {
      name: "Firewalls",
      quantity: firewalls,
      model: "Cisco ASA 5515-X",
      specs: "Throughput 1.3 Gbps, IPS/IDS",
      purpose: "Seguridad perimetral y control de tráfico",
    },
    {
      name: "Routers",
      quantity: routers,
      model: "Cisco ISR 4321",
      specs: "2 puertos Gigabit, VPN, QoS",
      purpose: "Interconexión de sedes y acceso a internet",
    },
    {
      name: "Cámaras de Seguridad",
      quantity: cameras,
      model: "Hikvision DS-2CD2143G0-I",
      specs: "4MP, PoE, IR 30m",
      purpose: "Vigilancia y seguridad física",
    },
    {
      name: "Puntos de Acceso WiFi (APs)",
      quantity: aps,
      model: "Cisco Aironet 2800",
      specs: "WiFi 6 (802.11ax), PoE+",
      purpose: "Cobertura inalámbrica para dispositivos móviles",
    },
    {
      name: "Servidores",
      quantity: 4,
      model: "Dell PowerEdge R750",
      specs: "2x Xeon, 256GB RAM, SSD NVMe",
      purpose: "Almacenamiento, aplicaciones, base de datos",
    },
    {
      name: "UPS (Sistemas de Respaldo)",
      quantity: sites,
      model: "APC Smart-UPS 10000VA",
      specs: "10kVA, 8 minutos autonomía",
      purpose: "Respaldo de energía para equipos críticos",
    },
    {
      name: "Patch Panel",
      quantity: Math.ceil(totalWorkstations / 24),
      model: "24 puertos Cat6A",
      specs: "Gestión de cableado",
      purpose: "Organización del cableado estructurado",
    },
  ];

  const totalEquipmentCost = equipmentList.reduce((sum, eq) => {
    const costMap: { [key: string]: number } = {
      "Switches de Acceso (L2)": 2500,
      "Switches de Distribución (L3)": 5000,
      "Switches Core (L3)": 15000,
      "Firewalls": 4000,
      "Routers": 2000,
      "Cámaras de Seguridad": 400,
      "Puntos de Acceso WiFi (APs)": 800,
      "Servidores": 8000,
      "UPS (Sistemas de Respaldo)": 3000,
      "Patch Panel": 200,
    };
    return sum + (costMap[eq.name] || 0) * eq.quantity;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-4">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Switches Acceso</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{switchesAcceso}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950">
          <CardContent className="pt-4">
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Firewalls</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">{firewalls}</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-950">
          <CardContent className="pt-4">
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Routers</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{routers}</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-950">
          <CardContent className="pt-4">
            <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">Cámaras</p>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{cameras}</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-950">
          <CardContent className="pt-4">
            <p className="text-xs text-red-600 dark:text-red-400 font-semibold">APs WiFi</p>
            <p className="text-2xl font-bold text-red-900 dark:text-red-100">{aps}</p>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista Detallada de Equipos</CardTitle>
          <CardDescription>
            Equipamiento necesario para la infraestructura de red
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100 dark:bg-slate-800">
                  <TableHead className="font-semibold">Equipo</TableHead>
                  <TableHead className="font-semibold text-center">Cantidad</TableHead>
                  <TableHead className="font-semibold">Modelo Recomendado</TableHead>
                  <TableHead className="font-semibold">Especificaciones</TableHead>
                  <TableHead className="font-semibold">Propósito</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipmentList.map((eq, idx) => (
                  <TableRow key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <TableCell className="font-semibold">{eq.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default" className="text-lg px-3">
                        {eq.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{eq.model}</TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                      {eq.specs}
                    </TableCell>
                    <TableCell className="text-sm">{eq.purpose}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Cost Estimate */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-green-900 dark:text-green-100">Estimación de Costos</CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Costo aproximado de equipamiento (sin instalación ni servicios)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Costo Total Equipos</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                ${(totalEquipmentCost / 1000).toFixed(0)}K
              </p>
            </div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Costo por Usuario</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                ${(totalEquipmentCost / totalUsers).toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Costo por Sede</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                ${(totalEquipmentCost / sites / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-amber-900 dark:text-amber-100">Consideraciones Importantes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-800 dark:text-amber-200 space-y-2">
          <p>
            • <strong>Redundancia:</strong> Se incluyen 2 firewalls y 2 routers por sede para alta disponibilidad.
          </p>
          <p>
            • <strong>Cámaras:</strong> Se recomienda 8 cámaras por piso para cobertura completa.
          </p>
          <p>
            • <strong>WiFi:</strong> 1 AP por cada 30 usuarios para cobertura óptima.
          </p>
          <p>
            • <strong>Cableado:</strong> Incluir cableado Cat6A, patch panels y canaletas.
          </p>
          <p>
            • <strong>Instalación:</strong> Presupuestar 30-40% adicional para instalación, configuración y servicios profesionales.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
