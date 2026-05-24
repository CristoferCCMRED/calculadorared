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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Edit2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VLAN {
  id: string;
  vlanId: number;
  name: string;
  area: string;
  priority: string;
  qos: number;
  description: string;
}

const DEFAULT_VLANS: VLAN[] = [
  {
    id: "1",
    vlanId: 10,
    name: "TI",
    area: "Gestión de Red",
    priority: "Alta",
    qos: 5,
    description: "Gestión de red y administración",
  },
  {
    id: "2",
    vlanId: 20,
    name: "Administrativo",
    area: "Administrativo",
    priority: "Media",
    qos: 3,
    description: "Personal administrativo y finanzas",
  },
  {
    id: "3",
    vlanId: 30,
    name: "Operaciones",
    area: "Operaciones",
    priority: "Media-Alta",
    qos: 4,
    description: "Operaciones core de la empresa",
  },
  {
    id: "4",
    vlanId: 40,
    name: "RRHH",
    area: "RRHH",
    priority: "Media",
    qos: 3,
    description: "Gestión de talento humano",
  },
  {
    id: "5",
    vlanId: 50,
    name: "Invitados",
    area: "Invitados",
    priority: "Baja",
    qos: 1,
    description: "Visitantes y externos",
  },
  {
    id: "6",
    vlanId: 60,
    name: "VIP",
    area: "VIP",
    priority: "Muy Alta",
    qos: 6,
    description: "Directivos y ejecutivos",
  },
  {
    id: "7",
    vlanId: 70,
    name: "Servicios",
    area: "Servicios",
    priority: "Alta",
    qos: 5,
    description: "Telefonía IP, videoconferencia",
  },
  {
    id: "8",
    vlanId: 80,
    name: "Servidores",
    area: "Servidores",
    priority: "Muy Alta",
    qos: 6,
    description: "Servidores y almacenamiento",
  },
  {
    id: "9",
    vlanId: 90,
    name: "Control Acceso",
    area: "Control de Acceso",
    priority: "Alta",
    qos: 5,
    description: "Sistemas de seguridad física",
  },
];

const PRIORITY_OPTIONS = ["Baja", "Media", "Media-Alta", "Alta", "Muy Alta"];

export default function VLANManager() {
  const [vlans, setVlans] = useState<VLAN[]>(DEFAULT_VLANS);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<VLAN>>({
    vlanId: 100,
    name: "",
    area: "",
    priority: "Media",
    qos: 3,
    description: "",
  });

  const handleOpenDialog = (vlan?: VLAN) => {
    if (vlan) {
      setFormData(vlan);
      setEditingId(vlan.id);
    } else {
      const nextVlanId = Math.max(...vlans.map((v) => v.vlanId)) + 10;
      setFormData({
        vlanId: nextVlanId,
        name: "",
        area: "",
        priority: "Media",
        qos: 3,
        description: "",
      });
      setEditingId(null);
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.vlanId) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    // Validar que el VLAN ID sea único
    if (
      !editingId &&
      vlans.some((v) => v.vlanId === formData.vlanId)
    ) {
      toast.error("El ID de VLAN ya existe");
      return;
    }

    if (editingId) {
      setVlans(
        vlans.map((v) =>
          v.id === editingId ? { ...v, ...formData } : v
        )
      );
      toast.success("VLAN actualizada");
    } else {
      const newVlan: VLAN = {
        id: Date.now().toString(),
        vlanId: formData.vlanId || 100,
        name: formData.name || "",
        area: formData.area || "",
        priority: formData.priority || "Media",
        qos: formData.qos || 3,
        description: formData.description || "",
      };
      setVlans([...vlans, newVlan]);
      toast.success("VLAN agregada");
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    if (vlans.length <= 1) {
      toast.error("Debe haber al menos una VLAN");
      return;
    }
    setVlans(vlans.filter((v) => v.id !== id));
    toast.success("VLAN eliminada");
  };

  const handleReset = () => {
    setVlans(DEFAULT_VLANS);
    toast.success("VLANs restauradas a configuración predeterminada");
  };

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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestor de VLANs</CardTitle>
            <CardDescription>
              Crea y personaliza las VLANs para tu infraestructura de red
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleReset}
              variant="outline"
              className="gap-2"
              title="Restaurar configuración predeterminada"
            >
              <RotateCcw className="w-4 h-4" />
              Restaurar
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Nueva VLAN
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Editar VLAN" : "Crear Nueva VLAN"}
                  </DialogTitle>
                  <DialogDescription>
                    Define los parámetros de la VLAN
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vlan-id">ID VLAN (1-4094) *</Label>
                      <Input
                        id="vlan-id"
                        type="number"
                        value={formData.vlanId || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vlanId: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="100"
                        className="mt-1"
                        min="1"
                        max="4094"
                      />
                    </div>

                    <div>
                      <Label htmlFor="vlan-name">Nombre *</Label>
                      <Input
                        id="vlan-name"
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Ej: Datos"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="vlan-area">Área</Label>
                    <Input
                      id="vlan-area"
                      value={formData.area || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      placeholder="Ej: Almacenamiento de Datos"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vlan-priority">Prioridad</Label>
                      <Select
                        value={formData.priority || "Media"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, priority: value })
                        }
                      >
                        <SelectTrigger id="vlan-priority" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="vlan-qos">CoS (QoS) 0-7</Label>
                      <Input
                        id="vlan-qos"
                        type="number"
                        value={formData.qos || 3}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qos: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="3"
                        className="mt-1"
                        min="0"
                        max="7"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="vlan-description">Descripción</Label>
                    <Input
                      id="vlan-description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Descripción de la VLAN"
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
                      {editingId ? "Actualizar" : "Crear"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-950">
            <CardContent className="pt-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                Total de VLANs
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {vlans.length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950">
            <CardContent className="pt-4">
              <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                Prioridad Máxima
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {vlans.filter((v) => v.priority === "Muy Alta").length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950">
            <CardContent className="pt-4">
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                Rango VLAN
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {Math.min(...vlans.map((v) => v.vlanId))} - {Math.max(...vlans.map((v) => v.vlanId))}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100 dark:bg-slate-800">
                <TableHead className="font-semibold">VLAN ID</TableHead>
                <TableHead className="font-semibold">Nombre</TableHead>
                <TableHead className="font-semibold">Área</TableHead>
                <TableHead className="font-semibold">Prioridad</TableHead>
                <TableHead className="font-semibold text-center">CoS</TableHead>
                <TableHead className="font-semibold">Descripción</TableHead>
                <TableHead className="font-semibold text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vlans
                .sort((a, b) => a.vlanId - b.vlanId)
                .map((vlan) => (
                  <TableRow key={vlan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <TableCell className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {vlan.vlanId}
                    </TableCell>
                    <TableCell className="font-semibold">{vlan.name}</TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                      {vlan.area}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(vlan.priority)}`}>
                        {vlan.priority}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-semibold">{vlan.qos}</TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {vlan.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDialog(vlan)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(vlan.id)}
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
      </CardContent>
    </Card>
  );
}
