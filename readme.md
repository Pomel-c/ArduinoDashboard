# Sistema de Monitoreo de Motores

## Descripción

Esta aplicación Node.js proporciona una interfaz web para monitorear varios motores. Los datos de los motores se leen a través de un Arduino y se muestran en tiempo real en la interfaz web.

## Archivos

### server.js

Este es el archivo principal de la aplicación. Aquí es donde se configura y se inicia el servidor.

### table.ejs

Este archivo es una plantilla EJS que genera una página HTML para mostrar los datos de Arduino.

### layout.ejs

Este archivo es una plantilla EJS que proporciona la estructura básica de las páginas HTML de la aplicación.

### index.ejs

Este archivo es una plantilla EJS que genera la página de inicio de la aplicación.

### detail.ejs

Este archivo es una plantilla EJS que genera la página de detalles de un motor específico.

## Instalación

Para instalar y ejecutar esta aplicación necesitas tener instalado Node.js y npm. Después de clonar el repositorio, debes ejecutar:

```bash
npm install
```
Esto instalará todas las dependencias necesarias para la aplicación.

Uso
Para iniciar la aplicación, ejecuta:

```bash
node server.js
```

