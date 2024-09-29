
## 使用示例

#### 所有的 TCP 连接信息

```bash
# -a 显示所有的连接和监听端口；-n 以数字形式显示地址和端口号，不进行域名解析；-t 仅显示 TCP 协议的连接
$ netstat -ant
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0    280 10.0.2.15:22            10.0.2.2:56669          ESTABLISHED
tcp6       0      0 :::22                   :::*                    LISTEN
```

#### 查看丢包和乱序等统计

```bash
$ netstat -s
......
Tcp:
    16 active connection openings
    1 passive connection openings
    8 failed connection attempts
    1 connection resets received
    1 connections established
    6254 segments received
    4035 segments sent out
    1 segments retransmitted
    0 bad segments received
    3 resets sent
......
TcpExt:
    1 ICMP packets dropped because socket was locked
    3 TCP sockets finished time wait in fast timer
    8 delayed acks sent
    4674 packet headers predicted
    10 acknowledgments not containing data payload received
    1008 predicted acknowledgments
    TCPTimeouts: 1
    TCPBacklogCoalesce: 140
    1 connections reset due to early user close
    TCPRcvCoalesce: 2187
    TCPAutoCorking: 110
    TCPSynRetrans: 1
    TCPOrigDataSent: 1041
    TCPDelivered: 1049
```

#### 查看路由表
使用 `route -n`、`ip route` 也可以查看路由表。

```bash
$ netstat -r
Kernel IP routing table
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
default         _gateway        0.0.0.0         UG        0 0          0 enp0s3
10.0.2.0        0.0.0.0         255.255.255.0   U         0 0          0 enp0s3
_gateway        0.0.0.0         255.255.255.255 UH        0 0          0 enp0s3
172.17.0.0      0.0.0.0         255.255.0.0     U         0 0          0 docker0
```
