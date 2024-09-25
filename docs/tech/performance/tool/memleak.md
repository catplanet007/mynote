memleak 可以跟踪系统或指定进程的内存分配、释放请求，然后定期输出一个未释放内存和相应调用栈的汇总情况（默认 5 秒）。

memleak 是 bcc 软件包中的一个工具。

```shell
# -a 表示显示每个内存分配请求的大小以及地址
# -p 指定案例应用的PID号
$ sudo /usr/share/bcc/tools/memleak -a -p $(pidof app)
Attaching to pid 37956, Ctrl+C to quit.
[18:51:02] Top 10 stacks with outstanding allocations:
        addr = 7f3e680ab480 size = 8192
        addr = 7f3e680a9470 size = 8192
        addr = 7f3e680a7460 size = 8192
        addr = 7f3e680ad490 size = 8192
        32768 bytes in 4 allocations from stack
                0x0000555e31a00879      fibonacci+0x1f [app]
                0x0000555e31a008ea      child+0x4f [app]
                0x00007f3e6f7316db      start_thread+0xdb [libpthread-2.27.so]
[18:51:07] Top 10 stacks with outstanding allocations:
        addr = 7f3e680af4a0 size = 8192
        addr = 7f3e680b74e0 size = 8192
        addr = 7f3e680ab480 size = 8192
        addr = 7f3e680b34c0 size = 8192
        addr = 7f3e680a9470 size = 8192
        addr = 7f3e680a7460 size = 8192
        addr = 7f3e680ad490 size = 8192
        addr = 7f3e680b54d0 size = 8192
        addr = 7f3e680b14b0 size = 8192
        73728 bytes in 9 allocations from stack
                0x0000555e31a00879      fibonacci+0x1f [app]
                0x0000555e31a008ea      child+0x4f [app]
                0x00007f3e6f7316db      start_thread+0xdb [libpthread-2.27.so]
[18:51:12] Top 10 stacks with outstanding allocations:
        addr = 7f3e680af4a0 size = 8192
        addr = 7f3e680bd510 size = 8192
        addr = 7f3e680bf520 size = 8192
        addr = 7f3e680b74e0 size = 8192
        addr = 7f3e680ab480 size = 8192
        addr = 7f3e680b34c0 size = 8192
        addr = 7f3e680a9470 size = 8192
        addr = 7f3e680a7460 size = 8192
        addr = 7f3e680c1530 size = 8192
        addr = 7f3e680ad490 size = 8192
        addr = 7f3e680b94f0 size = 8192
        addr = 7f3e680b54d0 size = 8192
        addr = 7f3e680b14b0 size = 8192
        addr = 7f3e680bb500 size = 8192
        114688 bytes in 14 allocations from stack
                0x0000555e31a00879      fibonacci+0x1f [app]
                0x0000555e31a008ea      child+0x4f [app]
                0x00007f3e6f7316db      start_thread+0xdb [libpthread-2.27.so
```