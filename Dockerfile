FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN npx prisma generate
RUN pnpm run build


EXPOSE 3000

CMD ["node", "dist/main"]