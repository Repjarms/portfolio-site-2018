FROM node
MAINTAINER Jeff Arn

# Clone application within image
RUN git clone https://github.com/Repjarms/portfolio-site-2018.git /root/portfolio-site-2018
RUN cd /root/portfolio-site-2018; npm i; npm run build;
EXPOSE 3000
CMD cd /root/portfolio-site-2018; npm run build && NODE_ENV=production node server.js
