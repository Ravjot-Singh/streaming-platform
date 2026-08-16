#!/bin/sh

NAME="$1"
 
sleep 4
 
exec stdbuf -oL -eL ffmpeg -i "http://localhost:8080/hls/source/${NAME}/index.m3u8" \
    -c:v libx264 -preset veryfast -profile:v main -b:v 2500k -maxrate 2500k -bufsize 5000k -vf scale=-2:720 -g 60 -c:a aac -b:a 128k -f flv "rtmp://localhost:1935/transcode_720/${NAME}" \
    -c:v libx264 -preset veryfast -profile:v main -b:v 800k  -maxrate 800k  -bufsize 1600k -vf scale=-2:360 -g 60 -c:a aac -b:a 96k  -f flv "rtmp://localhost:1935/transcode_360/${NAME}" \
    > "/tmp/transcode_${NAME}.log" 2>&1