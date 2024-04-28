import { FormulaPlugin, FormulaNodeType } from 'es/interface';

function mid(text: string, start_num: number, num_chars: number): string {
  return text.slice(start_num, start_num + num_chars);
}

function lower(text: string): string {
  return text.toLocaleLowerCase();
}
function upper(text: string): string {
  return text.toLocaleUpperCase();
}

export const Text: FormulaPlugin = {
  name: 'Text',
  methods: [
    {
      name: 'text',
      description: '转为文本',
      inputs: [
        {
          type:
            FormulaNodeType.TEXT |
            FormulaNodeType.NUMBER |
            FormulaNodeType.BOOLEAN |
            FormulaNodeType.DATETIME,
          name: 'value',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.TEXT
      },
      method: function toText(value: string | number | boolean | Date) {
        if (typeof value === 'string') {
          return value;
        }
        if (value instanceof Date) {
          return value.toLocaleString();
        }
        return value.toString();
      }
    },
    {
      name: 'concat',
      description: '合并字符串',
      inputs: [
        {
          type: FormulaNodeType.TEXT,
          name: 'text1',
          required: true
        },
        {
          type: FormulaNodeType.TEXT,
          name: 'text2',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.TEXT
      },
      method: function concat(t1: string, t2: string) {
        return `${t1}${t2}`;
      }
    },
    {
      name: 'find',
      description: '返回一个字符串在另一个字符串中出现的起始位置（区分大小写）',
      inputs: [
        {
          type: FormulaNodeType.TEXT,
          name: 'find_text',
          description: '源字符串',
          required: true
        },
        {
          type: FormulaNodeType.TEXT,
          name: 'within_text',
          description: '查找的字符串',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          description: '开始查找的位置',
          name: 'start_num'
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER,
        description: '第一次出现的位置'
      },
      method: function find(
        find_text: string,
        within_text: string,
        start_num = 0
      ) {
        return find_text.slice(start_num).indexOf(within_text);
      }
    },
    {
      name: 'exact',
      description: '判断字符串是否完全相等（区分大小写）',
      inputs: [
        {
          type: FormulaNodeType.TEXT,
          name: 'text1',
          description: '源字符串',
          required: true
        },
        {
          type: FormulaNodeType.TEXT,
          name: 'text2',
          description: '比较的字符串',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.BOOLEAN
      },
      method: function exact(t1: string, t2: string) {
        return t1 === t2;
      }
    },
    {
      name: 'mid',
      description: '从字符串指定位置开始切割出指定长度的字符串',
      inputs: [
        {
          type: FormulaNodeType.TEXT,
          name: 'text',
          description: '源字符串',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'start_num',
          description: '开始位置',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'num_chars',
          description: '字符个数',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.TEXT,
        description: '目标字符串'
      },
      method: mid
    },
    {
      name: 'left',
      description: '从字符串的第一个字符开始切割出指定长度的字符串',
      inputs: [
        {
          type: FormulaNodeType.TEXT,
          name: 'text',
          description: '源字符串',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'num_chars',
          description: '字符个数',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.TEXT,
        description: '目标字符串'
      },
      method: function left(text: string, num_chars: number): string {
        return mid(text, 0, num_chars);
      }
    },
    {
      name: 'right',
      description: '从字符串的最后一个字符开始返回指定个数的字符',
      inputs: [
        {
          type: FormulaNodeType.TEXT,
          name: 'text',
          description: '源字符串',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'num_chars',
          description: '字符个数',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.TEXT,
        description: '目标字符串'
      },
      method: function right(text: string, num_chars: number): string {
        return text.slice(-num_chars);
      }
    },
    {
      name: 'len',
      description: '',
      inputs: [
        {
          type: FormulaNodeType.TEXT,
          name: 'text',
          description: '源字符串',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER,
        description: '字符串长度'
      },
      method: function len(text: string): number {
        return text.length;
      }
    },
    {
      name: 'lower',
      description: '将字符串中所有的字母转换成小写形式',
      inputs: [
        {
          type: FormulaNodeType.TEXT,
          name: 'text',
          description: '源字符串',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.TEXT,
        description: '转换后的字符串'
      },
      method: lower
    },
    {
      name: 'upper',
      description: '将字符串中所有的字母转换成大写形式',
      inputs: [
        {
          type: FormulaNodeType.TEXT,
          name: 'text',
          description: '源字符串',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.TEXT,
        description: '转换后的字符串'
      },
      method: upper
    },
    {
      name: 'proper',
      description: '将字符串中各英文单词的第一个字母转大写，其余转小写',
      inputs: [
        {
          type: FormulaNodeType.TEXT,
          name: 'text',
          description: '源字符串',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.TEXT,
        description: '转换后的字符串'
      },
      method: function proper(text: string): string {
        return text
          .split(' ')
          .map((t) => {
            if (!/^[A-Za-z]+$/.test(t)) return t;
            return upper(t.charAt(0)) + lower(t.slice(1));
          })
          .join(' ');
      }
    },
    {
      name: 'replace',
      description: '替换字符串',
      inputs: [
        {
          type: FormulaNodeType.TEXT,
          name: 'text',
          description: '源字符串',
          required: true
        },
        {
          type: FormulaNodeType.TEXT,
          name: 'old_text',
          description: '被替换的字符串',
          required: true
        },
        {
          type: FormulaNodeType.TEXT,
          name: 'new_text',
          description: '替换的字符串',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.TEXT,
        description: '替换后的字符串'
      },
      method: function replace(
        text: string,
        old_text: string,
        new_text: string
      ): string {
        return text.replace(new RegExp(old_text, 'g'), new_text);
      }
    },
    {
      name: 'repeat',
      description: '指定次数重复字符串',
      inputs: [
        {
          type: FormulaNodeType.TEXT,
          name: 'text',
          description: '源字符串',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'count',
          description: '重复次数',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.TEXT,
        description: '目标字符串'
      },
      method: function repeat(text: string, count: number): string {
        return text.repeat(count);
      }
    },
    {
      name: 'trim',
      description:
        '删除字符串中多余的空格，但会在英文字符串中保留一个作为词与词之间分隔的空格',
      inputs: [
        {
          type: FormulaNodeType.TEXT,
          name: 'text',
          description: '源字符串',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.TEXT,
        description: '目标字符串'
      },
      method: function trim(text: string): string {
        return text.trim().split(/[ ]+/).join(' ');
      }
    }
  ]
};
