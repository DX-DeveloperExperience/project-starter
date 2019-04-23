import { StackRegister } from './stack-register';
import * as fs from 'fs';
import Stack from './stack';

// import all stacks files
fs.readdirSync(`${__dirname}`)
  .filter(path => {
    return path.endsWith('.d.ts') || path.endsWith('.ts');
  })
  .forEach(path => {
    require(`${__dirname}/${path.replace(/.d.ts|.ts/, '')}`);
  });

export class ListStacks {
  static findStacksIn(rootPath: string): Stack[] {
    return StackRegister.getImplementations()
      .map(stack => new stack(rootPath))
      .filter(stack => stack.isInPath(rootPath));
  }
}
