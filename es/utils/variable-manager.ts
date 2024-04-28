import { FormulaPluginVariable } from 'es/interface';
import { getNodeTypeString, isValueMatchNodeType } from 'es/node';
import { ExceptionType, createException } from './exception';

export class VariableManager {
  private map = new Map<string, FormulaPluginVariable>();

  add(options: FormulaPluginVariable) {
    if (this.has(options)) {
      throw createException(ExceptionType.RedeclareVariable, options.name);
    }
    if (!isValueMatchNodeType(options.value, options.type)) {
      throw createException(
        ExceptionType.NotAssignableType,
        typeof options.value,
        getNodeTypeString(options!.type)
      );
    }
    this.map.set(options.name, options);
  }

  remove(options: FormulaPluginVariable) {
    if (this.has(options)) {
      this.map.delete(options.name);
    }
  }

  has(options: FormulaPluginVariable) {
    return this.map.has(options.name);
  }

  set<T>(name: string, value: T) {
    const opt = this.map.get(name);
    if (!opt) {
      throw createException(ExceptionType.VariableNotDefined, name);
    }
    if (!isValueMatchNodeType(value, opt.type)) {
      throw createException(
        ExceptionType.NotAssignableType,
        typeof value,
        getNodeTypeString(opt.type)
      );
    }
    opt.value = value;
  }

  get<T>(name: string): T {
    const opt = this.map.get(name);
    if (!opt) {
      throw createException(ExceptionType.VariableNotDefined, name);
    }
    return opt!.value;
  }
}
