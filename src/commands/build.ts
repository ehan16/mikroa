import type { CommandBuilder } from 'yargs';
import execa from 'execa';
import { SingleBar } from 'cli-progress';
import {
  readJson,
  directoryExist,
  createFile,
} from '../templates/default/default.template';
import {
  showError,
  showGenerate,
  showStart,
  showSuccess,
  showWarning,
} from '../utils/logger.util';

export const command = 'build';
export const desc = 'Build a Mikroa project by generating the Docker images';

export const builder: CommandBuilder = {};

export const handler = async () => {
  showStart('to build Docker images');

  const dockerCompose = [];
  dockerCompose.push(`
version: "1"

services:
  api-gateway:
    build:
    context: ./api-gateway
    image: api-gateway
    container_name: api-gateway
    env_file: ./api-gateway/.env
    restart: unless-stopped
    ports:
      - '3000:3000'
    mem_limit: 2g
    memswap_limit: -1
    mem_swappiness: 20`);

  const progressBar = new SingleBar({
    format: `{microservice} | {bar} | {percentage}%`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  try {
    // 1. Build api gateway image
    showStart(`to build api-gateway image`);
    const apiBuild = await execa(
      'docker',
      ['build', '.', '-t', 'api-gateway'],
      {
        cwd: `${process.cwd()}/api-gateway`,
      }
    );

    if (apiBuild.failed) {
      showWarning('failed to generate api-gateway Docker image');
    } else {
      showSuccess('api-gateway image builded successfully');
    }

    // 2. Read the configuration file to extract current microservices
    const configFile = await readJson('config.json');

    // 3. Iterate over the microservices
    for (const [name, config] of Object.entries(configFile)) {
      const { language, orm, framework } = config as {
        language: string;
        orm: string;
        framework: string;
      };

      if (!(language && orm && framework)) {
        showError('you must execute command in root folder');
        process.exit(1);
      }

      if (directoryExist(name)) {
        showStart(`building ${name} image`);
        progressBar.start(100, 60, { microservice: name });
        // 4. Execute the command in charge of compiling the code
        const resBuild = await execa(
          'docker',
          ['build', '.', '-t', `${name}`],
          {
            cwd: `${process.cwd()}/${name}`,
          }
        );

        // 5. Add the new microservice to the docker-compose

        progressBar.update(100);
        progressBar.stop();
        if (resBuild.failed) {
          showWarning(`failed to generate ${name} Docker image`);
        } else {
          const microserviceCompose = `
  ${name}:
    build:
      context: ./${name}
    image: ${name}
    container_name: ${name}
    env_file: ./${name}/.env
    depends_on:
      - 'api-gateway'
    restart: unless-stopped
    ports:
      - '3001:3001'
    mem_limit: 2g
    memswap_limit: -1
    mem_swappiness: 20
          `;
          dockerCompose.push(microserviceCompose);
          showSuccess(`${name} image builded successfully`);
        }
      }
    }

    // 6. Create docker-compose
    showGenerate('docker-compose');
    await createFile('', 'docker-compose.yml', dockerCompose.join('\n'));
    showSuccess('Build was successful and docker-composer has been generated');
  } catch (err) {
    showError((err as any).message);
    process.exit(1);
  }
};
