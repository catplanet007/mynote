
```bash
$ nsenter --help

Usage:
 nsenter [options] [<program> [<argument>...]]

Run a program with namespaces of other processes.

Options:
 -a, --all              enter all namespaces
 -t, --target <pid>     target process to get namespaces from
 -m, --mount[=<file>]   enter mount namespace
 -u, --uts[=<file>]     enter UTS namespace (hostname etc)
 -i, --ipc[=<file>]     enter System V IPC namespace
 -n, --net[=<file>]     enter network namespace
 -p, --pid[=<file>]     enter pid namespace
 -C, --cgroup[=<file>]  enter cgroup namespace
 -U, --user[=<file>]    enter user namespace
 -T, --time[=<file>]    enter time namespace
 -S, --setuid <uid>     set uid in entered namespace
 -G, --setgid <gid>     set gid in entered namespace
     --preserve-credentials do not touch uids or gids
 -r, --root[=<dir>]     set the root directory
 -w, --wd[=<dir>]       set the working directory
 -F, --no-fork          do not fork before exec'ing <program>
 -Z, --follow-context   set SELinux context according to --target PID

 -h, --help             display this help
 -V, --version          display version

For more details see nsenter(1).
```

```bash
```bash
# 获取容器应用 pid
$ PID=$(docker inspect --format {{.State.Pid}} app)
# -i表示显示网络套接字信息
$ nsenter --target $PID --net -- lsof -i
COMMAND    PID            USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
redis-ser 9085 systemd-network    6u  IPv4 15447972      0t0  TCP localhost:6379 (LISTEN)
redis-ser 9085 systemd-network    8u  IPv4 15448709      0t0  TCP localhost:6379->localhost:32996 (ESTABLISHED)
python    9181            root    3u  IPv4 15448677      0t0  TCP *:http (LISTEN)
python    9181            root    5u  IPv4 15449632      0t0  TCP localhost:32996->localhost:6379 (ESTABLISHED)
```
```