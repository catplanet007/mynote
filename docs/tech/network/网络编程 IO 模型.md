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

<各种IO模型对比svg style={{width: '80%', height: '80%'}}/>

## Reactor 模式

Reactor 模式是一种常见的事件驱动设计模式。它通过事件分离机制将输入输出（I/O）操作与应用逻辑解耦，让程序能够高效地处理多个客户端请求，而不必为每个连接创建一个线程。这种模式特别适合用在处理大量 I/O 事件的场景，比如网络服务器、事件循环等。


* 事件多路复用（I/O多路复用）：使用系统提供的 I/O 多路复用机制（如 Linux 的 select、poll 或 epoll），Reactor 不断监听多个 I/O 事件，等待其中任何一个变为可用。当某个 I/O 事件（比如可读或可写）就绪时，Reactor 会将事件分发给相应的处理器来处理。

* 事件驱动：当某个事件（如连接请求、数据到达等）发生时，Reactor 会调用对应的事件处理器来处理该事件。不同于传统的阻塞 I/O 模型，Reactor 是非阻塞的，即使某个事件处理需要较长时间，其他事件也可以继续处理。

* 单线程或少量线程：在传统的每个连接对应一个线程的模型中，高并发时会产生大量线程和上下文切换开销。Reactor模式通过复用少量线程，极大提高了效率。通常 Reactor 本身在一个线程中运行，专门负责监听和分发事件。

## Proactor 模式

Proactor 模式是一种与 Reactor 模式相对的设计模式，用于处理异步 I/O 操作。它同样用于高并发场景，但其主要区别在于事件处理的方式。Proactor 模式让操作系统或者框架负责处理 I/O 操作的具体细节，而应用程序只需要处理完成后的结果，因此它是基于**异步 I/O**（Asynchronous I/O）的。

* 异步 I/O 操作：在 Proactor 模式中，I/O 操作是异步的，也就是说，当应用程序请求 I/O 操作时（如读取数据），操作系统会立即返回，且操作的实际执行会在后台完成。应用程序并不直接参与这个操作，而是由操作系统在操作完成后通知应用程序。

* 回调处理：当 I/O 操作完成后，操作系统会通过回调或者事件通知的方式告知应用程序。在这个回调函数中，应用程序处理完成的 I/O 操作结果。与 Reactor 模式不同，Proactor 模式中的应用程序不会主动等待 I/O 事件发生，而是被动等待完成通知。

* 减少阻塞：由于 I/O 操作是异步的，应用程序不会因为等待 I/O 操作完成而被阻塞，从而提升系统的整体并发性。

### Proactor 模式和 Reactor 模式的区别

- I/O 操作发起方式不同：
  - 在 **Reactor 模式** 中，应用程序**发起非阻塞 I/O** 操作，主动监听 I/O 事件发生。它检测何时某个操作可以执行（例如文件描述符可读、可写），然后应用程序主动执行读写操作。
  - 在 **Proactor 模式** 中，应用程序发起的是**异步 I/O** 操作，系统负责完成整个操作，应用程序只需在操作完成时被通知并处理结果。

- I/O 操作执行的时机不同：
  - 在 **Reactor 模式** 中，应用程序负责在 I/O 事件发生时执行操作。
  - 在 **Proactor 模式** 中，操作系统完成 I/O 操作，应用程序仅处理结果。

## 线程数目

一个服务程序的线程数应该和当前负载无关，而应该和机器的CPU数目有关。

## 善于用 `__thread` 关键字

## 12 种常见并发网络编程方案

《Linux 多线程服务端编程：使用 muduo C++ 网络库》

[6.6.2](https://chenshuo-public.s3.amazonaws.com/pdf/chap6.pdf) P37

7.4.1 muduo 的 IO 模型

