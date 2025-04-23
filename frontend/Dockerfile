# frontend/Dockerfile

FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
ENV VITE_BACKEND_URL="http://localhost:4000"
ENV VITE_RAG_URL="http://rag:8000"
COPY . .

CMD ["npm", "start"]
