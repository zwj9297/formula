import { FormulaNodeType, FormulaPlugin } from 'es/interface';
import { ExceptionType, createException } from 'es/utils/exception';

const padZeroStart = (text: string, length: number) => {
  return text.padStart(length, '0');
};

const replaceYear = (format: string, date: Date) => {
  const year = date.getFullYear();
  return format
    .replace(/YYYY/g, year.toString())
    .replace(/YY/g, (year % 100).toString());
};

/** 获取当前语言环境 */
const getLocale = () => {
  return Intl.DateTimeFormat().resolvedOptions().locale ?? 'en-US';
};

const replaceMonth = (format: string, date: Date) => {
  const month = date.getMonth() + 1;
  // 使用 Intl.DateTimeFormat 对象获取月份名称
  const monthName = new Intl.DateTimeFormat(getLocale(), {
    month: 'long'
  }).format(date);
  return format
    .replace(/M{3,4}/g, monthName)
    .replace(/MM/g, padZeroStart(month.toString(), 2))
    .replace(/M/g, month.toString());
};

const ONE_DAY_SECONDS = 24 * 60 * 60 * 1000;

const toOrdinalNumber = (day: number) => {
  if (day < 20 && day > 10) {
    return `${day}th`;
  }
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

const replaceDay = (format: string, date: Date) => {
  const year = date.getFullYear();
  const day = date.getDate();
  const dayOfYear = Math.ceil(
    (date.valueOf() - new Date(year, 0, 0).valueOf()) / ONE_DAY_SECONDS
  );
  // 获取星期几的名称
  const weekdayName = new Intl.DateTimeFormat(getLocale(), {
    weekday: 'long'
  }).format(date);
  return (
    format
      // 一年中的天数，1~365
      .replace(/D{3,4}/g, dayOfYear.toString())
      // 一个月中的天数（补0），01~31
      .replace(/DD/g, padZeroStart(day.toString(), 2))
      // 一个月中，带序号的天数，1st~31st
      .replace(/DO/g, toOrdinalNumber(day))
      // 一个月中的天数（不补0），1~31
      .replace(/D/g, day.toString())
      // 星期几，根据语言环境显示，Mon...Sunday
      .replace(/d{3,4}/g, weekdayName)
      // 星期几，1~7
      .replace(/E/g, (date.getDay() + 1).toString())
  );
};

const getQuarter = (date: Date) => {
  const month = date.getMonth();
  return Math.floor(month / 3) + 1; // 月份从0开始，所以要加1
};

const replaceQuarter = (format: string, date: Date) => {
  const quarter = getQuarter(date);
  return format.replace(/Q/g, quarter.toString());
};

const getPeriod = (hour: number) => {
  return hour < 12 ? 'am' : 'pm';
};

const replaceHour = (format: string, date: Date) => {
  const hours = date.getHours();
  const hoursBase12 = hours > 12 ? hours - 12 : hours ? hours : 12;
  return format
    .replace(/HH/g, padZeroStart(hours.toString(), 2))
    .replace(/H/g, hours.toString())
    .replace(/hh/g, padZeroStart(hoursBase12.toString(), 2))
    .replace(/h/g, hoursBase12.toString())
    .replace(/[Aa]/g, getPeriod(hours));
};

const replaceMinutes = (format: string, date: Date) => {
  const minutes = date.getMinutes();
  return format
    .replace(/mm/g, padZeroStart(minutes.toString(), 2))
    .replace(/m/g, minutes.toString());
};

const replaceSeconds = (format: string, date: Date) => {
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  return format
    .replace(/ss/g, padZeroStart(seconds.toString(), 2))
    .replace(/s/g, seconds.toString())
    .replace(/S{1,3}/g, (match) =>
      milliseconds.toString().slice(0, match.length)
    );
};

export const Datetime: FormulaPlugin = {
  name: 'Datetime',
  methods: [
    {
      name: 'datetime',
      description: '数值或文本转时间',
      inputs: [
        {
          type: FormulaNodeType.NUMBER | FormulaNodeType.TEXT,
          name: 'value',
          description: '数值或文本',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.DATETIME,
        description: '日期时间'
      },
      method: function date(value: string | number) {
        const date = new Date(value);
        if (isNaN(date.valueOf())) {
          throw createException(ExceptionType.InvalidData, 'datetime');
        }
        return date;
      }
    },
    {
      name: 'format',
      description: '格式化日期',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        },
        {
          type: FormulaNodeType.TEXT,
          name: 'format',
          description: '格式模板'
        }
      ],
      output: {
        type: FormulaNodeType.TEXT,
        description: '格式化日期时间'
      },
      method: function date(
        date: Date,
        format = 'YYYY-MM-DD HH:mm:ss'
      ): string {
        return [
          replaceYear,
          replaceQuarter,
          replaceMonth,
          replaceDay,
          replaceSeconds,
          replaceMinutes,
          replaceHour
        ].reduce((res, callback) => callback(res, date), format);
      }
    },
    {
      name: 'now',
      description: '获取当前时间',
      inputs: [],
      output: {
        type: FormulaNodeType.DATETIME,
        description: '当前时间'
      },
      method: function now() {
        return new Date();
      }
    },
    {
      name: 'getYear',
      description: '获取年',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER,
        description: '年'
      },
      method: function setYear(date: Date) {
        return date.getFullYear();
      }
    },
    {
      name: 'setYear',
      description: '设置年',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'year',
          description: '新的年',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.DATETIME,
        description: '新的日期时间'
      },
      method: function setYear(date: Date, year: number) {
        const res = new Date(date);
        res.setFullYear(year);
        return res;
      }
    },
    {
      name: 'getMonth',
      description: '获取月',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER,
        description: '月'
      },
      method: function getMonth(date: Date) {
        return date.getMonth() + 1;
      }
    },
    {
      name: 'setMonth',
      description: '设置月',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'month',
          description: '新的月',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.DATETIME,
        description: '新的日期时间'
      },
      method: function setMonth(date: Date, month: number) {
        const res = new Date(date);
        res.setMonth(month - 1);
        return res;
      }
    },
    {
      name: 'getDate',
      description: '获取日期',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER,
        description: '日'
      },
      method: function getDate(date: Date) {
        return date.getDate();
      }
    },
    {
      name: 'setDate',
      description: '设置日期',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'day',
          description: '新的日',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.DATETIME,
        description: '新的日期时间'
      },
      method: function setDate(date: Date, day: number) {
        const res = new Date(date);
        res.setDate(day);
        return res;
      }
    },
    {
      name: 'getHours',
      description: '获取时',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER,
        description: '时'
      },
      method: function getHours(date: Date) {
        return date.getHours();
      }
    },
    {
      name: 'setHours',
      description: '设置时',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'hours',
          description: '新的时',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.DATETIME,
        description: '新的日期时间'
      },
      method: function setHours(date: Date, hours: number) {
        const res = new Date(date);
        res.setHours(hours);
        return res;
      }
    },
    {
      name: 'getMinutes',
      description: '获取分',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER,
        description: '分'
      },
      method: function getMinutes(date: Date) {
        return date.getMinutes();
      }
    },
    {
      name: 'setMinutes',
      description: '设置分',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'minutes',
          description: '新的分',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.DATETIME,
        description: '新的日期时间'
      },
      method: function setMinutes(date: Date, minutes: number) {
        const res = new Date(date);
        res.setMinutes(minutes);
        return res;
      }
    },
    {
      name: 'getSeconds',
      description: '获取秒',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER,
        description: '秒'
      },
      method: function getSeconds(date: Date) {
        return date.getSeconds();
      }
    },
    {
      name: 'setSeconds',
      description: '设置秒',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'seconds',
          description: '新的秒',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.DATETIME,
        description: '新的日期时间'
      },
      method: function setSeconds(date: Date, seconds: number) {
        const res = new Date(date);
        res.setSeconds(seconds);
        return res;
      }
    },
    {
      name: 'getMilliseconds',
      description: '获取毫秒',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER,
        description: '毫秒'
      },
      method: function getMilliseconds(date: Date) {
        return date.getMilliseconds();
      }
    },
    {
      name: 'setMilliseconds',
      description: '设置毫秒',
      inputs: [
        {
          type: FormulaNodeType.DATETIME,
          name: 'date',
          description: '日期时间',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'ms',
          description: '新的毫秒',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.DATETIME,
        description: '新的日期时间'
      },
      method: function setMilliseconds(date: Date, ms: number) {
        const res = new Date(date);
        res.setMilliseconds(ms);
        return res;
      }
    }
  ]
};
