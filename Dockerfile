FROM node:18-alpine as build
WORKDIR /app
COPY package.json /app/
RUN npm install 
RUN npm install -g ionic @angular/cli
RUN npm install date-fns
COPY . /app
RUN ionic serve --prod
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/
COPY --from=build /app/www/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]