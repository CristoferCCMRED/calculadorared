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
import { CheckCircle, AlertCircle, Loader, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  validatePing,
  validateTelnet,
  validateSSH,
  validateIPAddress,
  validatePort,
  type ValidationResult,
} from "@/lib/networkValidation";

interface ValidationLog extends ValidationResult {
  id: string;
}

export default function NetworkValidationTool() {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('23');
  const [protocol, setProtocol] = useState<'ping' | 'telnet' | 'ssh'>('ping');
  const [isValidating, setIsValidating] = useState(false);
  const [validationLogs, setValidationLogs] = useState<ValidationLog[]>([]);

  const handleValidate = async () => {
    if (!host.trim()) {
      toast.error('Por favor ingresa un host');
      return;
    }

    if (!validateIPAddress(host) && !/^[a-zA-Z0-9.-]+$/.test(host)) {
      toast.error('Dirección IP o hostname inválido');
      return;
    }

    if (protocol !== 'ping' && !validatePort(parseInt(port))) {
      toast.error('Puerto inválido (1-65535)');
      return;
    }

    setIsValidating(true);

    try {
      let result: ValidationResult;

      if (protocol === 'ping') {
        result = await validatePing(host);
      } else if (protocol === 'telnet') {
        result = await validateTelnet(host, parseInt(port));
      } else {
        result = await validateSSH(host, parseInt(port));
      }

      const logEntry: ValidationLog = {
        ...result,
        id: `log-${Date.now()}`,
      };

      setValidationLogs([logEntry, ...validationLogs]);

      if (result.success) {
        toast.success(`${protocol.toUpperCase()} exitoso a ${host}`);
      } else {
        toast.error(`${protocol.toUpperCase()} falló: ${result.message}`);
      }
    } catch (error) {
      toast.error(`Error durante validación: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearLogs = () => {
    setValidationLogs([]);
    toast.success('Registros borrados');
  };

  const handleDeleteLog = (id: string) => {
    setValidationLogs(validationLogs.filter(log => log.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleValidate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Validation Tool */}
      <Card>
        <CardHeader>
          <CardTitle>Herramienta de Validación de Red</CardTitle>
          <CardDescription>
            Valida conectividad usando Ping, Telnet o SSH
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="host">Host / IP</Label>
              <Input
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="192.168.1.1 o example.com"
                className="mt-1"
                disabled={isValidating}
              />
            </div>

            <div>
              <Label htmlFor="protocol">Protocolo</Label>
              <Select value={protocol} onValueChange={(value: any) => setProtocol(value)}>
                <SelectTrigger id="protocol" className="mt-1" disabled={isValidating}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ping">Ping (ICMP)</SelectItem>
                  <SelectItem value="telnet">Telnet (TCP 23)</SelectItem>
                  <SelectItem value="ssh">SSH (TCP 22)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {protocol !== 'ping' && (
              <div>
                <Label htmlFor="port">Puerto</Label>
                <Input
                  id="port"
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={protocol === 'telnet' ? '23' : '22'}
                  className="mt-1"
                  disabled={isValidating}
                  min="1"
                  max="65535"
                />
              </div>
            )}
          </div>

          <Button
            onClick={handleValidate}
            disabled={isValidating}
            className="w-full gap-2"
          >
            {isValidating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Validando...
              </>
            ) : (
              'Validar Conectividad'
            )}
          </Button>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Nota:</strong> En un navegador, Ping usa HTTP HEAD request. Para validación real de ICMP, usa la API del servidor.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Validation Logs */}
      {validationLogs.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Historial de Validaciones</CardTitle>
                <CardDescription>{validationLogs.length} registros</CardDescription>
              </div>
              <Button
                onClick={handleClearLogs}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Limpiar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-100 dark:bg-slate-800">
                    <TableHead className="w-12">Estado</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Protocolo</TableHead>
                    <TableHead className="text-center">Puerto</TableHead>
                    <TableHead className="text-center">Tiempo (ms)</TableHead>
                    <TableHead>Mensaje</TableHead>
                    <TableHead className="text-center">Hora</TableHead>
                    <TableHead className="text-center">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validationLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                      <TableCell>
                        {log.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600" title="Exitoso" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" title="Falló" />
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.host}</TableCell>
                      <TableCell className="uppercase text-sm font-semibold">
                        {log.protocol}
                      </TableCell>
                      <TableCell className="text-center">
                        {log.port || '-'}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {log.responseTime ? `${log.responseTime}ms` : '-'}
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {log.message}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString('es-ES')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteLog(log.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Statistics */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Card className="bg-green-50 dark:bg-green-950">
                <CardContent className="pt-6">
                  <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    Exitosas
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {validationLogs.filter(l => l.success).length}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-red-50 dark:bg-red-950">
                <CardContent className="pt-6">
                  <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                    Fallidas
                  </p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                    {validationLogs.filter(l => !l.success).length}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-950">
                <CardContent className="pt-6">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                    Tasa Éxito
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {validationLogs.length > 0
                      ? Math.round(
                          (validationLogs.filter(l => l.success).length /
                            validationLogs.length) *
                            100
                        )
                      : 0}%
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {validationLogs.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No hay validaciones registradas
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center">
              Ejecuta una validación para ver los resultados aquí
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
