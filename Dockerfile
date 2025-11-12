FROM node:18.20.8-alpine

ENV NODE_ENV=production

RUN mkdir -p /app
WORKDIR /app

COPY dist /app/dist
COPY test /app/test
COPY src /app/src
COPY jest.config.ts /app/
COPY package.json /app/
COPY tsconfig.json /app/
COPY tsconfig.build.json /app/
COPY tsconfig.test.json /app/
COPY vite.config.ts /app/

RUN cd /app
RUN npm config set registry https://registry.npmmirror.com
RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "src/main.cjs"]
