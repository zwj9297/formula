import { FormulaPluginMethod, FormulaMethodNode } from 'es/interface';
import { createNodeByType, getNodeTypeString } from 'es/node';
import { ExceptionType, createException } from './exception';

export class MethodManager {
  private map = new Map<string, FormulaPluginMethod>();

  add(options: FormulaPluginMethod) {
    if (this.has(options)) {
      console.warn(`The function ${options.name} has already been registered!`);
      return;
    }
    const lastRequiredInputIndex = options.inputs.findLastIndex(
      (opt) => opt.required
    );
    const firstNotRequiredInputIndex = options.inputs.findIndex(
      (opt) => !opt.required
    );
    if (
      // 有必填参数
      lastRequiredInputIndex > -1 &&
      // 有非必填参数
      firstNotRequiredInputIndex > -1 &&
      // 非必填参数位置在必填参数前面
      lastRequiredInputIndex > firstNotRequiredInputIndex
    ) {
      // 必填参数不允许在非必填参数后面
      throw createException(ExceptionType.RequiredFollowOptional, options.name);
    }
    this.map.set(options.name, options);
  }

  remove(options: FormulaPluginMethod) {
    if (this.has(options)) {
      this.map.delete(options.name);
    }
  }

  has(options: FormulaPluginMethod) {
    return this.map.has(options.name);
  }

  async call(node: FormulaMethodNode) {
    const { name, params } = node.content;
    const opt = this.map.get(name);
    if (!opt) {
      // 函数未定义
      throw createException(ExceptionType.NotAFunction, name);
    }
    const { inputs, output, method } = opt;
    const requiredInputNumber = inputs.filter((input) => input.required).length;
    if (params.length > inputs.length) {
      // 实际入参数量多余约定入参数量
      throw createException(
        ExceptionType.MostNArgumentsIsRequired,
        inputs.length
      );
    } else if (requiredInputNumber && !params.length) {
      // 没有实际入参 但 约定需要有必填参数
      throw createException(
        ExceptionType.LeastNArgumentsIsRequired,
        requiredInputNumber
      );
    } else if (requiredInputNumber > params.length) {
      // 实际参数数量小于必填参数
      if (requiredInputNumber !== inputs.length) {
        // 约定的参数是必填和非必填混合的
        throw createException(
          ExceptionType.ExpectedN2MArguments,
          requiredInputNumber,
          inputs.length,
          params.length
        );
      } else {
        // 约定的参数都是必填的
        throw createException(
          ExceptionType.ExpectedNArguments,
          inputs.length,
          params.length
        );
      }
    }
    for (let i = 0; i < params.length; i++) {
      if (!(params[i].type & inputs[i].type)) {
        // 参数类型不对
        throw createException(
          ExceptionType.NotAssignableParameter,
          getNodeTypeString(params[i].type),
          getNodeTypeString(inputs[i].type)
        );
      }
    }
    const result = method.apply(
      null,
      params.map((node) => node.content.value)
    );
    const resulFormulaNode = createNodeByType(node.index, node.chars, result);
    if (!(resulFormulaNode.type & output.type)) {
      // 响应类型不对
      throw createException(
        ExceptionType.NotAssignableType,
        getNodeTypeString(resulFormulaNode.type),
        getNodeTypeString(output.type)
      );
    }
    return resulFormulaNode;
  }
}
