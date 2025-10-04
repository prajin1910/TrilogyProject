#!/bin/bash

echo "🔧 Installing root dependencies..."
npm install

echo "🔧 Installing backend dependencies..."
cd backend && npm install

echo "🔧 Installing frontend dependencies..."
cd ../frontend && npm install

echo "🏗️ Building frontend for production..."
npm run build

echo "✅ Build complete! Ready for deployment."
echo ""
echo "To start locally: npm start"
echo "For development: npm run dev"