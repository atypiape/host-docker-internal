import { getDockerHost, getContainerIp, isValidIp } from '@dist';

test('isValidIp', () => {
  expect(isValidIp('0.0.0.0')).toBe(true);
  expect(isValidIp('255.255.255.255')).toBe(true);
  expect(isValidIp('192.168.1.1')).toBe(true);
  expect(isValidIp('192.168.1.256')).toBe(false);
  expect(isValidIp('192.168.1.1.1')).toBe(false);
  expect(isValidIp('192.168.1')).toBe(false);
  expect(isValidIp('256.255.1.1')).toBe(false);
});

test('getDockerHost', () => {
  const host = getDockerHost();
  expect(isValidIp(host) || host === 'host.docker.internal').toBe(true);
});

test('getContainerIp', () => {
  const containerIp = getContainerIp();
  expect(isValidIp(containerIp)).toBe(true);
});
