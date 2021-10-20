import execa from 'execa';
import type { CommandBuilder } from 'yargs';
import { readJson } from '../templates/default/default.template';
import { showError, showStart, showWarning } from '../utils/logger.util';

export const command = 'build';
export const desc =
  'Build a Mikroa project by generating the Docker containers';

export const builder: CommandBuilder = {};

export const handler = async () => {
  showStart('to generate Docker containers');

  try {
    // 1. Read the configuration file to extract current microservices
    const configFile = await readJson('config.json');

    // 2. Iterate over the microservices
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

      // 3. Execute the command in charge of compiling the code
      const res = await execa('docker', ['build', '.', '-t', `${name}`], {
        cwd: `${process.cwd()}/${name}`,
      });
      if (res.failed) {
        showWarning(`failed to generate ${name} Docker container`);
      }
    }
  } catch (err) {
    console.error(err);
    showError(
      'an error has ocurred while building, please check the Dockerfile, path or dependencies'
    );
  }
};
