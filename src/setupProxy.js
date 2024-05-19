const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const target = process.env.REACT_APP_PROXY_TARGET || 'http://localhost:8080'; // 기본값을 설정하거나 환경변수를 사용

  app.use(
    '/api',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
    })
  );
};