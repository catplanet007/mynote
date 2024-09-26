lsof 专门用来查看进程打开文件列表，不过，这里的“文件”不只有普通文件，还包括了目录、块设备、动态库、网络套接字等。

## 使用示例

#### 查看指定进程打开的文件

```shell
$ sudo lsof -p 42768
COMMAND   PID USER   FD   TYPE DEVICE  SIZE/OFF   NODE NAME
python  42768 root  cwd    DIR   0,48      4096 803449 /
python  42768 root  rtd    DIR   0,48      4096 803449 /
python  42768 root  txt    REG   0,48     28016 800016 /usr/local/bin/python3.7
python  42768 root  mem    REG   0,48           800745 /usr/local/lib/python3.7/lib-dynload/_queue.cpython-37m-x86_64-linux-gnu.so (stat: No such file or directory)
python  42768 root  mem    REG   0,48           800743 /usr/local/lib/python3.7/lib-dynload/_pickle.cpython-37m-x86_64-linux-gnu.so (stat: No such file or directory)
python  42768 root  mem    REG   0,48           800754 /usr/local/lib/python3.7/lib-dynload/_struct.cpython-37m-x86_64-linux-gnu.so (stat: No such file or directory)
python  42768 root  mem    REG   0,48           800776 /usr/local/lib/python3.7/lib-dynload/select.cpython-37m-x86_64-linux-gnu.so (stat: No such file or directory)
python  42768 root  mem    REG   0,48           800751 /usr/local/lib/python3.7/lib-dynload/_socket.cpython-37m-x86_64-linux-gnu.so (stat: No such file or directory)
python  42768 root  mem    REG   0,48           800746 /usr/local/lib/python3.7/lib-dynload/_random.cpython-37m-x86_64-linux-gnu.so (stat: No such file or directory)
python  42768 root  mem    REG   0,48           800713 /usr/local/lib/python3.7/lib-dynload/_bisect.cpython-37m-x86_64-linux-gnu.so (stat: No such file or directory)
python  42768 root  mem    REG   0,48           800749 /usr/local/lib/python3.7/lib-dynload/_sha3.cpython-37m-x86_64-linux-gnu.so (stat: No such file or directory)
python  42768 root  mem    REG   0,48           800714 /usr/local/lib/python3.7/lib-dynload/_blake2.cpython-37m-x86_64-linux-gnu.so (stat: No such file or directory)
python  42768 root  mem    REG   0,48           693883 /lib/libcrypto.so.43.0.1 (stat: No such file or directory)
python  42768 root  mem    REG   0,48           800734 /usr/local/lib/python3.7/lib-dynload/_hashlib.cpython-37m-x86_64-linux-gnu.so (stat: No such file or directory)
python  42768 root  mem    REG   0,48           800768 /usr/local/lib/python3.7/lib-dynload/math.cpython-37m-x86_64-linux-gnu.so (stat: No such file or directory)
python  42768 root  mem    REG   0,48           800735 /usr/local/lib/python3.7/lib-dynload/_heapq.cpython-37m-x86_64-linux-gnu.so (stat: No such file or directory)
python  42768 root  mem    REG   0,48           693825 /etc/localtime (path dev=252,3, inode=1182486)
python  42768 root  mem    REG   0,48           800125 /usr/local/lib/libpython3.7m.so.1.0 (stat: No such file or directory)
python  42768 root  mem    REG   0,48           693880 /lib/ld-musl-x86_64.so.1 (stat: No such file or directory)
python  42768 root    0u   CHR  136,0       0t0      3 /dev/pts/0
python  42768 root    1u   CHR  136,0       0t0      3 /dev/pts/0
python  42768 root    2u   CHR  136,0       0t0      3 /dev/pts/0
python  42768 root    3w   REG  252,3 629145690 693699 /tmp/logtest.txt
```

输出中 FD 表示文件描述符号，TYPE 表示文件类型，NAME 表示文件路径。

