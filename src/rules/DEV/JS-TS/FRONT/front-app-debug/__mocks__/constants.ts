import { LaunchConf, LaunchConfFile } from '../constants';
import VueJS from '../../../../../../stacks/vue-js/index';
import Stack from '../../../../../../stacks/stack';
import Angular from '../../../../../../stacks/angular';
import Constructor from '../../../../../../constructor';

export const configs: {
  [key: string]: { stack: Constructor<Stack>; confs: LaunchConf[] };
} = {
  vuejs: {
    stack: VueJS,
    confs: [
      {
        type: 'firefox',
      },
      {
        type: 'chrome',
      },
    ],
  },
  angular: {
    stack: Angular,
    confs: [
      {
        type: 'other',
      },
    ],
  },
};

export const vscodeConfig: LaunchConfFile = {
  version: '0.2.0',
  configurations: [],
};
