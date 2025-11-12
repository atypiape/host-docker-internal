import { getDockerHost } from '@dist';

test('Get docker host', () => {
  const host = getDockerHost();

  expect(host).toBe('172.17.0.1');
});
