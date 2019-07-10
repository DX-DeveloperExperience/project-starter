import { StackRegister } from '../../../../stacks/stack-register';
import { logger } from '../../../../logger/index';
import { RuleRegister } from '../../../rule-register';
import * as util from 'util';
import * as cp from 'child_process';
import TypeScript from '../../../../stacks/typescript';
import Node from '../../../../stacks/node';
import { hasDevDependency } from '../../../../utils/json/index';
import Globals from '../../../../utils/globals';
/**
 * Looks for Prettier dependency in package.json, and add it if necessary.
 */
@RuleRegister.register
@StackRegister.registerRuleForStacks([Node, TypeScript])
export class Prettier {
  private packagePath: string;
  private parsedPackage: any;

  constructor() {
    this.packagePath = `${Globals.rootPath}package.json`;
    this.parsedPackage = require(this.packagePath);
  }

  async apply(apply: boolean) {
    if (apply) {
      const exec = util.promisify(cp.exec);

      exec('npm i prettier -DE', { cwd: Globals.rootPath })
        .then((result: { stdout: string; stderr: string }) => {
          logger.debug(result.stderr);
          logger.info('Succesfully installed prettier.');
        })
        .catch(err => {
          logger.error(
            'Could not install prettier, try installing it using "npm i prettier -DE" command in your terminal.',
          );
          logger.debug(err);
        });
    }
  }

  async shouldBeApplied() {
    return !hasDevDependency(this.parsedPackage, 'prettier');
  }

  getName() {
    return 'Prettier';
  }

  getShortDescription() {
    return 'Prettier keeps your code well formatted. Would you like to install it ?';
  }

  getLongDescription() {
    return 'Laborum exercitation incididunt nulla veniam labore esse. Pariatur adipisicing sint aliqua adipisicing culpa consequat reprehenderit excepteur eiusmod. Est irure voluptate fugiat enim minim laborum. Magna anim eiusmod consectetur voluptate. Proident ad ex laborum in adipisicing sit minim aliquip duis. Do non voluptate mollit officia consequat proident ex mollit dolore qui esse sit reprehenderit.';
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return [{ name: 'Yes', value: true }, { name: 'No', value: false }];
  }
}