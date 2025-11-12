import { existsSync, readFileSync } from 'node:fs';
import isDocker from 'is-docker';
import { getContainerIp } from './container';
import { hexToIp, isValidIp } from './utils';
import { execSync } from 'node:child_process';

let _host = '';

/*******************************************************************************
 * Fetch Docker host IP/hostname from inside containers.
 *
 * 1. During local development and debugging (not in a container), `host` is `127.0.0.1`
 * 2. When the container runs on macOS or Windows, `host` is `host.docker.internal`
 * 3. When the container runs on Linux, `host` is the host machine's IP
 * 4. If fetching fails, `host` defaults to `172.17.0.1`
 ******************************************************************************/
export function getDockerHost(): string {
  if (_host) {
    return _host;
  }

  // 不在容器中
  if (!isDocker()) {
    _host = '127.0.0.1';
    return _host;
  }

  // 检查 host.docker.internal 是否可用
  if (resolveCurl() || resolveNslookup() || resolveEtcHosts()) {
    _host = 'host.docker.internal';
    return _host;
  }

  // 通过路由表获取
  _host = resolveProcNetRoute();
  if (_host) {
    return _host;
  }

  // 通过容器 IP 修改
  const containerIp = getContainerIp();
  if (containerIp) {
    const parts = containerIp.split('.').slice(0, 3);
    parts.push('1');
    _host = parts.join('.');
    return _host;
  }

  // 返回常见的 Docker 默认网关作为备选
  _host = '172.17.0.1';
  return _host;
}

/*******************************************************************************
 * 解析 /proc/net/route 获取网关 IP
 ******************************************************************************/
function resolveProcNetRoute(): string {
  try {
    if (!existsSync('/proc/net/route')) {
      console.debug('[HDI] file not found: /proc/net/route');
      return '';
    }

    const routeContent = readFileSync('/proc/net/route', 'utf8');
    const lines = routeContent.split('\n');

    for (const line of lines.slice(1)) {
      // 跳过标题行
      const fields = line.trim().split('\t');
      if (fields.length < 3 || fields[1] !== '00000000') {
        continue;
      }
      // 默认路由
      const gatewayHex = fields[2];
      const ip = hexToIp(gatewayHex);
      if (!isValidIp(ip)) {
        break;
      }
      return ip;
    }
  } catch (error) {
    console.debug('[HDI] fs.readFileSync("/proc/net/route") error:', error);
  }

  console.debug('[HDI] resolveProcNetRoute() faild.');
  return '';
}

/*******************************************************************************
 * 解析 /etc/hosts, 通过 host.docker.internal 获取主机 IP
 ******************************************************************************/
function resolveEtcHosts(): string {
  try {
    if (!existsSync('/etc/hosts')) {
      console.debug('[HDI] file not found: /etc/hosts');
      return '';
    }

    const data = readFileSync('/etc/hosts', 'utf8');
    const lines = data.split('\n');

    for (const line of lines) {
      if (line.startsWith('#') || line.trim() === '') {
        continue; // 忽略注释和空行
      }
      const parts = line.split(/\s+/);
      // 第一个部分是IP，后面是主机名列表
      const hostnames = parts.slice(1);
      if (!hostnames.includes('host.docker.internal')) {
        continue;
      }
      const ip = parts[0];
      if (!isValidIp(ip)) {
        break;
      }
      return ip;
    }
  } catch (error) {
    console.debug('[HDI] fs.readFileSync("/etc/hosts") error:', error);
  }

  console.debug('[HDI] resolveEtcHosts() faild.');
  return '';
}

/*******************************************************************************
 * 执行 nslookup 命令, 查找 host.docker.internal
 ******************************************************************************/
function resolveNslookup(): boolean {
  try {
    const output = execSync('nslookup host.docker.internal');
    const text = output.toString();
    if (text.includes('host.docker.internal')) {
      return true;
    }
  } catch (e) {
    const { message = '' } = e as Error;
    if (message.includes('not found')) {
      console.debug('[HDI] nslookup: not found.');
    } else {
      console.debug('[HDI] exec nslookup error:', message);
    }
  }
  return false;
}

/*******************************************************************************
 * 执行 curl 命令, 检查 host.docker.internal
 ******************************************************************************/
function resolveCurl(): boolean {
  try {
    const output = execSync('curl -s http://host.docker.internal');
    const text = output.toString();
    if (text.includes('host.docker.internal')) {
      return true;
    }
  } catch (e) {
    const { message = '' } = e as Error;
    if (message.includes('not found')) {
      console.debug('[HDI] curl: not found.');
    } else {
      console.debug('[HDI] exec curl error:', message);
    }
  }
  return false;
}
