
`dstat` 是一个强大的系统资源监控工具，提供实时的 CPU、磁盘、网络、内存等性能指标信息。相比传统工具如 vmstat、iostat 和 netstat，dstat 结合了它们的功能，并提供了更加直观的输出。

## 使用示例

#### 查看 CPU、磁盘、网络、内存等常规信息
```shell
$ dstat
You did not select any stats, using -cdngy by default.
--total-cpu-usage-- -dsk/total- -net/total- ---paging-- ---system--
usr sys idl wai stl| read  writ| recv  send|  in   out | int   csw
  0   0  99   0   0|  73k  278k|   0     0 | 352B 3135B| 683  1487
  1   1  98   0   0|   0     0 |   0     0 |   0     0 |2486  5278
  0   0 100   0   0|   0     0 | 648B  760B|   0     0 |  23   132
  0   0 100   0   0|   0     0 |   0     0 |   0     0 |1271  2641
  0   0 100   0   0|   0     0 |   0     0 |   0     0 |  27   130
```

#### 指定刷新频率和次数

每隔 2 秒刷新一次，并显示 10 次

```shell
$ dstat 2 10
```

#### 显示详细的 CPU 使用情况

显示 CPU 的使用情况，包括用户、系统、空闲、等待等状态。

```shell
$ dstat -c
--total-cpu-usage--
usr sys idl wai stl
  0   0  99   0   0
  0   0 100   0   0
  1   0  99   0   0
```

#### 显示内存使用情况

显示磁盘读写速度。

```shell
$ dstat -m
------memory-usage-----
 used  free  buff  cach
2583M 1067M 2248k  487M
2585M 1065M 2256k  487M
2586M 1065M 2256k  487M
```

#### 显示磁盘 I/O

```shell
$ dstat -d
-dsk/total-
 read  writ
  73k  278k
   0     0
   0     0
   0    52k
```

#### 显示网络流量

```shell
$ dstat -n
-net/total-
 recv  send
   0     0
   0     0
```

#### 组合使用

同时查看 CPU、磁盘、内存和网络：

```shell
$ dstat -cdmn
--total-cpu-usage-- -dsk/total- ------memory-usage----- -net/total-
usr sys idl wai stl| read  writ| used  free  buff  cach| recv  send
  0   0  99   0   0|  73k  278k|2596M 1049M 2928k  491M|   0     0
  1   0  99   0   0|   0  8192B|2593M 1053M 2928k  491M|   0     0
  0   0 100   0   0|   0     0 |2593M 1053M 2928k  491M|   0     0
```

#### 显示时间

```shell
$ dstat --time -cdmn
----system---- --total-cpu-usage-- -dsk/total- ------memory-usage----- -net/total-
     time     |usr sys idl wai stl| read  writ| used  free  buff  cach| recv  send
23-09 22:04:16|  0   0  99   0   0|  73k  278k|2600M 1005M 8352k  526M|   0     0
23-09 22:04:17|  0   0 100   0   0|   0     0 |2600M 1005M 8352k  526M|   0     0
23-09 22:04:18|  0   1  99   0   0|   0     0 |2605M 1000M 8352k  526M|   0     0
```

#### 监控特定的磁盘设备

使用 -D 参数指定磁盘设备：

```shell
$ dstat -D sda,sdb
You did not select any stats, using -cdngy by default.
--total-cpu-usage-- --dsk/sda-----dsk/sdb-- -net/total- ---paging-- ---system--
usr sys idl wai stl| read  writ: read  writ| recv  send|  in   out | int   csw
  0   0  99   0   0|1744B    0 : 375B 3125B|   0     0 | 366B 3125B| 683  1489
  1   0  99   0   0|   0     0 :   0     0 |   0     0 |   0     0 |2173  4572
  0   0 100   0   0|   0     0 :   0     0 |   0     0 |   0     0 |  33   162
```

#### 监控特定的网络接口

使用 -N 参数指定网络接口

```shell
$ dstat -N eth0,eth1
You did not select any stats, using -cdngy by default.
--total-cpu-usage-- -dsk/total- --net/eth0- ---paging-- ---system--
usr sys idl wai stl| read  writ| recv  send|  in   out | int   csw
  0   0  99   0   0|  73k  278k|   0     0 | 366B 3124B| 684  1489
  0   0  99   0   0|   0    16k|   0     0 |   0     0 |1344  2791
```

#### 显示详细的 I/O 延迟信息

```shell
$ dstat --io
--io/total-
 read  writ
2.30  1.82
   0  4.00
```

#### 显示进程的上下文切换和中断

```shell
$ dstat --proc
---procs---
run blk new
  0   0  14
  0   0 171
  0   0 3.0
1.0   0   0
```

#### 显示系统负载信息

```shell
$ dstat --load
---load-avg---
 1m   5m  15m
0.13 0.06 0.01
0.13 0.06 0.01
0.12 0.06 0.01
0.12 0.06 0.01
```

#### 查看 TCP 连接

```bash
$ dstat --tcp
------tcp-sockets-------
lis  act  syn  tim  clo
  6    2    0    3    0
  6    2    0    3    0
  6    2    0    4    0
```