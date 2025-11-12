import { networkInterfaces } from 'node:os';
import { execSync } from 'node:child_process';
import { isValidIp } from './utils';

let _containerIp = '';

/*******************************************************************************
 * Fetch the IP address of the Docker container.
 ******************************************************************************/
export function getContainerIp(): string {
  if (_containerIp) {
    return _containerIp;
  }
  _containerIp = resolveNetworkInterfaces() || resolveHostname();
  return _containerIp;
}

/*******************************************************************************
 * 使用 Node.js 网络接口获取容器 IP (最可靠)
 ******************************************************************************/
function resolveNetworkInterfaces(): string {
  const interfaces = networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    if (name === 'lo' || name.startsWith('veth') || name.startsWith('docker')) {
      continue; // 跳过回环和虚拟接口
    }
    const iface = interfaces[name];
    if (!iface) {
      continue;
    }
    for (const item of iface) {
      if (item.internal || item.family !== 'IPv4') {
        continue;
      }
      if (!isValidIp(item.address)) {
        break;
      }
      return item.address; // 只返回 IPv4 地址
    }
  }

  console.debug('[HDI] os.networkInterfaces() failed.');
  return '';
}

/*******************************************************************************
 * 通过 `hostname -i` 命令获取容器 IP
 ******************************************************************************/
function resolveHostname(): string {
  try {
    const ip = execSync('hostname -i', { encoding: 'utf8' }).trim();
    if (ip && isValidIp(ip)) {
      return ip;
    }
  } catch (e) {
    console.debug('[HDI] execSync("hostname -i") error:', (e as Error).message);
  }
  return '';
}
