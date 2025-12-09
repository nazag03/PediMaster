# PediMasterClon

Este repositorio contiene un backend en .NET 8 y un frontend en React con Vite. Se eliminaron artefactos generados y se agregó un `.gitignore` para evitar que vuelvan a versionarse. Sigue estos pasos para preparar tu entorno desde cero.

> Estado del repositorio: el `.gitignore` ya está en la rama actual y las carpetas ignoradas (`node_modules`, `dist`, `.vs`, `bin`, `obj`, `.vite`) se eliminaron del control de versiones. Si clonas o sincronizas el proyecto, no deberías ver esos directorios en Git.

## Requisitos previos
- [.NET SDK 8](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/) y npm

## Backend (.NET)
1. Navega a la carpeta del backend:
   ```bash
   cd Back
   ```
2. Restaura dependencias:
   ```bash
   dotnet restore
   ```
3. Compila la solución:
   ```bash
   dotnet build
   ```
4. Ejecuta la API (opcional):
   ```bash
   dotnet run --project WebApi/WebApi.csproj
   ```

## Frontend (React + Vite)
1. Navega a la carpeta del frontend:
   ```bash
   cd Front/part1
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Levanta el entorno de desarrollo:
   ```bash
   npm run dev
   ```
4. Genera el build de producción:
   ```bash
   npm run build
   ```

## Notas sobre artefactos ignorados
El archivo `.gitignore` excluye dependencias, carpetas de compilación y artefactos de Vite (`node_modules`, `dist`, `.vs`, `bin`, `obj`, `.vite`). Si necesitas limpiar tu copia local, puedes borrar estas carpetas y volver a ejecutar los comandos anteriores.
