@echo off
echo ========================================
echo Remotion Captioning Platform - Setup
echo ========================================
echo.

echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/5] Creating required directories...
if not exist "public\uploads" mkdir "public\uploads"
if not exist "public\renders" mkdir "public\renders"
if not exist "tmp" mkdir "tmp"
if not exist "output" mkdir "output"

echo.
echo [3/5] Checking FFmpeg installation...
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: FFmpeg not found!
    echo Please install FFmpeg from: https://ffmpeg.org/download.html
    echo Or use Chocolatey: choco install ffmpeg
    pause
)

echo.
echo [4/5] Setting up environment file...
if not exist ".env" (
    copy ".env.example" ".env"
    echo Created .env file from template
    echo IMPORTANT: Please edit .env and add your API keys!
) else (
    echo .env file already exists
)

echo.
echo [5/5] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Edit .env file and add your API keys
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo ========================================
echo.
pause
