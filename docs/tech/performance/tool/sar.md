sar 是一个系统活动报告工具，既可以实时查看系统的当前活动，又可以配置保存和报告历史统计数据。

### 使用示例

#### 收集系统实时活动信息
以下命令会每 2 秒收集一次 CPU 使用率，连续 5 次：

```shell
$ sar 2 5
Linux 5.15.0-107-generic (iZ2ze5ybozvutjqtoe2zk3Z)      09/23/2024      _x86_64_        (2 CPU)

11:46:13 PM     CPU     %user     %nice   %system   %iowait    %steal     %idle
11:46:15 PM     all      0.25      0.00      0.25      0.00      0.00     99.49
11:46:17 PM     all      1.00      0.00      1.00      0.00      0.00     98.01
11:46:19 PM     all      0.76      0.00      0.00      0.00      0.00     99.24
11:46:21 PM     all      0.75      0.00      0.50      0.00      0.00     98.75
11:46:23 PM     all      0.00      0.00      0.76      0.00      0.00     99.24
Average:        all      0.55      0.00      0.50      0.00      0.00     98.94
```

#### 显示网络收发的报告

在 `sar` 命令中，`-n` 选项可以跟随不同的参数，常见的有：

- **DEV**: 显示网络设备的统计信息。
- **EDEV**: 显示扩展网络设备的统计信息，包括发送和接收的包和字节数。
- **ALL**: 显示所有网络设备的统计信息。
- **TCP**: 显示 TCP 连接的统计信息。
- **UDP**: 显示 UDP 连接的统计信息。

```shell
# -n DEV 表示显示网络收发的报告，间隔1秒输出一组数据
$ sar -n DEV 1
15:03:46        IFACE   rxpck/s   txpck/s    rxkB/s    txkB/s   rxcmp/s   txcmp/s  rxmcst/s   %ifutil
15:03:47         eth0  12607.00   6304.00    664.86    358.11      0.00      0.00      0.00      0.01
15:03:47      docker0   6302.00  12604.00    270.79    664.66      0.00      0.00      0.00      0.00
15:03:47           lo      0.00      0.00      0.00      0.00      0.00      0.00      0.00      0.00
15:03:47    veth9f6bbcd   6302.00  12604.00    356.95    664.66      0.00      0.00      0.00      0.05
```

* 第二列：IFACE 表示网卡。
* 第三、四列：rxpck/s 和 txpck/s 分别表示每秒接收、发送的网络帧数，也就是  PPS。
* 第五、六列：rxkB/s 和 txkB/s 分别表示每秒接收、发送的千字节数，也就是  BPS。

#### 观测系统的页信息（Paging statistics）

```bash
$ sar -B 1
Linux 5.15.0-107-generic (iZ2ze5ybozvutjqtoe2zk3Z)      10/01/2024      _x86_64_        (2 CPU)

12:17:33 PM  pgpgin/s pgpgout/s   fault/s  majflt/s  pgfree/s pgscank/s pgscand/s pgsteal/s    %vmeff
12:17:34 PM      0.00     80.00      2.00      0.00      0.00      0.00      0.00      0.00      0.00
12:17:35 PM      0.00      0.00      5.00      0.00      0.00      0.00      0.00      0.00      0.00
12:17:36 PM      0.00      0.00      0.00      0.00      0.00      0.00      0.00      0.00      0.00
12:17:37 PM      0.00      0.00      0.00      0.00      1.00      0.00      0.00      0.00      0.00
^C
Average:         0.00     20.00      1.75      0.00      0.25      0.00      0.00      0.00      0.00
```

- `pgpgin/s`：表示每秒从磁盘读入到内存的页面数。
- `pgpgout/s`：表示每秒从内存写到磁盘的页面数。
- `fault/s`：表示每秒发生的缺页次数。
- `majflt/s`：表示每秒发生的重大缺页（需要从磁盘读取页面）次数。
- `pgfree/s`：表示每秒被释放的页面数。
- `pgscank/s`：表示每秒被 kswapd（内核页交换守护进程）扫描的页面数。对应 `/proc/vmstat` 中 `pgscan_kswapd`
- `pgscand/s`：Application 在内存申请过程中每秒直接扫描的 page 个数。对应 `/proc/vmstat` 中 `pgscan_direct`
- `pgsteal/s`：表示每秒被 kswapd 从缓存中回收的页面数。对应 `/proc/vmstat` 中 `pgsteal_kswapd + pgsteal_direct`
- `%vmeff`: `pgsteal/(pgscank+pgscand)`, 回收效率，越接近 100 说明系统越安全，越接近 0 说明系统内存压力越大。

#### 观测系统内存使用信息（ (Memory utilization statistics)）
```bash
$ sar -r 1
Linux 5.15.0-107-generic (iZ2ze5ybozvutjqtoe2zk3Z)      10/01/2024      _x86_64_        (2 CPU)

01:10:08 PM kbmemfree   kbavail kbmemused  %memused kbbuffers  kbcached  kbcommit   %commit  kbactive   kbinact   kbdirty
01:10:09 PM     92888   1248424    250716     14.63     22908   1256848    991952     57.90    899648    525432         0
01:10:10 PM     92888   1248424    250716     14.63     22908   1256848    991952     57.90    899648    525432         0
01:10:11 PM     92888   1248424    250716     14.63     22908   1256848    991952     57.90    899648    525432         0
01:10:12 PM     92888   1248424    250716     14.63     22908   1256848    991952     57.90    899648    525432         0
^C
Average:        92888   1248424    250716     14.63     22908   1256848    991952     57.90    899648    525432         0
```

- `kbmemfree`：以千字节为单位的可用内存大小。
- `kbmemused`：以千字节为单位的已使用内存大小。
- `%memused`：已使用内存占总内存的百分比。
- `kbbuffers`：以千字节为单位的缓冲区内存大小。
- `kbcached`：以千字节为单位的缓存内存大小。
- `kbcommit`：以千字节为单位的已提交虚拟内存大小。
- `%commit`：已提交虚拟内存占总内存和交换空间总和的百分比。

kbdirty 就是系统中的脏页大小，它同样也是对 /proc/vmstat 中 nr_dirty 的解析。
