import { MockSTDIN, stdin } from 'mock-stdin';
import fs from 'fs-extra';
import { MultiBar } from 'cli-progress';
import { Arguments } from 'yargs';
import {
  outputJsonAsync,
  readJson,
} from '../../src/templates/default/default.template';
import {
  showError,
  showGenerate,
  showStart,
  showSuccess,
  showTitle,
  showWarning,
} from '../../src/utils/logger.util';
import { createMicroservice } from '../../src/templates/microservicesTemplates/default.microservices.template';
import { formatFiles } from '../../src/utils/npm.util';
import { promptForOptions } from '../../src/utils/prompt.util';

// Key codes
const keys = {
  up: '\x1B\x5B\x41',
  down: '\x1B\x5B\x42',
  enter: '\x0D',
  space: '\x20',
};

// Mock stdin so we can send messages to the CLI
let io: MockSTDIN | null = null;
beforeAll(() => (io = stdin()));
afterAll(() => io?.restore());

jest.setTimeout(1000000);

type Options = {
  microservice: string | undefined;
};

const generate = async (argv: Arguments<Options>) => {
  const { microservice } = argv;
  const microserviceName = microservice?.toLocaleLowerCase() ?? '';
  const microservices = [];
  let prismaMicroservice = false;

  showTitle();

  const multibar = new MultiBar({
    format: ' {bar} | {microserviceName} | {value}/{total} ',
    hideCursor: true,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  });

  try {
    const configFile = await readJson('test-project/config.json');

    // 1. Check if microservice name was provided
    if (microserviceName) {
      if (
        /[^A-Za-z0-9-]+/.test(String(microserviceName)) ||
        /\s/.test(String(microserviceName))
      ) {
        showError('invalid name');
        process.exit();
      }

      showGenerate(`${microservice || ''}`);

      // In case the microservice name is passed, ask the user for language, orm, etc
      const answers = await promptForOptions();
      microservices.push({
        name: microserviceName,
        language: answers.language,
        orm: answers.orm,
        framework: answers.framework,
      });

      // If a new microservice was created manually, append to the config
      const newConfig = {
        ...configFile,
        [microserviceName]: {
          language: answers.language,
          orm: answers.orm,
          framework: answers.framework,
        },
      };

      await outputJsonAsync('config.json', newConfig);
    }
    // 3. Check in the cache which microservices haven't been created yet and filter them out
    showStart('to read the cache');
    let cache = await readJson('test-project/cache.json');
    const cacheLength = Object.keys(cache).length;
    let dockerPort = 3001 + cacheLength;

    const _microservices = microservices.filter(
      (m) => !Object.keys(cache).includes(m.name)
    );

    if (_microservices?.length === 0) {
      showWarning(
        'there is no new microservices to generate or an already created microservice was passed'
      );
      process.exit(1);
    }

    // 4. Create the ones that are not in the cache
    showGenerate('microservices');

    // multibar.bars[0].update(20);

    for (const { framework, language, name, orm } of _microservices) {
      const bar = multibar.create(300, 0, { microserviceName: name });
      if (orm === 'prisma') prismaMicroservice = true;

      await createMicroservice(
        name,
        { language, orm, framework },
        dockerPort,
        bar
      );
      dockerPort += 1;

      bar.update(289);

      // 5. Once it have been created, append the new microservice to the cache
      cache = {
        ...cache,
        [name]: {
          language,
          orm,
          framework,
        },
      };

      bar.update(296);

      // 6. format all the files
      await formatFiles(`/${name}`, language === 'typescript');
      bar.update(300);
    }

    // 7. Write the new cache file
    await outputJsonAsync('test-project/cache.json', cache);

    // 8. Format
    await formatFiles('/new-microservice');
    multibar.stop();
    showSuccess('The microservices have been successfully created');

    if (prismaMicroservice) {
      showWarning(
        'For Prisma and MongoDB to work, Prisma Schema and Client have to be modified accordingly'
      );
    }
  } catch (e) {
    multibar.stop();
    console.log(e);
    showError('An error has ocurred while creating the microservice');
    process.exit(1);
  }
};

// helper function for timing
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Integration test: command generate', () => {
  test('generate a new microservice', async () => {
    const argv = {
      _: ['generate'],
      $0: 'mikroa',
      microservice: 'new-microservice',
    };

    const sendKeystrokes = async () => {
      io?.send(keys.enter);
      await delay(10);
      io?.send(keys.enter);
      await delay(10);
      io?.send(keys.enter);
    };

    setTimeout(() => sendKeystrokes().then(), 30);

    await generate(argv);

    const microserviceCreated = fs.existsSync(
      `${process.cwd()}/new-microservice`
    );

    expect(microserviceCreated).toBeTruthy();
  });
});
