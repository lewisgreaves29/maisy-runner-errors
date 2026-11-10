# Stage 1: Build static bundle
FROM --platform=$BUILDPLATFORM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run test:ci && npm run build

# Stage 2: Distroless production web server
FROM nginx:alpine-slim
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
