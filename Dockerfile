# KobeanSkills — All-in-One Sandboxed Agent Environment
FROM node:22-bookworm-slim

LABEL maintainer="Joseph Nguyen"
LABEL description="Sandboxed execution environment with KobeanSkills and pre-installed companion CLIs"

ENV DEBIAN_FRONTEND=noninteractive
ENV PATH="/root/.local/bin:/root/.cargo/bin:${PATH}"

# 1. Install system utilities, git, python3, and curl
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    python3 \
    python3-pip \
    python3-venv \
    unzip \
    tar \
    && rm -rf /var/lib/apt/lists/*

# 2. Install Astral uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# 3. Install Beads CLI (bd)
RUN npm install -g @beads/bd

# 4. Install betterleaks binary
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then B_ARCH="amd64"; elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then B_ARCH="arm64"; else B_ARCH="amd64"; fi && \
    curl -sSL "https://github.com/betterleaks/betterleaks/releases/latest/download/betterleaks_linux_${B_ARCH}.tar.gz" -o /tmp/betterleaks.tar.gz && \
    tar -xzf /tmp/betterleaks.tar.gz -C /usr/local/bin/ betterleaks && \
    chmod +x /usr/local/bin/betterleaks && \
    rm -f /tmp/betterleaks.tar.gz

# 5. Install Google osv-scanner binary
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then O_ARCH="amd64"; elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then O_ARCH="arm64"; else O_ARCH="amd64"; fi && \
    curl -sSL "https://github.com/google/osv-scanner/releases/latest/download/osv-scanner_linux_${O_ARCH}" -o /usr/local/bin/osv-scanner && \
    chmod +x /usr/local/bin/osv-scanner

# 6. Install Graphify via uv
RUN /root/.local/bin/uv tool install graphifyy || true

# 7. Copy and install KobeanSkills globally inside the container
WORKDIR /opt/kobean
COPY . /opt/kobean
RUN npm link && ./scripts/install.sh

WORKDIR /workspace

CMD ["node", "/opt/kobean/bin/kobean.js", "doctor"]
