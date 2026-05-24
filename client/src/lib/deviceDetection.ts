/**
 * Device Detection and Configuration Library
 * Supports automatic detection of network devices and generation of manufacturer-specific configurations
 */

export interface DeviceInfo {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  deviceType: 'switch' | 'firewall' | 'router' | 'ap' | 'load-balancer' | 'vpn-gateway';
  ipAddress: string;
  macAddress?: string;
  serialNumber?: string;
  firmwareVersion?: string;
  osType: 'ios' | 'iosxe' | 'huawei' | 'aruba' | 'hp' | 'juniper' | 'palo-alto' | 'fortinet' | 'mikrotik' | 'ubiquiti';
  ports?: number;
  capabilities?: string[];
}

export interface DetectionResult {
  success: boolean;
  device?: DeviceInfo;
  error?: string;
  confidence: number;
}

/**
 * Device manufacturer signatures for detection
 */
const MANUFACTURER_SIGNATURES = {
  cisco: {
    patterns: ['cisco', 'ios', 'iosxe', 'catalyst', 'asr', 'asa'],
    models: {
      'catalyst-9300': { type: 'switch', ports: 48, os: 'iosxe' },
      'catalyst-9500': { type: 'switch', ports: 48, os: 'iosxe' },
      'catalyst-3850': { type: 'switch', ports: 48, os: 'ios' },
      'asr-1000': { type: 'router', os: 'iosxe' },
      'asa-5500': { type: 'firewall', os: 'ios' },
      'asa-5506': { type: 'firewall', os: 'ios' },
      'c9200': { type: 'switch', ports: 48, os: 'iosxe' },
    }
  },
  huawei: {
    patterns: ['huawei', 'huawei-os', 'huawei-vrp', 's5700', 's6700', 'ar'],
    models: {
      's5700-48': { type: 'switch', ports: 48, os: 'huawei' },
      's6700-48': { type: 'switch', ports: 48, os: 'huawei' },
      's7700': { type: 'switch', ports: 48, os: 'huawei' },
      'ar3200': { type: 'router', os: 'huawei' },
      'usg6000': { type: 'firewall', os: 'huawei' },
    }
  },
  aruba: {
    patterns: ['aruba', 'arubaos', 'instant-on', 'iap', 'cx'],
    models: {
      'cx6100': { type: 'switch', ports: 48, os: 'aruba' },
      'cx6200': { type: 'switch', ports: 48, os: 'aruba' },
      'iap-315': { type: 'ap', os: 'aruba' },
      'iap-325': { type: 'ap', os: 'aruba' },
    }
  },
  fortinet: {
    patterns: ['fortinet', 'fortigate', 'fortios'],
    models: {
      'fg-3100d': { type: 'firewall', os: 'fortinet' },
      'fg-5140d': { type: 'firewall', os: 'fortinet' },
      'fg-7040': { type: 'firewall', os: 'fortinet' },
    }
  }
};

/**
 * Detect device information from various sources
 */
export function detectDevice(input: string | Partial<DeviceInfo>): DetectionResult {
  if (typeof input === 'string') {
    return detectFromString(input);
  } else {
    return detectFromObject(input);
  }
}

function detectFromString(input: string): DetectionResult {
  const lowerInput = input.toLowerCase();
  let bestMatch: { manufacturer: string; confidence: number } = { manufacturer: '', confidence: 0 };

  for (const [manufacturer, sig] of Object.entries(MANUFACTURER_SIGNATURES)) {
    for (const pattern of (sig as any).patterns) {
      if (lowerInput.includes(pattern)) {
        const confidence = pattern.length / input.length;
        if (confidence > bestMatch.confidence) {
          bestMatch = { manufacturer, confidence };
        }
      }
    }
  }

  if (bestMatch.confidence > 0) {
    return {
      success: true,
      device: {
        id: `device-${Date.now()}`,
        name: `Detected ${bestMatch.manufacturer} Device`,
        manufacturer: bestMatch.manufacturer,
        model: 'unknown',
        deviceType: 'switch',
        ipAddress: '10.0.0.1',
        osType: bestMatch.manufacturer as any,
      },
      confidence: bestMatch.confidence,
    };
  }

  return {
    success: false,
    error: 'Could not detect device manufacturer',
    confidence: 0,
  };
}

function detectFromObject(input: Partial<DeviceInfo>): DetectionResult {
  const device: DeviceInfo = {
    id: input.id || `device-${Date.now()}`,
    name: input.name || 'Unknown Device',
    manufacturer: input.manufacturer || 'unknown',
    model: input.model || 'unknown',
    deviceType: input.deviceType || 'switch',
    ipAddress: input.ipAddress || '10.0.0.1',
    macAddress: input.macAddress,
    serialNumber: input.serialNumber,
    firmwareVersion: input.firmwareVersion,
    osType: input.osType || 'ios',
    ports: input.ports || 48,
    capabilities: input.capabilities || [],
  };

  return {
    success: true,
    device,
    confidence: 1.0,
  };
}

/**
 * Get configuration template for a specific device
 */
export function getConfigurationTemplate(device: DeviceInfo): string {
  const { manufacturer } = device;

  switch (manufacturer.toLowerCase()) {
    case 'cisco':
      return getCiscoConfiguration(device);
    case 'huawei':
      return getHuaweiConfiguration(device);
    case 'aruba':
      return getArubaConfiguration(device);
    case 'fortinet':
      return getFortinetConfiguration(device);
    default:
      return getGenericConfiguration(device);
  }
}

function getCiscoConfiguration(device: DeviceInfo): string {
  const { deviceType, name } = device;

  if (deviceType === 'switch') {
    return `! ===== CISCO SWITCH CONFIGURATION (ESTRICTA) =====
! Device: ${name}
configure terminal
hostname ${name.replace(/\s+/g, '-')}
enable secret class
service password-encryption
username admin privilege 15 secret cisco123

line vty 0 4
 transport input ssh
 login local

spanning-tree mode rapid-pvst

! VLANs (Ejemplo Base)
vlan 10
 name TI
vlan 20
 name Administrativo

interface range GigabitEthernet1/0/1-48
 switchport mode access
 switchport access vlan 20
 spanning-tree portfast
 spanning-tree bpduguard enable

interface range GigabitEthernet1/0/49-50
 switchport mode trunk
 switchport trunk allowed vlan 1,10,20

end
write memory`;
  } else if (deviceType === 'router') {
    return `! ===== CISCO ROUTER CONFIGURATION (ESTRICTA) =====
! Device: ${name}
configure terminal
hostname ${name.replace(/\s+/g, '-')}
enable secret class
service password-encryption

interface GigabitEthernet0/0/0
 ip address 203.0.113.1 255.255.255.0
 no shutdown

ip route 0.0.0.0 0.0.0.0 203.0.113.254

router ospf 1
 network 203.0.113.0 0.0.0.255 area 0

end
write memory`;
  }
  return getGenericConfiguration(device);
}

function getHuaweiConfiguration(device: DeviceInfo): string {
  const { deviceType, name } = device;
  if (deviceType === 'switch') {
    return `# ===== HUAWEI SWITCH CONFIGURATION (ESTRICTA) =====
system-view
sysname ${name.replace(/\s+/g, '-')}
user-interface vty 0 4
 authentication-mode aaa
aaa
 local-user admin privilege level 15 password cipher Huawei@123

vlan 10
vlan 20

interface GigabitEthernet0/0/1
 port link-type access
 port default vlan 10

interface GigabitEthernet0/0/49
 port link-type trunk
 port trunk allow-pass vlan 1 10 20

return
save`;
  }
  return getGenericConfiguration(device);
}

function getFortinetConfiguration(device: DeviceInfo): string {
  const { name } = device;
  return `# ===== FORTINET FORTIOS CONFIGURATION (ESTRICTA) =====
config system global
    set hostname ${name.replace(/\s+/g, '-')}
end

config system interface
    edit "port1"
        set ip 203.0.113.1 255.255.255.0
        set allowaccess ping https ssh
    next
end

config router static
    edit 1
        set gateway 203.0.113.254
        set device "port1"
        set dst 0.0.0.0 0.0.0.0
    next
end`;
}

function getArubaConfiguration(device: DeviceInfo): string {
  const { name } = device;
  return `# ===== ARUBA SWITCH CONFIGURATION (ESTRICTA) =====
configure terminal
hostname ${name.replace(/\s+/g, '-')}
vlan 10
 name "TI"
interface 1/1/1
 untagged vlan 10
exit`;
}

function getGenericConfiguration(device: DeviceInfo): string {
  return `! ===== GENERIC NETWORK DEVICE CONFIGURATION =====
! Device: ${device.name}
! Manufacturer: ${device.manufacturer}
hostname ${device.name.replace(/\s+/g, '-')}
ip address 10.0.0.1 255.255.255.0
save`;
}

export default {
  detectDevice,
  getConfigurationTemplate,
  MANUFACTURER_SIGNATURES,
};
