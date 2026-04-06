#!/bin/bash

echo ""
echo "🛡️  VERIDEX — Verify Before You Click"
echo "======================================="
echo ""

# Check Node
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org"
  exit 1
fi
echo "✅ Node.js $(node --version) found"

# Install backend deps
echo ""
echo "📦 Installing backend dependencies..."
cd backend && npm install --silent
cd ..

# Install frontend deps
echo "📦 Installing frontend dependencies..."
cd frontend && npm install --silent
cd ..

echo ""
echo "🚀 Starting Veridex..."
echo "   Backend  → http://localhost:5000"
echo "   Frontend → http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers."
echo ""

# Start both servers
npx concurrently \
  --names "BACKEND,FRONTEND" \
  --prefix-colors "cyan,magenta" \
  "cd backend && npm run dev" \
  "cd frontend && npm run dev"
