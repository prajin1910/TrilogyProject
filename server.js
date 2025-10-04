const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Start backend server in production
if (process.env.NODE_ENV === 'production') {
  const { spawn } = require('child_process');
  
  console.log('🚀 Starting backend server...');
  const backendPath = path.join(__dirname, 'backend');
  
  // Set environment for backend
  const backendEnv = {
    ...process.env,
    PORT: '5001'
  };
  
  const backend = spawn('node', ['server.js'], {
    cwd: backendPath,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
    env: backendEnv
  });

  backend.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backend.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backend.on('error', (error) => {
    console.error('Backend server error:', error);
  });

  // Give backend time to start
  setTimeout(() => {
    console.log('✅ Backend server started on port 5001');
  }, 3000);
}

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Proxy API requests to backend
const apiProxy = createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Backend service unavailable' });
  }
});

app.use('/api', apiProxy);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 Backend API: http://localhost:5001`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('💡 For development, run: npm run dev');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  process.exit(0);
});