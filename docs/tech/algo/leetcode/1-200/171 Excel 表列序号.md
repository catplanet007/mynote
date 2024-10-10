---
sidebar_position: 171
tags: [leetcode, 中级算法]
---

https://leetcode.cn/leetbook/read/top-interview-questions-medium/xweb76/

cost: 2m39s

```cpp
class Solution {
public:
    int titleToNumber(string columnTitle) {
        int r = 0;
        for (const char ch : columnTitle) {
            r *= 26;
            r += ch - 'A' + 1;
        }
        return r;
    }
};
```
