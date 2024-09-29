tshark 也可以读取和解析抓包文件。关于 tshark 的更多说明，可以参考[官方文档](https://www.wireshark.org/docs/man-pages/tshark.html)。

tshark 解读文件时，可以像 Wireshark 那样解读到应用层，而这一点，tcpdump 就无法做到。


#### 过滤并统计 HTTP 返回码的分布情况

[lesson17-in.pcap](https://gitee.com/steelvictor/network-analysis/blob/master/17/lesson17-in-shorten.pcap)
```bash
$ tshark -r lesson17-in.pcap -T fields -e http.response.code | grep -v ^$ | sort | uniq -c | sort -r
2883 200
704 502
227 304
141 400
45 301
41 302
16 408
13 403
6 503
6 404
2 206
```