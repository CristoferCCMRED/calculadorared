Calculadora de Infraestructura de Red - Actualizaciones Principales
🚀 Calculadora de Infraestructura de Red Avanzada Una herramienta integral para el diseño, cálculo y configuración de redes empresariales. Esta aplicación permite gestionar VLAN, calcular anchos de banda, detectar dispositivos automáticamente y generar topologías de red profesionales.

✨ Características Principales • Detección Automática de Dispositivos: Identifica marca y modelo de equipos (Cisco, Huawei, Aruba, HP, Juniper, etc.) y genera plantillas de configuración específicas. • Generador de Comandos: Crea scripts de configuración basados ​​en tu propuesta real (VLANs, IPs, Áreas). • Topologías Estilo GNS3: Visualización de diagramas con sugerencias de arquitectura (Malla, Estrella, Jerárquico). • Validación de Red: Herramientas integradas de Ping, Telnet y SSH. • Chat de Ayuda con IA: Asistente inteligente para diagnóstico de errores y mejores prácticas. • Gestión de Clientes: Administración de sedes, servicios e inventario (renombrado de "Usuarios" a "Clientes"). • Informes Profesionales: Exportación de informes técnicos en HTML, PDF y DOCX.

🛠️ Requisitos Previos Antes de comenzar, asegúrese de tener instalado: • Node.js (Versión 18.0 o superior) • npm (Incluido con Node.js)

🚀 Instalación y Ejecución Sigue estos pasos según tu sistema operativo:

Clonar o Descargar el Proyecto Si usas Git: git init 
                                            git clone ( https://github.com/CristoferCCMRED/calculadorared.git ) cd calculadora-red

Instalar Dependencias En la terminal, dentro de la carpeta del proyecto, ejecuta: npm install --legacy-peer-deps

Ejecutar la Aplicación Modo Desarrollo (Recomendado) Para ejecutar localmente con recarga automática: npm run dev La aplicación se abrirá en: http://localhost:3000 (o el puerto que indica la terminal).

Modo Producción Para compilar y ejecutar la versión optimizada: npm run build npm start La aplicación estará disponible en: http://localhost:3000 .

💻 Guía por Sistema Operativo Windows 11 • Usa PowerShell o Windows Terminal. • Si tiene errores de permisos al ejecutar scripts, abra PowerShell como Administrador y ejecute: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

macOS / Linux • Usa la Terminal nativa. • Asegúrese de tener permisos de escritura en la carpeta del proyecto: chmod -R 755.

📂 Estructura del Proyecto • /cliente: Código fuente del frontend (React + Vite). • /server: Servidor backend para gestión de archivos y reportes. • /shared: Constantes y tipos compartidos. • /client/src/lib: Bibliotecas de detección de dispositivos y validación.

📋 Resumen de Cambios
Esta versión incluye actualizaciones significativas para mejorar la funcionalidad, escalabilidad y usabilidad de la aplicación de diseño de redes empresariales.

✨ Nuevas Características
1. Detección Automática de Dispositivos
Detección inteligente de fabricantes (Cisco, Huawei, Aruba, HP, Juniper, Palo Alto, Fortinet, Mikrotik, Ubiquiti)
Reconocimiento automático de modelos de dispositivos.
Generación automática de configuraciones específicas del fabricante
Soporte para múltiples tipos de dispositivos (switches, firewalls, enrutadores, AP, etc.)
Ubicación: Pestaña "Dispositivos"

2. Validación de Conectividad de Red
Validación de Ping (ICMP)
Validación de Telnet (TCP 23)
Validación de SSH (TCP 22)
Validación en lote de múltiples hosts
Historial de validaciones con estadísticas.
Ubicación: Pestaña "Validación"

3. Topología de Red Avanzada (Estilo GNS3)
4 sugerencias de topología predefinidas:

Jerárquica (3 Capas): Diseño clásico con Core, Distribución y Acceso
Malla (Mesh): Máxima redundancia con múltiples caminos
Estrella (Star): Diseño simple y económico
Core Colapsado: Equilibrio entre costo y rendimiento
Diagramas SVG interactivos

Cálculo automático de dispositivos necesarios

Ventajas y desventajas de cada topología

Exportación de topología como PNG

Recomendaciones de uso

Ubicación: Pestaña "Topología"

4. Integración de Terminal
Soporte para múltiples métodos de conexión:

SSH
Telnet
Masilla
MobaXterm
CMD (Windows)
Terminal (Linux/Mac)
Plantillas de comandos rápidos para:

Cisco IOS
Huawei VRP
Juniper Junos
Comandos genéricos
Generación de cadenas de conexión

Ejecución simulada de comandos

Historial de comandos

Descarga de logs de terminal

Ubicación: Pestaña "Terminal"

5. Chat de Ayuda con IA
Asistente inteligente para diagnóstico de problemas

Detección automática de errores comunes:

Problemas de VLAN
Problemas de conectividad
Configuración de firewall
Recomendaciones de topología
Mejores prácticas de seguridad, rendimiento y disponibilidad.

Interfaz conversacional en tiempo real

Ubicación: Pestaña "Ayuda IA"

6. Informe de configuración completo
Generación de informes profesionales

Formatos soportados:

HTML (con estilos profesionales)
PDF (exportable)
DOCX (exportable)
Contenido del informe:

Resumen ejecutivo con estadisticas
Configuración de VLANs
Cálculos de ancho de banda
Inventario de dispositivos
Topología de red
Recomendaciones y mejores prácticas
Funcionalidades:

Descarga de informe
Impresión directa
Compartir por correo electrónico
Vista previa interactiva
Ubicación: Pestaña "Informe"

7. Renombrado de "Usuarios" a "Clientes"
Cambio de terminología en toda la aplicación
Actualización de interfaces de usuario
Compatibilidad con datos anteriores
🔧 Bibliotecas y Módulos Creados
lib/deviceDetection.ts
- detectDevice(input): Detecta dispositivos automáticamente
- getConfigurationTemplate(device): Genera configuración específica
- MANUFACTURER_SIGNATURES: Firmas de fabricantes
lib/networkValidation.ts
- validatePing(host): Valida conectividad ICMP
- validateTelnet(host, port): Valida conectividad Telnet
- validateSSH(host, port): Valida conectividad SSH
- validateMultipleHosts(): Validación en lote
- checkNetworkStatus(): Estado de conectividad
- validateIPAddress(): Valida formato IP
- validatePort(): Valida número de puerto
- validateHostname(): Valida formato de hostname
- parseConnectionString(): Parsea cadenas de conexión
📱 Compatibilidad multiplataforma
La aplicación es completamente compatible con:

Navegadores Web:

Cromo/Cromo 90+
Firefox 88+
Safari 14+
Edge 90+
Sistemas Operativos:

Windows 10/11
macOS 10.15+
Linux (Ubuntu 18.04+, Debian 10+, CentOS 7+)
Métodos de Conexión Soportados:

SSH (OpenSSH, PuTTY, MobaXterm)
Telnet (Clientes nativos)
Terminal integrada (simulada en navegador)
Integración con herramientas locales
🎯 Casos de Uso
1. Diseño de Red Empresarial
Crear propuestas de infraestructura.
Calculadora de VLAN y subredes
Estimar ancho de banda requerido
Generar topología recomendada
2. Diagnóstico de Problemas
Usar el chat de IA para solucionar problemas
Validar conectividad con Ping/Telnet/SSH
Revisar configuraciones de dispositivos
Generar informe de diagnóstico
3. Configuración de Dispositivos
Detectar dispositivos automáticamente
Generar configuraciones específicas
Ejecutar comandos en terminal
Documentar cambios en informe
4. Planificación de Topología
Explorar 4 opciones de topología
Comparar ventajas y desventajas
Calcular dispositivos necesarios
Exportar diagrama para documentación
📊 Características de Informes
Resumen Ejecutivo:

Total de clientes
Número de edificios
VLANs configuradas
Dispositivos de red
Detalles Técnicos:

Configuración de VLAN (ID, nombre, área, prioridad)
Cálculos de ancho de banda (requerido, recomendado, respaldo)
Inventario de dispositivos (nombre, fabricante, modelo, tipo, IP)
Topología de red utilizada
Recomendaciones:

Seguridad (ACL, SSH, SNMP v3, registro de eventos)
Rendimiento (QoS, OSPF/BGP, Port Fast, agregación de enlaces)
Disponibilidad (redundancia, HSRP/VRRP, múltiples rutas, copias de seguridad)
🔒 Seguridad
Validación de entrada en todos los formularios
Sanitización de datos
Protección contra inyección de comandos
Manejo seguro de credenciales (no almacenadas)
HTTPS recomendado en producción
🚀 Rendimiento
Compilación optimizada con Vite
Carga diferida de componentes
Almacenamiento en caché de configuraciones
Validaciones asincrónicas
Interfaz responsiva
📝 Guía de Uso Rápido
Crear una Propuesta
Ir a pestaña "Calculadora"
Ingresar datos de sedes y clientes
Configurar VLANs
Calcular ancho de banda
Guardar propuesta
Detectar Dispositivos
Ir a pestaña "Dispositivos"
Ingresar información del dispositivo
Sistema detecta fabricante y modelo
Genera configuración automáticamente
Descargar o copiar configuración
Validar Conectividad
Ir a pestaña "Validación"
Host/IP de Ingresar
Seleccionar protocolo (Ping/Telnet/SSH)
Ejecutar validación
Ver resultados en historial
Generar Informe
Seleccionar propuesta en "Propuestas"
Ir a pestaña "Informe"
Seleccionar formato (HTML/PDF/DOCX)
Descargar, imprimir o compartir
🔄 Integración con Herramientas Externas
Integración de terminales
Genera comandos para SSH, Telnet, PuTTY, MobaXterm
Compatible con scripts de automatización
Exportar registros de configuración
Exportación de Datos
Formatos: JSON, CSV, Word, PDF
Compatible con herramientas de documentación
Importación de propuestas anteriores
📚 Documentación Técnica
Componentes Principales:

NetworkCalculator.tsx- Calculadora principal
DeviceDetectionManager.tsx- Gestión de dispositivos
NetworkValidationTool.tsx- Validación de red
AdvancedTopologyDiagram.tsx- Topología GNS3
TerminalIntegration.tsx- Integración de terminal
AIHelpChat.tsx- Chat de ayuda
ConfigurationReport.tsx- Generación de reportes
Librerías Utilizadas:

React 18+
Mecanografiado
Vite
Interfaz de usuario Radix
Tailwind CSS
Sonner (Tostadas)
Chart.js (Gráficos)
🐛 Solución de Problemas
Problema: Dispositivo no detectado

Solución: Verificar que el nombre del fabricante esté correcto
Alternativa: Agregar manualmente
Problema: Validación de falla de conectividad

Solución: Verificar IP/nombre de host y puerto
Nota: Ping en navegador usa HTTP HEAD request
Problema: Terminal no muestra salida

Solución: Verificar que el comando sea válido
Nota: Terminal es simulada en navegador
Todos los derechos reservados © 2024

Historial de Prompts (Evolución del Desarrollo) Para fines académicos, a continuación se documenta la secuencia de requerimientos (prompts) que dieron vida a esta herramienta:

Diseño Base: Requerimiento de infraestructura para 4 sedes (S1: 830, S2: 1240, S3: 210) con áreas específicas (TI, Admin, Ops, RRHH, Invitados, VIP), alta disponibilidad y cálculo de ancho de banda.

App de Cálculo: Solicitud de una aplicación en lenguajes sencillos para calcular requerimientos en base a un archivo de propuesta.

Generador de Topología e Inventario: Adición de funcionalidad para generar diagramas según pisos/puestos y listar el hardware necesario (SW, FW, Routers, APs, Cámaras).

Soporte de Archivos: Permitir la carga de la propuesta en Procesador de Texto, PDF o .json.

Entradas Detallados y Multimarca: Formulario para cantidad de usuarios cableados, WiFi, VMs; y generación de comandos para Cisco, Huawei, HP, Aruba.

Cálculo Dinámico: Recálculo automático de ancho de banda al detectar nuevos servicios.

IPv6 y Configuración Directa: Cambio de concepto de "usuarios" a "clientes". Adición de mapeo IPv4/IPv6, inventario detallado por áreas, interfaz corporativa y descarga de scripts de autoconfiguración.

Módulo VPN: Capacidad de editar VPN Site-to-Site y VPN de clientes.

Integración PuTTY y Corrección de Marcas: Botón para abrir PuTTY local y restauración de generación de comandos para Fortinet, Palo Alto, etc.

Restauración de UI: Recuperación de las pestañas de "Proveedores" y "Tipos de Dispositivo".

Cobertura Total: La configuración arrojada debe abarcar la propuesta completa.

Detección de Hardware: Botón para escanear y mostrar dispositivos conectados.

SSH Integrado: Implementación de un cliente SSH nativo en el backend para enviar comandos directamente a los equipos de red.

Versión: 3.0.0
Última actualización: Mayo 2024
