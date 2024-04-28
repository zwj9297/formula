import { createTokenizer } from './tokenizer/tokenizer';
import { FormulaPlugin } from './interface';
import { MethodManager } from './utils/method-manager';
import { VariableManager } from './utils/variable-manager';
import { createCalculator } from './calculator/calculator';
import { ExceptionType, createException } from './utils/exception';

interface IFormulaOptions {
  plugins?: FormulaPlugin[];
}

export class Formula {
  private plugins: FormulaPlugin[] = [];

  private readonly methodManager: MethodManager;

  private readonly variableManager: VariableManager;

  private readonly tokenizer: ReturnType<typeof createTokenizer>;

  private readonly calculator: ReturnType<typeof createCalculator>;

  constructor(options?: IFormulaOptions) {
    options?.plugins?.forEach((plugin) => {
      this.register(plugin);
    });
    this.methodManager = new MethodManager();
    this.variableManager = new VariableManager();
    this.tokenizer = createTokenizer();
    this.calculator = createCalculator(
      this.methodManager,
      this.variableManager
    );
  }

  /** 注册插件 */
  register(plugin: FormulaPlugin) {
    if (this.plugins.some((p) => p.name === plugin.name)) {
      console.warn(`The plugin ${plugin.name} has been registered!`);
      return;
    }
    try {
      plugin.methods?.forEach((method) => {
        this.methodManager.add(method);
      });
      plugin.constants?.forEach((constant) => {
        this.variableManager.add(constant);
      });
      this.plugins.push(plugin);
    } catch (err) {
      console.error(err);
      createException(
        ExceptionType.Custom,
        'Formula',
        'Plugin registration failed!'
      );
    }
  }

  /** 注销插件 */
  unregister(plugin: FormulaPlugin) {
    const index = this.plugins.findIndex((p) => p.name === plugin.name);
    if (index < 0) {
      return;
    }
    plugin.methods?.forEach((method) => {
      this.methodManager.remove(method);
    });
    plugin.constants?.forEach((constant) => {
      this.variableManager.remove(constant);
    });
    this.plugins.splice(index, 1);
  }

  async calculate(text: string, tempVars: Record<string, any> = {}) {
    const nodes = await this.tokenizer(text);
    const result = await this.calculator(nodes, tempVars);
    return result.content.value;
  }
}
