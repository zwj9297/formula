import { FormulaNodeType, FormulaPlugin } from 'es/interface';

function and(condition1: boolean, condition2: boolean) {
  return condition1 && condition2;
}

function or(condition1: boolean, condition2: boolean) {
  return condition1 || condition2;
}

function xor(condition1: boolean, condition2: boolean) {
  return condition1 !== condition2;
}

function not(value: boolean): boolean {
  return !value;
}

function if$1(condition: boolean): boolean;
function if$1<T, F>(
  condition: boolean,
  value_if_true: T,
  value_if_false: F
): T | F;
function if$1<T, F>(
  condition: boolean,
  value_if_true?: T,
  value_if_false?: F
): T | F | boolean {
  return condition ? value_if_true ?? true : value_if_false ?? false;
}

export const Logic: FormulaPlugin = {
  name: 'Logic',
  methods: [
    {
      name: 'true',
      description: '输出true',
      inputs: [],
      output: {
        type: FormulaNodeType.BOOLEAN,
        description: 'true'
      },
      method: function true$1() {
        return true;
      }
    },
    {
      name: 'false',
      description: '输出false',
      inputs: [],
      output: {
        type: FormulaNodeType.BOOLEAN,
        description: 'false'
      },
      method: function false$1() {
        return false;
      }
    },
    {
      name: 'and',
      description: '判断：且',
      inputs: [
        {
          type: FormulaNodeType.BOOLEAN,
          name: 'condition1',
          required: true
        },
        {
          type: FormulaNodeType.BOOLEAN,
          name: 'condition2',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.BOOLEAN
      },
      method: and
    },
    {
      name: 'or',
      description: '判断：或',
      inputs: [
        {
          type: FormulaNodeType.BOOLEAN,
          name: 'condition1',
          required: true
        },
        {
          type: FormulaNodeType.BOOLEAN,
          name: 'condition2',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.BOOLEAN
      },
      method: or
    },
    {
      name: 'xor',
      description: '判断：异或',
      inputs: [
        {
          type: FormulaNodeType.BOOLEAN,
          name: 'condition1',
          required: true
        },
        {
          type: FormulaNodeType.BOOLEAN,
          name: 'condition2',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.BOOLEAN
      },
      method: xor
    },
    {
      name: 'not',
      description: '判断：非',
      inputs: [
        {
          type: FormulaNodeType.BOOLEAN,
          name: 'value',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.BOOLEAN
      },
      method: not
    },
    {
      name: 'if',
      description: '判断：if',
      inputs: [
        {
          type: FormulaNodeType.BOOLEAN,
          name: 'condition',
          description: '条件',
          required: true
        },
        {
          type:
            FormulaNodeType.TEXT |
            FormulaNodeType.NUMBER |
            FormulaNodeType.BOOLEAN |
            FormulaNodeType.DATETIME,
          name: 'value_if_true',
          description: '为true的结果'
        },
        {
          type:
            FormulaNodeType.TEXT |
            FormulaNodeType.NUMBER |
            FormulaNodeType.BOOLEAN |
            FormulaNodeType.DATETIME,
          name: 'value_if_false',
          description: '为false的结果'
        }
      ],
      output: {
        type:
          FormulaNodeType.TEXT |
          FormulaNodeType.NUMBER |
          FormulaNodeType.BOOLEAN |
          FormulaNodeType.DATETIME,
        description: '结果'
      },
      method: if$1
    }
  ]
};
