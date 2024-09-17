FROM node:20

# Set the working directory to /frontend
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run npm run build
RUN npm run build

EXPOSE 3000

# Use npm run dev for hot reloading
CMD ["npm", "run", "dev"]
