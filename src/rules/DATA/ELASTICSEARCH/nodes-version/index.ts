import { Register } from './../../../../register/index';
import { FetchDataError } from '../../../../errors/fetch-data-errors';
import Elasticsearch from '../../../../stacks/elasticsearch';
import Globals from '../../../../utils/globals';
import { YesNo } from '../../../../choice';
import Axios from 'axios';

@Register.ruleForStacks([Elasticsearch])
export class ElasticsearchNodesVersion {
  async shouldBeApplied(): Promise<boolean> {
    const url = `${Globals.rootPath}_nodes`;
    return Axios.get(url)
      .then(result => {
        const versions = Object.values(result.data.nodes).map(
          (node: any) => node.version,
        );

        const set = new Set(versions);
        return set.size > 1;
      })
      .catch(err => {
        throw new FetchDataError(err, url, this.constructor.name);
      });
  }

  getName() {
    return 'Elasticsearch Version';
  }

  getShortDescription() {
    return 'An Elasticsearch cluster should have all nodes using the same version of Elasticsearch';
  }

  getLongDescription() {
    return 'Laborum exercitation incididunt nulla veniam labore esse. Pariatur adipisicing sint aliqua adipisicing culpa consequat reprehenderit excepteur eiusmod. Est irure voluptate fugiat enim minim laborum. Magna anim eiusmod consectetur voluptate. Proident ad ex laborum in adipisicing sit minim aliquip duis. Do non voluptate mollit officia consequat proident ex mollit dolore qui esse sit reprehenderit.';
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return YesNo;
  }
}
