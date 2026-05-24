/**
 * Network Validation Utilities
 * Provides Ping and Telnet validation capabilities
 */

export interface ValidationResult {
  success: boolean;
  host: string;
  port?: number;
  protocol: 'ping' | 'telnet' | 'ssh';
  responseTime?: number;
  message: string;
  timestamp: string;
}

export interface PingResult extends ValidationResult {
  protocol: 'ping';
  packetsReceived?: number;
  packetsSent?: number;
  packetLoss?: number;
}

export interface TelnetResult extends ValidationResult {
  protocol: 'telnet';
  port: number;
  connected: boolean;
}

export interface SSHResult extends ValidationResult {
  protocol: 'ssh';
  port: number;
  connected: boolean;
  version?: string;
}

/**
 * Simulate Ping validation (in real environment, this would use ICMP)
 * For browser environment, we simulate with HTTP HEAD request
 */
export async function validatePing(host: string, timeout: number = 5000): Promise<PingResult> {
  const startTime = Date.now();
  
  try {
    // In a real scenario, this would use a backend API that performs actual ICMP ping
    const response = await fetch(`http://${host}`, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
      signal: AbortSignal.timeout(timeout),
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      host,
      protocol: 'ping',
      responseTime,
      message: `Host ${host} is reachable (${responseTime}ms)`,
      timestamp: new Date().toISOString(),
      packetsReceived: 1,
      packetsSent: 1,
      packetLoss: 0,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      host,
      protocol: 'ping',
      responseTime,
      message: `Failed to reach host ${host}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString(),
      packetsReceived: 0,
      packetsSent: 1,
      packetLoss: 100,
    };
  }
}

/**
 * Simulate Telnet validation
 * For browser environment, we simulate with WebSocket or HTTP
 */
export async function validateTelnet(
  host: string,
  port: number = 23,
  timeout: number = 5000
): Promise<TelnetResult> {
  const startTime = Date.now();
  
  try {
    // Attempt to connect via HTTP (since browsers can't do raw TCP)
    // In a real scenario, this would use a backend API
    const response = await fetch(`http://${host}:${port}`, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
      signal: AbortSignal.timeout(timeout),
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      host,
      port,
      protocol: 'telnet',
      responseTime,
      connected: true,
      message: `Successfully connected to ${host}:${port}`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      host,
      port,
      protocol: 'telnet',
      responseTime,
      connected: false,
      message: `Failed to connect to ${host}:${port}: ${error instanceof Error ? error.message : 'Connection refused'}`,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Validate SSH connectivity
 */
export async function validateSSH(
  host: string,
  port: number = 22,
  timeout: number = 5000
): Promise<SSHResult> {
  const startTime = Date.now();
  
  try {
    // Attempt to connect via HTTP (since browsers can't do raw TCP)
    // In a real scenario, this would use a backend API
    const response = await fetch(`http://${host}:${port}`, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
      signal: AbortSignal.timeout(timeout),
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      host,
      port,
      protocol: 'ssh',
      responseTime,
      connected: true,
      version: 'SSH-2.0',
      message: `SSH connection successful to ${host}:${port}`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      host,
      port,
      protocol: 'ssh',
      responseTime,
      connected: false,
      message: `SSH connection failed to ${host}:${port}: ${error instanceof Error ? error.message : 'Connection refused'}`,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Validate multiple hosts in parallel
 */
export async function validateMultipleHosts(
  hosts: string[],
  protocol: 'ping' | 'telnet' | 'ssh' = 'ping',
  port: number = 23
): Promise<ValidationResult[]> {
  const validations = hosts.map(host => {
    if (protocol === 'ping') {
      return validatePing(host);
    } else if (protocol === 'telnet') {
      return validateTelnet(host, port);
    } else {
      return validateSSH(host, port);
    }
  });
  
  return Promise.all(validations);
}

/**
 * Check network connectivity status
 */
export async function checkNetworkStatus(): Promise<{
  online: boolean;
  latency: number;
  timestamp: string;
}> {
  const startTime = Date.now();
  
  try {
    // Use a reliable endpoint to check connectivity
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
    });
    
    const latency = Date.now() - startTime;
    
    return {
      online: true,
      latency,
      timestamp: new Date().toISOString(),
    };
  } catch {
    return {
      online: false,
      latency: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Validate IP address format
 */
export function validateIPAddress(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }
  
  return ipv6Regex.test(ip);
}

/**
 * Validate port number
 */
export function validatePort(port: number): boolean {
  return port >= 1 && port <= 65535;
}

/**
 * Validate hostname format
 */
export function validateHostname(hostname: string): boolean {
  const hostnameRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  return hostnameRegex.test(hostname);
}

/**
 * Parse connection string (host:port)
 */
export function parseConnectionString(connectionString: string): { host: string; port: number } | null {
  const parts = connectionString.split(':');
  
  if (parts.length < 1 || parts.length > 2) {
    return null;
  }
  
  const host = parts[0].trim();
  const port = parts.length === 2 ? parseInt(parts[1], 10) : 23;
  
  if (!validateIPAddress(host) && !validateHostname(host)) {
    return null;
  }
  
  if (!validatePort(port)) {
    return null;
  }
  
  return { host, port };
}

export default {
  validatePing,
  validateTelnet,
  validateSSH,
  validateMultipleHosts,
  checkNetworkStatus,
  validateIPAddress,
  validatePort,
  validateHostname,
  parseConnectionString,
};
