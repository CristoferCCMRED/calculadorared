import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

interface CommandGeneratorProps {
  vlans: any[];
  sites: any[];
}

export default function CommandGenerator({ vlans, sites }: CommandGeneratorProps) {
  const [brand, setBrand] = useState("cisco");
  const [deviceType, setDeviceType] = useState("switch");

  const generateCiscoCommands = () => {
    const vlanIds = vlans.map(v => v.vlan).join(",");
    
    if (deviceType === "switch") {
      return `! ===== CONFIGURACIÓN CISCO SWITCH (ESTRICTA) =====
enable
configure terminal

! Configuración de Gestión
hostname Switch-Core
enable secret class ! Define contraseña de enable
service password-encryption
username admin privilege 15 secret cisco123

! Líneas de Acceso
line vty 0 4
 transport input ssh
 login local

! Spanning Tree
spanning-tree mode rapid-pvst

! Crear VLANs dinámicas de la propuesta
${vlans.map((v) => `vlan ${v.vlan}\n name ${v.area.replace(/\s+/g, '_')}`).join("\n")}

! Configuración de Puertos de Acceso (Ejemplo)
interface range GigabitEthernet1/0/1-48
 switchport mode access
 switchport access vlan 20 ! VLAN Administrativa por defecto
 spanning-tree portfast
 spanning-tree bpduguard enable

! Configuración de Troncales
interface range GigabitEthernet1/0/49-50
 switchport mode trunk
 switchport trunk native vlan 1
 switchport trunk allowed vlan ${vlanIds || "1,10-90"}

end
write memory`;
    } else if (deviceType === "router") {
      return `! ===== CONFIGURACIÓN CISCO ROUTER (ESTRICTA) =====
enable
configure terminal

! Hostname y Gestión
hostname Router-Principal
enable secret class ! Define contraseña de enable
service password-encryption
username admin privilege 15 secret cisco123

line vty 0 4
 transport input ssh
 login local

! Interfaces y Subinterfaces (Router-on-stick)
interface GigabitEthernet0/0/0
 no shutdown

${vlans.slice(0, 3).map((v) => `interface GigabitEthernet0/0/0.${v.vlan}\n encapsulation dot1q ${v.vlan}\n ip address 192.168.${v.vlan}.1 255.255.255.0`).join("\n\n")}

! Routing Estático (Ejemplo)
ip route 0.0.0.0 0.0.0.0 203.0.113.254

! OSPF (Dinámico)
router ospf 1
 ${vlans.slice(0, 3).map(v => `network 192.168.${v.vlan}.0 0.0.0.255 area 0`).join("\n ")}
 passive-interface default
 no passive-interface GigabitEthernet0/0/0

end
write memory`;
    } else if (deviceType === "firewall") {
      return `! ===== CONFIGURACIÓN CISCO ASA FIREWALL (ESTRICTA) =====
enable
configure terminal

! Interfaces
interface GigabitEthernet0/0
 nameif outside
 security-level 0
 ip address 203.0.113.1 255.255.255.0
 no shutdown

interface GigabitEthernet0/1
 nameif inside
 security-level 100
 ip address 10.0.0.1 255.255.255.0
 no shutdown

! ACLs (Permitir tráfico web y SSH)
access-list ACL_INSIDE extended permit tcp any any eq 80
access-list ACL_INSIDE extended permit tcp any any eq 443
access-list ACL_INSIDE extended permit tcp any any eq 22

access-group ACL_INSIDE in interface inside

! NAT
nat (inside,outside) dynamic interface

end
write memory`;
    }
    return "";
  };

  const generateHuaweiCommands = () => {
    if (deviceType === "switch") {
      return `# ===== CONFIGURACIÓN HUAWEI SWITCH (ESTRICTA) =====
system-view
sysname Switch-Huawei

# Gestión
user-interface vty 0 4
 authentication-mode aaa
aaa
 local-user admin privilege level 15 password cipher Huawei@123

# Crear VLANs
${vlans.map((v) => `vlan ${v.vlan}\n description ${v.area}`).join("\n")}

# Puertos de Acceso
interface GigabitEthernet0/0/1
 port link-type access
 port default vlan 20

# Puertos Troncales
interface GigabitEthernet0/0/49
 port link-type trunk
 port trunk allow-pass vlan ${vlans.map(v => v.vlan).join(" ")}

return
save`;
    } else if (deviceType === "router") {
      return `# ===== CONFIGURACIÓN HUAWEI ROUTER (ESTRICTA) =====
system-view
sysname Router-Huawei

# Routing Estático
ip route-static 0.0.0.0 0.0.0.0 203.0.113.254

# OSPF
ospf 1 router-id 1.1.1.1
 area 0
  ${vlans.slice(0, 3).map(v => `network 192.168.${v.vlan}.0 0.0.0.255`).join("\n  ")}

return
save`;
    }
    return "# Configuración no disponible para este tipo de dispositivo Huawei";
  };

  const generateFortinetCommands = () => {
    return `# ===== CONFIGURACIÓN FORTINET FORTIOS (ESTRICTA) =====
config system global
    set hostname FortiGate-Edge
end

# Interfaces
config system interface
    edit "port1"
        set vdom "root"
        set ip 203.0.113.1 255.255.255.0
        set allowaccess ping https ssh
        set type physical
        set role wan
    next
    edit "port2"
        set vdom "root"
        set ip 10.0.0.1 255.255.255.0
        set allowaccess ping https ssh
        set type physical
        set role lan
    next
end

# Routing Estático
config router static
    edit 1
        set gateway 203.0.113.254
        set device "port1"
        set dst 0.0.0.0 0.0.0.0
    next
end

# Políticas de Firewall (NAT Habilitado)
config firewall policy
    edit 1
        set name "Internet-Access"
        set srcintf "port2"
        set dstintf "port1"
        set srcaddr "all"
        set dstaddr "all"
        set action accept
        set schedule "always"
        set service "ALL"
        set nat enable
    next
end`;
  };

  const generateArubaCommands = () => {
    if (deviceType === "switch") {
      return `# ===== CONFIGURACIÓN ARUBA SWITCH (ESTRICTA) =====
configure terminal

! VLANs
${vlans.map((v) => `vlan ${v.vlan}\n name "${v.area}"`).join("\n")}

! Asignación de Interfaces
interface 1/1/1
 untagged vlan 20

interface 1/1/48
 tagged vlan ${vlans.map(v => v.vlan).join(",")}

! Routing
ip route 0.0.0.0/0 10.0.0.254

exit`;
    }
    return "# Aruba solo soporta Switch en esta base de conocimiento";
  };

  const getCommands = () => {
    switch (brand) {
      case "cisco":
        return generateCiscoCommands();
      case "huawei":
        return generateHuaweiCommands();
      case "fortinet":
        return generateFortinetCommands();
      case "aruba":
        return generateArubaCommands();
      default:
        return generateCiscoCommands();
    }
  };

  const commands = getCommands();

  const handleCopy = () => {
    navigator.clipboard.writeText(commands);
    toast.success("Comandos copiados al portapapeles");
  };

  const handleDownload = () => {
    const blob = new Blob([commands], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${brand}-${deviceType}-config.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Archivo descargado");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generador de Comandos de Configuración</CardTitle>
        <CardDescription>
          Genera comandos precisos basados en la base de conocimiento estricta y los datos de tu propuesta.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Marca del Dispositivo
            </label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cisco">Cisco</SelectItem>
                <SelectItem value="huawei">Huawei</SelectItem>
                <SelectItem value="fortinet">Fortinet</SelectItem>
                <SelectItem value="aruba">Aruba</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tipo de Dispositivo
            </label>
            <Select value={deviceType} onValueChange={setDeviceType}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="switch">Switch</SelectItem>
                <SelectItem value="router">Router</SelectItem>
                <SelectItem value="firewall">Firewall</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Commands Display */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Comandos de Configuración
            </label>
            <div className="flex gap-2">
              <Button onClick={handleCopy} size="sm" variant="outline" className="gap-2">
                <Copy className="w-4 h-4" />
                Copiar
              </Button>
              <Button onClick={handleDownload} size="sm" variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Descargar
              </Button>
            </div>
          </div>

          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-96">
            {commands}
          </pre>
        </div>

        {/* Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Nota:</strong> Los comandos se generan dinámicamente usando las VLANs de tu propuesta actual ({vlans.length} VLANs detectadas).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
