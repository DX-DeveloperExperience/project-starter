import { RuleRegister } from '../../rule-register';
import { Elasticsearch } from '../../../stacks/elasticsearch';
import { StackRegister } from '../../../stacks/stack-register';
import axios from 'axios';
import { YesNo } from '../../../choice';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Elasticsearch])
export class ElasticsearchNodesVersion {
  requiredFiles = [''];
  rootPath: string;

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
  }

  async shouldBeApplied(): Promise<boolean> {
    return axios.get(`${this.rootPath}_nodes`).then(result => {
      const versions = Object.values(result.data.nodes).map(
        (node: any) => node.version,
      );

      const set = new Set(versions);
      return set.size > 1;
    });
  }

  getName() {
    return 'Elasticsearch Version';
  }

  getDescription() {
    return 'An Elasticsearch cluster should have all nodes using the same version of Elasticsearch';
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return YesNo;
  }
}
