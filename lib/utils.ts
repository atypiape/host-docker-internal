/*****************************************************************************
 * Validate IP validity.
 * @param ip IP address to validate.
 * @returns true if the IP is valid, false otherwise.
 ****************************************************************************/
export function isValidIp(ip: string): boolean {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) {
    return false;
  }

  // 验证每个数字在 0-255 范围内
  const parts = ip.split('.');
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
}

/*******************************************************************************
 * 十六进制 IP 字符串转换为点分十进制
 ******************************************************************************/
export function hexToIp(hexStr: string): string {
  const ipParts: number[] = [];
  for (let i = 0; i < 8; i += 2) {
    ipParts.push(parseInt(hexStr.substring(i, i + 2), 16));
  }
  return ipParts.reverse().join('.');
}
