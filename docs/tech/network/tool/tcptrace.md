TCP connection analysis tool。当不方便使用 wireshark 时可以做一些检查。

下面输出说明这个抓包文件里有 2 个 TCP 连接，并且是以 RST 结束的：
```bash
$ tcptrace -b test.pcap
1 arg remaining, starting with 'test.pcap'
Ostermann's tcptrace -- version 6.6.7 -- Thu Nov  4, 2004

145 packets seen, 145 TCP packets traced
elapsed wallclock time: 0:00:00.028527, 5082 pkts/sec analyzed
trace file elapsed time: 0:00:04.534695
TCP connection info:
  1: victorebpf:51952 - 180.101.49.12:443 (a2b)   15>   15<  (complete)  (reset)
  2: victorebpf:56794 - 180.101.49.58:443 (c2d)   56>   59<  (complete)  (reset)
```