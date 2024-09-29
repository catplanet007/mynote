

#### 查看路由表
使用 `netstat -r`、`ip route` 也可以查看路由表。

```bash
$ ip route
default via 10.0.2.2 dev enp0s3 proto dhcp src 10.0.2.15 metric 100
10.0.2.0/24 dev enp0s3 proto kernel scope link src 10.0.2.15
10.0.2.2 dev enp0s3 proto dhcp scope link src 10.0.2.15 metric 100
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 linkdown
```

#### 创建 GRE（通用路由封装）隧道

- `ip tun add tun0`：添加一个名为 tun0 的隧道设备
- `mode gre`：设置隧道模式为通用路由封装（GRE）
- `remote 172.17.158.46 local 172.17.158.48`：隧道的远程 IP 地址为 `172.17.158.46`，隧道的本地 IP 地址为 `172.17.158.48`
- `ttl 64`：隧道数据包的生存时间（TTL）为 64

```bash
$ ip tun add tun0 mode gre remote 172.17.158.46 local 172.17.158.48 ttl 64
# 设置隧道设备 tun0 启用
$ ip link set tun0 up
# 为 tun0 设备添加 IP 100.64.0.1，对端的 IP 为 100.64.0.2
$ ip addr add 100.64.0.1 peer 100.64.0.2 dev tun0
```

添加路由，使得发往 110.242.68.0/24 这个网络的数据包通过 tun0 隧道接口，并经由下一跳地址 100.64.0.2 进行转发
- `110.242.68.0/24`：是目标网络地址和子网掩码，表示要到达的目标网络范围。
- `via 100.64.0.2`：指定到达目标网络的下一跳地址，即数据包在前往目标网络时要经过的下一个 IP 地址。

```bash
$ ip route add 110.242.68.0/24 via 100.64.0.2 dev tun0
```

此时对端也需要创建对应的隧道，并开启 ip_forward
```bash
sysctl net.ipv4.ip_forward=1
```