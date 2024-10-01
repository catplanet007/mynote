## 用法

按下 c 查看进程完整命令路径
按下 1 查看每个 CPU 情况

#### 输出解读

```shell
# 默认每3秒刷新一次
$ top
top - 11:58:59 up 9 days, 22:47,  1 user,  load average: 0.03, 0.02, 0.00
Tasks: 123 total,   1 running,  72 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.3 us,  0.3 sy,  0.0 ni, 99.3 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  8169348 total,  5606884 free,   334640 used,  2227824 buff/cache
KiB Swap:        0 total,        0 free,        0 used.  7497908 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
    1 root      20   0   78088   9288   6696 S   0.0  0.1   0:16.83 systemd
    2 root      20   0       0      0      0 S   0.0  0.0   0:00.05 kthreadd
    4 root       0 -20       0      0      0 I   0.0  0.0   0:00.00 kworker/0:0H
...
```

第三行 %Cpu 就是系统的 CPU 使用率。默认显示的是所有 CPU 的平均值，按下数字 1 ，切换到每个 CPU 的使用率。

每个进程都有一个 %CPU 列，表示进程的 CPU 使用率。它是用户态和内核态 CPU 使用率的总和，包括进程用户空间使用的 CPU、通过系统调用执行的内核空间 CPU 、以及在就绪队列等待运行的 CPU。在虚拟化环境中，它还包括了运行虚拟机占用的 CPU。


%iowait 表示在一个采样周期内有百分之几的时间属于以下情况：CPU空闲、并且有仍未完成的I/O请求。

对 %iowait 常见的误解有两个：
* 一是误以为 %iowait 表示CPU不能工作的时间，
* 二是误以为 %iowait 表示I/O有瓶颈。

首先 %iowait 升高并不能证明等待I/O的进程数量增多了，也不能证明等待I/O的总时间增加了。

例如，在CPU繁忙期间发生的I/O，无论IO是多还是少，%iowait都不会变；当CPU繁忙程度下降时，有一部分IO落入CPU空闲时间段内，导致%iowait升高。

再比如，IO的并发度低，%iowait就高；IO的并发度高，%iowait可能就比较低。

可见%iowait是一个非常模糊的指标，如果看到 %iowait 升高，还需检查I/O量有没有明显增加，avserv/avwait/avque等指标有没有明显增大，应用有没有感觉变慢，如果都没有，就没什么好担心的。
