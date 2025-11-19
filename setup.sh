#!/bin/bash

echo "========================================"
echo "Remotion Captioning Platform - Setup"
echo "========================================"
echo ""

echo "[1/5] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: npm install failed"
    exit 1
fi

echo ""
echo "[2/5] Creating required directories..."
mkdir -p public/uploads public/renders tmp output

echo ""
echo "[3/5] Checking FFmpeg installation..."
if ! command -v ffmpeg &> /dev/null; then
    echo "WARNING: FFmpeg not found!"
    echo "Please install FFmpeg:"
    echo "  macOS: brew install ffmpeg"
    echo "  Linux: sudo apt-get install ffmpeg"
else
    echo "FFmpeg found: $(ffmpeg -version | head -n 1)"
fi

echo ""
echo "[4/5] Setting up environment file..."
if [ ! -f ".env" ]; then
    cp ".env.example" ".env"
    echo "Created .env file from template"
    echo "IMPORTANT: Please edit .env and add your API keys!"
else
    echo ".env file already exists"
fi

echo ""
echo "[5/5] Setup complete!"
echo ""
echo "========================================"
echo "Next Steps:"
echo "========================================"
echo "1. Edit .env file and add your API keys"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo "========================================"
echo ""
