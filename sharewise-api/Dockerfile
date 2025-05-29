FROM node:16
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app
ENV PORT=3000
ENV DB_USER=postgres
ENV DB_PORT=5433
ENV DB_HOST=sharewise-db
ENV DB_PASSWORD=docker
ENV DB_NAME=sharewise
ARG SECRET_TOKEN

EXPOSE 3000
CMD ["node", "index.js"]