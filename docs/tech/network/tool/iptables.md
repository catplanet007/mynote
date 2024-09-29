iptables 是 Linux 系统中用于设置、维护和检查 IP 包过滤规则的工具。
## 基本概念

### 表

iptables中的不同表有不同的工作原理和用途：

- filter 表
  - 用于数据包过滤，决定是否允许数据包通过、丢弃或拒绝。
- nat 表
  - 用于网络地址转换，包括源地址转换（SNAT）和目的地址转换（DNAT）
- mangle 表
  - 用于修改数据包的头部信息，可以修改 IP 头的 TTL（Time To Live）值、TOS（Type Of Service）字段等，也可以设置数据包的 MARK 标记，供其他程序或规则使用。

### 链（Chains）

链是一系列规则的集合，位于特定的表中，用于处理特定类型的数据包。

iptables 有多个内置的链，主要的有INPUT（处理进入本机的数据包）、OUTPUT（处理本机发出的数据包）和FORWARD（处理转发的数据包）。

数据包在经过网络协议栈时，会根据其目的和来源依次经过这些链进行过滤和处理。

除了内置的链，还可以创建用户自定义链（User-defined Chains）。

### 规则（Rules）

由匹配条件和目标动作组成。

匹配条件可以基于协议（如 TCP、UDP、ICMP）、源和目的 IP 地址、源和目的端口号、网络接口等。

目标动作可以是ACCEPT（接受数据包）、DROP（丢弃数据包）、REJECT（拒绝数据包并向发送方返回错误消息）、LOG（记录数据包信息）等。

### 注意事项

- 规则的顺序很重要：数据包按照规则的顺序进行匹配，一旦匹配到一条规则，就会执行相应的动作，不再继续匹配后续规则。
- 规则的持久性：iptables 的规则在系统重启后会丢失。可以使用工具如 iptables-save 和 iptables-restore 来保存和恢复规则，或者使用其他第三方工具来实现规则的持久化。

## 基本使用方法

### 查看规则
- `iptables -nvL`：以数字形式显示详细的规则列表，包括数据包和字节计数等信息。

### 添加规则
- `iptables -I [链名] [规则编号] -p [协议] --[匹配条件] -j [目标动作]`
    - `iptables -I INPUT -p tcp --dport 22 -j ACCEPT` 表示在 INPUT 链的开头插入一条规则，允许目的端口为 22（SSH 端口）的 TCP 数据包进入。

### 删除规则

- `iptables -D [链名] [规则编号]`：删除指定链中的特定规则。
    - `iptables -D INPUT 5` 表示删除INPUT链中的第五条规则

### 清空规则

- `iptables -F [链名]` 清空指定链中的所有规则。如果不指定链名，则清空所有链。

### 设置默认策略

- `iptables -P [链名] [目标动作]`：设置指定链的默认策略。
    - `iptables -P INPUT DROP` 表示将 INPUT 链的默认策略设置为丢弃所有数据包。

## 用法示例

#### 丢弃所有目的端口为 80 TCP 包

在 INPUT 链中插入一条规则，拒绝（DROP）所有目的端口为 80 的 TCP 数据包进入

- `-I INPUT`：向 INPUT 链中插入规则。INPUT 链用于处理进入本机的数据包。
- `-p tcp`：指定匹配的协议为 TCP。
- `--dport 80`：指定匹配的目的端口为 80。
- `-j DROP`：表示如果数据包匹配上述条件，则执行 DROP 动作，即丢弃该数据包。

```bash
$ iptables -I INPUT -p tcp --dport 80 -j DROP
```

#### 查看当前 iptables 规则的详细信息

- `-n`：以数字形式显示 IP 地址和端口号，不进行域名解析等操作，这样可以加快显示速度并且使输出更清晰易读。
- `-v`：显示详细信息，包括数据包和字节的计数等更多统计信息
- `-L`：列出指定链（如果不指定链，则列出所有链）的规则

```bash
$ sudo iptables -nvL
Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination

Chain FORWARD (policy DROP 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
 183K   38M DOCKER-USER  all  --  *      *       0.0.0.0/0            0.0.0.0/0
 183K   38M DOCKER-ISOLATION-STAGE-1  all  --  *      *       0.0.0.0/0            0.0.0.0/0
76247 5227K ACCEPT     all  --  *      docker0  0.0.0.0/0            0.0.0.0/0            ctstate RELATED,ESTABLISHED
12411  743K DOCKER     all  --  *      docker0  0.0.0.0/0            0.0.0.0/0
94549   32M ACCEPT     all  --  docker0 !docker0  0.0.0.0/0            0.0.0.0/0
    0     0 ACCEPT     all  --  docker0 docker0  0.0.0.0/0            0.0.0.0/0

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination

Chain DOCKER (1 references)
 pkts bytes target     prot opt in     out     source               destination

Chain DOCKER-ISOLATION-STAGE-1 (1 references)
 pkts bytes target     prot opt in     out     source               destination
94549   32M DOCKER-ISOLATION-STAGE-2  all  --  docker0 !docker0  0.0.0.0/0            0.0.0.0/0
 183K   38M RETURN     all  --  *      *       0.0.0.0/0            0.0.0.0/0

Chain DOCKER-ISOLATION-STAGE-2 (1 references)
 pkts bytes target     prot opt in     out     source               destination
    0     0 DROP       all  --  *      docker0  0.0.0.0/0            0.0.0.0/0
94549   32M RETURN     all  --  *      *       0.0.0.0/0            0.0.0.0/0

Chain DOCKER-USER (1 references)
 pkts bytes target     prot opt in     out     source               destination
 183K   38M RETURN     all  --  *      *       0.0.0.0/0            0.0.0.0/0
```

#### 阻止特定 IP 地址或 IP 范围的访问

`iptables -I INPUT -s [IP地址/IP范围] -j DROP`：阻止来自特定 IP 地址或 IP 范围的数据包进入本机。

#### 开放特定服务的端口

对于 Web 服务器（通常使用端口 80 和 443），可以使用 `iptables -I INPUT -p tcp --dport 80 -j ACCEPT` 和 `iptables -I INPUT -p tcp --dport 443 -j ACCEPT` 来允许外部访问这些端口。

#### 防止端口扫描

可以设置规则来限制对特定端口的访问频率，以防止端口扫描攻击。

#### 网络地址转换（NAT）

iptables 可以用于实现网络地址转换，例如将内网 IP 地址转换为外网 IP 地址，实现多个设备共享一个公网 IP 地址上网