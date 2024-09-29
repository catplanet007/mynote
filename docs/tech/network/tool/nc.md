
## 使用示例

#### 测试 TCP 握手

```bash
# -z: 只进行测试，不发送数据；-v 显示详细信息；-w 2 超时时间 2 秒
$ nc -w 2 -zv www.baidu.com 443
Connection to www.baidu.com 443 port [tcp/https] succeeded!
```