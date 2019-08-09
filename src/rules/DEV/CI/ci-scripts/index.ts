import { YesNo } from './../../../../choice/index';
import { WriteFileError } from './../../../../errors/FileErrors';
import { StackRegister } from '../../../../stacks/stack-register';
import Elasticsearch from '../../../../stacks/elasticsearch';
import { Website } from '../../../../stacks/website';
import { ensureDir } from 'fs-extra';
import Globals from '../../../../utils/globals';
import { logger } from '../../../../logger';
import Choice from '../../../../choice';
import { DirError } from '../../../../errors/DirErrors';
import { myCopy } from '../../../../utils/file-utils';

@StackRegister.registerRuleForAll({ excludes: [Elasticsearch, Website] })
export default class CiScripts {
  private scriptsPath = Globals.rootPath + 'ci-scripts';
  private defaultScriptsPath = __dirname + '/scripts';

  async shouldBeApplied(): Promise<boolean> {
    return true;
  }

  async apply(apply: boolean): Promise<void> {
    if (apply) {
      return new Promise((resolve, reject) => {
        return ensureDir(this.scriptsPath)
          .then(
            () => {
              return myCopy(this.defaultScriptsPath, this.scriptsPath);
            },
            err => {
              reject(new DirError(err, this.scriptsPath, this.getName()));
            },
          )
          .then(
            () => {
              logger.info(
                `${this.getName()}: Succesfully added CI scripts to ci-scripts folder. Please take some time to update them to fit your project and place them in your CI's folder. Then just run 'run_all.sh' in your CI.`,
              );
              resolve();
            },
            err => {
              if (err instanceof WriteFileError) {
                reject(err);
              }
              resolve();
            },
          );
      });
    }
  }
  getName(): string {
    return 'CI Scripts';
  }
  getShortDescription(): string {
    return `${this.getName()}: This rule will add bash scripts to a ci-scripts folder at the root of your project.\
    These scripts' purpose is to be run in your CI. Continue ?`;
  }
  getLongDescription(): string {
    return 'Long Description';
  }
  getPromptType(): string {
    return 'list';
  }
  getChoices(): Choice[] {
    return YesNo;
  }
}
