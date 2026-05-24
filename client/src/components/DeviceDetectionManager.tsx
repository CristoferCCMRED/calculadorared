import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Trash2, Search, Download, Copy } from "lucide-react";
import { toast } from "sonner";
import { detectDevice, getConfigurationTemplate, type DeviceInfo } from "@/lib/deviceDetection";

interface DetectedDevice extends DeviceInfo {
  configGenerated?: string;
}

export default function DeviceDetectionManager() {
  const [devices, setDevices] = useState<DetectedDevice[]>([]);
  const [detectionInput, setDetectionInput] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<DetectedDevice | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleDetectDevice = () => {
    if (!detectionInput.trim()) {
      toast.error('Por favor ingresa información del dispositivo');
      return;
    }

    setIsDetecting(true);

    try {
      const result = detectDevice(detectionInput);

      if (result.success && result.device) {
        const newDevice: DetectedDevice = {
          ...result.device,
          id: `device-${Date.now()}`,
        };

        // Generate configuration
        const config = getConfigurationTemplate(newDevice);
        newDevice.configGenerated = config;

        setDevices([...devices, newDevice]);
        setDetectionInput('');
        toast.success(`Dispositivo detectado: ${newDevice.manufacturer} ${newDevice.model}`);
      } else {
        toast.error(result.error || 'No se pudo detectar el dispositivo');
      }
    } catch (error) {
      toast.error('Error al detectar dispositivo');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleAddManualDevice = () => {
    const manualDevice: DetectedDevice = {
      id: `device-${Date.now()}`,
      name: 'Nuevo Dispositivo',
      manufacturer: 'cisco',
      model: 'catalyst-9300',
      deviceType: 'switch',
      ipAddress: '10.0.0.1',
      osType: 'iosxe',
      ports: 48,
      capabilities: ['VLAN', 'QoS', 'Spanning Tree'],
    };

    const config = getConfigurationTemplate(manualDevice);
    manualDevice.configGenerated = config;

    setDevices([...devices, manualDevice]);
    toast.success('Dispositivo manual agregado');
  };

  const handleDeleteDevice = (id: string) => {
    setDevices(devices.filter(d => d.id !== id));
    if (selectedDevice?.id === id) {
      setSelectedDevice(null);
    }
    toast.success('Dispositivo eliminado');
  };

  const handleDownloadConfig = (device: DetectedDevice) => {
    if (!device.configGenerated) {
      toast.error('No hay configuración disponible');
      return;
    }

    const blob = new Blob([device.configGenerated], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${device.manufacturer}-${device.model}-config.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Configuración descargada');
  };

  const handleCopyConfig = (device: DetectedDevice) => {
    if (!device.configGenerated) {
      toast.error('No hay configuración disponible');
      return;
    }

    navigator.clipboard.writeText(device.configGenerated);
    toast.success('Configuración copiada al portapapeles');
  };

  return (
    <div className="space-y-6">
      {/* Detection Section */}
      <Card>
        <CardHeader>
          <CardTitle>Detección de Dispositivos</CardTitle>
          <CardDescription>
            Detecta automáticamente dispositivos de red por fabricante y modelo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="detection-input">Información del Dispositivo</Label>
            <Textarea
              id="detection-input"
              value={detectionInput}
              onChange={(e) => setDetectionInput(e.target.value)}
              placeholder="Ej: Cisco Catalyst 9300, Huawei S5700-48, etc."
              className="mt-1"
              rows={3}
            />
            <p className="text-xs text-slate-500 mt-2">
              Ingresa el nombre del fabricante, modelo o cualquier información del dispositivo
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleDetectDevice}
              disabled={isDetecting}
              className="gap-2"
            >
              <Search className="w-4 h-4" />
              {isDetecting ? 'Detectando...' : 'Detectar Dispositivo'}
            </Button>
            <Button
              onClick={handleAddManualDevice}
              variant="outline"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Manual
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Devices List */}
      {devices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dispositivos Detectados ({devices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-100 dark:bg-slate-800">
                    <TableHead>Nombre</TableHead>
                    <TableHead>Fabricante</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow
                      key={device.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                      onClick={() => setSelectedDevice(device)}
                    >
                      <TableCell className="font-semibold">{device.name}</TableCell>
                      <TableCell className="capitalize">{device.manufacturer}</TableCell>
                      <TableCell className="font-mono text-sm">{device.model}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-semibold">
                          {device.deviceType}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{device.ipAddress}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-1 justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyConfig(device);
                            }}
                            title="Copiar configuración"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadConfig(device);
                            }}
                            title="Descargar configuración"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDevice(device.id);
                            }}
                            className="text-red-600 hover:text-red-700"
                            title="Eliminar"
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
      )}

      {/* Device Details */}
      {selectedDevice && (
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Dispositivo</CardTitle>
            <CardDescription>{selectedDevice.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-slate-500">Fabricante</Label>
                <p className="font-semibold capitalize">{selectedDevice.manufacturer}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Modelo</Label>
                <p className="font-semibold">{selectedDevice.model}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Tipo de Dispositivo</Label>
                <p className="font-semibold capitalize">{selectedDevice.deviceType}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Sistema Operativo</Label>
                <p className="font-semibold">{selectedDevice.osType}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Dirección IP</Label>
                <p className="font-mono">{selectedDevice.ipAddress}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Puertos</Label>
                <p className="font-semibold">{selectedDevice.ports || 'N/A'}</p>
              </div>
              {selectedDevice.macAddress && (
                <div>
                  <Label className="text-xs text-slate-500">Dirección MAC</Label>
                  <p className="font-mono text-sm">{selectedDevice.macAddress}</p>
                </div>
              )}
              {selectedDevice.serialNumber && (
                <div>
                  <Label className="text-xs text-slate-500">Número de Serie</Label>
                  <p className="font-mono text-sm">{selectedDevice.serialNumber}</p>
                </div>
              )}
            </div>

            {selectedDevice.capabilities && selectedDevice.capabilities.length > 0 && (
              <div>
                <Label className="text-xs text-slate-500">Capacidades</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedDevice.capabilities.map((cap, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedDevice.configGenerated && (
              <div>
                <Label className="text-xs text-slate-500 mb-2 block">Configuración Generada</Label>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-96">
                  {selectedDevice.configGenerated}
                </pre>
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => handleCopyConfig(selectedDevice)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </Button>
                  <Button
                    onClick={() => handleDownloadConfig(selectedDevice)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Descargar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {devices.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No hay dispositivos detectados
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center">
              Ingresa información del dispositivo o agrega uno manualmente para comenzar
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
