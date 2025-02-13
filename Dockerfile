FROM node:20-bullseye

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    wget \
    g++ \
    make \
    python3 \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Instalar ts-node globalmente
RUN npm install -g ts-node typescript @types/node

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Configurar sharp
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
ENV NODE_ENV=development

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm install

# Copiar el código fuente
COPY . .

EXPOSE 8021

CMD ["npx", "ts-node", "src/index.ts"]