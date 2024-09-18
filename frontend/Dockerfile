FROM node:20

# Set the working directory to /frontend
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./
# Copy .env.local file
COPY .env.local .env.local

# Set environment variables from .env.local
RUN export $(cat .env.local | xargs)

# Install dependencies
RUN npm ci
RUN npm install supertokens-auth-react

# Copy the rest of the application code
COPY . .

 # Run npm run build
# RUN npm run build

EXPOSE 3000

# Use npm run dev for hot reloading
CMD ["npm", "run", "dev"]
