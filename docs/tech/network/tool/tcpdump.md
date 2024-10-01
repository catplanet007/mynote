---
sidebar_position: 7
tags: [Linux, 性能优化, 网络]
---

tcpdump 基于 [libpcap](https://www.tcpdump.org/)，利用内核中的 `AF_PACKET` 套接字，抓取网络接口中传输的网络包；并提供了强大的过滤规则，帮你从大量的网络包中，挑出最想关注的信息。

tcpdump 为你展示了每个网络包的详细细节，这就要求，在使用前，你必须要对网络协议有基本了解。而要了解网络协议的详细设计和实现细节， [RFC](https://www.rfc-editor.org/rfc-index.html) 当然是最权威的资料。


## 用法

```bash
tcpdump [选项] [过滤表达式]
```

查看 tcpdump 的[手册](https://www.tcpdump.org/manpages/tcpdump.1.html) ，以及 [pcap-filter](https://www.tcpdump.org/manpages/pcap-filter.7.html) 的手册，你会发现，tcpdump 提供了大量的选项以及各式各样的过滤表达式。

### tcpdump 常用选项

- `-i`：`tcpdump -i eth0`，指定网络接口，默认是 0 号接口（如 eth0），any 表示所有接口。
- `-nn`：`tcpdump -nn`，不解析 IP 地址和端口号的名称。
- `-c`：`tcpdump -c 5`，限制要抓取网络包的个数。
- `-A`：`tcpdump -A`，以 ASCII 格式显示网络包内容（不指定时只显示头部信息）。
- `-w`：`tcpdump -w file.pcap`，保存到文件中，文件名通常以 .pcap 为后缀。
- `-r`：`tcpdump -r file.pcap 'tcp[tcpflags] & (tcp-rst) != 0'`，读取 file.pcap 文件并过滤
- `-e`：`tcpdump -e`，输出链路层的头部信息。
- `-s`：每个报文只抓一定长度，节省抓包文件的大小，**延长抓包时间**
- `-v`,`-vv`,`-vvv`，打印更详细的报文信息
- `-p`：关闭混杂模式。所谓混杂模式，也就是嗅探（Sniffing），就是把目的地址不是本机地址的网络报文也抓取下来。
- `-X`：以 hex 或 ASCII 格式打印每个包内容

### tcpdump 常用过滤表达式

- 主机过滤：`host`、`src host`、`dst host`
  - `tcpdump -nn host 35.190.27.188`
  - `tcpdump -nn src host 192.168.1.1`
- 网络过滤：`net`、`src net`、`dst net`
  - `tcpdump -nn net 192.168.0.0`
- 端口过滤：`port`、`portrange`、`src port`、`dst port`
  - `tcpdump -nn dst port 80`
  - `tcpdump -nn portrange 1024-2048`
- 协议过滤：`ip`、`ip6`、`arp`、`tcp`、`udp`、`icmp`
  - `tcpdump -nn tcp`
- 逻辑表达式：`and`、`or`、`not`
  - `tcpdump -nn icmp or udp`
  - `tcpdump -nn tcp and port 80`
  - `tcpdump -nn not port 22`
- 特定状态的 TCP 包：`tcp[tcpflags]`
  - `tcpdump -nn "tcp[tcpflags] & tcp-syn != 0"`
  - `tcpdump -nn "tcp[tcpflags] & tcp-ack != 0"`
  - `tcpdump -nn "tcp[tcpflags] & (tcp-rst) != 0"`
    - 等价于 `tcpdump -nn 'tcp[13]&4 != 0'`
  - `tcpdump -w file.pcap 'dst port 443 && tcp[20]==22 && tcp[25]==1'`
    - `tcp[20]==22`：提取了 TCP 的第 21 个字节，由于 TCP 头部占 20 字节，TLS 又是 TCP 的载荷，那么 TLS 的第 1 个字节就是 TCP 的第 21 个字节，这个位置的值如果是 22（十进制），那么就表明这个是 TLS 握手报文
    - `tcp[25]==1`：TCP 头部的第 26 个字节，如果它等于 1，那么就表明这个是 Client Hello 类型的 TLS 握手报文。
- tcp.analysis 类过滤器
  - `tcp.analysis.ack_rtt >0.2 and tcp.len == 0`：找到超过 200ms 才发回的确认报文
  - `tcp.analysis.window_full`：找到所有的 TCP Window Full 的报文

### tcpdump 输出格式

```bash
时间戳 协议 源地址.源端口 > 目的地址.目的端口 网络包详细信息
```

络包的详细信息取决于协议，不同协议展示的格式也不同。更详细的使用方法，还是去查询 tcpdump 的 [man 手册](https://www.tcpdump.org/manpages/tcpdump.1.html)。

根据 IP 地址反查域名、根据端口号反查协议名称，是很多网络工具默认的行为，而这往往会导致性能工具的工作缓慢。所以，通常，网络性能工具都会提供一个选项（比如 -n 或者 -nn），来禁止名称解析。

#### 以 hex 或 ASCII 格式打印每个包内容
例如服务器有一台 nginx 服务器

```bash
$ sudo docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS     NAMES
14e6239d52c6   nginx     "/docker-entrypoint.鈥?   32 seconds ago   Up 31 seconds   80/tcp    wonderful_murdock

$ sudo lsof -i :80
COMMAND     PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
AliYunDun 70919 root   11u  IPv4 805447      0t0  TCP iZ2ze5ybozvutjqtoe2zk3Z:59738->100.100.30.26:http (ESTABLISHED)
```

用 `-X` 抓包，然后 telnet 连上，手动输入如下内容：
```
GET / HTTP/1.1
Host: www.baidu.com


```

可以看到转到的包显示 nginx 返回信息

import Foldable from '@site/src/components/Foldable';

<Foldable title='telnet 127.0.0.1 80' defaultOpen={false} >
```bash
$ telnet 127.0.0.1 80
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
GET / HTTP/1.1
Host: www.baidu.com

HTTP/1.1 200 OK
Server: nginx/1.21.5
Date: Sat, 28 Sep 2024 05:10:05 GMT
Content-Type: text/html
Content-Length: 615
Last-Modified: Tue, 28 Dec 2021 15:28:38 GMT
Connection: keep-alive
ETag: "61cb2d26-267"
Accept-Ranges: bytes

<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```
</Foldable>

<Foldable title='sudo tcpdump -i any -X port 80' defaultOpen={false} >
```bash
$ sudo tcpdump -i any -X port 80
tcpdump: data link type LINUX_SLL2
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on any, link-type LINUX_SLL2 (Linux cooked v2), snapshot length 262144 bytes
13:08:10.150294 lo    In  IP localhost.56790 > localhost.http: Flags [S], seq 807712343, win 65495, options [mss 65495,sackOK,TS val 3354499346 ecr 0,nop,wscale 7], length 0
        0x0000:  4510 003c 3888 4000 4006 0422 7f00 0001  E..<8.@.@.."....
        0x0010:  7f00 0001 ddd6 0050 3024 b657 0000 0000  .......P0$.W....
        0x0020:  a002 ffd7 fe30 0000 0204 ffd7 0402 080a  .....0..........
        0x0030:  c7f1 9912 0000 0000 0103 0307            ............
13:08:10.150343 lo    In  IP localhost.http > localhost.56790: Flags [S.], seq 3986952917, ack 807712344, win 65483, options [mss 65495,sackOK,TS val 3354499346 ecr 3354499346,nop,wscale 7], length 0
        0x0000:  4500 003c 0000 4000 4006 3cba 7f00 0001  E..<..@.@.<.....
        0x0010:  7f00 0001 0050 ddd6 eda4 12d5 3024 b658  .....P......0$.X
        0x0020:  a012 ffcb fe30 0000 0204 ffd7 0402 080a  .....0..........
        0x0030:  c7f1 9912 c7f1 9912 0103 0307            ............
13:08:10.150369 lo    In  IP localhost.56790 > localhost.http: Flags [.], ack 1, win 512, options [nop,nop,TS val 3354499346 ecr 3354499346], length 0
        0x0000:  4510 0034 3889 4000 4006 0429 7f00 0001  E..48.@.@..)....
        0x0010:  7f00 0001 ddd6 0050 3024 b658 eda4 12d6  .......P0$.X....
        0x0020:  8010 0200 fe28 0000 0101 080a c7f1 9912  .....(..........
        0x0030:  c7f1 9912                                ....
......
13:10:05.872475 lo    In  IP localhost.http > localhost.36802: Flags [P.], seq 239:854, ack 40, win 512, options [nop,nop,TS val 3354615069 ecr 3354615068], length 615: HTTP
        0x0000:  4500 029b fb95 4000 4006 3ec5 7f00 0001  E.....@.@.>.....
        0x0010:  7f00 0001 0050 8fc2 f44a c70d 04c2 1811  .....P...J......
        0x0020:  8018 0200 0090 0000 0101 080a c7f3 5d1d  ..............].
        0x0030:  c7f3 5d1c 3c21 444f 4354 5950 4520 6874  ..].<!DOCTYPE.ht
        0x0040:  6d6c 3e0a 3c68 746d 6c3e 0a3c 6865 6164  ml>.<html>.<head
        0x0050:  3e0a 3c74 6974 6c65 3e57 656c 636f 6d65  >.<title>Welcome
        0x0060:  2074 6f20 6e67 696e 7821 3c2f 7469 746c  .to.nginx!</titl
        0x0070:  653e 0a3c 7374 796c 653e 0a68 746d 6c20  e>.<style>.html.
        0x0080:  7b20 636f 6c6f 722d 7363 6865 6d65 3a20  {.color-scheme:.
        0x0090:  6c69 6768 7420 6461 726b 3b20 7d0a 626f  light.dark;.}.bo
        0x00a0:  6479 207b 2077 6964 7468 3a20 3335 656d  dy.{.width:.35em
        0x00b0:  3b20 6d61 7267 696e 3a20 3020 6175 746f  ;.margin:.0.auto
        0x00c0:  3b0a 666f 6e74 2d66 616d 696c 793a 2054  ;.font-family:.T
        0x00d0:  6168 6f6d 612c 2056 6572 6461 6e61 2c20  ahoma,.Verdana,.
        0x00e0:  4172 6961 6c2c 2073 616e 732d 7365 7269  Arial,.sans-seri
        0x00f0:  663b 207d 0a3c 2f73 7479 6c65 3e0a 3c2f  f;.}.</style>.</
        0x0100:  6865 6164 3e0a 3c62 6f64 793e 0a3c 6831  head>.<body>.<h1
        0x0110:  3e57 656c 636f 6d65 2074 6f20 6e67 696e  >Welcome.to.ngin
        0x0120:  7821 3c2f 6831 3e0a 3c70 3e49 6620 796f  x!</h1>.<p>If.yo
        0x0130:  7520 7365 6520 7468 6973 2070 6167 652c  u.see.this.page,
        0x0140:  2074 6865 206e 6769 6e78 2077 6562 2073  .the.nginx.web.s
        0x0150:  6572 7665 7220 6973 2073 7563 6365 7373  erver.is.success
        0x0160:  6675 6c6c 7920 696e 7374 616c 6c65 6420  fully.installed.
        0x0170:  616e 640a 776f 726b 696e 672e 2046 7572  and.working..Fur
        0x0180:  7468 6572 2063 6f6e 6669 6775 7261 7469  ther.configurati
        0x0190:  6f6e 2069 7320 7265 7175 6972 6564 2e3c  on.is.required.<
        0x01a0:  2f70 3e0a 0a3c 703e 466f 7220 6f6e 6c69  /p>..<p>For.onli
        0x01b0:  6e65 2064 6f63 756d 656e 7461 7469 6f6e  ne.documentation
        0x01c0:  2061 6e64 2073 7570 706f 7274 2070 6c65  .and.support.ple
        0x01d0:  6173 6520 7265 6665 7220 746f 0a3c 6120  ase.refer.to.<a.
        0x01e0:  6872 6566 3d22 6874 7470 3a2f 2f6e 6769  href="http://ngi
        0x01f0:  6e78 2e6f 7267 2f22 3e6e 6769 6e78 2e6f  nx.org/">nginx.o
        0x0200:  7267 3c2f 613e 2e3c 6272 2f3e 0a43 6f6d  rg</a>.<br/>.Com
        0x0210:  6d65 7263 6961 6c20 7375 7070 6f72 7420  mercial.support.
        0x0220:  6973 2061 7661 696c 6162 6c65 2061 740a  is.available.at.
        0x0230:  3c61 2068 7265 663d 2268 7474 703a 2f2f  <a.href="http://
        0x0240:  6e67 696e 782e 636f 6d2f 223e 6e67 696e  nginx.com/">ngin
        0x0250:  782e 636f 6d3c 2f61 3e2e 3c2f 703e 0a0a  x.com</a>.</p>..
        0x0260:  3c70 3e3c 656d 3e54 6861 6e6b 2079 6f75  <p><em>Thank.you
        0x0270:  2066 6f72 2075 7369 6e67 206e 6769 6e78  .for.using.nginx
        0x0280:  2e3c 2f65 6d3e 3c2f 703e 0a3c 2f62 6f64  .</em></p>.</bod
        0x0290:  793e 0a3c 2f68 746d 6c3e 0a              y>.</html>.
13:10:05.872483 lo    In  IP localhost.36802 > localhost.http: Flags [.], ack 854, win 507, options [nop,nop,TS val 3354615069 ecr 3354615069], length 0
        0x0000:  4510 0034 7adb 4000 4006 c1d6 7f00 0001  E..4z.@.@.......
        0x0010:  7f00 0001 8fc2 0050 04c2 1811 f44a c974  .......P.....J.t
        0x0020:  8010 01fb fe28 0000 0101 080a c7f3 5d1d  .....(........].
        0x0030:  c7f3 5d1d                                ..].
```
</Foldable>

#### 抓取到 TLS 握手阶段的 Client Hello 报文
解释见上面的，常用过滤表达式一节
```bash
$ tcpdump -w file.pcap 'dst port 443 && tcp[20]==22 && tcp[25]==1'
```

![alt text](./img/tcpdump-tsl-client-hello.png)

![alt text](./img/tcpdump-tsl-client-hello2.png)

#### 读取过滤后转存

```bash
$ tcpdump -r file.pcap 'tcp[tcpflags] & (tcp-rst) != 0' -w rst.pcap
```

#### 延长抓包时间

一般来说，帧头是 14 字节，IP 头是 20 字节，TCP 头是 20~40 字节。如果你明确地知道这次抓包的重点是传输层，那么理论上，对于每一个报文，你只要抓取到传输层头部即可，也就是前 14+20+40 字节（即前 74 字节）：

```bash
$ tcpdump -s 74 -w file.pcap
```

如果是默认抓取 1500 字节，那么生成的抓包文件将是上面这个抓包文件的 20 倍。反过来说，使用同样的磁盘空间，上面这种方式，其抓包时间可以长达默认的 20 倍！

应用层头部的长度跟二到四层的情况非常不同，应用层头部可能非常大，甚至可以超过 TCP 的 MSS。比如 HTTP 头部，小的话可能只有几十个字节，大的话可能要几十个 KB，也就是好多个 TCP segment 才放得下。这种时候就不要纠结如何节省抓取的报文长度了。


## Wireshark

tcpdump 可以用 `-w` 参数保存 .pcap 文件，然后导入到 Wireshark 中。

```bash
# 保存 .pcap 文件
$ tcpdump -nn udp port 53 or host 35.190.27.188 -w ping.pcap
$ scp host-ip/path/ping.pcap .
```

## 案例 1

执行下面的命令，再试一下 ping

```bash
# 禁止接收从DNS服务器发送过来并包含googleusercontent的包
$ iptables -I INPUT -p udp --sport 53 -m string --string googleusercontent --algo bm -j DROP
```

```bash
# ping 3 次（默认每次发送间隔1秒）
# 假设DNS服务器还是上一期配置的114.114.114.114
$ ping -c3 geektime.org
PING geektime.org (35.190.27.188) 56(84) bytes of data.
64 bytes from 35.190.27.188 (35.190.27.188): icmp_seq=1 ttl=109 time=188 ms
64 bytes from 35.190.27.188 (35.190.27.188): icmp_seq=2 ttl=109 time=199 ms
64 bytes from 35.190.27.188: icmp_seq=3 ttl=109 time=189 ms

--- geektime.org ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 12400ms
rtt min/avg/max/mdev = 188.389/192.151/199.190/4.980 ms
```

根据 ping 的输出，你可以发现，geektime.org 解析后的 IP 地址是 35.190.27.188，而后三次 ping 请求都得到了响应，延迟（RTT）都是 30ms 多一点。

但汇总的地方，就有点儿意思了。3 次发送，收到 3 次响应，没有丢包，但三次发送和接受的总时间居然超过了 12s（12400ms）。

可能是 DNS 解析延迟导致的吗？看 ping 的输出，三次 ping 请求中，用的都是 IP 地址，说明 ping 只需要在最开始运行时，解析一次得到 IP，后面就可以只用 IP 了。

```bash
$ time nslookup geektime.org
Server:    114.114.114.114
Address:  114.114.114.114#53

Non-authoritative answer:
Name:  geektime.org
Address: 35.190.27.188


real  0m0.044s
user  0m0.006s
sys  0m0.003s
```

可以看到，域名解析还是很快的，只需要 44ms，显然比 12s 短了很多。

这时候就可以用 tcpdump 抓包，查看 ping 在收发哪些网络包。

```bash
$ tcpdump -nn udp port 53 or host 35.190.27.188
```

- `-nn` ，表示不解析抓包中的域名（即不反向解析）、协议以及端口号。
- `udp port 53` ，表示只显示 UDP 协议的端口号（包括源端口和目的端口）为 53 的包。
- `host 35.190.27.188` ，表示只显示 IP 地址（包括源地址和目的地址）为 35.190.27.188 的包。
- 这两个过滤条件中间的“ or ”，表示或的关系，也就是说，只要满足上面两个条件中的任一个，就可以展示出来。


```bash
$ ping -c3 geektime.org
...
--- geektime.org ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 11095ms
rtt min/avg/max/mdev = 81.473/81.572/81.757/0.130 ms
```

查看 tcpdump 的输出：

```bash
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
14:02:31.100564 IP 172.16.3.4.56669 > 114.114.114.114.53: 36909+ A? geektime.org. (30)
14:02:31.507699 IP 114.114.114.114.53 > 172.16.3.4.56669: 36909 1/0/0 A 35.190.27.188 (46)
14:02:31.508164 IP 172.16.3.4 > 35.190.27.188: ICMP echo request, id 4356, seq 1, length 64
14:02:31.539667 IP 35.190.27.188 > 172.16.3.4: ICMP echo reply, id 4356, seq 1, length 64
14:02:31.539995 IP 172.16.3.4.60254 > 114.114.114.114.53: 49932+ PTR? 188.27.190.35.in-addr.arpa. (44)
14:02:36.545104 IP 172.16.3.4.60254 > 114.114.114.114.53: 49932+ PTR? 188.27.190.35.in-addr.arpa. (44)
14:02:41.551284 IP 172.16.3.4 > 35.190.27.188: ICMP echo request, id 4356, seq 2, length 64
14:02:41.582363 IP 35.190.27.188 > 172.16.3.4: ICMP echo reply, id 4356, seq 2, length 64
14:02:42.552506 IP 172.16.3.4 > 35.190.27.188: ICMP echo request, id 4356, seq 3, length 64
14:02:42.583646 IP 35.190.27.188 > 172.16.3.4: ICMP echo reply, id 4356, seq 3, length 64
```

输出前两行，表示 tcpdump 的选项以及接口的基本信息；从第三行开始，就是抓取到的网络包的输出。这些输出的格式，都是 `时间戳 协议 源地址.源端口 > 目的地址.目的端口 网络包详细信息`（这是最基本的格式，可以通过选项增加其他字段）。

前面的字段，都比较好理解。但网络包的详细信息，本身根据协议的不同而不同。所以，要理解这些网络包的详细含义，就要对常用网络协议的基本格式以及交互原理，有基本的了解。

实际上，这些内容都会记录在 IETF（ 互联网工程任务组）发布的 [RFC](https://www.rfc-editor.org/rfc-index.html)（请求意见稿）中。

比如，第一条就表示，从本地 IP 发送到 114.114.114.114 的 A 记录查询请求，它的报文格式记录在 [RFC1035](https://www.ietf.org/rfc/rfc1035.txt) 中。在这个 tcpdump 的输出中，

- 36909+ 表示查询标识值，它也会出现在响应中，加号表示启用递归查询。
- A? 表示查询 A 记录。
- geektime.org. 表示待查询的域名。
- 30 表示报文长度。

接下来的一条，则是从 114.114.114.114 发送回来的 DNS 响应——域名 geektime.org. 的 A 记录值为 35.190.27.188。

第三条和第四条，是 ICMP echo request 和 ICMP echo reply，响应包的时间戳 14:02:31.539667，减去请求包的时间戳 14:02:31.508164 ，就可以得到，这次 ICMP 所用时间为 30ms。这看起来并没有问题。

但随后的两条反向地址解析 PTR 请求，就比较可疑了。因为我们只看到了请求包，却没有应答包。仔细观察它们的时间，你会发现，这两条记录都是发出后 5s 才出现下一个网络包，两条 PTR 记录就消耗了 10s。

再往下看，最后的四个包，则是两次正常的 ICMP 请求和响应，根据时间戳计算其延迟，也是 30ms。

到这里，其实我们也就找到了 ping 缓慢的根源，正是两次 PTR 请求没有得到响应而超时导致的。PTR 反向地址解析的目的，是从 IP 地址反查出域名，但事实上，并非所有 IP 地址都会定义 PTR 记录，所以 PTR 查询很可能会失败。

所以，在你使用 ping 时，如果发现结果中的延迟并不大，而 ping 命令本身却很慢，不要慌，有可能是背后的 PTR 在搞鬼。

知道问题后，解决起来就比较简单了，只要禁止 PTR 就可以。还是老路子，执行 man ping 命令，查询使用手册，就可以找出相应的方法，即加上 `-n` 选项禁止名称解析。比如，我们可以在终端中执行如下命令：

```bash
$ ping -n -c3 geektime.org
PING geektime.org (35.190.27.188) 56(84) bytes of data.
64 bytes from 35.190.27.188: icmp_seq=1 ttl=43 time=33.5 ms
64 bytes from 35.190.27.188: icmp_seq=2 ttl=43 time=39.0 ms
64 bytes from 35.190.27.188: icmp_seq=3 ttl=43 time=32.8 ms

--- geektime.org ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2002ms
rtt min/avg/max/mdev = 32.879/35.160/39.030/2.755 ms
```

案例最后，如果你在开始时，执行了 iptables 命令，那也不要忘了删掉它：

```bash
$ iptables -D INPUT -p udp --sport 53 -m string --string googleusercontent --algo bm -j DROP
```

不过，删除后你肯定还有疑问，明明我们的案例跟 Google 没啥关系，为什么要根据 googleusercontent ，这个毫不相关的字符串来过滤包呢？

实际上，如果换一个 DNS 服务器，就可以用 PTR 反查到 35.190.27.188 所对应的域名：

```bash
 $ nslookup -type=PTR 35.190.27.188 8.8.8.8
Server:  8.8.8.8
Address:  8.8.8.8#53
Non-authoritative answer:
188.27.190.35.in-addr.arpa  name = 188.27.190.35.bc.googleusercontent.com.
Authoritative answers can be found from:
```

虽然查到了 PTR 记录，但结果并非 geekbang.org，而是 188.27.190.35.bc.googleusercontent.com。其实，这也是为什么，案例开始时将包含 googleusercontent 的丢弃后，ping 就慢了。因为 iptables ，实际上是把 PTR 响应给丢了，所以会导致 PTR 请求超时。

## 案例 2

```bash
$ dig +short example.com
93.184.215.14
$ tcpdump -nn host 93.184.215.14 -w web.pcap
```

```bash
$ curl http://example.com
```

使用 wireshark 打开 web.pcap

可以看到：

![alt text](./img/example.com-package-capture.png)

打开菜单栏 -> 统计 -> 流量图，可以看到更直观的：

![alt text](./img/example.com-package-capture2.png)

找出访问 example.com 时间附近的包，TCP 三次握手和四次挥手。值得注意的是这里只看到三次挥手，从服务端返回的包中 ACK 和 FIN 合并成了一个包。

Wireshark 官[方文档](https://www.wireshark.org/docs/)和 [wiki](https://wiki.wireshark.org/)。


