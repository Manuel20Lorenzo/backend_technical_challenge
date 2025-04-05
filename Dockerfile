# Usa una imagen base de Node.js 18 (Alpine es más ligera)
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración del proyecto (package.json y package-lock.json)
COPY package*.json ./

# Instala las dependencias usando npm
RUN npm install --force

# Copia el resto de los archivos del proyecto
COPY . .

# Expone el puerto 3000, que es el puerto por defecto de NestJS
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:dev"]
