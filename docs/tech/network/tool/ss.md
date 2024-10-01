

## 使用示例

#### 查看连接的统计信息

```bash
$ ss -s
Total: 164
TCP:   5 (estab 1, closed 0, orphaned 0, timewait 0)

Transport Total     IP        IPv6
RAW    1         0         1
UDP    2         2         0
TCP    5         4         1
INET    8         6         2
FRAG    0         0         0
```

```bash
$ ss -eit
State                      Recv-Q                      Send-Q                                            Local Address:Port                                                Peer Address:Port                       Process
ESTAB                      0                           0                                                  172.24.56.35:59738                                              100.100.30.26:http                        ino:805447 sk:102c cgroup:/aegis <->
         sack cubic wscale:7,7 rto:228 rtt:24.627/0.049 ato:40 mss:1424 pmtu:1500 rcvmss:1460 advmss:1460 cwnd:34 bytes_sent:9902132 bytes_acked:9902133 bytes_received:250652 segs_out:14939 segs_in:20691 data_segs_out:14762 data_segs_in:6038 send 15.7Mbps lastsnd:88 lastrcv:29972 lastack:64 pacing_rate 31.5Mbps delivery_rate 2.31Mbps delivered:14763 app_limited busy:312888ms rcv_rtt:399985 rcv_space:67331 rcv_ssthresh:436446 minrtt:24.587
ESTAB                      0                           80                                                 172.24.56.35:ssh                                               106.39.150.218:13859                       timer:(on,020ms,0) ino:960640 sk:102d cgroup:/system.slice/ssh.service <->
         ts sack cubic wscale:7,7 rto:212 rtt:10.669/7.621 ato:40 mss:1400 pmtu:1500 rcvmss:908 advmss:1448 cwnd:10 bytes_sent:5094 bytes_acked:5014 bytes_received:3989 segs_out:27 segs_in:33 data_segs_out:21 data_segs_in:19 send 10.5Mbps lastsnd:4 lastrcv:4 lastack:4 pacing_rate 21Mbps delivery_rate 3.32Mbps delivered:20 app_limited busy:232ms unacked:2 rcv_rtt:9 rcv_space:14600 rcv_ssthresh:64076 minrtt:6.175
```

- `cubic`：TCP 拥塞控制算法为 cubic
- `wscale:7,7`：这条 TCP 连接的两端的 Window Scale 分别是 7 和 7。
- `cwnd:34`：这条 TCP 连接的拥塞窗口为 34 个 MSS。