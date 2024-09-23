`vmstat` 常用来分析内存情况和CPU上下文切换和终端次数。

```bash
vmstat [options] [delay [count]]
```

```shell
$ vmstat --help
Usage:
 vmstat [options] [delay [count]]

Options:
 -a, --active           active/inactive memory 活动的内存（包括缓存和交换）
 -f, --forks            number of forks since boot
 -m, --slabs            slabinfo 显示内存的使用情况，包括缓存、缓冲区和交换。
 -n, --one-header       do not redisplay header
 -s, --stats            event counter statistics
 -d, --disk             disk statistics
 -D, --disk-sum         summarize disk statistics
 -p, --partition <dev>  partition specific statistics 显示特定分区的统计信息。
 -S, --unit <char>      define display unit
 -w, --wide             wide output
 -t, --timestamp        show timestamp

 -h, --help     display this help and exit
 -V, --version  output version information and exit
 ```

### 使用示例

#### 实时监控系统性能，每 2 秒输出一次
```bash
vmstat 5
```

#### 显示内存使用情况
```bash
vmstat -a 2
```

#### 显示详细的内存和交换信息
```bash
vmstat -m 2
```

#### 显示特定次数的统计信息（例如，10 次，每 1 秒）
```bash
vmstat 1 10
```

### 输出解释

```shell
$ vmstat
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 0  0      0 444400  55116 943860    0    0    36   132 1181 1116  8  1 89  2  0
```

- **Procs（进程）**:
   - **r**: Running or Runnable，就绪队列的长度，也就是正在运行和等待 CPU 的进程数。
   - **b**: Blocked，则是处于不可中断睡眠状态的进程数。

- **Memory（内存）**:
   - **swpd**: 已使用的交换内存。
   - **free**: 空闲内存。
   - **buff**: 用作缓冲区的内存。
   - **cache**: 用作缓存的内存。
   - **inact**: 非活动内存（仅在 `-a` 选项下显示）。
   - **active**: 活动内存（仅在 `-a` 选项下显示）。

- **Swap（交换内存）**:
   - **si**: 每秒从磁盘交换到内存的字节数。
   - **so**: 每秒从内存交换到磁盘的字节数。

- **IO（输入/输出）**:
   - **bi**: 每秒从块设备接收的 KiB 数。
   - **bo**: 每秒发送到块设备的 KiB 数。

- **System（系统）**:
   - **in**: interrupt，每秒中断数，包括时钟中断。
   - **cs**: context switch，每秒上下文切换数。

- **CPU（CPU 使用情况）**:
   - **us**: user，用户态消耗的 CPU 时间（包括 nice 时间）。
   - **sy**: system，内核态消耗的 CPU 时间。
   - **id**: idle，空闲时间。
   - **wa**: 等待 I/O 的时间。
   - **st**: 从虚拟机中偷取的时间。
   - **gu**: 运行 KVM 客户机代码所花的时间。

wmstat 只能查看系统总体的上下文切换情况，要想查看每个进程的详细情况，需要 `pidstat -w`。