FROM node:23-alpine AS builder
WORKDIR /app
ENV NEXT_PUBLIC_REDIRECT_URI=https://3168-118-218-200-33.ngrok-free.app/auth/callback
ENV NEXT_PUBLIC_LOGOUT_URI=https://3168-118-218-200-33.ngrok-free.app/

COPY package*.json ./
RUN npm install
# 소스 전체 복사 및 빌드 실행
COPY public ./public
COPY public /app/public
COPY . .
RUN npm run build
# :둘: 실행 스테이지
FROM node:23-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# standalone 모드로 빌드된 파일만 복사
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "server.js"]
