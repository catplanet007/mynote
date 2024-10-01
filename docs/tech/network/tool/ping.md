
#### 快速探测 PMTU

先试试
```bash
$ ping www.baidu.com -s 1472
```

然后再试试

```bash
$ ping www.baidu.com -s 1473
```

看看两者的返回有没有区别？

