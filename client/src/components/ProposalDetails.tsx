import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProposalDetailsProps {
  proposal: any;
  onClose: () => void;
}

export default function ProposalDetails({ proposal, onClose }: ProposalDetailsProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{proposal.name}</DialogTitle>
          <DialogDescription>
            {new Date(proposal.createdAt).toLocaleDateString("es-ES")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sedes */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Sedes Configuradas</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Clientes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposal.sites?.map((site: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell>{site.name}</TableCell>
                      <TableCell className="text-right font-semibold">{site.clients || site.users}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-slate-100 dark:bg-slate-800 font-semibold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">{proposal.totalClients || proposal.totalUsers}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* VLANs */}
          {proposal.calculations?.vlan && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Configuración de VLANs</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>VLAN</TableHead>
                      <TableHead>Área</TableHead>
                      <TableHead>Prioridad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposal.calculations.vlan.map((vlan: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono font-semibold">{vlan.vlan}</TableCell>
                        <TableCell>{vlan.area}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {vlan.priority}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Ancho de Banda */}
          {proposal.calculations?.bandwidth && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Cálculo de Ancho de Banda</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sede</TableHead>
                      <TableHead className="text-right">Clientes</TableHead>
                      <TableHead className="text-right">BW Requerido</TableHead>
                      <TableHead className="text-right">BW Recomendado</TableHead>
                      <TableHead className="text-right">BW Respaldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposal.calculations.bandwidth.map((bw: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>{bw.siteName}</TableCell>
                        <TableCell className="text-right">{bw.clients || bw.users}</TableCell>
                        <TableCell className="text-right font-mono">{bw.bwRequired} Gbps</TableCell>
                        <TableCell className="text-right font-mono font-semibold text-green-600 dark:text-green-400">
                          {bw.bwRecommended} Gbps
                        </TableCell>
                        <TableCell className="text-right font-mono text-orange-600 dark:text-orange-400">
                          {bw.bwBackup} Gbps
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-950">
              <CardContent className="pt-6">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">Total Sedes</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {proposal.sites?.length || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-950">
              <CardContent className="pt-6">
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Total Clientes</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {(proposal.totalClients || proposal.totalUsers)?.toLocaleString() || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 dark:bg-orange-950">
              <CardContent className="pt-6">
                <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold">BW Total Rec.</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                  {proposal.calculations?.bandwidth
                    ? proposal.calculations.bandwidth
                        .reduce((sum: number, b: any) => sum + parseFloat(b.bwRecommended), 0)
                        .toFixed(1)
                    : "0"}{" "}
                  Gbps
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
