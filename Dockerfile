FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/package*.json ./backend/

WORKDIR /app/backend
RUN npm install --omit=dev

WORKDIR /app/ai
COPY ai/requirements.txt .

RUN pip3 install --no-cache-dir --break-system-packages \
    -r requirements.txt

WORKDIR /app

COPY backend ./backend
COPY ai ./ai

ENV NODE_ENV=production
ENV PYTHON_PATH=python3

EXPOSE 10000

WORKDIR /app/backend

CMD ["npm", "start"]