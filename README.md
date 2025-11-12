# host-docker-internal

Fetch Docker host IP/hostname from inside containers.

> 在容器内部获取 Docker 宿主机的 IP 或主机名。

## 🔍 What it does

Helps you quickly fetch the IP or hostname of the Docker host from inside a container, making it easy to access services on the host or in other containers.

> 帮你在容器内部，快速获取 Docker 宿主机的 IP 或主机名，以便访问宿主机或其他容器中的服务。

## 🚀 When to use it

This library comes in handy when you encounter any of the following situations:

- 🐧 When Docker runs on Linux (not macOS or Windows), you can't directly use `host.docker.internal`
- ⚙️ When it's inconvenient to add `--add-host=host.docker.internal:host-gateway` during `docker run`
- 🌍 When you don't want to switch between `localhost` and `host.docker.internal` between development and production environments
- 💡 When you face any of the above but don't want to implement the fetching logic yourself

> 当你遇到以下任意情况时，本库可以派上用场：
>
> - 🐧 当 Docker 在 Linux 而不是 macOS 或 Windows 上运行时，无法直接使用 `host.docker.internal`
> - ⚙️ 当不方便在 `Docker run` 时添加 `--add-host=host.docker.internal:host-gateway`
> - 🌍 当你不想在开发环境与生产环境之间，来回切换 `localhost` 和 `host.docker.internal`
> - 💡 当你遇到以上几种情况，但又不想自己实现获取逻辑

## 📦 Install

```bash
npm install host-docker-internal
```

## 💻 Example

```js
import { getDockerHost } from 'host-docker-internal';

const host = getDockerHost();

await fetch(`http://${host}:3000/api/hello`);
```

## 📝 Remark

1. During local development and debugging (not in a container), `host` is `127.0.0.1`
2. When the container runs on macOS or Windows, `host` is `host.docker.internal`
3. When the container runs on Linux, `host` is the host machine's IP
4. If fetching fails, `host` defaults to `172.17.0.1`

> 1. 本地开发调试时（不在容器中），`host` 为 `127.0.0.1`
> 2. 容器运行在 macOS 或 Windows 上时，`host` 为 `host.docker.internal`
> 3. 容器运行在 Linux 上时，`host` 为宿主机 IP
> 4. 如果获取失败，`host` 为默认值 `172.17.0.1`