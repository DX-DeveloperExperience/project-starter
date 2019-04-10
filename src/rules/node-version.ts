import { JavaScript } from './../stacks/javascript';
import { RuleRegister } from './rule-register';
import { StackRegister } from '../stacks/stack-register';
import { TypeScript } from '../stacks/typescript';
import Axios from 'axios';
import * as cp from 'child_process';
import * as fs from 'fs';

@RuleRegister.register
@StackRegister.registerRuleForStacks([JavaScript, TypeScript])
export class NodeVersion {
  readonly requiredFiles: string[] = [];
  readonly rootPath: string;
  private nodeVersionSchedule: any;
  private nodeVersion: string = '';
  private shortNodeVersion: string = '';

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
    this.nodeVersion = cp.execSync('node --version').toString();
    this.shortNodeVersion = this.nodeVersion.split('.')[0];

    Axios.get(
      'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json',
    )
      .then(schedule => {
        this.nodeVersionSchedule = schedule.data;
        fs.writeFileSync('./../../etc/node-schedule.json', schedule.data);
      })
      .catch(err => {
        this.nodeVersionSchedule = JSON.parse(
          fs.readFileSync('./../../etc/node-schedule.json', {
            encoding: 'utf-8',
          }),
        );
      });
  }

  shouldBeApplied() {
    return this.isCritical() || this.isOutdated();
  }
  apply() {
    //
  }

  private isCritical() {
    const now = Date.now();
    const maintenance = Date.parse(
      this.nodeVersionSchedule[this.shortNodeVersion].maintenance,
    );
    const end = Date.parse(this.nodeVersionSchedule[this.shortNodeVersion].end);

    return maintenance < now && now < end;
  }

  private isOutdated() {
    const now = Date.now();
    const end = Date.parse(this.nodeVersionSchedule[this.shortNodeVersion].end);

    return end < now;
  }

  name() {
    return 'Node Version';
  }

  description() {
    if (this.isOutdated()) {
      const endDate = this.nodeVersionSchedule[this.shortNodeVersion].end;
      return `Your NodeJS version : ${this.nodeVersion}
      is outdated (${endDate}), you should consider updating it.`;
    } else {
      const maintenanceDate = this.nodeVersionSchedule[this.shortNodeVersion]
        .maintenance;
      return `Your NodeJS version : ${this.nodeVersion}
      is not maintained anymore, you should conside updating it.`;
    }
  }
}