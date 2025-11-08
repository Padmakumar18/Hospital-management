# Hospital Management System - Deployment Guide

## Production Deployment

### Prerequisites

- Java 24 JDK
- Node.js 18+
- PostgreSQL 12+
- Nginx (for frontend)
- SSL Certificate (recommended)

## Backend Deployment

### 1. Prepare Production Configuration

Create `application-prod.properties`:

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/

# Database Configuration
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000

# Logging
logging.level.root=INFO
logging.level.com.hospitalmanagement=INFO
logging.file.name=logs/application.log

# Security
server.error.include-message=never
server.error.include-stacktrace=never
```

### 2. Build Production JAR

```bash
cd backend
mvn clean package -DskipTests
```

This creates `target/backend-0.0.1-SNAPSHOT.jar`

### 3. Deploy to Server

#### Option A: Direct Deployment

```bash
# Copy JAR to server
scp target/backend-0.0.1-SNAPSHOT.jar user@server:/opt/hospital-app/

# SSH to server
ssh user@server

# Run application
cd /opt/hospital-app
java -jar -Dspring.profiles.active=prod backend-0.0.1-SNAPSHOT.jar
```

#### Option B: Systemd Service

Create `/etc/systemd/system/hospital-backend.service`:

```ini
[Unit]
Description=Hospital Management Backend
After=syslog.target network.target

[Service]
User=hospital
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod /opt/hospital-app/backend-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

Environment="DATABASE_URL=jdbc:postgresql://localhost:5432/hospitalmanagement"
Environment="DATABASE_USERNAME=hospital_user"
Environment="DATABASE_PASSWORD=secure_password"

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable hospital-backend
sudo systemctl start hospital-backend
sudo systemctl status hospital-backend
```

#### Option C: Docker Deployment

Create `backend/Dockerfile`:

```dockerfile
FROM eclipse-temurin:24-jdk-alpine
WORKDIR /app
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
```

Build and run:

```bash
docker build -t hospital-backend .
docker run -d -p 8080:8080 \
  -e DATABASE_URL=jdbc:postgresql://db:5432/hospitalmanagement \
  -e DATABASE_USERNAME=hospital_user \
  -e DATABASE_PASSWORD=secure_password \
  --name hospital-backend \
  hospital-backend
```

## Frontend Deployment

### 1. Update API URL

Edit `frontend/app/src/services/api.js`:

```javascript
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://api.yourdomain.com/api";
```

Create `.env.production`:

```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### 2. Build Production Bundle

```bash
cd frontend/app
npm run build
```

This creates optimized files in `build/` directory.

### 3. Deploy Frontend

#### Option A: Nginx

Install Nginx:

```bash
sudo apt install nginx
```

Create `/etc/nginx/sites-available/hospital-frontend`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/hospital-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/hospital-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Copy build files:

```bash
sudo mkdir -p /var/www/hospital-frontend
sudo cp -r build/* /var/www/hospital-frontend/
sudo chown -R www-data:www-data /var/www/hospital-frontend
```

#### Option B: Docker

Create `frontend/app/Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `frontend/app/nginx.conf`:

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

Build and run:

```bash
docker build -t hospital-frontend .
docker run -d -p 80:80 --name hospital-frontend hospital-frontend
```

## Database Setup

### 1. Create Production Database

```sql
CREATE DATABASE hospitalmanagement;
CREATE USER hospital_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE hospitalmanagement TO hospital_user;
```

### 2. Run Migrations

```bash
# Using Flyway or Liquibase (recommended for production)
# Or manually run schema creation scripts
```

### 3. Backup Strategy

Create backup script `/opt/scripts/backup-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/hospital-db"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U hospital_user hospitalmanagement | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

Add to crontab:

```bash
0 2 * * * /opt/scripts/backup-db.sh
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Auto-renewal:

```bash
sudo certbot renew --dry-run
```

## Docker Compose (Complete Stack)

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: hospitalmanagement
      POSTGRES_USER: hospital_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: jdbc:postgresql://db:5432/hospitalmanagement
      DATABASE_USERNAME: hospital_user
      DATABASE_PASSWORD: secure_password
    depends_on:
      - db
    restart: unless-stopped

  frontend:
    build: ./frontend/app
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy:

```bash
docker-compose up -d
```

## Monitoring and Logging

### 1. Application Monitoring

Add Spring Boot Actuator to `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Configure in `application-prod.properties`:

```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when-authorized
```

### 2. Log Aggregation

Use ELK Stack or similar:

```bash
# Install Filebeat
sudo apt install filebeat

# Configure to send logs to Elasticsearch
```

### 3. Uptime Monitoring

Use tools like:

- UptimeRobot
- Pingdom
- New Relic
- Datadog

## Performance Optimization

### Backend

1. Enable caching:

```java
@EnableCaching
public class BackendApplication {
    // ...
}
```

2. Database indexing:

```sql
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
```

3. Connection pooling (already configured in HikariCP)

### Frontend

1. Code splitting (already done by Create React App)
2. Lazy loading routes
3. Image optimization
4. CDN for static assets

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Implement password hashing (BCrypt)
- [ ] Add rate limiting
- [ ] Enable CSRF protection
- [ ] Implement JWT authentication
- [ ] Add input validation
- [ ] Use prepared statements (already done with JPA)
- [ ] Regular security updates
- [ ] Implement audit logging
- [ ] Add API authentication
- [ ] Configure firewall rules
- [ ] Regular backups
- [ ] Disaster recovery plan

## Scaling Strategies

### Horizontal Scaling

1. Load balancer (Nginx/HAProxy)
2. Multiple backend instances
3. Shared database
4. Redis for session management

### Vertical Scaling

1. Increase server resources
2. Optimize database queries
3. Add database read replicas

## Maintenance

### Regular Tasks

- Daily: Check logs for errors
- Weekly: Review performance metrics
- Monthly: Update dependencies
- Quarterly: Security audit
- Yearly: Disaster recovery test

### Update Process

1. Test updates in staging
2. Create database backup
3. Deploy during low-traffic hours
4. Monitor for issues
5. Rollback if needed

## Troubleshooting

### Backend Issues

```bash
# Check logs
sudo journalctl -u hospital-backend -f

# Check process
ps aux | grep java

# Check port
sudo netstat -tulpn | grep 8080
```

### Frontend Issues

```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Database Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Check database size
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('hospitalmanagement'));"
```

## Rollback Procedure

1. Stop services:

```bash
sudo systemctl stop hospital-backend
sudo systemctl stop nginx
```

2. Restore database:

```bash
gunzip < backup_YYYYMMDD_HHMMSS.sql.gz | psql -U hospital_user hospitalmanagement
```

3. Deploy previous version:

```bash
java -jar backend-previous-version.jar
```

4. Restart services:

```bash
sudo systemctl start hospital-backend
sudo systemctl start nginx
```

## Support and Maintenance Contacts

- System Administrator: admin@yourdomain.com
- Database Administrator: dba@yourdomain.com
- Development Team: dev@yourdomain.com
- Emergency Hotline: +1-XXX-XXX-XXXX
