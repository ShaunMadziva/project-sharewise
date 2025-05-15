FROM node:16
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
ENV PORT=3000
ENV DB_URL=postgresql://postgres.zydxnsfwivadzuhhqgjh:rKZM26KJtRNf21i1@aws-0-eu-west-2.pooler.supabase.com:6543/postgres
ARG SECRET_TOKEN
EXPOSE 3000
CMD ["node", "index.js"]