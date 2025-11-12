const http = require('http');
const { getDockerHost, getContainerIp } = require('../dist/index.cjs');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });

  res.end(
    JSON.stringify({
      dockerHost: getDockerHost(),
      containerIp: getContainerIp(),
    }),
  );
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`服务器已启动，正在监听 http://localhost:${PORT}`);
});
