# ===========================
# 1️⃣ build phase：build next.js project
# ===========================
FROM node:22.12.0 AS builder

# work directory
WORKDIR /app

# copy package files
COPY package*.json ./

# install dependencies
RUN npm ci

# copy files
COPY . .

# build next.js
RUN npm run build


# ===========================
# 2️⃣ running phase：keep needed files only
# ===========================
FROM node:22.12.0 AS runner

WORKDIR /app

# production env
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# copy outputs and dependencies from the build phase
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# expose port
EXPOSE 3000

# startup
# npm start
CMD ["npm", "start"]
