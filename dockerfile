FROM node:16-alpine as builder

ENV NODE_ENV build
WORKDIR /home/node

COPY package*.json ./
COPY .env ./

RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --omit=dev

# ---

FROM node:16-alpine

# USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/.env ./

EXPOSE 3001

CMD ["node", "dist/main.js"]