import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Site {
  id: string;
  name: string;
  clients: number;
}

interface IPCalculatorProps {
  sites: Site[];
}

const AREAS = [
  { name: "Operaciones", percentage: 0.45 },
  { name: "Administrativo", percentage: 0.25 },
  { name: "Invitados", percentage: 0.1 },
  { name: "RRHH", percentage: 0.08 },
  { name: "TI", percentage: 0.05 },
  { name: "VIP", percentage: 0.03 },
  { name: "Servidores", percentage: 0.02 },
  { name: "Control Acceso", percentage: 0.01 },
  { name: "Servicios", percentage: 0.01 },
];

function calculateSubnets(clients: number) {
  const subnets = [];
  let currentIp = 0;
  let remainingUsers = clients;

  for (const area of AREAS) {
    const areaUsers = Math.ceil(clients * area.percentage);
    const prefixLength = calculatePrefix(areaUsers);
    const hostsPerSubnet = Math.pow(2, 32 - prefixLength) - 2;

    subnets.push({
      area: area.name,
      users: areaUsers,
      prefix: prefixLength,
      hosts: hostsPerSubnet,
      utilization: Math.round((areaUsers / hostsPerSubnet) * 100),
    });

    remainingUsers -= areaUsers;
  }

  return subnets;
}

function calculatePrefix(hosts: number) {
  if (hosts <= 2) return 31;
  if (hosts <= 6) return 29;
  if (hosts <= 14) return 28;
  if (hosts <= 30) return 27;
  if (hosts <= 62) return 26;
  if (hosts <= 126) return 25;
  if (hosts <= 254) return 24;
  if (hosts <= 510) return 23;
  if (hosts <= 1022) return 22;
  if (hosts <= 2046) return 21;
  if (hosts <= 4094) return 20;
  return 19;
}

export default function IPCalculator({ sites }: IPCalculatorProps) {
  return (
    <div className="space-y-6">
      {sites.map((site, index) => {
        const subnets = calculateSubnets(site.clients);
        const baseIp = `10.${index + 1}`;

        return (
          <Card key={site.id}>
            <CardHeader>
              <CardTitle className="text-lg">{site.name}</CardTitle>
              <CardDescription>
                Direccionamiento VLSM para {site.clients} clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100 dark:bg-slate-800">
                      <TableHead className="font-semibold">Área</TableHead>
                      <TableHead className="font-semibold text-center">Usuarios</TableHead>
                      <TableHead className="font-semibold">Subred (Ejemplo)</TableHead>
                      <TableHead className="font-semibold text-center">Máscara</TableHead>
                      <TableHead className="font-semibold text-center">Hosts</TableHead>
                      <TableHead className="font-semibold text-center">Utilización</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subnets.map((subnet, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <TableCell className="font-semibold">{subnet.area}</TableCell>
                        <TableCell className="text-center">{subnet.users}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {baseIp}.{idx}.0/{subnet.prefix}
                        </TableCell>
                        <TableCell className="text-center font-mono">/{subnet.prefix}</TableCell>
                        <TableCell className="text-center">{subnet.hosts}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              subnet.utilization > 80
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : subnet.utilization > 50
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            }`}
                          >
                            {subnet.utilization}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  Bloque de Sede: {baseIp}.0.0/16
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Rango total: {baseIp}.0.0 - {baseIp}.255.255
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">Notas sobre VLSM</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <p>
            • VLSM (Variable Length Subnet Mask) permite usar diferentes máscaras de subred en la misma red.
          </p>
          <p>
            • Las subredes se calculan automáticamente según el número de clientes en cada área.
          </p>
          <p>
            • Se recomienda mantener la utilización por debajo del 80% para permitir crecimiento.
          </p>
          <p>
            • El direccionamiento es escalable: cada sede puede crecer hasta el bloque /16 asignado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
