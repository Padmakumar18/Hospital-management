@echo off
echo ========================================
echo Hospital Management System - Dev Start
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed or not in PATH
    echo Please install Java 24 or higher
    pause
    exit /b 1
)
echo [OK] Java found

REM Check Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher
    pause
    exit /b 1
)
echo [OK] Node.js found

REM Check PostgreSQL
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] PostgreSQL CLI not found in PATH
    echo Make sure PostgreSQL is running on localhost:5432
)
echo.

echo ========================================
echo Starting Backend (Spring Boot)
echo ========================================
echo.

cd backend
start "Hospital Backend" cmd /k "mvn spring-boot:run"
cd ..

echo Waiting for backend to start...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo Starting Frontend (React)
echo ========================================
echo.

cd frontend\app

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

start "Hospital Frontend" cmd /k "npm start"
cd ..\..

echo.
echo ========================================
echo Development Environment Started!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Press any key to stop all services...
pause >nul

echo.
echo Stopping services...
taskkill /FI "WindowTitle eq Hospital Backend*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Hospital Frontend*" /T /F >nul 2>&1

echo.
echo All services stopped.
echo.
pause
