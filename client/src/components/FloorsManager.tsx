import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Floor {
  id: string;
  floorNumber: number;
  name: string;
  workstations: number;
  area: string;
}

interface FloorsManagerProps {
  siteId: string;
  siteName: string;
}

export default function FloorsManager({ siteId, siteName }: FloorsManagerProps) {
  const [floors, setFloors] = useState<Floor[]>([
    { id: "1", floorNumber: 1, name: "Planta Baja", workstations: 50, area: "Recepción y Administrativo" },
    { id: "2", floorNumber: 2, name: "Primer Piso", workstations: 100, area: "Operaciones" },
    { id: "3", floorNumber: 3, name: "Segundo Piso", workstations: 80, area: "Administrativo y RRHH" },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Floor>>({
    floorNumber: 1,
    name: "",
    workstations: 0,
    area: "",
  });

  const handleOpenDialog = (floor?: Floor) => {
    if (floor) {
      setFormData(floor);
      setEditingId(floor.id);
    } else {
      const nextFloor = Math.max(...floors.map((f) => f.floorNumber), 0) + 1;
      setFormData({
        floorNumber: nextFloor,
        name: `Piso ${nextFloor}`,
        workstations: 0,
        area: "",
      });
      setEditingId(null);
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || formData.workstations === undefined || formData.workstations <= 0) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    if (editingId) {
      setFloors(
        floors.map((f) =>
          f.id === editingId ? { ...f, ...formData } : f
        )
      );
      toast.success("Piso actualizado");
    } else {
      const newFloor: Floor = {
        id: Date.now().toString(),
        floorNumber: formData.floorNumber || 1,
        name: formData.name || "",
        workstations: formData.workstations || 0,
        area: formData.area || "",
      };
      setFloors([...floors, newFloor]);
      toast.success("Piso agregado");
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    if (floors.length === 1) {
      toast.error("Debe haber al menos un piso");
      return;
    }
    setFloors(floors.filter((f) => f.id !== id));
    toast.success("Piso eliminado");
  };

  const totalWorkstations = floors.reduce((sum, f) => sum + f.workstations, 0);
  const switchesNeeded = Math.ceil(totalWorkstations / 48); // 48 puertos por switch

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{siteName} - Pisos y Puestos</CardTitle>
            <CardDescription>Define la estructura física de la sede</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                Agregar Piso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Piso" : "Agregar Nuevo Piso"}
                </DialogTitle>
                <DialogDescription>
                  Define los parámetros del piso
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="floor-number">Número de Piso</Label>
                    <Input
                      id="floor-number"
                      type="number"
                      value={formData.floorNumber || 1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          floorNumber: parseInt(e.target.value) || 1,
                        })
                      }
                      placeholder="1"
                      className="mt-1"
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="floor-name">Nombre del Piso *</Label>
                    <Input
                      id="floor-name"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Ej: Planta Baja"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="floor-workstations">Puestos de Trabajo *</Label>
                  <Input
                    id="floor-workstations"
                    type="number"
                    value={formData.workstations || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workstations: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="50"
                    className="mt-1"
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="floor-area">Área / Departamento</Label>
                  <Input
                    id="floor-area"
                    value={formData.area || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    placeholder="Ej: Operaciones"
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    {editingId ? "Actualizar" : "Agregar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-950">
            <CardContent className="pt-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                Total Pisos
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {floors.length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950">
            <CardContent className="pt-4">
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                Total Puestos
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {totalWorkstations}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950">
            <CardContent className="pt-4">
              <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                Switches Necesarios
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {switchesNeeded}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100 dark:bg-slate-800">
                <TableHead className="font-semibold">Piso</TableHead>
                <TableHead className="font-semibold">Nombre</TableHead>
                <TableHead className="font-semibold">Área</TableHead>
                <TableHead className="font-semibold text-center">Puestos</TableHead>
                <TableHead className="font-semibold text-center">Switches (48p)</TableHead>
                <TableHead className="font-semibold text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {floors
                .sort((a, b) => a.floorNumber - b.floorNumber)
                .map((floor) => (
                  <TableRow key={floor.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <TableCell className="font-semibold">{floor.floorNumber}</TableCell>
                    <TableCell className="font-semibold">{floor.name}</TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                      {floor.area}
                    </TableCell>
                    <TableCell className="text-center font-semibold">{floor.workstations}</TableCell>
                    <TableCell className="text-center">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-semibold">
                        {Math.ceil(floor.workstations / 48)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDialog(floor)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(floor.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {floors.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No hay pisos configurados. Agrega uno para comenzar.
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Nota:</strong> Se calcula automáticamente 1 switch de 48 puertos por cada 48 puestos de trabajo. Ajusta según tus necesidades de redundancia.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
