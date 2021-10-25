import type { CommandBuilder } from 'yargs';
import execa from 'execa';
import { SingleBar } from 'cli-progress';
import {
  readJson,
  directoryExist,
} from '../templates/default/default.template';
import {
  showError,
  showStart,
  showSuccess,
  showWarning,
} from '../utils/logger.util';

export const command = 'build';
export const desc = 'Build a Mikroa project by generating the Docker images';

export const builder: CommandBuilder = {};

export const handler = async () => {
  showStart('to build Docker images');

  const progressBar = new SingleBar({
    format: `{microservice} | {bar} | {percentage}%`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  // progressBar.start(50, 0);

  try {
    // 1. Read the configuration file to extract current microservices
    const configFile = await readJson('config.json');
    // progressBar.update(10);

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

      if (directoryExist(name)) {
        showStart(`building ${name} image`);
        progressBar.start(100, 60, { microservice: name });
        // 3. Execute the command in charge of compiling the code
        const res = await execa('docker', ['build', '.', '-t', `${name}`], {
          cwd: `${process.cwd()}/${name}`,
        });

        // [host port]:[container port]
        // -d is detach mode
        // -p is publish
        // docker run -d -p 3000:3000 <container-name>

        progressBar.update(100);
        progressBar.stop();
        if (res.failed) {
          showWarning(`failed to generate ${name} Docker container`);
        } else {
          showSuccess(`${name} image builded successfully`);
        }
      }

      // progressBar.increment(40 / Object.entries(configFile).length);
    }

    // progressBar.update(50);
    // progressBar.stop();
    showSuccess('Build was successful');
  } catch (err) {
    // progressBar.stop();
    showError((err as any).message);
    process.exit(1);
  }
};
