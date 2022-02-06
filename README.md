# formula

文本的表达式库

## 基本用法
### 基本规则
- 输入：文本解析成公式，并输出结果
  - 支持解析数值（`0-9`和`.`组成的字符串）
  - 支持解析运算符（`+`, `-`, `*`, `/`, `<`, `<=`, `>`, `>=`, `!=`, `==`）
  - 支持解析本文（以`''`或`""`包裹的字符串）
  - 支持解析变量（以`{}`包裹的字符串）
  - 支持解析函数（以`$`开头，`()`结尾的字符串）
- 输出：文本（string），数值（number），是否（boolean）以及日期（[moment对象](http://momentjs.cn/docs/)）

### 创建formula实例
通过createFormula创建一个formula实例，每个实例的[全局变量](#全局变量)，[别名](#函数设置别名)和[自定义函数](#自定义函数)都是隔离的。
```javascript
import { createFormula } from '@zwj9297/formula'

const formula = createFormula()
```

### 支持四则运算

- 加减乘除

  ```javascript
  import { createFormula } from '@zwj9297/formula'

  const formula = createFormula()

  formula.calc('1+1').then(res => {
    console.log(res) // 2
  })
  formula.calc('3-2').then(res => {
    console.log(res) // 1
  })
  formula.calc('2*4').then(res => {
    console.log(res) // 8
  })
  formula.calc('10/2').then(res => {
    console.log(res) // 5
  })
  ```

- 分组运算

  ```javascript
  import { createFormula } from '@zwj9297/formula'
  
  const formula = createFormula()

  formula.calc('(1+2)*(3-4)').then(res => {
    console.log(res) // -3
  })
  ```

- 基于[big.js](https://www.npmjs.com/package/big.js)，解决了精度丢失和大数相加

  ```javascript
  import { createFormula } from '@zwj9297/formula'

  const formula = createFormula()

  formula.calc('0.1+0.2').then(res => {
    console.log(res) // 0.3
  })
  formula.calc('9007199254740992+1').then(res => {
    console.log(res) // 9007199254740993
  })
  ```

### 支持变量

被`{}`包裹的字符串会被作为变量使用

- 临时变量

  ```javascript
  import { createFormula } from '@zwj9297/formula'

  const formula = createFormula()

  formula.calc('1+{a}', { a: 2 }).then(res => {
    console.log(res) // 3
  })
  formula.calc('{a}+{b.c}', { a: 2, b: { c: 3 } }).then(res => {
    console.log(res) // 5
  })
  ```

- #### 全局变量

  ```javascript
  import { createFormula } from '@zwj9297/formula'

  const formula = createFormula()

  formula.setVariable('a', 2)
  formula.calc('1+{a}').then(res => {
    console.log(res) // 3
  })

  formula.setVariable('b.c', 3)
  formula.calc('1+{b.c}').then(res => {
    console.log(res) // 4
  })
  ```

### 支持函数

- 以`$`开头，字母作为函数名，`()`包裹作为入参的的字符串会被作为函数使用

  > 默认提供了文本函数、数学函数、日期函数、逻辑函数，详情请看[全局函数](#全局函数)

  ```javascript
  import { createFormula } from '@zwj9297/formula'

  const formula = createFormula()

  formula.calc('$value("001")').then(res => {
    console.log(res) // 1
  })
  formula.calc('$text(123)').then(res => {
    console.log(res) // '123'
  })
  ```

- #### 自定义函数

  ```javascript
  import { createFormula } from '@zwj9297/formula'

  const formula = createFormula()

  formula.register('test', (a,b) => a*b+1)

  formula.calc('$test(4,5)').then(() => {
    console.log(res) // 21
  })
  ```

- #### 函数设置别名

  ```javascript
  import { createFormula } from '@zwj9297/formula'

  const formula = createFormula()

  formula.setAlias('v', 'value')

  formula.calc('$v("001")').then(res => {
    console.log(res) // 1
  })

  formula.setAlias('add', 'Math.add')
  formula.calc('$add(1,2)').then(res => {
    console.log(res) // 3
  })
  ```

## 全局函数
### 数学函数
#### text(value)
数值转换为文本
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |value|number|数值||
- 出参
  |类型|说明|
  |--|----|
  |string|由数值组成的文本| 

#### Math.add(...numbers)
求和
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |numbers|number[]|数值||
- 出参
  |类型|说明|
  |--|----|
  |number|和|

#### Math.minus(...numbers)
求差
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |numbers|number[]|数值||
- 出参
  |类型|说明|
  |--|----|
  |number|差|
  
#### Math.multi(...numbers)
求积
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |numbers|number[]|数值||
- 出参
  |类型|说明|
  |--|----|
  |number|积|
  
#### Math.div(...numbers)
求商
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |numbers|number[]|数值||
- 出参
  |类型|说明|
  |--|----|
  |number|商|

#### Math.average(...numbers)
求平均值
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |numbers|number[]|数值||
- 出参
  |类型|说明|
  |--|----|
  |number|平均值|

#### Math.pow(x:, y)
求幂
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |x|number|底数||
  |y|number|指数||
- 出参
  |类型|说明|
  |--|----|
  |number|幂|

#### Math.fixed(number, decimals)
保留小数并转成文本
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |number|number|数值||
  |decimals|number|保留的小数位数|2|
- 出参
  |类型|说明|
  |--|----|
  |string|由数值组成的文本|

#### Math.gte(x, y)
判断大于等于
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |x|number|数值||
  |y|number|数值||
- 出参
  |类型|说明|
  |--|----|
  |boolean|x是否大于等于y|
  
#### Math.gt(x, y)
判断大于
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |x|number|数值||
  |y|number|数值||
- 出参
  |类型|说明|
  |--|----|
  |boolean|x是否大于y|
  
#### Math.lte(x, y)
判断小于等于
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |x|number|数值||
  |y|number|数值||
- 出参
  |类型|说明|
  |--|----|
  |boolean|x是否小于等于y|
  
#### Math.lt(x, y)
判断小于
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |x|number|数值||
  |y|number|数值||
- 出参
  |类型|说明|
  |--|----|
  |boolean|x是否小于y|

#### Math.eq(x, y)
是否相等
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |x|number|数值||
  |y|number|数值||
- 出参
  |类型|说明|
  |--|----|
  |boolean|x是否等于y|

#### Math.neq(x, y)
是否不相等
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |x|number|数值||
  |y|number|数值||
- 出参
  |类型|说明|
  |--|----|
  |boolean|x是否不等于y|  

### 文本函数 
#### value(text)
把文本转换为数值
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |text|string|由数值组成的文本||
- 出参
  |类型|说明|
  |--|----|
  |number|数值|

#### Text.concat(...texts)
拼接文本
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |texts|string[]|多个文本||
- 出参
  |类型|说明|
  |--|----|
  |string|拼接后的文本|  

#### Text.find(find_text, within_text, start_num)
找到一个文本在另一个文本中出现的起始位置（区分大小写）
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |find_text|string|目标文本||
  |within_text|string|查找的文本||
  |start_num|string|开始查找的位置|0|
- 出参
  |类型|说明|
  |--|----|
  |number|查找的文本第一次出现的位置|

#### Text.exact(text1, text2)
判断字符串是否完全相等（区分大小写）
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |text1|string|文本||
  |text2|string|文本||
- 出参
  |类型|说明|
  |--|----|
  |boolean|两个文本是否相等|

#### Text.mid(text, start_num, num_chars)
从文本指定位置开始切割出指定长度的文本
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |text|string|目标文本||
  |start_num|number|开始切割的位置||
  |num_chars|number|切割个数||
- 出参
  |类型|说明|
  |--|----|
  |string|切割处理的文本|

#### Text.left(text, num_chars)
从文本的第一个字符开始切割出指定长度的字符
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |text|string|目标文本||
  |num_chars|number|切割个数||
- 出参
  |类型|说明|
  |--|----|
  |string|切割出来的文本|

#### Text.right(text, num_chars)
从文本的最后一个字符开始返回指定个数的字符
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |text|string|目标文本||
  |num_chars|number|切割个数||
- 出参
  |类型|说明|
  |--|----|
  |string|切割出来的文本|

#### Text.len(text)
返回字符串长度
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |text|string|目标文本||
- 出参
  |类型|说明|
  |--|----|
  |number|文本长度|

#### Text.lower(text)
将文本中所有的字母转换成小写形式
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |text|string|目标文本||
- 出参
  |类型|说明|
  |--|----|
  |string|转成小写的文本|

#### Text.upper(text)
将文本中所有的字母转换成大写形式
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |text|string|目标文本||
- 出参
  |类型|说明|
  |--|----|
  |string|转成大写的文本|

#### Text.proper(text)
将文本中各英文单词的第一个字母转大写，其余转小写
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |text|string|目标文本||
- 出参
  |类型|说明|
  |--|----|
  |string|各英文单词的第一个字母转大写，其余转小写的文本|

#### Text.replace(text, old_text, new_text)
替换文本
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |text|string|目标文本||
  |old_text|string|被替换的文本||
  |new_text|string|替换的文本||
- 出参
  |类型|说明|
  |--|----|
  |string|替换后的文本|

#### Text.rept(text, count)
指定次数重复文本
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |text|string|目标文本||
  |count|number|重复次数||
- 出参
  |类型|说明|
  |--|----|
  |string|重复多次后的文本|

#### Text.trim(text)
删除文本中多余的空格，但会在英文文本中保留一个作为词与词之间分隔的空格
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |text|string|目标文本||
- 出参
  |类型|说明|
  |--|----|
  |string|删除空格后的文本|

### 日期函数
#### date(text, format)
文本按照格式解析成moment对象
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |text|string|目标文本||
  |format|string|格式|'YYYY-MM-DD HH:mm:ss'|
- 出参
  |类型|说明|
  |--|----|
  |Moment|moment对象|

#### Date.now()
获取当前moment
- 出参
  |类型|说明|
  |--|----|
  |Moment|moment对象|

#### Date.get(moment, type)
从moment中取值
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |moment|Moment|moment对象||
  |[format](http://momentjs.cn/docs/#/get-set/get/)|string|取值类型|'millisecond'|
- 出参
  |类型|说明|
  |--|----|
  |number|数值|

#### Date.set(moment, number, type)
设置并输出新的moment
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |moment|Moment|moment对象||
  |number|number|设置的数值||
  |[format](http://momentjs.cn/docs/#/get-set/get/)|string|取值类型|'millisecond'|
- 出参
  |类型|说明|
  |--|----|
  |number|数值|

#### Date,diff(start, end, type)
计算时间差
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |start|Moment|开始moment||
  |end|number|结束moment||
  |[type](http://momentjs.cn/docs/#/get-set/get/)|string|取值类型|'millisecond'|
- 出参
  |类型|说明|
  |--|----|
  |number|数值|

#### Date.format(moment, format)
输出格式化时间
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |moment|Moment|moment||
  |[format](http://momentjs.cn/docs/#/displaying/format/)|string|日期令牌|'YYYY-MM-DD'|
- 出参
  |类型|说明|
  |--|----|
  |string|格式化时间|

#### Date.max(...moments)
取最大日期
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |moments|Moment[]|多个moment||
- 出参
  |类型|说明|
  |--|----|
  |Moment|最大的moment|
  
#### Date.min(...moments)
取最大日期
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |moments|Moment[]|多个moment||
- 出参
  |类型|说明|
  |--|----|
  |Moment|最小的moment|

#### Date.add(moment, number, type)
在原有的moment的基础上增加时间并输出新的moment
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |moment|Moment|moment||
  |number|number|增加的数值||
  |[type](http://momentjs.cn/docs/#/manipulating/add/)|string|增加类型|'millisecond'|
- 出参
  |类型|说明|
  |--|----|
  |Moment|增加后的moment|
  
#### Date.minus(moment, number, type)
在原有的moment的基础上减少时间并输出新的moment
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |moment|Moment|moment||
  |number|number|减少的数值||
  |[type](http://momentjs.cn/docs/#/manipulating/add/)|string|减少类型|'millisecond'|
- 出参
  |类型|说明|
  |--|----|
  |Moment|减少后的moment|

### 逻辑函数
#### Logic.true()
输出true
- 出参
  |类型|说明|
  |--|----|
  |boolean|true|

#### Logic.false()
输出false
- 出参
  |类型|说明|
  |--|----|
  |boolean|false|

#### Logic.and(...bools)
判断且
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |bools|boolean[]|多个boolean||
- 出参
  |类型|说明|
  |--|----|
  |boolean|是否|
  
#### Logic.or(...bools)
判断或
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |bools|boolean[]|多个boolean||
- 出参
  |类型|说明|
  |--|----|
  |boolean|是否|
  
#### Logic.xor(...bools)
判断异或
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |bools|boolean[]|多个boolean||
- 出参
  |类型|说明|
  |--|----|
  |boolean|是否|

#### Logic.not(bool)
非
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |bool|boolean|是否||
- 出参
  |类型|说明|
  |--|----|
  |boolean|是否|

#### Logic.if(bool, value_if_true, value_if_false)
判断if
- 入参
  |参数名|类型|说明|默认值|
  |--|--|----|--|
  |bool|boolean|是否||
  |value_if_true|any|是的结果||
  |value_if_false|any|否的结果||
- 出参
  |类型|说明|
  |--|----|
  |any|是或否的结果|