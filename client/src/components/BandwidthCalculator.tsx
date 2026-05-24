import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Site {
  id: string;
  name: string;
  clients: number;
}

interface BandwidthCalculatorProps {
  sites: Site[];
}

const BW_PER_USER = 5; // Mbps
const SIMULTANEITY_FACTOR = 0.7;
const GROWTH_FACTOR = 1.3;
const BACKUP_FACTOR = 0.5;

export default function BandwidthCalculator({ sites }: BandwidthCalculatorProps) {
  const calculateBandwidth = (clients: number) => {
    const bwRequired = (clients * BW_PER_USER * SIMULTANEITY_FACTOR) / 1000; // Gbps
    const bwRecommended = bwRequired * GROWTH_FACTOR;
    const bwBackup = bwRecommended * BACKUP_FACTOR;

    return {
      bwRequired: parseFloat(bwRequired.toFixed(2)),
      bwRecommended: parseFloat(bwRecommended.toFixed(2)),
      bwBackup: parseFloat(bwBackup.toFixed(2)),
    };
  };

  const bandwidthData = sites.map((site) => {
    const bw = calculateBandwidth(site.clients);
    return {
      name: site.name,
      clients: site.clients,
      required: bw.bwRequired,
      recommended: bw.bwRecommended,
      backup: bw.bwBackup,
    };
  });

  const totalBandwidth = bandwidthData.reduce(
    (sum, item) => ({
      required: sum.required + item.required,
      recommended: sum.recommended + item.recommended,
      backup: sum.backup + item.backup,
    }),
    { required: 0, recommended: 0, backup: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Visualización de Ancho de Banda</CardTitle>
          <CardDescription>Comparación de requerimientos por sede</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bandwidthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: "Gbps", angle: -90, position: "insideLeft" }} />
              <Tooltip
                formatter={(value: any) => `${(value as number).toFixed(2)} Gbps`}
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar dataKey="required" fill="#3b82f6" name="Requerido" />
              <Bar dataKey="recommended" fill="#10b981" name="Recomendado" />
              <Bar dataKey="backup" fill="#f59e0b" name="Respaldo" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cálculo Detallado</CardTitle>
          <CardDescription>
            Fórmula: BW = (Clientes × {BW_PER_USER} Mbps × {SIMULTANEITY_FACTOR}) × {GROWTH_FACTOR} (crecimiento)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100 dark:bg-slate-800">
                  <TableHead className="font-semibold">Sede</TableHead>
                  <TableHead className="font-semibold text-center">Clientes</TableHead>
                  <TableHead className="font-semibold text-center">BW Requerido</TableHead>
                  <TableHead className="font-semibold text-center">BW Recomendado</TableHead>
                  <TableHead className="font-semibold text-center">BW Respaldo</TableHead>
                  <TableHead className="font-semibold">Enlace Recomendado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bandwidthData.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <TableCell className="font-semibold">{item.name}</TableCell>
                    <TableCell className="text-center">{item.clients}</TableCell>
                    <TableCell className="text-center font-mono">{item.required.toFixed(2)} Gbps</TableCell>
                    <TableCell className="text-center font-mono font-semibold text-green-600 dark:text-green-400">
                      {item.recommended.toFixed(2)} Gbps
                    </TableCell>
                    <TableCell className="text-center font-mono text-orange-600 dark:text-orange-400">
                      {item.backup.toFixed(2)} Gbps
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-semibold">
                        {item.recommended <= 2
                          ? "2-3 Gbps Fibra"
                          : item.recommended <= 5
                            ? "5 Gbps Fibra"
                            : "10 Gbps Fibra"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">Total Requerido</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {totalBandwidth.required.toFixed(2)} Gbps
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Total Recomendado</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {totalBandwidth.recommended.toFixed(2)} Gbps
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
              <CardContent className="pt-6">
                <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold">Total Respaldo</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {totalBandwidth.backup.toFixed(2)} Gbps
                </p>
              </CardContent>
            </Card>
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
            • <strong>BW Requerido:</strong> Cálculo conservador basado en 5 Mbps por cliente con factor de simultaneidad de 0.7.
          </p>
          <p>
            • <strong>BW Recomendado:</strong> Incluye 30% adicional para crecimiento futuro y picos de tráfico.
          </p>
          <p>
            • <strong>BW Respaldo:</strong> Enlace secundario con 50% de la capacidad recomendada para redundancia.
          </p>
          <p>
            • Se recomienda usar <strong>Fibra Óptica</strong> para enlaces principales y respaldo.
          </p>
          <p>
            • Implementar <strong>QoS</strong> para priorizar servicios críticos (VoIP, videoconferencia, servidores).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
