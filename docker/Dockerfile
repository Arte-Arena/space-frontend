FROM node:18
WORKDIR /app
COPY space-frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY space-frontend/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
