
pidstat 用来监控 Linux 系统中各个进程（PID）的资源使用情况。它可以显示 **CPU、内存、I/O、线程**等详细的资源使用信息，适合对**单个进程**进行性能分析。

```shell
pidstat [options] [interval] [count]
```

### 使用示例

#### 显示每个进程开机以来 CPU 使用情况
```shell
$ pidstat
```

#### 开机以来，指定 pid 的 CPU 使用情况

```shell
$ pidstat -p 1325
01:57:15 PM   UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
01:57:15 PM     0      1325    0.83    0.57    0.00    1.40    1.40     1  AliYunDunMonito
```

#### 开机以来，指定 pid 的内存使用情况
```shell
$ pidstat -p 1325 -r
01:58:45 PM   UID       PID  minflt/s  majflt/s     VSZ     RSS   %MEM  Command
01:58:45 PM     0      1325      1.30      0.00  140232   38848   2.27  AliYunDunMonito
```

#### 开机以来，指定 pid 的 I/O 情况
```shell
$ pidstat -p 1325 -d
01:59:26 PM   UID       PID   kB_rd/s   kB_wr/s kB_ccwr/s iodelay  Command
01:59:26 PM     0      1325     -1.00     -1.00     -1.00       0  AliYunDunMonito
```

#### 开机以来，指定 pid 的线程级别的 CPU 使用情况
```shell
$ pidstat -p 1325 -d
02:03:04 PM   UID      TGID       TID    %usr %system  %guest   %wait    %CPU   CPU  Command
02:03:04 PM     0      1325         -    0.82    0.57    0.00    1.33    1.39     1  AliYunDunMonito
02:03:04 PM     0         -      1325    0.08    0.06    0.00    1.33    0.14     1  |__AliYunDunMonito
02:03:04 PM     0         -      1326    0.00    0.01    0.00    0.20    0.01     0  |__AliYunDunMonito
02:03:04 PM     0         -      1327    0.00    0.01    0.00    0.21    0.01     0  |__AliYunDunMonito
02:03:04 PM     0         -      1328    0.01    0.01    0.00    0.18    0.02     1  |__AliYunDunMonito
02:03:04 PM     0         -      1329    0.03    0.03    0.00    0.04    0.06     0  |__AliYunDunMonito
02:03:04 PM     0         -      1330    0.00    0.00    0.00    0.02    0.00     0  |__AliYunDunMonito
02:03:04 PM     0         -      1331    0.04    0.03    0.00    0.97    0.07     0  |__AliYunDunMonito
02:03:04 PM     0         -      1332    0.00    0.00    0.00    0.17    0.00     0  |__AliYunDunMonito
02:03:04 PM     0         -      1333    0.19    0.04    0.00    2.25    0.23     1  |__AliYunDunMonito
02:03:04 PM     0         -      1334    0.02    0.02    0.00    0.91    0.04     0  |__AliYunDunMonito
02:03:04 PM     0         -      1335    0.00    0.00    0.00    0.02    0.00     1  |__AliYunDunMonito
02:03:04 PM     0         -      1336    0.00    0.00    0.00    0.00    0.00     1  |__AliYunDunMonito
02:03:04 PM     0         -      1337    0.19    0.28    0.00    1.93    0.47     0  |__AliYunDunMonito
02:03:04 PM     0         -      1338    0.00    0.00    0.00    0.02    0.00     1  |__AliYunDunMonito
02:03:04 PM     0         -      1339    0.05    0.02    0.00    1.17    0.07     1  |__AliYunDunMonito
02:03:04 PM     0         -      1340    0.01    0.01    0.00    0.50    0.03     0  |__AliYunDunMonito
02:03:04 PM     0         -      1341    0.01    0.01    0.00    0.02    0.02     1  |__AliYunDunMonito
02:03:04 PM     0         -      1342    0.01    0.01    0.00    0.35    0.02     1  |__AliYunDunMonito
02:03:04 PM     0         -      1343    0.03    0.02    0.00    1.01    0.05     1  |__AliYunDunMonito
02:03:04 PM     0         -      1344    0.03    0.01    0.00    0.62    0.04     1  |__AliYunDunMonito
02:03:04 PM     0         -      1345    0.03    0.02    0.00    1.03    0.05     1  |__AliYunDunMonito
02:03:04 PM     0         -      1354    0.00    0.00    0.00    0.02    0.00     0  |__AliYunDunMonito
02:03:04 PM     0         -      1355    0.00    0.00    0.00    0.02    0.00     1  |__AliYunDunMonito
02:03:04 PM     0         -      1356    0.00    0.00    0.00    0.02    0.00     0  |__AliYunDunMonito
02:03:04 PM     0         -      1357    0.00    0.00    0.00    0.00    0.00     0  |__AliYunDunMonito
02:03:04 PM     0         -      1372    0.03    0.02    0.00    0.92    0.05     0  |__AliYunDunMonito
```

#### 开机以来，显示指定 pid 的上下文切换信息

```shell
$ pidstat -p 1325 -w
02:02:30 PM   UID       PID   cswch/s nvcswch/s  Command
02:02:30 PM     0      1325     29.87      0.11  AliYunDunMonito
```

* cswch：表示每秒**自愿上下文切换（voluntary context switches）**的次数。指进程无法获取所需资源，导致的上下文切换。比如说， I/O、内存等系统资源不足时，就会发生自愿上下文切换。
* nvcswch：表示每秒**非自愿上下文切换（non voluntary context switches）**的次数。指进程由于时间片已到等原因，被系统强制调度，进而发生的上下文切换。比如说，大量进程都在争抢 CPU 时，就容易发生非自愿上下文切换。

#### 组合使用多种统计信息

```shell
$ pidstat -p 1325 -urd
Linux 5.15.0-107-generic (iZ2ze5ybozvutjqtoe2zk3Z)      09/23/2024      _x86_64_        (2 CPU)

02:07:08 PM   UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
02:07:08 PM     0      1325    0.82    0.57    0.00    1.29    1.39     1  AliYunDunMonito

02:07:08 PM   UID       PID  minflt/s  majflt/s     VSZ     RSS   %MEM  Command
02:07:08 PM     0      1325      1.21      0.00  140232   38848   2.27  AliYunDunMonito

02:07:08 PM   UID       PID   kB_rd/s   kB_wr/s kB_ccwr/s iodelay  Command
02:07:08 PM     0      1325     -1.00     -1.00     -1.00       0  AliYunDunMonito
```

#### 每隔 5 秒显示一次 CPU 和内存使用情况，持续 3 次：

```shell
$ pidstat -p 1325 -r 5 3
Linux 5.15.0-107-generic (iZ2ze5ybozvutjqtoe2zk3Z)      09/23/2024      _x86_64_        (2 CPU)

02:07:55 PM   UID       PID  minflt/s  majflt/s     VSZ     RSS   %MEM  Command
02:08:00 PM     0      1325      0.00      0.00  140232   38848   2.27  AliYunDunMonito
02:08:05 PM     0      1325      0.00      0.00  140232   38848   2.27  AliYunDunMonito
02:08:10 PM     0      1325      0.00      0.00  140232   38848   2.27  AliYunDunMonito
Average:        0      1325      0.00      0.00  140232   38848   2.27  AliYunDunMonito
```

#### 同时查看多种统计信息

```shell
$ pidstat -u 5 1
Linux 5.15.0-107-generic (iZ2ze5ybozvutjqtoe2zk3Z)      09/23/2024      _x86_64_        (2 CPU)

12:38:32 PM   UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
12:38:37 PM     0      1314    0.20    0.00    0.00    0.00    0.20     1  AliYunDun
12:38:37 PM     0      1325    0.40    0.20    0.00    0.00    0.60     1  AliYunDunMonito
12:38:37 PM     0     10561    0.20    0.00    0.00    0.00    0.20     1  snapd
12:38:37 PM     0     12755    0.20    0.00    0.00    0.00    0.20     0  aliyun-service
12:38:37 PM  1000     34311  100.00    0.00    0.00    0.00  100.00     0  stress

Average:      UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
Average:        0      1314    0.20    0.00    0.00    0.00    0.20     -  AliYunDun
Average:        0      1325    0.40    0.20    0.00    0.00    0.60     -  AliYunDunMonito
Average:        0     10561    0.20    0.00    0.00    0.00    0.20     -  snapd
Average:        0     12755    0.20    0.00    0.00    0.00    0.20     -  aliyun-service
Average:     1000     34311  100.00    0.00    0.00    0.00  100.00     -  stress
```

### 输出解释

#### `-u` CPU 信息

* **%usr**：任务在用户级别（应用程序）执行时占用的 CPU 百分比，包括使用 nice 优先级运行的进程。注意：这个字段不包括运行虚拟处理器所花费的时间。
* **%system**：任务在系统级别（内核）执行时占用的 CPU 百分比。
* **%guest**：任务在虚拟机中（运行虚拟处理器）占用的 CPU 百分比。
* **%wait**：任务等待运行时占用的 CPU 百分比。

#### `-w` 上下文切换信息

* **cswch/s**：任务每秒自愿上下文切换的总次数。**自愿上下文切换**是指任务由于需要的资源不可用而主动暂停，等待资源可用后再继续运行。
* **nvcswch/s**：任务每秒非自愿上下文切换的总次数。**非自愿上下文切换**是指任务在用完了自己的时间片后，被操作系统强制暂停并让出 CPU 给其他任务。

#### `-d` I/O 信息

* **kB_rd/s**：任务每秒从磁盘**读**取的千字节数。
* **kB_wr/s**：任务每秒导致**写**入磁盘的千字节数，或者即将导致写入磁盘的数据量。
* **kB_ccwr/s**：任务取消写入到磁盘的千字节数。这通常发生在任务截断了一些脏页缓存的情况下。在这种情况下，原本由其他任务负责的 I/O 将不再发生。
* **iodelay**：被监控任务的块 I/O 延迟，以时钟周期为单位。该度量包括任务在等待同步块 I/O 完成和交换块 I/O 完成时的延迟。

#### `-r` 内存信息

* **minflt/s**：任务每秒发生的**次要页面错误数**，这些错误不需要从磁盘加载内存页。次要错误通常意味着访问了已经在内存中的页面，但需要重新映射。
* **majflt/s**：任务每秒发生的**主要页面错误数**，这些错误需要从磁盘加载内存页。主要错误意味着任务需要的数据页不在内存中，必须从磁盘读取。
* **VSZ**：虚拟内存大小，表示任务使用的虚拟内存总量，单位为千字节。
* **RSS**：常驻集大小，表示任务使用的未交换的物理内存量，单位为千字节。
* **%MEM**：任务当前使用的物理内存占可用内存的百分比。

