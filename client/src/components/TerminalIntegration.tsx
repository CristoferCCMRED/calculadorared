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
import { Copy, Download, Terminal, Zap } from "lucide-react";
import { toast } from "sonner";

interface TerminalCommand {
  id: string;
  host: string;
  protocol: string;
  command: string;
  timestamp: string;
}

interface TerminalIntegrationProps {
  deviceName?: string;
  deviceIP?: string;
}

export default function TerminalIntegration({
  deviceName = "Device",
  deviceIP = "192.168.1.1",
}: TerminalIntegrationProps) {
  const [connectionMethod, setConnectionMethod] = useState('ssh');
  const [host, setHost] = useState(deviceIP);
  const [port, setPort] = useState(connectionMethod === 'ssh' ? '22' : '23');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [commands, setCommands] = useState<TerminalCommand[]>([]);
  const [commandInput, setCommandInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('');

  const terminalCommands = {
    cisco: {
      name: 'Cisco IOS',
      commands: [
        { label: 'Ver versión', cmd: 'show version' },
        { label: 'Ver interfaces', cmd: 'show interfaces' },
        { label: 'Ver VLANs', cmd: 'show vlan brief' },
        { label: 'Ver rutas', cmd: 'show ip route' },
        { label: 'Ver configuración', cmd: 'show running-config' },
        { label: 'Ver estado de puertos', cmd: 'show interfaces status' },
        { label: 'Ver Spanning Tree', cmd: 'show spanning-tree' },
        { label: 'Ver tabla ARP', cmd: 'show arp' },
      ]
    },
    huawei: {
      name: 'Huawei VRP',
      commands: [
        { label: 'Ver versión', cmd: 'display version' },
        { label: 'Ver interfaces', cmd: 'display interface brief' },
        { label: 'Ver VLANs', cmd: 'display vlan' },
        { label: 'Ver rutas', cmd: 'display ip routing-table' },
        { label: 'Ver configuración', cmd: 'display current-configuration' },
        { label: 'Ver estado', cmd: 'display interface' },
        { label: 'Ver tabla ARP', cmd: 'display arp' },
      ]
    },
    juniper: {
      name: 'Juniper Junos',
      commands: [
        { label: 'Ver versión', cmd: 'show version' },
        { label: 'Ver interfaces', cmd: 'show interfaces' },
        { label: 'Ver rutas', cmd: 'show route' },
        { label: 'Ver configuración', cmd: 'show configuration' },
      ]
    },
    generic: {
      name: 'Comandos Genéricos',
      commands: [
        { label: 'Ping', cmd: 'ping 8.8.8.8' },
        { label: 'Traceroute', cmd: 'traceroute 8.8.8.8' },
        { label: 'Ver hostname', cmd: 'hostname' },
        { label: 'Ver fecha', cmd: 'date' },
      ]
    }
  };

  const handleExecuteCommand = () => {
    if (!commandInput.trim()) {
      toast.error('Por favor ingresa un comando');
      return;
    }

    const newCommand: TerminalCommand = {
      id: `cmd-${Date.now()}`,
      host,
      protocol: connectionMethod,
      command: commandInput,
      timestamp: new Date().toISOString(),
    };

    setCommands([newCommand, ...commands]);

    // Simulate command execution
    const output = `[${new Date().toLocaleTimeString()}] ${connectionMethod.toUpperCase()}@${host}:${port}
$ ${commandInput}

Simulación de salida del comando:
${generateMockOutput(commandInput)}

---`;

    setTerminalOutput(output + '\n' + terminalOutput);
    setCommandInput('');
    toast.success('Comando ejecutado');
  };

  const generateMockOutput = (cmd: string): string => {
    const lowerCmd = cmd.toLowerCase();

    if (lowerCmd.includes('show version') || lowerCmd.includes('display version')) {
      return `Cisco IOS Software, C9300 Software, Version 17.6.1
Copyright (c) 1986-2022 by Cisco Systems, Inc.
Compiled Mon 15-Aug-22 14:30:00 +0000 by mcpre`;
    } else if (lowerCmd.includes('show interfaces') || lowerCmd.includes('display interface')) {
      return `GigabitEthernet0/0/0 is up, line protocol is up
  Hardware is Gigabit Ethernet, address is 0001.0001.0001
  Internet address is 192.168.1.1/24
  MTU 1500 bytes, BW 1000000 Kbit/sec`;
    } else if (lowerCmd.includes('ping')) {
      return `PING 8.8.8.8 (8.8.8.8): 56 data bytes
64 bytes from 8.8.8.8: icmp_seq=0 ttl=119 time=25.123 ms
64 bytes from 8.8.8.8: icmp_seq=1 ttl=119 time=24.856 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=119 time=25.234 ms
--- 8.8.8.8 statistics ---
3 packets transmitted, 3 packets received, 0% packet loss`;
    } else if (lowerCmd.includes('show vlan') || lowerCmd.includes('display vlan')) {
      return `VLAN ID  Name                             Status    Ports
------- -------------------------------- --------- ------
1        default                          active    Gi0/1, Gi0/2
10       TI                               active    Gi0/3, Gi0/4
20       Administrativo                   active    Gi0/5, Gi0/6
30       Operaciones                      active    Gi0/7, Gi0/8`;
    } else if (lowerCmd.includes('show running-config') || lowerCmd.includes('display current-configuration')) {
      return `!
! Last configuration change at 14:30:00 UTC Mon Aug 15 2022
!
version 17.6
service timestamps debug datetime msec
service timestamps log datetime msec
!
hostname SWITCH-01
!
ip routing
!
vlan 10
 name TI
!
vlan 20
 name Administrativo`;
    } else {
      return `Comando ejecutado correctamente.
Salida simulada para: ${cmd}`;
    }
  };

  const handleQuickCommand = (cmd: string) => {
    setCommandInput(cmd);
  };

  const handleGenerateConnectionString = () => {
    let connectionString = '';

    if (connectionMethod === 'ssh') {
      connectionString = `ssh -l ${username} ${host} -p ${port}`;
    } else if (connectionMethod === 'telnet') {
      connectionString = `telnet ${host} ${port}`;
    } else if (connectionMethod === 'putty') {
      connectionString = `putty -${connectionMethod === 'ssh' ? 'ssh' : 'telnet'} ${username}@${host} -P ${port}`;
    } else if (connectionMethod === 'mobaxterm') {
      connectionString = `mobaxterm -${connectionMethod === 'ssh' ? 'ssh' : 'telnet'} ${username}@${host} -P ${port}`;
    }

    navigator.clipboard.writeText(connectionString);
    toast.success('Cadena de conexión copiada');
  };

  const handleCopyTerminalOutput = () => {
    navigator.clipboard.writeText(terminalOutput);
    toast.success('Salida copiada al portapapeles');
  };

  const handleDownloadLog = () => {
    const blob = new Blob([terminalOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `terminal-log-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Log descargado');
  };

  return (
    <div className="space-y-6">
      {/* Connection Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Conexión</CardTitle>
          <CardDescription>
            Configura la conexión a dispositivos de red
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="method">Método</Label>
              <Select value={connectionMethod} onValueChange={setConnectionMethod}>
                <SelectTrigger id="method" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ssh">SSH</SelectItem>
                  <SelectItem value="telnet">Telnet</SelectItem>
                  <SelectItem value="putty">PuTTY</SelectItem>
                  <SelectItem value="mobaxterm">MobaXterm</SelectItem>
                  <SelectItem value="cmd">CMD (Windows)</SelectItem>
                  <SelectItem value="terminal">Terminal (Linux/Mac)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="host">Host / IP</Label>
              <Input
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="192.168.1.1"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="port">Puerto</Label>
              <Input
                id="port"
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder={connectionMethod === 'ssh' ? '22' : '23'}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleGenerateConnectionString} variant="outline" className="gap-2">
              <Terminal className="w-4 h-4" />
              Copiar Cadena de Conexión
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Command Execution */}
      <Card>
        <CardHeader>
          <CardTitle>Ejecución de Comandos</CardTitle>
          <CardDescription>
            Ejecuta comandos en el dispositivo conectado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {Object.entries(terminalCommands).map(([key, category]) => (
              <div key={key}>
                <Label className="text-xs text-slate-500 mb-2 block">{category.name}</Label>
                <div className="space-y-1">
                  {category.commands.slice(0, 3).map((cmd, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant="outline"
                      className="w-full justify-start text-xs h-8"
                      onClick={() => handleQuickCommand(cmd.cmd)}
                      title={cmd.cmd}
                    >
                      {cmd.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <Label htmlFor="command">Comando</Label>
            <Textarea
              id="command"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Ingresa un comando..."
              className="mt-1"
              rows={2}
            />
          </div>

          <Button onClick={handleExecuteCommand} className="w-full gap-2">
            <Zap className="w-4 h-4" />
            Ejecutar Comando
          </Button>
        </CardContent>
      </Card>

      {/* Terminal Output */}
      {terminalOutput && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Salida de Terminal</CardTitle>
                <CardDescription>Resultados de comandos ejecutados</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyTerminalOutput}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadLog}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Descargar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-96">
              {terminalOutput}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Command History */}
      {commands.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Comandos</CardTitle>
            <CardDescription>{commands.length} comandos ejecutados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {commands.slice(0, 10).map((cmd) => (
                <div
                  key={cmd.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-sm font-semibold">{cmd.command}</p>
                      <p className="text-xs text-slate-500">
                        {cmd.protocol.toUpperCase()} @ {cmd.host}:{port}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(cmd.timestamp).toLocaleTimeString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Nota:</strong> Esta es una interfaz de simulación. Para conexiones reales, usa SSH, Telnet, PuTTY o MobaXterm directamente en tu sistema operativo.
        </p>
      </div>
    </div>
  );
}
