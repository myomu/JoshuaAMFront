const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const target = "https://port-0-joshuaam-1ru12mlwbog2dc.sel5.cloudtype.app" || 'http://localhost:8080'; // 기본값을 설정하거나 환경변수를 사용

  app.use(
    '/api',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
    })
  );
};
