import { LaunchConf, LaunchConfFile } from '../constants';
import { Constructor } from '../../../stacks/stack-register/index';
import Stack from '../../../../lib/stacks/stack/index';
import VueJS from '../../../stacks/vue-js/index';
import Angular from '../../../stacks/angular/index';
import { React } from '../../../stacks/react/index';
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
};

export const vscodeConfig: LaunchConfFile = {
  version: '0.2.0',
  configurations: [],
};
