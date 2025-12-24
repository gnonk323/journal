FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

# copy the built app
COPY --from=build /app/dist /usr/share/nginx/html

# copy template config
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# copy startup script
COPY start.nginx.sh /usr/local/bin/start.nginx.sh
RUN chmod +x /usr/local/bin/start.nginx.sh

EXPOSE 80

CMD ["/usr/local/bin/start.nginx.sh"]
