import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Printer, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ConfigurationReportProps {
  siteName: string;
  clients: number;
  buildings: number;
  vlans: any[];
  bandwidth: any;
  devices: any[];
  topology: any;
  timestamp?: string;
}

export default function ConfigurationReport({
  siteName,
  clients,
  buildings,
  vlans,
  bandwidth,
  devices,
  topology,
  timestamp = new Date().toISOString(),
}: ConfigurationReportProps) {
  const [reportFormat, setReportFormat] = useState<'html' | 'pdf' | 'docx'>('html');

  const generateHTMLReport = (): string => {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informe de Configuración de Red - ${siteName}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .section {
            background: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .section h2 {
            color: #667eea;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            margin-top: 0;
        }
        .section h3 {
            color: #764ba2;
            margin-top: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        table th {
            background: #667eea;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        table td {
            padding: 10px 12px;
            border-bottom: 1px solid #ddd;
        }
        table tr:hover {
            background: #f9f9f9;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-card .value {
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
        }
        .stat-card .label {
            opacity: 0.9;
            font-size: 0.9em;
        }
        .device-config {
            background: #f9f9f9;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
            overflow-x: auto;
        }
        .vlan-item {
            background: #f0f4ff;
            padding: 10px;
            margin: 5px 0;
            border-radius: 4px;
            border-left: 3px solid #667eea;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 0.9em;
            border-top: 1px solid #ddd;
            margin-top: 30px;
        }
        .page-break {
            page-break-after: always;
        }
        @media print {
            body {
                background: white;
            }
            .section {
                box-shadow: none;
                border: 1px solid #ddd;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Informe de Configuración de Red</h1>
        <p>${siteName}</p>
        <p>Generado: ${new Date(timestamp).toLocaleString('es-ES')}</p>
    </div>

    <div class="section">
        <h2>Resumen Ejecutivo</h2>
        <div class="stats">
            <div class="stat-card">
                <div class="label">Total de Clientes</div>
                <div class="value">${clients}</div>
            </div>
            <div class="stat-card">
                <div class="label">Edificios</div>
                <div class="value">${buildings}</div>
            </div>
            <div class="stat-card">
                <div class="label">VLANs Configuradas</div>
                <div class="value">${vlans.length || 0}</div>
            </div>
            <div class="stat-card">
                <div class="label">Dispositivos</div>
                <div class="value">${devices.length || 0}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Configuración de VLANs</h2>
        ${vlans && vlans.length > 0 ? `
        <table>
            <thead>
                <tr>
                    <th>VLAN ID</th>
                    <th>Nombre</th>
                    <th>Área</th>
                    <th>Prioridad</th>
                </tr>
            </thead>
            <tbody>
                ${vlans.map((vlan: any) => `
                <tr>
                    <td><strong>${vlan.vlan}</strong></td>
                    <td>${vlan.name || 'N/A'}</td>
                    <td>${vlan.area || 'N/A'}</td>
                    <td>${vlan.priority || 'Normal'}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        ` : '<p>No hay VLANs configuradas</p>'}
    </div>

    <div class="section">
        <h2>Cálculo de Ancho de Banda</h2>
        ${bandwidth ? `
        <table>
            <thead>
                <tr>
                    <th>Métrica</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Ancho de Banda Requerido</td>
                    <td><strong>${bandwidth.required || 'N/A'} Gbps</strong></td>
                </tr>
                <tr>
                    <td>Ancho de Banda Recomendado</td>
                    <td><strong>${bandwidth.recommended || 'N/A'} Gbps</strong></td>
                </tr>
                <tr>
                    <td>Ancho de Banda de Respaldo</td>
                    <td><strong>${bandwidth.backup || 'N/A'} Gbps</strong></td>
                </tr>
            </tbody>
        </table>
        ` : '<p>No hay datos de ancho de banda</p>'}
    </div>

    <div class="section page-break">
        <h2>Dispositivos de Red</h2>
        ${devices && devices.length > 0 ? `
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Fabricante</th>
                    <th>Modelo</th>
                    <th>Tipo</th>
                    <th>IP</th>
                </tr>
            </thead>
            <tbody>
                ${devices.map((device: any) => `
                <tr>
                    <td>${device.name || 'N/A'}</td>
                    <td>${device.manufacturer || 'N/A'}</td>
                    <td>${device.model || 'N/A'}</td>
                    <td>${device.deviceType || 'N/A'}</td>
                    <td><code>${device.ipAddress || 'N/A'}</code></td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        ` : '<p>No hay dispositivos registrados</p>'}
    </div>

    <div class="section">
        <h2>Topología de Red</h2>
        ${topology ? `
        <p><strong>Tipo de Topología:</strong> ${topology.type || 'No especificado'}</p>
        <p><strong>Descripción:</strong> ${topology.description || 'N/A'}</p>
        ` : '<p>No hay información de topología</p>'}
    </div>

    <div class="section">
        <h2>Recomendaciones y Mejores Prácticas</h2>
        <h3>Seguridad</h3>
        <ul>
            <li>Implementar ACLs restrictivas en todos los firewalls</li>
            <li>Usar SSH en lugar de Telnet para acceso remoto</li>
            <li>Configurar SNMP v3 con autenticación</li>
            <li>Habilitar logging y monitoreo en tiempo real</li>
        </ul>
        <h3>Rendimiento</h3>
        <ul>
            <li>Implementar QoS para servicios críticos</li>
            <li>Usar OSPF o BGP para routing dinámico</li>
            <li>Configurar Port Fast en accesos</li>
            <li>Implementar Link Aggregation para mayor ancho de banda</li>
        </ul>
        <h3>Disponibilidad</h3>
        <ul>
            <li>Configurar redundancia en core y distribución</li>
            <li>Usar HSRP/VRRP para failover automático</li>
            <li>Implementar múltiples rutas</li>
            <li>Realizar backups regulares de configuración</li>
        </ul>
    </div>

    <div class="footer">
        <p>Este informe fue generado automáticamente por el Calculador de Red</p>
        <p>Fecha: ${new Date(timestamp).toLocaleString('es-ES')}</p>
        <p>© 2024 - Todos los derechos reservados</p>
    </div>
</body>
</html>
    `;
  };

  const handleDownloadReport = async () => {
    try {
      if (reportFormat === 'html') {
        const html = generateHTMLReport();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${siteName}-report-${Date.now()}.html`;
        link.click();
        URL.revokeObjectURL(url);
      } else if (reportFormat === 'pdf') {
        // In a real scenario, this would use a PDF library like jsPDF
        toast.info('Exportación a PDF requiere configuración del servidor');
      } else if (reportFormat === 'docx') {
        toast.info('Exportación a DOCX requiere configuración del servidor');
      }
      
      toast.success(`Informe descargado en formato ${reportFormat.toUpperCase()}`);
    } catch (error) {
      toast.error('Error al descargar el informe');
    }
  };

  const handlePrintReport = () => {
    const html = generateHTMLReport();
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleShareReport = () => {
    const html = generateHTMLReport();
    const blob = new Blob([html], { type: 'text/html' });
    
    if (navigator.share) {
      navigator.share({
        title: `Informe de Red - ${siteName}`,
        text: 'Informe de configuración de red',
        files: [new File([blob], `${siteName}-report.html`, { type: 'text/html' })],
      }).catch(err => console.log('Error sharing:', err));
    } else {
      toast.info('Compartir no está disponible en este navegador');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informe de Configuración</CardTitle>
          <CardDescription>
            Generado para {siteName} - {new Date(timestamp).toLocaleDateString('es-ES')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Format Selection */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Formato de Informe</label>
            <div className="flex gap-2">
              {['html', 'pdf', 'docx'].map(format => (
                <Button
                  key={format}
                  variant={reportFormat === format ? 'default' : 'outline'}
                  onClick={() => setReportFormat(format as any)}
                  className="uppercase text-xs"
                >
                  {format}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleDownloadReport} className="gap-2">
              <Download className="w-4 h-4" />
              Descargar Informe
            </Button>
            <Button onClick={handlePrintReport} variant="outline" className="gap-2">
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
            <Button onClick={handleShareReport} variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Compartir
            </Button>
            <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              Enviar por Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Vista Previa del Informe</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Resumen</TabsTrigger>
              <TabsTrigger value="vlans">VLANs</TabsTrigger>
              <TabsTrigger value="devices">Dispositivos</TabsTrigger>
              <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-blue-50 dark:bg-blue-950">
                  <CardContent className="pt-6">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">Clientes</p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{clients}</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 dark:bg-green-950">
                  <CardContent className="pt-6">
                    <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Edificios</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">{buildings}</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 dark:bg-purple-950">
                  <CardContent className="pt-6">
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">VLANs</p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{vlans?.length || 0}</p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-50 dark:bg-orange-950">
                  <CardContent className="pt-6">
                    <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold">Dispositivos</p>
                    <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{devices?.length || 0}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="vlans">
              {vlans && vlans.length > 0 ? (
                <div className="space-y-2">
                  {vlans.map((vlan: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">VLAN {vlan.vlan}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{vlan.name || 'Sin nombre'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600 dark:text-slate-400">{vlan.area || 'N/A'}</p>
                          <p className="text-xs text-slate-500">{vlan.priority || 'Normal'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-400">No hay VLANs configuradas</p>
              )}
            </TabsContent>

            <TabsContent value="devices">
              {devices && devices.length > 0 ? (
                <div className="space-y-2">
                  {devices.map((device: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{device.name}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {device.manufacturer} {device.model}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-mono text-slate-600 dark:text-slate-400">{device.ipAddress}</p>
                          <p className="text-xs text-slate-500 capitalize">{device.deviceType}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-400">No hay dispositivos registrados</p>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Seguridad</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Implementar ACLs restrictivas</li>
                  <li>Usar SSH en lugar de Telnet</li>
                  <li>Configurar SNMP v3</li>
                  <li>Habilitar logging</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Rendimiento</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Implementar QoS</li>
                  <li>Usar OSPF o BGP</li>
                  <li>Configurar Port Fast</li>
                  <li>Link Aggregation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Disponibilidad</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Redundancia en core</li>
                  <li>HSRP/VRRP</li>
                  <li>Múltiples rutas</li>
                  <li>Backups regulares</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
