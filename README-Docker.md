# Docker Setup Instructions

## Prerequisites
- Docker and Docker Compose installed
- Cloud MongoDB database setup (MongoDB Atlas recommended)
- SerpAPI key (if using search functionality)

## Setup Steps

1. **Clone and navigate to the project directory:**
   ```bash
   cd "c:\Users\omgup\Desktop\AI Tool"
   ```

2. **Create environment file:**
   ```bash
   copy .env.example .env
   ```
   Then edit `.env` file with your actual values:
   - `MONGODB_URI`: Your cloud MongoDB connection string
   - `SERPAPI_KEY`: Your SerpAPI key
   - Other environment variables as needed

3. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Or run in detached mode:**
   ```bash
   docker-compose up -d --build
   ```

## Access Points
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## Docker Commands

### Stop services:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f
```

### Restart specific service:
```bash
docker-compose restart backend
# or
docker-compose restart frontend
```

### Rebuild specific service:
```bash
docker-compose up --build backend
# or
docker-compose up --build frontend
```

## Troubleshooting

1. **Port conflicts**: If ports 80 or 3000 are in use, modify the ports in `docker-compose.yml`
2. **Environment variables**: Ensure your `.env` file has the correct MongoDB connection string
3. **Build issues**: Try `docker-compose build --no-cache` to rebuild from scratch
4. **Logs**: Check container logs with `docker-compose logs [service-name]`

## Production Deployment

For production deployment:
1. Update CORS settings in backend to include your production domain
2. Use production MongoDB credentials
3. Consider using Docker secrets for sensitive data
4. Set up proper SSL/TLS certificates
5. Use a reverse proxy like Nginx for additional security

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │────│   Backend   │────│   Cloud DB  │
│   (React)   │    │  (Node.js)  │    │ (MongoDB)   │
│   Port 80   │    │  Port 3000  │    │   Remote    │
└─────────────┘    └─────────────┘    └─────────────┘
```
