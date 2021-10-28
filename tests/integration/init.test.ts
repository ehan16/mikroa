import { MockSTDIN, stdin } from 'mock-stdin';
import fs from 'fs-extra';
import { handler } from '../../src/commands/init';

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

jest.setTimeout(50000);

describe('Integration test: command init', () => {
  test('initialize a microservice project', async () => {
    const argv = { _: ['init'], $0: 'mikroa', name: 'jest-project' };

    const sendKeystrokes = async () => {
      io?.send('y');
      io?.send(keys.enter);
    };

    setTimeout(() => sendKeystrokes().then(), 5);

    await handler(argv);

    const projectCreated = fs.existsSync(`${process.cwd()}/jest-project`);
    expect(projectCreated).toBeTruthy();
  });
});
