FROM node:20-alpine

WORKDIR /app

# evita reinstall desnecessário
COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# cria usuário não-root (alinha com Umbrel)
RUN addgroup -S app && adduser -S app -G app

# The persistent /data bind mount is owned by root on first start.
# Prepare it as root, then run the application as the unprivileged app user.
RUN apk add --no-cache su-exec

EXPOSE 3712

# healthcheck leve
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:3712/health || exit 1

CMD ["sh", "-c", "mkdir -p /data && chown app:app /data && exec su-exec app node server.js"]