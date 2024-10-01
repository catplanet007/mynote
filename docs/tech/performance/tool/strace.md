#### 统计5秒内
```bash
# -c 表示统计每个系统调用的时间和次数
$ timeout 5 strace -c -fp 7504
strace: Process 7504 attached with 7 threads
strace: Process 7504 detached
strace: Process 7505 detached
strace: Process 7506 detached
strace: Process 7507 detached
strace: Process 7508 detached
strace: Process 7509 detached
strace: Process 7510 detached
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 42.31    0.000033           8         4           epoll_pwait
 41.03    0.000032          16         2           write
 16.67    0.000013           6         2           read
------ ----------- ----------- --------- --------- ----------------
100.00    0.000078                     8           total
```