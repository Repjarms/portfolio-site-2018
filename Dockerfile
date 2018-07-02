FROM ubuntu
MAINTAINER Jeff Arn

# Install packages for Node.js
RUN apt-get update
RUN apt-get install -y build-essential wget git
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
RUN apt-get clean

# Clone application within image
RUN git clone https://github.com/Repjarms/portfolio-site-2018.git /root/portfolio-site-2018
RUN cd /root/portfolio-site-2018; npm i; npm run build;
EXPOSE 3000
CMD cd /root/portfolio-site-2018; npm run build && NODE_ENV=production node server.js
