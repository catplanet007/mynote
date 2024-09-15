---
sidebar_position: 1
---

## 网络字节序和主机字节序互相转换

```c
// #include <netinet/in.h>

#include <arpa/inet.h>
uint32_t htonl(uint32_t hostlong); // host to network long
uint16_t htons(uint16_t hostshort);
uint32_t ntohl(uint32_t netlong);
uint16_t ntohs(uint16_t netshort);
```

