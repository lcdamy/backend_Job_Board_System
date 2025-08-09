# Project environment
FROM node:18.0.0-alpine3.15

# Container directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install packages
RUN npm install

# Rebuild bcrypt for the correct architecture
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application files
COPY . .

# Container port
EXPOSE 3001

# Last command to run the project
CMD ["npm", "run", "dev"]
