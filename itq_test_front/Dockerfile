# start from an official image
FROM node:10

#возможно надо npm install --production  написать!!!

WORKDIR /opt/services/front/app/

COPY . .

RUN npm install express
RUN npm install cors
RUN npm install express-minify
RUN npm install express-http-proxy --save

# expose the port 3000
EXPOSE 3000


CMD ["node","server.js"]
