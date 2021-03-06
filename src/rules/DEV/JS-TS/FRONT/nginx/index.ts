import { Register } from './../../../../../register/index';
import { YesNo } from './../../../../../choice/index';
import Angular from '../../../../../stacks/angular';
import { React } from '../../../../../stacks/react';
import VueJS from '../../../../../stacks/vue-js';
import { ensureDir } from 'fs-extra';
import Globals from '../../../../../utils/globals';
import { logger } from '../../../../../logger';
import Choice from '../../../../../choice';
import { copy } from '../../../../../utils/file-utils';

@Register.ruleForStacks([Angular, React, VueJS])
export default class Nginx {
  private configDirPath = Globals.rootPath + 'nginx-config';
  private configFilePath = this.configDirPath + '/nginx.conf';
  private defaultConfFilePath = __dirname + '/nginx.conf';

  async shouldBeApplied(): Promise<boolean> {
    return true;
  }

  async apply(): Promise<void> {
    return new Promise((resolve, reject) => {
      ensureDir(this.configDirPath)
        .then(() => {
          return copy(this.defaultConfFilePath, this.configFilePath);
        })
        .then(
          () => {
            logger.info('Succesfully copied nginx.conf file to config folder.');
            resolve();
          },
          err => {
            if (err.message.endsWith('already exists')) {
              resolve();
            }
            reject(err);
          },
        );
    });
  }

  getName(): string {
    return 'Nginx';
  }
  getShortDescription(): string {
    return 'Would you like to add a configuration file for Nginx ?';
  }
  getLongDescription(): string {
    return 'Nginx long description';
  }
  getPromptType(): string {
    return 'list';
  }
  getChoices(): Choice[] {
    return YesNo;
  }
}
