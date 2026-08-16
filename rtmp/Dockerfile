FROM debian:bookworm-slim AS builder
 
RUN apt-get update && apt-get install -y \
    build-essential \
    libpcre3 libpcre3-dev \
    libssl-dev \
    zlib1g-dev \
    git wget ca-certificates \
    && rm -rf /var/lib/apt/lists/*
 
ARG NGINX_VERSION=1.25.4
 
WORKDIR /build
RUN wget https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz \
    && tar zxf nginx-${NGINX_VERSION}.tar.gz \
    && git clone --depth 1 https://github.com/arut/nginx-rtmp-module.git
 
WORKDIR /build/nginx-${NGINX_VERSION}
RUN ./configure \
    --prefix=/usr/local/nginx \
    --add-module=../nginx-rtmp-module \
    --with-http_ssl_module \
    && make -j"$(nproc)" \
    && make install
 
# --- Runtime stage: only what's needed to run the compiled binary ---
FROM debian:bookworm-slim
 
RUN apt-get update && apt-get install -y \
    libpcre3 \
    libssl3 \
    ca-certificates \
    gettext-base \
    curl \
    ffmpeg \
    procps \
    && rm -rf /var/lib/apt/lists/*
 
COPY --from=builder /usr/local/nginx /usr/local/nginx
COPY nginx.conf.template /usr/local/nginx/conf/nginx.conf.template
COPY entrypoint.sh /entrypoint.sh
COPY transcode.sh /transcode.sh
RUN chmod +x /entrypoint.sh /transcode.sh
 
RUN mkdir -p /var/www/hls/source /var/www/hls/transcode
 
EXPOSE 1935 8080
 
CMD ["/entrypoint.sh"]