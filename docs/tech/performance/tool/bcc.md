基于 Linux 内核的 eBPF（extended Berkeley Packet Filters）机制，来跟踪内核中管理的缓存，并输出缓存的使用和命中情况。

https://github.com/iovisor/bcc


## Ubuntu 22.04 安装

```shell
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 4052245BD4284CDD
echo "deb https://repo.iovisor.org/apt/bionic bionic main" | sudo tee /etc/apt/sources.list.d/iovisor.list
sudo apt-get update
sudo apt-get install -y bcc-tools libbcc-examples linux-headers-$(uname -r)
```

其中 jammy（Ubuntu 22.04）、focal（Ubuntu 20.04）都没有源，可以使用 bionic（Ubuntu 18.04 LTS）

安装会报错

```shell
The following packages have unmet dependencies:
 python-bcc : Depends: python but it is not installable
E: Unable to correct problems, you have held broken package
```

python 包在 22.04 上已经没有了，都换成 python3 了，这时需要我们手动创建一个虚拟包，告诉 apt 你已经满足了这个依赖，而实际上这个包什么也不做，只是为了满足依赖关系。

安装 equivs：

```shell
sudo apt-get install equivs
```

创建一个虚拟 python 包：

```bash
equivs-control python-control
```

编辑生成的 python-control 文件，在其中添加以下内容：

```bash
Section: misc
Priority: optional
Standards-Version: 3.9.2

Package: python
Provides: python
Description: Fake python package to satisfy dependencies
```

然后构建并安装虚拟包：

```bash
equivs-build python-control
sudo dpkg -i python_1.0_all.deb
```

这会告诉 apt 你已经有了一个 python 包，但实际上它不会安装任何内容。

然后再次尝试可以成功安装。

安装后 bcc 提供的工具都安装在 `/usr/share/bcc/tools` 这个目录了，放到 `PATH` 找那个。

```shell
$ export PATH=$PATH:/usr/share/bcc/tools
```

