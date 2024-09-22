---
sidebar_position: 2
---

Unix 下有 5 种 I/O 模型：
* 阻塞式 I/O
* 非阻塞式 I/O
* I/O 复用（select、poll）
* 信号驱动式 I/O（SIGIO）
* 异步 I/O（POSIX 的 aio_ 系列函数）

一个输入操作通常包括 2 个不同阶段：

1. 等待数据准备好（等待网络数据到达，当所等待分组到达时，它被复制到内核中的某个缓冲区）
2. 从内核向进程复制数据（把数据从内核复制到用户态进程缓冲区）

## 阻塞式 I/O

所有 socket 都是阻塞的。

import 阻塞式IO模型svg from './img/阻塞式IO模型.svg';

<阻塞式IO模型svg style={{width: '70%', height: '70%'}}/>

## 非阻塞式 I/O

把 socket 设置为非阻塞，那么内核遇到 I/O 操作不让进程等待，直接返回报错。

import 非阻塞式IO模型svg from './img/非阻塞式IO模型.svg';

<非阻塞式IO模型svg style={{width: '70%', height: '70%'}}/>

## I/O 复用

I/O 复用（I/O multiplexing）阻塞在这两个系统调用上，而不是阻塞在真正的 I/O 系统调用上。


import IO复用模型svg from './img/IO复用模型.svg';

<IO复用模型svg style={{width: '70%', height: '70%'}}/>

对比阻塞式 I/O 的过程，I/O 复用并没有优势，甚至因为需要两次系统调用，I/O 复用还稍有劣势。I/O 复用真正的优势在于可以等待多个描述符。

与 I/O 复用相关的另一种 I/O 模型是在多线程中使用阻塞式 I/O，使用多个线程（每个文件描述符一个线程），这样每个线程可以自由地调用 recvfrom 之类的阻塞式 I/O 系统调用。

## 信号驱动式 I/O（SIGIO）

让内核在描述符就绪时发送 SIGIO 信号通知我们。

import 信号驱动式IO模型svg from './img/信号驱动式IO模型.svg';

<信号驱动式IO模型svg style={{width: '70%', height: '70%'}}/>

首先开启套接字的信号驱动式 I/O 功能，并通过 sigaction 系统调用安装一个信号处理函数。该系统调用将立即返回，我们的进程继续工作。当数据报准备好读取时，内核为该进程产生一个 SIGIO 信号。应用随后可以在信号处理函数中调用 recvfrom 读取数据报。

## 异步 I/O（POSIX 的 aio_ 系列函数）

告知内核启动某个操作，并让内核在整个操作（包括将数据从内核复制到我们自己的缓冲区）完成后通知我们。这种模型与信号驱动模型的区别在于：信号驱动模型是由内核通知我们何时可以启动一个 I/O 操作，而异步 I/O 模型是由内核通知我们  I/O 操作何时完成。

import 异步IO模型svg from './img/异步IO模型.svg';

<异步IO模型svg style={{width: '70%', height: '70%'}}/>

调用 `aio_read` 函数，给内核传递描述符、缓冲区指针、缓冲区大小、文件偏移，并告诉内核当整个操作完成时如何通知我们。该系统调用立即返回，而且在等待 I/O 完成期间，我们的进程不被阻塞。

## 各种 I/O 模型的对比

POSIX 把这两个术语定义如下：
* **同步 I/O 操作**（synchronous I/O opetation）导致请求进程阻塞，直到 I/O 操作完成
* **异步 I/O 操作**（asynchronous I/O opetation）不导致请求进程阻塞

前 4 种模型的主要区别在于第一阶段，因为它们的第二阶段是一样的：在数据从内核复制到调用者的缓冲区期间，进程阻塞于 recvfrom 调用。相反，异步I/O模型在这两个阶段都要处理，从而不同于其他4种模型。

根据定义，前 4 种模型都是同步 I/O 模型，因为其中真正的 I/O 操作（recvfrom）将阻塞进程。只有异步 I/O 模型与 POSIX 定义的异步 I/O 相匹配。

import 各种IO模型对比svg from './img/各种IO模型对比.svg';

<各种IO模型对比svg style={{width: '70%', height: '70%'}}/>

