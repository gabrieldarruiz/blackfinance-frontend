# Use a imagem oficial do Node.js como base
FROM node:20-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install --legacy-peer-deps

# Copie todo o código da aplicação
COPY . .

# Defina a porta desejada
ENV PORT=8000

# Exponha a porta no contêiner
EXPOSE 8000

# Comando para rodar a aplicação
CMD ["npm", "run", "dev"]
