## 证书

由 CA(Certificate Authority) 认证。证书中包含 CA 的私钥签名，签名的内容是网站的公钥，客户端下载网站证书后，用 CA 公钥进行解密，验证是受 CA 背书的证书，放心使用网站的公钥。

客户端在验证网站证书时，会从信任的 CA 仓库中，拿 CA 的证书里面的公钥解密网站证书。这个过程中会不断追溯 CA、CA 的 CA，一直到一个授信的 CA。

CA 也分级别，CA 公钥可以层层授权背书，往上找可以一直到 root CA。

## TLS 

### history

![alt text](./img/TLS-SSL-history.png)

### 设计目的

- 身份验证
- 保密性
- 完整性

### 协议

- Record 记录协议
    - 对称加密
- Handshake 握手协议
    - 验证通讯双方的身份
    - 交换加密的安全套件
    - 协商加密参数

### 安全密码套件

![alt text](./img/安全密码套件.png)

- 密钥交换算法：ECDHE
- 对称加密算法：AES_128_GCM
- 身份验证：RSA
- 签名hash算法：SHA256

### 对称加密

#### 原理：基于 XOR 异或运算

加密：密钥与明文异或得到密文
解密：密钥与密文异或得到明文

好处是速度非常快。

#### 填充 padding

- Block cipher 分组加密：将明文分成多个等长的 Block 模块，对每个模块将分别加解密
- 目的：当明文最后一个 Block 长度不足时，需要填充
- 填充方法
    - 位填充：以 bit 位为单位来填充
        - ... | 1011 1001 1101 0100 0010 011<span style={{color: 'red'}}>1 0000 0000</span> |
    - 字节填充：以字节为单位为填充
        - 补零：... | DD DD DD DD DD DD DD DD | DD DD DD DD <span style={{color: 'red'}}>00 00 00 00</span> |
        - ANSI X9.23：... | DD DD DD DD DD DD DD DD | DD DD DD DD <span style={{color: 'red'}}>00 00 00 04</span> | ，最后的 04 表示填充 4 个字节
        - ISO 10126：... | DD DD DD DD DD DD DD DD | DD DD DD DD <span style={{color: 'red'}}>81 A6 23 04</span> |，最后的 04 表示填充 4 个字节
        - PKCS7 （RFC5652）: ...| DD DD DD DD DD DD DD DD | DD DD DD DD <span style={{color: 'red'}}>04 04 04 04</span> |，最后的 04 表示填充 4 个字节，AES 使用此方式

#### 分组工作模式（block cupher mode of operation）
- 允许使用同一个分组密码密钥对多块的数据进行加密，并保证其安全性

- ECB（Electronic codebook）模式
    - 直接将明文分解为多个块，对每个块独立加密
    - 问题：无法隐藏数据特征

![alt text](./img/ecb-issue.png)

- CBC（Cipher-block chaining）模式
    - 每个明文块先与前一个密文块进行异或后，再进行加密
    - 问题：加密过程串行化

- CTR（Counter）模式
    - 通过递增一个加密计数器以产生连续的密钥流
    - 问题：不能提供密文消息完整性校验

- GCM
    - Galois/Counter Mode
        - CTR + GMAC（MAC 算法即用 hash 生成摘要，用来校验数据）

### AES（Advanced Encryption Standard）

- 常用填充算法：PKCS7
- 常用分组工作模式：GCM
- 分组长度是 128 位（16字节）

#### 加密步骤

1. 把明文按照 128bit（16 字节）拆分成若干个明文块，每个明文块是 4*4 矩阵
2. 按照选择的填充方式来填充最后一个明文块
3. 每一个明文块利用 AES 加密器和密钥，加密成密文块
4. 拼接所有的密文块，成为最终的密文结果

其中第 3 步

- C = E(K,P)，E 为每一轮算法，每轮密钥皆不同

- 初始轮
    - `AddRoundKey`：轮密钥加
- 普通轮
    - `AddRoundKey`：轮密钥加
    - `SubBytes`：字节替代
    - `ShiftRows`：行移位
    - `MixColumns`：列混合
- 最终轮
    - `SubBytes`：字节替代
    - `ShiftRows`：行移位
    - `AddRoundKey`：轮密钥加

![alt text](./img/aes.png)

### RSA 算法

1977 年由罗纳德·李维斯特（Ron <span style={{color: 'red'}}>R</span>ivest）、阿迪·萨莫尔（Adi <span style={{color: 'red'}}>S</span>hamir）和伦纳德·阿德曼（Leonard <span style={{color: 'red'}}>A</span>dleman）一起提出，因此名为 <span style={{color: 'red'}}>RSA</span> 算法

#### 公私钥生成

1. 随机选择两个不相等的质数 `p` 和 `q`。
2. 计算 `p` 和 `q` 的乘积 `n`（明文中每个数字都需要小于 `n`）。
3. 计算 `n` 的欧拉函数 `v = φ(n)`。
4. 随机选择一个整数 `k`，满足 `1 < k < v`，且 `k` 与 `v` 互质。
5. 计算 `k` 对于 `v` 的模反元素 `d`。
6. 公钥：`(k, n)`。
7. 私钥：`(d, n)`。

对于正整数 `n`，欧拉函数 `φ(n)` 表示小于或等于 `n` 的正整数中与 `n` 互质的数的个数。

例如，如果 `n = 10`，小于或等于 10 的正整数中与 10 互质的数有 1、3、7、9，所以 `φ(10) = 4`。

如果 `n = p * q`，其中 `p` 和 `q` 是两个不同的质数，那么 `φ(n) = (p - 1)*(q - 1)`。这是在 RSA 算法中常用的一个性质。

![alt text](./img/rsa-algo.png)

#### 加解密流程

- 加密：$c ≡ m^k (\mod n)$
    - m 是明文，C 是密文
- 解密：$m ≡ c^d (\mod n)$
- 举例：对明文数字 123 加密
    - 公钥（3,319）加密
        - $123^3 \mod 319 = 140$
        - 对密文 140 用私钥 (187, 319) 解密
            - $140^{187} \mod 319 = 123$
    - 私钥 (187, 319) 加密
        - $123^{187} \mod 319 = 161$
        - 对密文 161 用共钥 (3, 319) 解密
            - $161^3 \mod 319 = 123$

#### openssl 验证 RSA

生成私钥（密钥格式建 RFC3447）

```bash
$ openssl genrsa -out private.pem
$ cat private.pem
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCo6n3lp4FXKdGz
YEuAML3SZa7hQLtAIJ5jpl0UV9SRc3YojMri176Hp4fucW0jjqemp+SEo2LVVhaq
k8ftL2zrOdUxdjobl/sEO99RfF4n40oLYzmdfPnxaixNWse3HIpJUfGQxDKCSALr
8zZwDioyViXgIsvxXu+xug0cDpQNcAM7xoFt7GWvHXDQjVoLBqjXIOmBvdhjw6Ki
10AZtHr8KRHs2sCGvMEPgjJtWEHVbw74LLLGkwfnZEMjFhJ/0Vs2wCeGEuDdYieV
cN4YHhuUXTI2VzqqXIHeeWuuPniNvT80rWt9jQ97Db8BEIJ9N0mkwYurQN68O4YQ
AjpU++1rAgMBAAECggEACNl8Lg94CcKBn4Wwfu9OypqULm3vQX1T/wGEx9+QHeyw
KJCzwm2uKDpBN19O6fl71BHguYg70dR4TIiAhW8iJDK79iLtCWwNdRvT59d9sVZJ
l04kAxm8mIbI+maCpxfCMPQvlTeKM+Qk7wqnc/hyAoAb7OG10Jf6M9P9AtbKr+d0
F1IJN8EDU9iiDBIgjEMNku81+SZimPVTmroi5TeKU3SiYgANLDRCvk320Trz9FfF
KIMxaAoi3LG5tbKuY5xNZPXtvrxS256zEBGhxJ2xa/MFS98eLCv9XjqXoG0tU1zc
Tga0cnGRmtA9rhtAEIFZghc7jx4EyDH9LkPVmhy6BQKBgQDdIhJs2a/XoB53HFY1
26vJ4JcDm2revLsGBUit4fl5H0UU6Iuke94PJ/E/1FRoASbOAWbh51E6bOuaI/A3
eajap0+7RWaW31zFH1JAJWigG5pSKMjX23BXPTZb/7vIddwOvM8NRoce8f0cU7ii
s2ZGidRtGpXt8v43az+6WPqN/wKBgQDDjLO0abht7xZlIQWf/9DWF2XuEwh4yb8q
f4dd9mJHPaJs4iDeqTOyWNgH8cuU/R/Ek+FyPR/PlCaKPyDHbjETf1j1ZH5kBIps
IlZmTueVXtspzOHaHoCvoLSp1P9xwjJozm50y558FQ/aYmqJ4HOgGDlh8Nf7ZRX8
f1RsOui4lQKBgGEUCyi0LGkqBxXdX8+HH5Shv0o7GaCtFCHhgfWsJdxRqP8z09Ii
+uqGa3fNHD0IfGOl4+e6qENQ++GQc223QDS1jOA26IHFjzGOvYohohvf4lC9TObO
lDQIUGv1ChhH/ZKOuwsl8j3YmHiuHHl47qZ67cH0EOwEaCwmLjT9yQk7AoGBAJQT
yMT2RYVhxgigX90P3zkvkK0eVoz44Lyyw3Pgrf0abBOdjJxvbklAQ56Id8wDfXnj
LZXPOXZ7zk9jjFPYWmtURK3WAmuEkLlfqyNf3rfak4Vssx3zeSkFPalZNHIVRwzc
PQJOal21qUKKwfhUMdpqXZGPyk2A94wzc19doHqdAoGBAIOWo587TNNt+JEh+2CR
cjjMkh3ug0vAZ/mcRjtWnQKyoqWVPJroI2/GW/9BQUOB+QrTv9U4BZ2AdY02RWxV
SmJKHG+xFORIj4x7N6YRzEeWDm1dfqtH7BgcsD8W8v0LcGD8pIFqrT0Z9G6xb4Ng
Dl3I3qzKsETSMtG6xrJzJ/Pj
-----END PRIVATE KEY-----
```

从私钥中提取出公钥

```bash
$ openssl rsa -in private.pem -pubout -out public.pem
writing RSA key
$ cat public.pem
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqOp95aeBVynRs2BLgDC9
0mWu4UC7QCCeY6ZdFFfUkXN2KIzK4te+h6eH7nFtI46npqfkhKNi1VYWqpPH7S9s
6znVMXY6G5f7BDvfUXxeJ+NKC2M5nXz58WosTVrHtxyKSVHxkMQygkgC6/M2cA4q
MlYl4CLL8V7vsboNHA6UDXADO8aBbexlrx1w0I1aCwao1yDpgb3YY8OiotdAGbR6
/CkR7NrAhrzBD4IybVhB1W8O+CyyxpMH52RDIxYSf9FbNsAnhhLg3WInlXDeGB4b
lF0yNlc6qlyB3nlrrj54jb0/NK1rfY0Pew2/ARCCfTdJpMGLq0DevDuGEAI6VPvt
awIDAQAB
-----END PUBLIC KEY-----
```

查看 ASN.1 格式的私钥

```bash
$ openssl asn1parse -i -in private.pem
    0:d=0  hl=4 l=1214 cons: SEQUENCE
    4:d=1  hl=2 l=   1 prim:  INTEGER           :00
    7:d=1  hl=2 l=  13 cons:  SEQUENCE
    9:d=2  hl=2 l=   9 prim:   OBJECT            :rsaEncryption
   20:d=2  hl=2 l=   0 prim:   NULL
   22:d=1  hl=4 l=1192 prim:  OCTET STRING      [HEX DUMP]:308204A40201000282010100A8EA7DE5A7815729D1B3604B8030BDD265AEE140BB40209E63A65D1457D4917376288CCAE2D7BE87A787EE716D238EA7A6A7E484A362D55616AA93C7ED2F6CEB39D531763A1B97FB043BDF517C5E27E34A0B63399D7CF9F16A2C4D5AC7B71C8A4951F190C432824802EBF336700E2A325625E022CBF15EEFB1BA0D1C0E940D70033BC6816DEC65AF1D70D08D5A0B06A8D720E981BDD863C3A2A2D74019B47AFC2911ECDAC086BCC10F82326D5841D56F0EF82CB2C69307E764432316127FD15B36C0278612E0DD62279570DE181E1B945D3236573AAA5C81DE796BAE3E788DBD3F34AD6B7D8D0F7B0DBF0110827D3749A4C18BAB40DEBC3B8610023A54FBED6B02030100010282010008D97C2E0F7809C2819F85B07EEF4ECA9A942E6DEF417D53FF0184C7DF901DECB02890B3C26DAE283A41375F4EE9F97BD411E0B9883BD1D4784C8880856F222432BBF622ED096C0D751BD3E7D77DB15649974E240319BC9886C8FA6682A717C230F42F95378A33E424EF0AA773F87202801BECE1B5D097FA33D3FD02D6CAAFE77417520937C10353D8A20C12208C430D92EF35F9266298F5539ABA22E5378A5374A262000D2C3442BE4DF6D13AF3F457C5288331680A22DCB1B9B5B2AE639C4D64F5EDBEBC52DB9EB31011A1C49DB16BF3054BDF1E2C2BFD5E3A97A06D2D535CDC4E06B47271919AD03DAE1B4010815982173B8F1E04C831FD2E43D59A1CBA0502818100DD22126CD9AFD7A01E771C5635DBABC9E097039B6ADEBCBB060548ADE1F9791F4514E88BA47BDE0F27F13FD454680126CE0166E1E7513A6CEB9A23F03779A8DAA74FBB456696DF5CC51F52402568A01B9A5228C8D7DB70573D365BFFBBC875DC0EBCCF0D46871EF1FD1C53B8A2B3664689D46D1A95EDF2FE376B3FBA58FA8DFF02818100C38CB3B469B86DEF166521059FFFD0D61765EE130878C9BF2A7F875DF662473DA26CE220DEA933B258D807F1CB94FD1FC493E1723D1FCF94268A3F20C76E31137F58F5647E64048A6C2256664EE7955EDB29CCE1DA1E80AFA0B4A9D4FF71C23268CE6E74CB9E7C150FDA626A89E073A0183961F0D7FB6515FC7F546C3AE8B89502818061140B28B42C692A0715DD5FCF871F94A1BF4A3B19A0AD1421E181F5AC25DC51A8FF33D3D222FAEA866B77CD1C3D087C63A5E3E7BAA84350FBE190736DB74034B58CE036E881C58F318EBD8A21A21BDFE250BD4CE6CE943408506BF50A1847FD928EBB0B25F23DD89878AE1C7978EEA67AEDC1F410EC04682C262E34FDC9093B028181009413C8C4F6458561C608A05FDD0FDF392F90AD1E568CF8E0BCB2C373E0ADFD1A6C139D8C9C6F6E4940439E8877CC037D79E32D95CF39767BCE4F638C53D85A6B5444ADD6026B8490B95FAB235FDEB7DA93856CB31DF37929053DA959347215470CDC3D024E6A5DB5A9428AC1F85431DA6A5D918FCA4D80F78C33735F5DA07A9D028181008396A39F3B4CD36DF89121FB60917238CC921DEE834BC067F99C463B569D02B2A2A5953C9AE8236FC65BFF41414381F90AD3BFD538059D80758D36456C554A624A1C6FB114E4488F8C7B37A611CC47960E6D5D7EAB47EC181CB03F16F2FD0B7060FCA4816AAD3D19F46EB16F83600E5DC8DEACCAB044D232D1BAC6B27327F3E3
```

查看 ASN.1 格式的公钥

```bash
$ openssl asn1parse -i -in public.pem
    0:d=0  hl=4 l= 290 cons: SEQUENCE
    4:d=1  hl=2 l=  13 cons:  SEQUENCE
    6:d=2  hl=2 l=   9 prim:   OBJECT            :rsaEncryption
   17:d=2  hl=2 l=   0 prim:   NULL
   19:d=1  hl=4 l= 271 prim:  BIT STRING
$ openssl asn1parse -i -in public.pem -strparse 19
    0:d=0  hl=4 l= 266 cons: SEQUENCE
    4:d=1  hl=4 l= 257 prim:  INTEGER           :A8EA7DE5A7815729D1B3604B8030BDD265AEE140BB40209E63A65D1457D4917376288CCAE2D7BE87A787EE716D238EA7A6A7E484A362D55616AA93C7ED2F6CEB39D531763A1B97FB043BDF517C5E27E34A0B63399D7CF9F16A2C4D5AC7B71C8A4951F190C432824802EBF336700E2A325625E022CBF15EEFB1BA0D1C0E940D70033BC6816DEC65AF1D70D08D5A0B06A8D720E981BDD863C3A2A2D74019B47AFC2911ECDAC086BCC10F82326D5841D56F0EF82CB2C69307E764432316127FD15B36C0278612E0DD62279570DE181E1B945D3236573AAA5C81DE796BAE3E788DBD3F34AD6B7D8D0F7B0DBF0110827D3749A4C18BAB40DEBC3B8610023A54FBED6B
  265:d=1  hl=2 l=   3 prim:  INTEGER           :010001
```

```bash
# cat hello.txt
Hello World
# 加密文件
$ openssl rsautl -encrypt -in hello.txt -inkey public.pem -pubin -out hello.en
The command rsautl was deprecated in version 3.0. Use 'pkeyutl' instead.
$ cat hello.en
Y*AKbif乱码...
# 解密文件
$ openssl rsautl -decrypt -in hello.en -inkey private.pem -out hello.de
The command rsautl was deprecated in version 3.0. Use 'pkeyutl' instead.
$ cat hello.de
Hello World
```

### PKI 证书体系

- 公钥数字证书组成：CA 信息、公钥用户信息、公钥、权威机构的签字、有效期
- PKI 用户
    - 网站站长：向 CA 注册公钥的用户
    - 普通用户：希望使用已注册公钥的用户

### RSA 密钥交换

1. 客户端发送 hello --> 服务端
2. 服务端发送公钥 --> 客户端
3. 客户端生成随机数，用服务端公钥加密，发送密文 --> 服务端
4. 服务端用私钥解密密文，得到随机数
5. 双方用随机数对称加密通信

问题：没有前向保密性。中间人截获所有流量，一旦某一天服务端私钥泄密，中间人可以解密历史所有消息。

### DH 密钥交换协议

1976 年由 Bailey Whitfield Diffie 和 Martin Edward Hellman 首次发表，故称为 Diffie–Hellman key exchange，简称 DH。

让双方在完全没有对方任何预先信息的条件下通过不安全信道创建起一个密钥。

1. 客户端发送 hello --> 服务端
2. 服务端生成一对公私钥(Key1)，发送公钥(Public Key 1) --> 客户端
3. 客户端收到服务端公钥，自己生成一对公私钥(Key2)，发送自己的公钥(Public Key 2) --> 服务端
4. 客户端基于 Private key 2 和 Public key 1 生成密钥，服务端基于 Private key 1 和 Public key 2 生成密钥，2 个密钥完全相同，用来对称加密通信

import dhAlgoPng from './img/dh-algo.png';

<img src={dhAlgoPng} width="500"/>

问题1：中间人伪造攻击。
- 向客户顿假装自己是服务端，进行一次 DH 密钥交换
- 向服务端假装自己是客户端，进行一次 DH 密钥交换
- 解决方法：用公钥数字证书进行身份验证

问题2：乘法太多，基于大因数分解，需要较长的密钥位数

### ECDH 密钥交换协议

#### ECC 椭圆曲线

椭圆曲线的表达式：$ y^2 = x^3 + ax + b$，参数 $a$ 和 $b$ 要满足 $4a^3 + 27b^2 \neq 0$

不是椭圆，只是某些情况下椭圆曲线确实与椭圆形状有关。

关于 X 轴对称（因为 y 平方）

![alt text](./img/ecc椭圆曲线.png)

椭圆曲线特性：+运算

- $P + Q = R$
    - +运算的几何意义：$R$ 为 $P$、$Q$ 连续与曲线焦点在 X 轴上的镜像
    - $P + R = R$
- +运算满足交换律，$a + b = b + a$
- +运算满足结合律，$(a + b) + c = a + (b + c)$

![alt text](./img/plus-calculation.png)

- 先计算出斜率 m，再计算出 R 点的坐标

![alt text](./img/plus-calculation2.png)

- $Q=K \cdot P$
    - 已知 K 与 P，正向运算快速
    - 已知 Q 与 P，计算 K 的逆向运算非常困难
    - K 为双方各自的私钥，私钥乘以 P 得到公钥，然后公钥交换给对方

#### ECDH 密钥交换协议
- DH 密钥交换协议使用椭圆曲线后的变种，称为 Elliptic Curve Diffie–Hellman key Exchange，缩写为 ECDH，优点是比 DH 计算速度快、同等安全条件下密钥更短
- ECC（Elliptic Curve Cryptography）：椭圆曲线密码学
- 魏尔斯特拉斯椭圆函数（Weierstrass‘s elliptic functions）：y2=x3+ax+b

2个RTT
步骤：
1. 客户端选定大整数 $K_a$ 作为私钥，基于选定曲线（即参数a,b的值）和曲线上的共享 $P$ 点，客户端计算出 $Q_a=K_a \cdot P$
2. 客户端将 $Q_a$、选定曲线、共享点 P --> 服务端
3. 服务端选定大整数 $K_b$ 作为私钥，计算 $Q_b = K_b \cdot P$，将 $Q_b$ --> 客户端端
4. 客户端端生成密钥 $Q_b \cdot K_a = (x, y)$，其中 $x$ 为对称加密的密钥；服务端生成密钥 $Q_a \cdot K_b = (x, y)$，其中 $x$ 为对称加密的密钥

$$
Q_b \cdot K_a = K_a \cdot (K_b \cdot P) = K_a \cdot K_b \cdot P = K_b \cdot (K_a \cdot P) = Q_a \cdot K_b
$$

### TLS 1.2

![alt text](./img/TLS1.2.png)

#### FREAK 攻击

- 2015 年发现漏洞
- 由于支持多种安全套件，其中包括 90 年代引入的 512 位以下 RSA 密钥，该安全套件可轻易破解。中间人可以要求只用该安全套件，即可破解。

![alt text](./img/FREAK.png)

### TLS 1.3

减少所支持的安全套件数量，去掉古老的安全套件

使用 https://www.ssllabs.com/ssltest/index.html 可以查看某个网站支持哪些安全套件

密钥交换步骤

1个 RTT

1. 客户端 Hello 发送 5 个安全套件的公钥给服务端
2. 服务端挑选一个密钥套件的公钥，生成公私钥，发送给客户端
3. 双方使用自己私钥和对方公钥生成对称秘钥，开始通信

![alt text](./img/tls1.3.png)

## 重发和篡改

通过 Timestamp 和 Nonce 随机数，做一个不可逆的签名。

Nonce 随机数和 Timestamp 合起来保证唯一，请求只接受一次。签名保证不可篡改。