---
sidebar_position: 412
tags: [leetcode, 中等, 初级算法]
---

https://leetcode.cn/leetbook/read/top-interview-questions-easy/xngt85/

https://leetcode.cn/problems/fizz-buzz/description/

cost: 2m18s

```cpp
class Solution {
public:
    vector<string> fizzBuzz(int n) {
        vector<string> r;
        for (int i = 1; i <= n; i++) {
            if (i % 3 == 0 && i % 5 == 0) {
                r.push_back("FizzBuzz");
                continue;
            }
            if (i % 3 == 0) {
                r.push_back("Fizz");
                continue;
            }
            if (i % 5 == 0) {
                r.push_back("Buzz");
                continue;
            }
            r.push_back(std::to_string(i));
        }
        return r;
    }
};
```