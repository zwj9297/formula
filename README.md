# formula

文本的表达式库

## 基本用法

### 基本规则

输入：文本解析成公式，并输出结果

- 支持解析数值（`0-9`和`.`组成的字符串，支持科学计数法）
- 支持解析运算符（`+`, `-`, `*`, `/`, `<`, `<=`, `>`, `>=`, `!=`, `==`）
- 支持解析本文（以`''`或`""`包裹的字符串）
- 支持解析变量（以`{}`包裹的字符串）
- 支持解析函数（以`$`开头，`()`结尾的字符串）

输出：文本（string），数值（number），是否（boolean）以及日期时间对象（Date）

### 创建 formula 实例

通过 `new Formula()` 创建一个实例。

```javascript
import { Formula } from '@zwj9297/formula';

const formula = new Formula();
```

### 支持四则运算

#### 加减乘除

```javascript
import { Formula } from '@zwj9297/formula';

const formula = new Formula();

formula.calculate('1+1').then((res) => {
  console.log(res); // 2
});
formula.calculate('3-2').then((res) => {
  console.log(res); // 1
});
formula.calculate('2*4').then((res) => {
  console.log(res); // 8
});
formula.calculate('10/2').then((res) => {
  console.log(res); // 5
});
```

#### 分组运算

```javascript
import { Formula } from '@zwj9297/formula';

const formula = new Formula();

formula.calculate('(1+2)*(3-4)').then((res) => {
  console.log(res); // -3
});
```

#### 基于[big.js](https://www.npmjs.com/package/big.js)，解决了精度丢失

```javascript
import { Formula } from '@zwj9297/formula';

const formula = new Formula();

formula.calculate('0.1+0.2').then((res) => {
  console.log(res); // 0.3
});
```

### 函数和变量

函数和全局变量由插件提供， 可以通过`Formula` 提供的内置插件或自定义插件注册到实例中

#### 内置插件

所有内置插件看 [插件列表](#插件列表)

```typescript
import { Arithmetic, Formula } from '@zwj9297/formula';

const formula = new Formula({ plugins: [Arithmetic] }); // 实例化时传入
// OR 通过 register 注册插件
// formula.register(Arithmetic);

formula.calculate('$add(1,2)').then((res) => {
  console.log(res); // 3
});
```

#### 自定义插件

通过抽象接口 `FormulaPlugin` 实现自定义插件

```typescript
import { FormulaPlugin, FormulaNodeType, Formula } from '@zwj9297/formula';

const CustomPlugin: FormulaPlugin = {
  // 插件名
  name: 'CustomPlugin',
  // 插件提供的函数列表
  methods: [
    {
      // 函数名
      name: 'isEven',
      // 功能描述
      description: '判断是否是偶数',
      // 入参列表，formula内部会做参数校验，若类型不对会抛出异常
      inputs: [
        {
          // 参数类型
          type: FormulaNodeType.NUMBER,
          // 参数名称
          name: 'value',
          // 参数描述
          description: '数值',
          // 是否必填
          required: true
        }
      ],
      output: {
        // 输出类型
        type: FormulaNodeType.BOOLEAN,
        // 输出描述
        description: '是否是偶数'
      },
      // 函数实现
      method: function isEven(value: number) {
        return value % 2 === 0;
      }
    }
  ],
  // 插件提供的全局变量列表
  variables: [
    {
      // 变量类型，注册时会通过其校验value，若类型不匹配会抛出异常
      type: FormulaNodeType.NUMBER,
      // 变量名
      name: 'two',
      // 变量描述
      description: '数字2',
      // 变量值
      value: 2
    }
  ]
};

const formula = new Formula({ plugins: [CustomPlugin] });

formula.calculate('$isEven({two})').then((res) => {
  console.log(res); // true
});

formula.calculate('$isEven({two}+1)').then((res) => {
  console.log(res); // false
});
```

#### 临时变量

每次调用时传入，不需要通过插件注册。临时变量优先级高于全局变量

```javascript
import { Formula, Arithmetic } from '@zwj9297/formula';

const formula = new Formula({ plugins: [Arithmetic] });

formula.calculate('1+{a}', { a: 2 }).then((res) => {
  console.log(res); // 3
});
formula.calculate('1+{a}', { a: 3 }).then((res) => {
  console.log(res); // 4
});
```

## 插件列表

### 数学插件

#### $add(x, y)

求和

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |x|number|被加数|是|无|
  |y|number|加数|是|无|
- 出参
  |类型|说明|
  |--|----|
  |number|和|

#### $minus(x, y)

求差

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |x|number|被减数|是|无|
  |y|number|减数|是|无|
- 出参
  |类型|说明|
  |--|----|
  |number|差|

#### $multi(x, y)

求积

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |x|number|被乘数|是|无|
  |y|number|乘数|是|无|
- 出参
  |类型|说明|
  |--|----|
  |number|积|

#### $div(x, y)

求商

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |x|number|被除数|是|无|
  |y|number|除数|是|无|
- 出参
  |类型|说明|
  |--|----|
  |number|商|

#### $pow(x:, y)

求幂

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |x|number|底数|是|无|
  |y|number|指数|是|无|
- 出参
  |类型|说明|
  |--|----|
  |number|幂|

#### $gte(x, y)

判断大于等于

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |x|number|数值|是|无|
  |y|number|数值|是|无|
- 出参
  |类型|说明|
  |--|----|
  |boolean|x 是否大于等于 y|

#### $gt(x, y)

判断大于

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |x|number|数值|是|无|
  |y|number|数值|是|无|
- 出参
  |类型|说明|
  |--|----|
  |boolean|x 是否大于 y|

#### $lte(x, y)

判断小于等于

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |x|number|数值|是|无|
  |y|number|数值|是|无|
- 出参
  |类型|说明|
  |--|----|
  |boolean|x 是否小于等于 y|

#### $lt(x, y)

判断小于

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |x|number|数值|是|无|
  |y|number|数值|是|无|
- 出参
  |类型|说明|
  |--|----|
  |boolean|x 是否小于 y|

#### $eq(x, y)

是否相等

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |x|number|数值|是|无|
  |y|number|数值|是|无|
- 出参
  |类型|说明|
  |--|----|
  |boolean|x 是否等于 y|

#### $neq(x, y)

是否不相等

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |x|number|数值|是|无|
  |y|number|数值|是|无|
- 出参
  |类型|说明|
  |--|----|
  |boolean|x 是否不等于 y|

#### $number(value)

转为数值

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |value|number \| text \| boolean \| date |数值/文本/是否/时间日期|是|无|
- 出参
  |类型|说明|
  |--|----|
  |number|数值|

### 文本插件

#### $text(value)

转为文本

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |value|text \| number \| boolean \| date |数值/文本/是否/时间日期|是|无|
- 出参
  |类型|说明|
  |--|----|
  |text|文本|

#### $concat(text1, text2)

拼接文本

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |text1|text|字符串 1|是|无|
  |text2|text|字符串 2|是|无|
- 出参
  |类型|说明|
  |--|----|
  |text|拼接后的文本|

#### $find(find_text, within_text, start_num)

找到一个文本在另一个文本中出现的起始位置（区分大小写）

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |find_text|text|源字符串|是|无|
  |within_text|text|查找的字符串|是|无|
  |start_num|text|开始查找的位置|否|0|
- 出参
  |类型|说明|
  |--|----|
  |number|第一次出现的位置|

#### $exact(text1, text2)

判断字符串是否完全相等（区分大小写）

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |text1|text|源字符串|是|无|
  |text2|text|比较的字符串|是|无|
- 出参
  |类型|说明|
  |--|----|
  |boolean|两个文本是否相等|

#### $mid(text, start_num, num_chars)

从文本指定位置开始切割出指定长度的文本

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |text|text|源字符串|是|无|
  |start_num|number|开始位置|是|无|
  |num_chars|number|字符个数|否|无|
- 出参
  |类型|说明|
  |--|----|
  |string|目标字符串|

#### $left(text, num_chars)

从文本的第一个字符开始切割出指定长度的字符

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |text|text|源字符串|是|无|
  |num_chars|number|字符个数|是|无|
- 出参
  |类型|说明|
  |--|----|
  |string|目标字符串|

#### $right(text, num_chars)

从文本的最后一个字符开始返回指定个数的字符

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |text|text|源字符串|是|无|
  |num_chars|number|字符个数|是|无|
- 出参
  |类型|说明|
  |--|----|
  |string|目标字符串|

#### $len(text)

返回字符串长度

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |text|text|源字符串|是|无|
- 出参
  |类型|说明|
  |--|----|
  |number|字符串长度|

#### $lower(text)

将文本中所有的字母转换成小写形式

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |text|text|源字符串|是|无|
- 出参
  |类型|说明|
  |--|----|
  |string|转换后的字符串|

#### $upper(text)

将文本中所有的字母转换成大写形式

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |text|text|源字符串|是|无|
- 出参
  |类型|说明|
  |--|----|
  |string|转换后的字符串|

#### $proper(text)

将文本中各英文单词的第一个字母转大写，其余转小写

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |text|text|源字符串|是|无|
- 出参
  |类型|说明|
  |--|----|
  |string|转换后的字符串|

#### $replace(text, old_text, new_text)

替换字符串

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |text|text|源字符串|是|无|
  |old_text|text|被替换的字符串|是|无|
  |new_text|text|源字符串|是|无|
- 出参
  |类型|说明|
  |--|----|
  |string|替换后的字符串|

#### $repeat(text, count)

指定次数重复字符串

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |text|text|源字符串|是|无|
  |count|number|重复次数|是|无|
- 出参
  |类型|说明|
  |--|----|
  |string|目标字符串|

#### $trim(text)

删除文本中多余的空格，但会在英文文本中保留一个作为词与词之间分隔的空格

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |text|text|源字符串|是|无|
- 出参
  |类型|说明|
  |--|----|
  |string|目标字符串|

### 日期插件

#### $datetime(value)

数值或文本转时间

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |value|text \| number|数值或文本|是|无|
- 出参
  |类型|说明|
  |--|----|
  |date|日期时间|

#### $format(date, format)

格式化日期

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |datetime|date|日期时间|是|无|
  |format|text|格式模板|否|'YYYY-MM-DD HH:mm:ss'|
- 出参
  |类型|说明|
  |--|----|
  |text|格式化日期时间|

#### $now()

获取当前时间

- 出参
  |类型|说明|
  |--|----|
  |date|当前时间|

#### $getYear(date)

获取年

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |date|date|日期时间|是|无|
- 出参
  |类型|说明|
  |--|----|
  |number|年|

#### $setYear(date, year)

设置年

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |datet|date|日期时间|是|无|
  |year|number|年|是|无|
- 出参
  |类型|说明|
  |--|----|
  |date|新的日期时间|

#### $getMonth(date)

获取月

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |date|date|日期时间|是|无|
- 出参
  |类型|说明|
  |--|----|
  |number|月|

#### $setMonth(date, month)

设置月

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |date|date|日期时间|是|无|
  |month|number|月|是|无|
- 出参
  |类型|说明|
  |--|----|
  |date|新的日期时间|

#### $getDate(date)

获取日

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |date|date|日期时间|是|无|
- 出参
  |类型|说明|
  |--|----|
  |number|日|

#### $setDate(date, day)

设置年

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |date|date|日期时间|是|无|
  |day|number|日|是|无|
- 出参
  |类型|说明|
  |--|----|
  |date|新的日期时间|

#### $getHours(date)

获取时

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |date|date|日期时间|是|无|
- 出参
  |类型|说明|
  |--|----|
  |number|时|

#### $setHours(date, hours)

设置时

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |date|date|日期时间|是|无|
  |hhours|number|时|是|无|
- 出参
  |类型|说明|
  |--|----|
  |date|新的日期时间|

#### $getMinutes(date)

获取分

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |date|date|日期时间|是|无|
- 出参
  |类型|说明|
  |--|----|
  |number|分|

#### $setMinutes(date, minutes)

设置分

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |date|date|日期时间|是|无|
  |minutes|number|分|是|无|
- 出参
  |类型|说明|
  |--|----|
  |date|新的日期时间|

#### $getSeconds(date)

获取秒

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |date|date|日期时间|是|无|
- 出参
  |类型|说明|
  |--|----|
  |number|秒|

#### $setSeconds(date, seconds)

设置秒

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |datet|date|日期时间|是|无|
  |seconds|number|秒|是|无|
- 出参
  |类型|说明|
  |--|----|
  |date|新的日期时间|

### 逻辑插件

#### $true()

输出 true

- 出参
  |类型|说明|
  |--|----|
  |boolean|true|

#### $false()

输出 false

- 出参
  |类型|说明|
  |--|----|
  |boolean|false|

#### $and(condition1, condition2)

判断且

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |condition1|boolean|条件 1|是|无|
  |condition2|boolean|条件 2|是|无|
- 出参
  |类型|说明|
  |--|----|
  |boolean|是否|

#### $or(condition1, condition2)

判断或

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |condition1|boolean|条件 1|是|无|
  |condition2|boolean|条件 2|是|无|
- 出参
  |类型|说明|
  |--|----|
  |boolean|是否|

#### $xor(condition1, condition2)

判断异或

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |condition1|boolean|条件 1|是|无|
  |condition2|boolean|条件 2|是|无|
- 出参
  |类型|说明|
  |--|----|
  |boolean|是否|

#### $not(condition)

非

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |condition|boolean|条件|是|无|
- 出参
  |类型|说明|
  |--|----|
  |boolean|是否|

#### if(condition, value_if_true, value_if_false)

判断 if

- 入参
  |参数名|类型|说明|是否必填|默认值|
  |--|--|----|--|--|
  |condition|boolean|条件|是|无|
  |value_if_true|text \| number \| boolean \| date|为 true 的结果|否|无|
  |value_if_FALSE|text \| number \| boolean \| date|为 false 的结果|否|无|
- 出参
  |类型|说明|
  |--|----|
  |text \| number \| boolean \| date|是或否的结果|
