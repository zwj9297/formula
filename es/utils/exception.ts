export enum ExceptionType {
  /** 输入非预期结束 */
  UnexpectedEnd,
  /** 非法的字符 */
  UnexpectedToken,
  /** 非法的类型 */
  UnexpectedType,
  /** 变量名为空 */
  VariableNameEmpty,
  /** 不是函数 */
  NotAFunction,
  /** 函数未被调用 */
  NotCalled,
  /** 变量未定义 */
  VariableNotDefined,
  /** 无效数据：这里指非字符串、数字、布尔和时间 */
  InvalidData,
  /** 无效token */
  InvalidToken,
  /** 不可赋值的参数：参数类型不匹配 */
  NotAssignableParameter,
  /** 不可分配类型 */
  NotAssignableType,
  /** 必填参数在可选参数后面 */
  RequiredFollowOptional,
  /** 至少需要 n 个参数 */
  LeastNArgumentsIsRequired,
  /** 预期需要 n 个参数 */
  ExpectedNArguments,
  /** 预期需要 n ~ m 个参数 */
  ExpectedN2MArguments,
  /** 最多需要 n 个参数 */
  MostNArgumentsIsRequired,
  /** 重新声明变量 */
  RedeclareVariable,
  /** 数字超出可显示的最大范围 */
  WillBeInfinity,
  /** 函数名未定义 */
  FunctionNameEmpty,
  /** 组合为空 */
  GroupEmpty,
  /** 组合以预期外的字符结束 */
  UnexpectedGroupEnd,
  /** 字符串在操作符后面 */
  StringFollowOperator,
  /** 自定义 */
  Custom
}

export function createException(
  type: ExceptionType,
  $1?: any,
  $2?: any,
  $3?: any
) {
  let E = Error;
  let message = 'Exception undefined.';

  switch (type) {
    case ExceptionType.UnexpectedEnd:
      E = SyntaxError;
      message = 'Unexpected end of input.';
      break;
    case ExceptionType.UnexpectedToken:
      E = SyntaxError;
      message = `Unexpected token '${$1}'.`;
      break;
    case ExceptionType.UnexpectedType:
      E = SyntaxError;
      message = `Unexpected ${$1}.`;
      break;
    case ExceptionType.VariableNameEmpty:
      E = SyntaxError;
      message = 'variable name can not be empty.';
      break;
    case ExceptionType.NotAFunction:
      E = TypeError;
      message = `${$1} is not a function.`;
      break;
    case ExceptionType.NotCalled:
      E = SyntaxError;
      message = `Method $${$1} not called.`;
      break;
    case ExceptionType.VariableNotDefined:
      E = ReferenceError;
      message = `${$1} is not defined.`;
      break;
    case ExceptionType.InvalidData:
      E = SyntaxError;
      message = 'Invalid data.';
      break;
    case ExceptionType.InvalidToken:
      E = SyntaxError;
      message = 'Invalid or unexpected token';
      break;
    case ExceptionType.NotAssignableParameter:
      message = `Argument of type '${$1}' is not assignable to parameter of type '${$2}'.`;
      break;
    case ExceptionType.NotAssignableType:
      message = `Type '${$1}' is not assignable to type '${$2}'.`;
      break;
    case ExceptionType.RequiredFollowOptional:
      message = `[method ${$1}] A required parameter cannot follow an optional parameter.`;
      break;
    case ExceptionType.LeastNArgumentsIsRequired:
      message = `At least ${$1} arguments is required.`;
      break;
    case ExceptionType.ExpectedNArguments:
      message = `Expected ${$1} arguments, but got ${$2}.`;
      break;
    case ExceptionType.ExpectedN2MArguments:
      message = `Expected ${$1} to ${$2} arguments, but got ${$3}`;
      break;
    case ExceptionType.MostNArgumentsIsRequired:
      message = `At most ${$1} arguments is required.`;
      break;
    case ExceptionType.RedeclareVariable:
      message = `Cannot redeclare variable '${$1}'.`;
      break;
    case ExceptionType.WillBeInfinity:
      message = 'The number will become Infinity.';
      break;
    case ExceptionType.FunctionNameEmpty:
      message = 'Function name cannot be empty.';
      break;
    case ExceptionType.GroupEmpty:
      message = 'The group cannot be empty';
      break;
    case ExceptionType.UnexpectedGroupEnd:
      E = SyntaxError;
      message = 'The group should end with ")".';
      break;
    case ExceptionType.StringFollowOperator:
      E = SyntaxError;
      message = 'Cannot follow string after operator.';
      break;
    case ExceptionType.Custom:
      message = `[${$1}] ${$2}`;
      break;
  }

  return new E(message);
}
