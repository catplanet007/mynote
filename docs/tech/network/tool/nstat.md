
nstat 的一个特点是，如果不加参数，它每次运行时输出的数值，是从上一次被执行以来这些计数器的变化值。这就带来了一个挺明显的优势：我们不用像使用 netstat 那样，在两次输出值中找出变化量了，nstat 输出的直接就是变化量。


```bash
$ nstat
#kernel
IpInReceives                    4956420            0.0
IpInAddrErrors                  7                  0.0
IpForwDatagrams                 183207             0.0
IpInDelivers                    4773103            0.0
IpOutRequests                   4634080            0.0
IpOutDiscards                   8                  0.0
IcmpInMsgs                      8890               0.0
IcmpInErrors                    16                 0.0
IcmpInDestUnreachs              875                0.0
IcmpInTimeExcds                 46                 0.0
IcmpInEchos                     7843               0.0
IcmpInEchoReps                  126                0.0
IcmpOutMsgs                     8213               0.0
IcmpOutDestUnreachs             29                 0.0
IcmpOutEchos                    341                0.0
IcmpOutEchoReps                 7843               0.0
IcmpMsgInType0                  126                0.0
IcmpMsgInType3                  875                0.0
IcmpMsgInType8                  7843               0.0
IcmpMsgInType11                 46                 0.0
IcmpMsgOutType0                 7843               0.0
IcmpMsgOutType3                 29                 0.0
IcmpMsgOutType8                 341                0.0
TcpActiveOpens                  35762              0.0
TcpPassiveOpens                 104837             0.0
TcpAttemptFails                 943782             0.0
TcpEstabResets                  163                0.0
TcpInSegs                       4676768            0.0
TcpOutSegs                      3483348            0.0
TcpRetransSegs                  34750              0.0
TcpInErrs                       9                  0.0
TcpOutRsts                      954310             0.0
TcpInCsumErrors                 8                  0.0
UdpInDatagrams                  87421              0.0
UdpNoPorts                      23                 0.0
UdpOutDatagrams                 88139              0.0
Ip6OutRequests                  476                0.0
Ip6OutDiscards                  1                  0.0
Ip6OutNoRoutes                  391                0.0
Ip6OutMcastPkts                 476                0.0
Ip6OutOctets                    30104              0.0
Ip6OutMcastOctets               30104              0.0
Icmp6OutMsgs                    474                0.0
Icmp6OutRouterSolicits          333                0.0
Icmp6OutNeighborSolicits        22                 0.0
Icmp6OutMLDv2Reports            119                0.0
Icmp6OutType133                 333                0.0
Icmp6OutType135                 22                 0.0
Icmp6OutType143                 119                0.0
TcpExtSyncookiesSent            2295               0.0
TcpExtSyncookiesRecv            2230               0.0
TcpExtSyncookiesFailed          1                  0.0
TcpExtEmbryonicRsts             943641             0.0
TcpExtOutOfWindowIcmps          4                  0.0
TcpExtLockDroppedIcmps          3                  0.0
TcpExtTW                        21112              0.0
TcpExtTWRecycled                1                  0.0
TcpExtPAWSEstab                 1                  0.0
TcpExtDelayedACKs               12909              0.0
TcpExtDelayedACKLocked          8                  0.0
TcpExtDelayedACKLost            3456               0.0
TcpExtTCPHPHits                 497002             0.0
TcpExtTCPPureAcks               306926             0.0
TcpExtTCPHPAcks                 282323             0.0
TcpExtTCPSackRecovery           3124               0.0
TcpExtTCPSACKReorder            580                0.0
TcpExtTCPRenoReorder            11                 0.0
TcpExtTCPTSReorder              40                 0.0
TcpExtTCPFullUndo               1                  0.0
TcpExtTCPPartialUndo            8                  0.0
TcpExtTCPDSACKUndo              36                 0.0
TcpExtTCPLossUndo               39                 0.0
TcpExtTCPLostRetransmit         7188               0.0
TcpExtTCPSackFailures           28                 0.0
TcpExtTCPLossFailures           23                 0.0
TcpExtTCPFastRetrans            9742               0.0
TcpExtTCPSlowStartRetrans       1839               0.0
TcpExtTCPTimeouts               13224              0.0
TcpExtTCPLossProbes             13141              0.0
TcpExtTCPLossProbeRecovery      2226               0.0
TcpExtTCPSackRecoveryFail       506                0.0
TcpExtTCPBacklogCoalesce        5700               0.0
TcpExtTCPDSACKOldSent           3452               0.0
TcpExtTCPDSACKOfoSent           1                  0.0
TcpExtTCPDSACKRecv              553                0.0
TcpExtTCPDSACKOfoRecv           5                  0.0
TcpExtTCPAbortOnData            133                0.0
TcpExtTCPAbortOnClose           110                0.0
TcpExtTCPAbortOnTimeout         269                0.0
TcpExtTCPDSACKIgnoredNoUndo     207                0.0
TcpExtTCPSpuriousRTOs           1                  0.0
TcpExtTCPSackShifted            40                 0.0
TcpExtTCPSackMerged             903                0.0
TcpExtTCPSackShiftFallback      3948               0.0
TcpExtIPReversePathFilter       2                  0.0
TcpExtTCPTimeWaitOverflow       2840               0.0
TcpExtTCPReqQFullDoCookies      2295               0.0
TcpExtTCPRcvCoalesce            357930             0.0
TcpExtTCPOFOQueue               212349             0.0
TcpExtTCPOFOMerge               28                 0.0
TcpExtTCPChallengeACK           43                 0.0
TcpExtTCPSYNChallenge           30                 0.0
TcpExtTCPAutoCorking            4370               0.0
TcpExtTCPFromZeroWindowAdv      3                  0.0
TcpExtTCPToZeroWindowAdv        3                  0.0
TcpExtTCPWantZeroWindowAdv      18                 0.0
TcpExtTCPSynRetrans             1850               0.0
TcpExtTCPOrigDataSent           741787             0.0
TcpExtTCPHystartTrainDetect     20                 0.0
TcpExtTCPHystartTrainCwnd       1205               0.0
TcpExtTCPHystartDelayDetect     8                  0.0
TcpExtTCPHystartDelayCwnd       937                0.0
TcpExtTCPACKSkippedChallenge    2                  0.0
TcpExtTCPKeepAlive              98                 0.0
TcpExtTCPDelivered              775422             0.0
TcpExtTCPAckCompressed          126859             0.0
TcpExtTcpTimeoutRehash          11383              0.0
TcpExtTcpDuplicateDataRehash    104                0.0
TcpExtTCPDSACKRecvSegs          554                0.0
TcpExtTCPDSACKIgnoredDubious    4                  0.0
IpExtOutMcastPkts               2                  0.0
IpExtInOctets                   9897698290         0.0
IpExtOutOctets                  8224647876         0.0
IpExtOutMcastOctets             80                 0.0
IpExtInNoECTPkts                5866317            0.0
IpExtInECT0Pkts                 2                  0.0
```

查看全部值
```bash
$ nstat -a
```

```bash
$ nstat --json
```