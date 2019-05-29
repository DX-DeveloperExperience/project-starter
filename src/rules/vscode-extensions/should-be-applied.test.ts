import { VSCodeExtensions } from '.';

const fs = require('fs');
jest.mock('fs');

const cp = require('child_process');
jest.mock('child_process');

afterEach(() => {
  jest.resetAllMocks();
});

const rootPath = './test/';

test('should return true if .vscode/extensions.json and .vscode folder do not exist but vscode is installed', () => {
  cp.execSync.mockImplementation(() => {
    return 'code -v mocked result';
  });

  expect(new VSCodeExtensions().shouldBeApplied()).toBeTruthy();
});

test('Method shouldBeApplied() should return true if .vscode/extension.json does not exist but .vscode folder do', () => {
  fs.lstatSync.mockImplementation(() => {
    return {
      isDirectory() {
        return true;
      },
    };
  });

  cp.execSync.mockImplementation(() => {
    throw new Error();
  });

  expect(new VSCodeExtensions().shouldBeApplied()).toBeTruthy();
});

test('should return true if .vscode/extensions.json is empty', () => {
  jest.mock('./test/.vscode/extensions.json', () => ({}), { virtual: true });

  expect(new VSCodeExtensions().shouldBeApplied()).toBeTruthy();
});

test('should return true if .vscode/extensions.json has no recommendations array', () => {
  const extensionsJSON = {
    array1: ['value1', 'value2'],
    object1: {
      key1: 'value1',
      key2: 'value2',
    },
    recommendations: {
      key1: 'value1',
    },
  };

  jest.mock('./test/.vscode/extensions.json', () => extensionsJSON, {
    virtual: true,
  });

  const vscext = new VSCodeExtensions();
  expect(vscext.shouldBeApplied()).toBeTruthy();
});

test('should return true if .vscode/extensions.json contains an empty "recommendations" array', () => {
  const extensionsJSON = {
    array1: ['value1', 'value2'],
    object1: {
      key1: 'value1',
      key2: 'value2',
    },
    recommendations: [],
  };

  jest.mock('./test/.vscode/extensions.json', () => extensionsJSON, {
    virtual: true,
  });

  expect(new VSCodeExtensions().shouldBeApplied()).toBeTruthy();
});

test('should return true if .vscode/extension.json does not contains all recommended extensions', () => {
  const extensionsJSON = {
    recommendations: ['ext1', 'ext2'],
  };

  jest.mock('./test/.vscode/extensions.json', () => extensionsJSON, {
    virtual: true,
  });

  cp.execSync.mockImplementation((param: string) => {
    if (param === 'code -v') {
      return 'code -v mocked result';
    }
  });

  const vsCodeExtension = new VSCodeExtensions(rootPath);

  vsCodeExtension.getChoices = jest.fn(() => {
    return Promise.resolve([
      { name: 'extension1', value: 'ext1' },
      { name: 'extension3', value: 'ext3' },
    ]);
  });

  expect(vsCodeExtension.shouldBeApplied()).toBeTruthy();
});

test('should return false if .vscode/extension.json contains all recommended extensions', () => {
  const extensionsJSON = {
    recommendations: ['ext1', 'ext2'],
  };

  jest.mock('./test/.vscode/extensions.json', () => extensionsJSON, {
    virtual: true,
  });

  cp.execSync.mockImplementation((param: string) => {
    if (param === 'code -v') {
      return 'code -v mocked result';
    }
  });

  const vsCodeExtension = new VSCodeExtensions(rootPath);

  vsCodeExtension.getChoices = jest.fn(() => {
    return Promise.resolve([
      { name: 'extension1', value: 'ext1' },
      { name: 'extension2', value: 'ext2' },
    ]);
  });

  return vsCodeExtension.shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});