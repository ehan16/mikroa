/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import fs from 'fs-extra';
import execa from 'execa';
import {
  createFile,
  directoryExist,
  readJson,
} from '../../src/templates/default/default.template';
import {
  showStart,
  showWarning,
  showError,
  showSuccess,
} from '../../src/utils/logger.util';

jest.setTimeout(300000);

const build = async () => {
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

  try {
    // 1. Build api gateway image
    showStart(`to build api-gateway image`);
    const apiBuild = await execa(
      'docker',
      ['build', '.', '-t', 'api-gateway'],
      {
        cwd: `${process.cwd()}/test-project/api-gateway`,
      }
    );

    if (apiBuild.failed) {
      showWarning('failed to generate api-gateway Docker image');
    } else {
      showSuccess('api-gateway image builded successfully');
    }

    const configFile = await readJson('test-project/config.json');

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
        const resBuild = await execa(
          'docker',
          ['build', '.', '-t', `${name}`],
          {
            cwd: `${process.cwd()}/test-project/${name}`,
          }
        );

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
    await createFile(
      '/test-project',
      'docker-compose.yml',
      dockerCompose.join('\n')
    );
    showSuccess('Build was successful and docker-composer has been generated');
  } catch (err) {
    showError((err as any).message);
    process.exit(1);
  }
};

describe('Integration test: command build', () => {
  const mockConsole = jest
    .spyOn(console, 'error')
    .mockImplementation((message?: any) => {});
  const mockExit = jest
    .spyOn(process, 'exit')
    .mockImplementation((code?: number) => undefined as never);

  test('building all microservices images have to be successful', async () => {
    await build();

    const dockerCompose = fs.existsSync(
      `${process.cwd()}/test-project/docker-compose.yml`
    );

    expect(dockerCompose).toBeTruthy();
    expect(mockConsole).not.toHaveBeenCalled();
    expect(mockExit).not.toHaveBeenCalled();
    mockExit.mockRestore();
    mockConsole.mockRestore();
  });
});
