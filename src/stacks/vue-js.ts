import { StackRegister } from './stack-register';

@StackRegister.register
export class VueJS {
  isInPath() {
    return true;
  }
}