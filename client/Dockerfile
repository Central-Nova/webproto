#  Pull official node image
FROM node:alpine

#  Set working directory
WORKDIR /usr/src/bizware/client

# # Install dependencies
# COPY package.json ./
# COPY package-lock.json ./
# RUN npm install 

# Copy the rest
COPY ./ ./

RUN npm install 

EXPOSE 3000

CMD ["/bin/bash"]
