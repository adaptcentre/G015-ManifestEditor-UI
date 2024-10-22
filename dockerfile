FROM node:latest as node
WORKDIR /myapp
COPY . .
RUN npm install @angular/cdk  --save --legacy-peer-deps
RUN npm install --legacy-peer-deps
RUN npm run build --prod
FROM nginx:alpine 

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/manuscript_viewer/browser /usr/share/nginx/html