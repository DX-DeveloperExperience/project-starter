import Globals from '../../../../../utils/globals/index';
import { Nodemon } from './index';
const commands = require('../../../../../utils/commands');

Globals.rootPath = 'nodemon/';
const packagePath = Globals.rootPath + 'package.json';

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

test('should return true if nodemon is not in devDependencies nor installed globally', () => {
  const parsedJSON = {
    devDependencies: {
      dep1: 'dep1',
      dep2: 'dep2',
    },
  };

  jest.mock(packagePath, () => parsedJSON, { virtual: true });

  commands.execInRootpath = jest.fn((cmd: string) => {
    expect(cmd).toBe('nodemon -v');
    return Promise.reject();
  });

  const nodemon = new Nodemon();

  return nodemon.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return false if nodemon is in devDependencies', () => {
  const parsedJSON = {
    devDependencies: {
      dep1: 'dep1',
      nodemon: 'dep2',
    },
  };

  jest.mock(packagePath, () => parsedJSON, { virtual: true });

  const nodemon = new Nodemon();

  return nodemon.shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});

test('should return false if nodemon is globally installed', () => {
  jest.mock(packagePath, () => ({}), { virtual: true });

  commands.execInRootpath = jest.fn((cmd: string) => {
    expect(cmd).toBe('nodemon -v');
    return Promise.resolve();
  });

  const nodemon = new Nodemon();

  return nodemon.shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});
