import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const VLAN_CONFIG = [
  { vlan: 10, area: "TI", description: "Gestión de red y administración", priority: "Alta", qos: 5 },
  { vlan: 20, area: "Administrativo", description: "Personal administrativo y finanzas", priority: "Media", qos: 3 },
  { vlan: 30, area: "Operaciones", description: "Operaciones core de la empresa", priority: "Media-Alta", qos: 4 },
  { vlan: 40, area: "RRHH", description: "Gestión de talento humano", priority: "Media", qos: 3 },
  { vlan: 50, area: "Invitados", description: "Visitantes y externos", priority: "Baja", qos: 1 },
  { vlan: 60, area: "VIP", description: "Directivos y ejecutivos", priority: "Muy Alta", qos: 6 },
  { vlan: 70, area: "Servicios", description: "Telefonía IP, videoconferencia", priority: "Alta", qos: 5 },
  { vlan: 80, area: "Servidores", description: "Servidores y almacenamiento", priority: "Muy Alta", qos: 6 },
  { vlan: 90, area: "Control Acceso", description: "Sistemas de seguridad física", priority: "Alta", qos: 5 },
];

export default function VLANCalculator() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Muy Alta":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Alta":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Media-Alta":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Media":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Baja":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segmentación VLAN</CardTitle>
        <CardDescription>
          Configuración estándar de VLANs para segmentación de red por área funcional
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100 dark:bg-slate-800">
                <TableHead className="font-semibold">VLAN</TableHead>
                <TableHead className="font-semibold">Área</TableHead>
                <TableHead className="font-semibold">Descripción</TableHead>
                <TableHead className="font-semibold">Prioridad</TableHead>
                <TableHead className="font-semibold text-center">CoS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {VLAN_CONFIG.map((vlan) => (
                <TableRow key={vlan.vlan} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                  <TableCell className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                    {vlan.vlan}
                  </TableCell>
                  <TableCell className="font-semibold">{vlan.area}</TableCell>
                  <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                    {vlan.description}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(vlan.priority)}`}>
                      {vlan.priority}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-semibold">{vlan.qos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Notas de Implementación</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Las VLANs se replican en todas las sedes para consistencia.</li>
            <li>• El CoS (Class of Service) determina la prioridad en la cola de transmisión.</li>
            <li>• La VLAN 60 (VIP) tiene prioridad máxima en toda la red.</li>
            <li>• La VLAN 50 (Invitados) está completamente aislada del resto.</li>
            <li>• Las VLANs 80 y 90 requieren acceso controlado mediante ACLs.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
