# samvad - professional communication platform

samvad is a real-time chat application. it supports messaging, file sharing(TEXT,PDF,VIDEO,AUDIO,IMAGE etc.. as it is and all other type in text format), authentication, and works across all devices.



### features

* real-time messaging with websocket
* jwt authentication
* file sharing
* user profiles
* responsive design

### technology stack

**frontend**

* react.js 
* tailwind css
* socket.io client
* react three for 3D

**backend**

* node.js with express
* mongodb
* socket.io server
* jwt authentication
* cloudinary for storage

## prerequisites

* node.js 
* npm 
* mongodb 
* cloudinary 

## installation

### 1. clone repository

```bash
git clone <repository-url>
cd samvad
```

### 2. install dependencies

```bash
npm install
```

### 3. environment setup

**backend .env**

```env
mongouri=your_mongodb_connection_string
port=8004
jwt_secret=your_jwt_secret_key
cloud_name=your_cloudinary_cloud_name
cloudinary_api_key=your_cloudinary_api_key
cloudinary_api_secret=your_cloudinary_api_secret
node_env=development
client_url=http://localhost:3000
frontend_url=http://localhost:3000
```

**frontend .env**

```env
vite_api_base_url=http://localhost:8004
vite_socket_url=http://localhost:8004
```

### 4. run app

backend:

```bash
npm start
```

frontend:

```bash
npm run dev
```

frontend: [http://localhost:3000](http://localhost:3000)
backend: [http://localhost:8004](http://localhost:8004)

### production

```bash
npm run build
npm run preview
```

## docker deployment

### prerequisites

* docker
* docker-compose

### quick start with docker

#### 1. create environment file

```bash
cp .env.example .env
```

edit `.env` with your cloudinary credentials:

```env
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### 2. start all services

```bash
docker-compose up -d
```

this will start:
- mongodb on port 27017
- backend on port 5001
- frontend on port 3000

#### 3. access application

- frontend: [http://localhost:3000](http://localhost:3000)
- backend api: [http://localhost:5001](http://localhost:5001)

### docker commands

```bash
docker-compose up -d              # start in background
docker-compose logs -f            # view logs
docker-compose down               # stop all services
docker-compose down -v            # stop and remove volumes
docker-compose up -d --build      # rebuild and start
```

## required environment variables

* mongouri
* jwt\_secret
* cloud\_name
* cloudinary\_api\_key
* cloudinary\_api\_secret

## optional variables

* port (default: 8004)
* node\_env
* client\_url
* frontend\_url

### To test frontend and backend 

```bash
pytest -v frontendtest.py
pytest -v backendtest.py

```
