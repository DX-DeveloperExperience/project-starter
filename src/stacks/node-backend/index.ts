import { StackRegister } from '../stack-register/index';
import Globals from '../../utils/globals';
import { pathExistsInJSON } from '../../utils/json/index';
import Node from '../node';

@StackRegister.registerSubStackOf(Node)
export class NodeBackend {
  private hasExpress: boolean = false;
  private hasRestify: boolean = false;
  private hasNestJS: boolean = false;
  private hasHapi: boolean = false;
  private parsedJSON: any;

  constructor() {
    console.log('NodeBackend instanciated');
    this.parsedJSON = require(`${Globals.rootPath}package.json`);
    this.hasExpress = pathExistsInJSON(this.parsedJSON, [
      'dependencies',
      'express',
    ]);
    this.hasRestify = pathExistsInJSON(this.parsedJSON, [
      'dependencies',
      'restify',
    ]);
    this.hasNestJS = pathExistsInJSON(this.parsedJSON, [
      'dependencies',
      '@nestjs/core',
    ]);
    this.hasHapi = pathExistsInJSON(this.parsedJSON, ['dependencies', 'hapi']);
  }

  async isAvailable(): Promise<boolean> {
    console.log('is NodeBackend available ?');
    console.log('has express ?' + this.hasExpress);
    return this.hasNestJS || this.hasExpress || this.hasRestify || this.hasHapi;
  }

  name(): string {
    return 'Node Backend';
  }
}
