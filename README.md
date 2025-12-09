# Guía de Configuración CI/CD para Backend

## 📋 Tabla de Contenidos

- [¿Qué es CI/CD?](#-qué-es-cicd)
- [Prerrequisitos](#-prerrequisitos)
- [Paso 1: Configurar el Proyecto](#-paso-1-configurar-el-proyecto)
- [Paso 2: Configurar GitHub Actions](#-paso-2-configurar-github-actions)
- [Paso 3: Configurar el Servidor](#-paso-3-configurar-el-servidor)
- [Paso 4: Nginx y Dominio](#-paso-4-nginx-y-dominio)
- [Flujo de Trabajo](#-flujo-de-trabajo)
- [Solución de Problemas](#-solución-de-problemas)
- [Recursos Adicionales](#-recursos-adicionales)

## 🔄 ¿Qué es CI/CD?

### CI (Continuous Integration) - Integración Continua

Automatiza la verificación de tu código en cada cambio. Detecta problemas temprano al ejecutar:

- ✅ Tests automatizados
- ✅ Análisis de código (linting)
- ✅ Verificación de formato
- ✅ Builds de compilación

### CD (Continuous Deployment) - Despliegue Continuo

Automatiza el despliegue a producción, permitiendo:

- 🚀 Releases frecuentes y confiables
- 🔄 Eliminación de errores humanos
- 📦 Despliegues automáticos tras CI exitoso

## 🛠️ Prerrequisitos

### Software Necesario

- [x] Cuenta en [GitHub](https://github.com)
- [x] Servidor/VPS (DigitalOcean, AWS, Linode, etc.)
- [x] Node.js 18+ instalado localmente
- [x] Git instalado

### Configuración Inicial del Proyecto

Asegúrate de que tu proyecto tenga:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "test": "jest --passWithNoTests",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

## 📁 Paso 1: Configurar el Proyecto

### 1.1 Instalar Dependencias de Desarrollo

```bash
npm install --save-dev jest supertest eslint prettier
```

### 1.2 Crear Archivo de Configuración ESLint (`.eslintrc.json`)

```json
{
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "env": {
    "node": true,
    "es6": true,
    "jest": true
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn"
  }
}
```

### 1.3 Crear Archivo de Configuración Prettier (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "printWidth": 80
}
```

### 1.4 Crear Tests Básicos

Crea el directorio y archivo de tests:

```
__tests__/
└── app.test.js
```

**`__tests__/app.test.js`:**

```javascript
import request from "supertest";

// Nota: Debes exportar tu app desde index.js
describe("API Tests", () => {
  test("GET /api/stats should return 200", async () => {
    // Tu código de test aquí
  });
});
```

## ⚙️ Paso 2: Configurar GitHub Actions

### 2.1 Estructura de Directorios

Crea la siguiente estructura en tu proyecto:

```
.github/
└── workflows/
    ├── ci.yml      # Pipeline de integración continua
    └── cd.yml      # Pipeline de despliegue continuo
```

### 2.2 Pipeline CI (`.github/workflows/ci.yml`)

```yaml
name: CI Pipeline

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  test-and-lint:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run tests
        run: npm test
        env:
          NODE_ENV: test
          MONGODB_URI: mongodb://localhost:27017/test_db
          PORT: 3000

      - name: Check formatting
        run: npx prettier --check .
```

### 2.3 Pipeline CD (`.github/workflows/cd.yml`)

```yaml
name: CD Pipeline

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20.x"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Deploy to Server
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.SERVER_PORT }}
          script: |
            cd /var/www/spotify-backend
            git pull origin main
            npm ci --only=production
            pm2 restart spotify-backend || pm2 start src/index.js --name spotify-backend
            pm2 save
```

### 2.4 Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. **Settings → Secrets and variables → Actions**
3. Agrega los siguientes secrets:

| Secret            | Descripción               | Ejemplo                           |
| ----------------- | ------------------------- | --------------------------------- |
| `SERVER_HOST`     | IP o dominio del servidor | `123.456.789.0`                   |
| `SERVER_USER`     | Usuario SSH               | `ubuntu`                          |
| `SSH_PRIVATE_KEY` | Clave privada SSH         | `-----BEGIN RSA PRIVATE KEY-----` |
| `SERVER_PORT`     | Puerto SSH (default: 22)  | `22`                              |

## 🖥️ Paso 3: Configurar el Servidor

### 3.1 Conectarse al Servidor

```bash
ssh usuario@tu-servidor-ip
```

### 3.2 Instalar Dependencias del Sistema

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 (gestor de procesos)
sudo npm install -g pm2

# Instalar Git
sudo apt-get install git -y

# Instalar MongoDB (si usas servidor local)
sudo apt-get install mongodb -y
```

### 3.3 Configurar el Proyecto en el Servidor

```bash
# Crear directorio del proyecto
sudo mkdir -p /var/www/spotify-backend
sudo chown $USER:$USER /var/www/spotify-backend

# Navegar al directorio
cd /var/www/spotify-backend

# Clonar repositorio (usando HTTPS o SSH)
git clone https://github.com/tu-usuario/tu-repositorio.git .

# Instalar dependencias de producción
npm ci --only=production

# Crear archivo .env con tus variables
nano .env
# Pegar contenido:
# PORT=3000
# MONGODB_URI=tu_uri_mongodb
# CLOUDINARY_CLOUD_NAME=...
# etc.
```

### 3.4 Iniciar la Aplicación con PM2

```bash
# Iniciar aplicación
pm2 start src/index.js --name spotify-backend

# Configurar inicio automático
pm2 startup
# Sigue las instrucciones que aparecen
pm2 save

# Ver estado
pm2 status
pm2 logs spotify-backend
```

## 🌐 Paso 4: Nginx y Dominio

### 4.1 Instalar y Configurar Nginx

```bash
# Instalar Nginx
sudo apt install nginx -y

# Crear configuración del sitio
sudo nano /etc/nginx/sites-available/spotify-backend
```

### 4.2 Configuración de Nginx

```nginx
server {
    listen 80;
    server_name tu-dominio.com; # o tu IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 4.3 Habilitar y Probar Configuración

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/spotify-backend /etc/nginx/sites-enabled/

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 4.4 Configurar SSL con Certbot (HTTPS Gratis)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com

# Configurar renovación automática
sudo certbot renew --dry-run
```

## 🔄 Flujo de Trabajo

### Diagrama del Pipeline

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Push/PR a     │────▶│   GitHub Actions │────▶│   Tests & Lint  │
│   main/develop  │     │   (CI Pipeline)  │     │   Automatizados │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
┌─────────────────┐     ┌─────────────────┐     ┌───────▼────────┐
│   Servidor de   │◀────│   Deploy        │◀────│   Si todo      │
│   Producción    │     │   Automático    │     │   pasa ✅      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Pasos del Despliegue Automático

1. **Push a `main`** → Se activa el pipeline
2. **GitHub Actions** ejecuta:
   - ✅ Instalación de dependencias
   - ✅ Tests automatizados
   - ✅ Verificación de código
3. **Si todo pasa** → Despliegue automático
4. **Servidor** actualiza:
   - 📥 Pull del código más reciente
   - 📦 Instalación de dependencias
   - 🔄 Reinicio de la aplicación

## 🐛 Solución de Problemas

### Problemas Comunes y Soluciones

| Problema                           | Posible Causa                  | Solución                                                                    |
| ---------------------------------- | ------------------------------ | --------------------------------------------------------------------------- |
| **Error de SSH en GitHub Actions** | Clave SSH mal configurada      | Verificar que la clave privada esté correctamente copiada en GitHub Secrets |
| **PM2 no encuentra la app**        | Ruta incorrecta en el servidor | Verificar que estás en `/var/www/spotify-backend`                           |
| **Variables de entorno faltantes** | Archivo `.env` no configurado  | Asegurarse de que el archivo `.env` existe en el servidor                   |
| **Puerto en uso**                  | Otra app usando puerto 3000    | Cambiar puerto o detener la otra app: `sudo lsof -i :3000`                  |
| **Nginx no redirige**              | Configuración incorrecta       | Verificar `sudo nginx -t` y logs: `sudo tail -f /var/log/nginx/error.log`   |

### Comandos Útiles para Monitoreo

```bash
# Ver logs de la aplicación
pm2 logs spotify-backend

# Ver estado de PM2
pm2 status
pm2 monit

# Ver logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Ver uso de recursos
htop
df -h
free -h

# Reiniciar servicios
sudo systemctl restart nginx
pm2 restart spotify-backend
```

## 📚 Recursos Adicionales

### Documentación Oficial

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt/Certbot](https://certbot.eff.org/)

### Herramientas Recomendadas

- **Monitoreo**: [UptimeRobot](https://uptimerobot.com/) (gratis)
- **Logs**: [Logtail](https://logtail.com/) o Papertrail
- **Backups**: Automatizar backups de MongoDB
- **Alertas**: Configurar alertas de PM2 por email

### Mejoras Futuras

1. **Entornos múltiples** (dev, staging, production)
2. **Dockerización** del proyecto
3. **Tests de integración** más completos
4. **Monitoreo de performance**
5. **Rollback automático** en caso de fallos

---

## 🎯 Resumen de Comandos Rápidos

### Local

```bash
# Instalar dependencias de desarrollo
npm install --save-dev jest supertest eslint prettier

# Ejecutar tests
npm test

# Verificar linting
npm run lint

# Formatear código
npm run format
```

### Servidor

```bash
# Conectarse al servidor
ssh usuario@ip

# Ver logs de la aplicación
pm2 logs spotify-backend

# Actualizar manualmente (si CD falla)
cd /var/www/spotify-backend
git pull origin main
npm ci --only=production
pm2 restart spotify-backend
```

### GitHub Actions

- Se ejecuta automáticamente en cada push/PR
- Ver estado en: `https://github.com/tu-usuario/tu-repo/actions`
- Debuggear: Revisar logs en la pestaña "Actions"
