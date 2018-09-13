FROM node:latest

RUN mkdir -p /project
WORKDIR /project

RUN npm install -g pm2
RUN apt-get update

COPY . /project

RUN chmod -R 777 /project

EXPOSE 80

CMD ["pm2-docker", "app.js"]