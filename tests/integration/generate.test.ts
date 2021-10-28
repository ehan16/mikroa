import { MockSTDIN, stdin } from 'mock-stdin';
import fs from 'fs-extra';
import { handler } from '../../src/commands/generate';

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

jest.setTimeout(20000);

test('generate a new microservice', async () => {
  const argv = {
    _: ['generate'],
    $0: 'mikroa',
    microservice: 'new-microservice',
  };

  const sendKeystrokes = async () => {
    io?.send(keys.enter);
    io?.send(keys.enter);
    io?.send(keys.enter);
  };

  setTimeout(() => sendKeystrokes().then(), 5);

  await handler(argv);

  const microserviceCreated = fs.existsSync(
    `${process.cwd()}/new-microservice`
  );

  expect(microserviceCreated).toBeTruthy();
});
