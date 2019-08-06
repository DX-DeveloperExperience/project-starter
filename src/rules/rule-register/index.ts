import Rule from '../rule';
import Constructor from '../../constructor';

/**
 * This class is a register for all implementations of the Rule interface.
 * Use the @RuleRegister.register decorator to implement the Rule interface
 * instead of using "implements Rule" in your class signature.
 */
export class RuleRegister {
  private static implementations: Array<Constructor<Rule>> = [];
  private static subRules: {
    [ruleName: string]: Array<Constructor<Rule>>;
  } = {};
  /**
   * This method returns every classes that implements the Rule interface.
   */
  static getImplementations(): Array<Constructor<Rule>> {
    return RuleRegister.implementations;
  }

  /**
   * This method is a class decorator that makes a class implement the Rule interface,
   * and registers this class in an array.
   * @param ctor The constructor of the class that implements the Rule interface
   */
  static register<P extends Constructor<Rule>>(ctor: P) {
    RuleRegister.implementations.push(ctor);
  }

  static registerSubRuleOf<
    R extends Constructor<Rule>,
    U extends Constructor<Rule>
  >(ruleCtor: U) {
    return (subRuleCtor: R) => {
      if (RuleRegister.subRules[ruleCtor.name] === undefined) {
        RuleRegister.subRules[ruleCtor.name] = [subRuleCtor];
      } else {
        RuleRegister.subRules[ruleCtor.name].push(subRuleCtor);
      }
    };
  }

  static getSubRulesOf(rule: Rule): Rule[] {
    if (RuleRegister.subRules[rule.constructor.name] !== undefined) {
      return RuleRegister.subRules[rule.constructor.name].map(subRule => {
        return new subRule();
      });
    }
    return [];
  }
}
