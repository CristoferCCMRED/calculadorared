import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIHelpChatProps {
  onClose?: () => void;
}

export default function AIHelpChat({ onClose }: AIHelpChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hola! Soy tu asistente de red. Puedo ayudarte con:\n• Diagnóstico de errores de configuración\n• Validación de dispositivos de red\n• Recomendaciones de topología\n• Solución de problemas de conectividad\n\n¿En qué puedo ayudarte?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response with intelligent error detection
    const lowerMessage = userMessage.toLowerCase();

    // Error detection patterns
    if (lowerMessage.includes('error') || lowerMessage.includes('falla') || lowerMessage.includes('problema')) {
      if (lowerMessage.includes('vlan')) {
        return `Detecté que mencionas un problema con VLANs. Aquí están las soluciones comunes:

1. **Verificar configuración de VLAN:**
   - Asegúrate de que la VLAN esté creada en el switch
   - Verifica que los puertos estén asignados correctamente
   - Usa: \`show vlan brief\` (Cisco) o \`display vlan\` (Huawei)

2. **Problemas de Trunk:**
   - Confirma que los puertos trunk permitan la VLAN
   - Verifica: \`show interfaces trunk\` (Cisco)

3. **Spanning Tree:**
   - Puede estar bloqueando la VLAN
   - Usa: \`show spanning-tree vlan [ID]\`

4. **Recomendación:**
   - Reinicia el switch si es necesario
   - Verifica la conectividad con ping entre dispositivos`;
      } else if (lowerMessage.includes('conectividad') || lowerMessage.includes('ping')) {
        return `Problema de conectividad detectado. Pasos para diagnosticar:

1. **Verificar estado de interfaces:**
   - Cisco: \`show interfaces status\`
   - Huawei: \`display interface brief\`

2. **Comprobar IP y máscara:**
   - \`show ip interface brief\` (Cisco)
   - \`display ip interface brief\` (Huawei)

3. **Verificar rutas:**
   - \`show ip route\` (Cisco)
   - \`display ip routing-table\` (Huawei)

4. **Prueba de ping:**
   - Desde el dispositivo: \`ping [IP]\`
   - Verifica ICMP no esté bloqueado en firewall

5. **Verificar ARP:**
   - \`show arp\` (Cisco)
   - \`display arp\` (Huawei)`;
      } else if (lowerMessage.includes('firewall')) {
        return `Problema de firewall detectado. Verificaciones:

1. **Estado del firewall:**
   - Cisco ASA: \`show firewall\`
   - Palo Alto: \`show running security-policy\`

2. **Reglas de acceso:**
   - Verifica que las ACLs permitan el tráfico
   - Cisco: \`show access-lists\`

3. **NAT Configuration:**
   - Cisco: \`show nat translations\`
   - Verifica que NAT esté correctamente configurado

4. **Zonas de seguridad:**
   - Huawei: \`display security-policy\`
   - Asegúrate que las zonas estén correctamente configuradas

5. **Logs:**
   - Revisa los logs del firewall para identificar tráfico bloqueado`;
      }
    }

    // Configuration recommendations
    if (lowerMessage.includes('recomendación') || lowerMessage.includes('sugerencia') || lowerMessage.includes('mejor práctica')) {
      return `Aquí están las mejores prácticas para configuración de red:

**Seguridad:**
- Implementar ACLs restrictivas
- Usar contraseñas fuertes (mínimo 12 caracteres)
- Habilitar SSH en lugar de Telnet
- Configurar SNMP v3 con autenticación

**Rendimiento:**
- Implementar QoS para servicios críticos
- Usar OSPF o BGP para routing dinámico
- Configurar Spanning Tree Priority correctamente
- Implementar Port Fast en accesos

**Disponibilidad:**
- Configurar redundancia en core
- Usar HSRP/VRRP para failover
- Implementar múltiples rutas
- Monitorear con SNMP

**Documentación:**
- Mantener diagrama de red actualizado
- Documentar cambios de configuración
- Crear plan de recuperación ante desastres`;
    }

    // Device detection help
    if (lowerMessage.includes('dispositivo') || lowerMessage.includes('device') || lowerMessage.includes('modelo')) {
      return `Para detectar dispositivos de red correctamente:

**Información necesaria:**
- Dirección IP del dispositivo
- Nombre de host (si está disponible)
- Modelo exacto del dispositivo
- Versión del sistema operativo

**Cómo obtener información:**
1. Conectar por SSH/Telnet
2. Ejecutar comandos de diagnóstico:
   - Cisco: \`show version\`
   - Huawei: \`display version\`
   - Juniper: \`show version\`

3. Verificar especificaciones:
   - Número de puertos
   - Capacidad de throughput
   - Características soportadas

**Dispositivos soportados:**
- Cisco (Catalyst, ASA, ISR)
- Huawei (S5700, S6700, AR, USG)
- Aruba (Instant On, CX)
- HP/HPE (ProCurve, Comware)
- Juniper (EX, SRX)
- Palo Alto Networks
- Fortinet FortiGate
- Mikrotik RouterOS
- Ubiquiti UniFi`;
    }

    // Topology help
    if (lowerMessage.includes('topología') || lowerMessage.includes('topology') || lowerMessage.includes('diagrama')) {
      return `Ayuda para diseño de topología:

**Topologías comunes:**

1. **Jerarquía de 3 capas:**
   - Core (núcleo)
   - Distribution (distribución)
   - Access (acceso)

2. **Mesh (Malla):**
   - Mayor redundancia
   - Más costosa
   - Mejor para centros de datos

3. **Star (Estrella):**
   - Más simple
   - Punto único de fallo
   - Buena para pequeñas redes

**Consideraciones:**
- Ancho de banda requerido
- Número de clientes
- Requisitos de redundancia
- Presupuesto disponible

**Recomendaciones:**
- Usar fibra óptica para enlaces principales
- Implementar VLAN por departamento
- Separar tráfico de datos y voz
- Planificar crecimiento futuro`;
    }

    // Default response
    return `Entendido. Para ayudarte mejor, puedo:

1. **Diagnosticar problemas:**
   - Proporciona detalles del error
   - Incluye comandos ejecutados
   - Describe el comportamiento esperado vs actual

2. **Validar configuraciones:**
   - Comparte fragmentos de configuración
   - Indicaré si hay problemas

3. **Recomendar topologías:**
   - Describe tu red actual
   - Número de clientes
   - Requisitos de disponibilidad

4. **Sugerir mejoras:**
   - Basadas en mejores prácticas
   - Considerando tu infraestructura

¿Cuál es tu pregunta específica?`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) {
      toast.error('Por favor ingresa un mensaje');
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aiResponse = await generateAIResponse(input);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Error al procesar la respuesta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Asistente de Red con IA</CardTitle>
            <CardDescription>
              Ayuda inteligente para diagnóstico y configuración
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString('es-ES')}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg rounded-bl-none">
              <Loader className="w-5 h-5 animate-spin text-slate-600 dark:text-slate-400" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <div className="border-t p-4 space-y-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe tu problema o pregunta... (Ctrl+Enter para enviar)"
          className="resize-none"
          rows={3}
          disabled={isLoading}
        />
        <div className="flex gap-2">
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="flex-1 gap-2"
          >
            <Send className="w-4 h-4" />
            Enviar
          </Button>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <strong>💡 Tip:</strong> Proporciona detalles específicos para mejores respuestas. Incluye errores, comandos ejecutados y comportamiento esperado.
          </p>
        </div>
      </div>
    </Card>
  );
}
