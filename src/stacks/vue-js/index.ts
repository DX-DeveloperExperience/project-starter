import { StackRegister } from '../stack-register';
import Globals from '../../utils/globals';
import { pathExistsInJSON } from '../../utils/json/index';
import { getExactSemver } from '../../utils/semver/index';

@StackRegister.register
export default class VueJS {
  readonly libraryVersion: string = '';
  readonly generatedCLI: boolean = false;
  private informations: string[] = [];
  private hasVueDependency: boolean = false;
  private parsedJSON: any;

  constructor() {
    try {
      this.parsedJSON = require(`${Globals.rootPath}/package.json`);
      if (pathExistsInJSON(this.parsedJSON, ['dependencies', 'vue'])) {
        this.libraryVersion = this.getLibraryVersion();
        this.generatedCLI = this.isGeneratedCLI();

        this.hasVueDependency = true;
      }
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        this.hasVueDependency = false;
      }
      throw e;
    }
  }

  async isAvailable(): Promise<boolean> {
    return this.hasVueDependency;
  }

  private isGeneratedCLI(): boolean {
    const isGeneratedCLI = pathExistsInJSON(this.parsedJSON, [
      'devDependencies',
      '@vue/cli-service',
    ]);

    if (isGeneratedCLI) {
      this.informations.push(
        'This Vue application has been generated using the Vue CLI',
      );
    }

    return isGeneratedCLI;
  }

  private getLibraryVersion(): string {
    const version = getExactSemver(this.parsedJSON.dependencies.vue);

    this.informations.push(`Vue version: ${version}`);

    return version;
  }

  getInformations() {
    return this.informations;
  }

  name() {
    return this.constructor.name;
  }
}
