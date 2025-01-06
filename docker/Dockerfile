FROM node:20
WORKDIR /app
COPY modernize/package*.json ./
RUN npm install
COPY modernize/ .
COPY .env /app/.env
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
