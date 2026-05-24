import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import ProposalDetails from "./ProposalDetails";

interface ProposalManagerProps {
  proposal: any;
  onDelete: () => void;
  onExport: () => void;
}

export default function ProposalManager({ proposal, onDelete, onExport }: ProposalManagerProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>{proposal.name}</CardTitle>
              <CardDescription>
                Creada el {formatDate(proposal.createdAt)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Sedes</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {proposal.sites?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Usuarios</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {proposal.totalUsers?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">VLANs</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {proposal.calculations?.vlan?.length || 9}
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">BW Total</p>
              <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                {proposal.calculations?.bandwidth
                  ? proposal.calculations.bandwidth
                      .reduce((sum: number, b: any) => sum + parseFloat(b.bwRecommended), 0)
                      .toFixed(1)
                  : "0"}{" "}
                Gbps
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowDetails(true)}
              variant="outline"
              className="gap-2 flex-1"
            >
              <Eye className="w-4 h-4" />
              Ver Detalles
            </Button>
            <Button
              onClick={onExport}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button
              onClick={onDelete}
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {showDetails && (
        <ProposalDetails
          proposal={proposal}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
