import execa from 'execa';
import { showError, showWarning } from './logger.util';

export async function initPackageJson(path: string) {
  const res = await execa('npm', ['init', '-y'], {
    cwd: process.cwd() + path,
  });
  if (res.failed) {
    showError('failed to generate package.json');
  }
}

export async function installPackage(
  path: string,
  packageName: string,
  // eslint-disable-next-line no-shadow
  options = ''
) {
  const res = await execa('npm', ['install', packageName, options], {
    cwd: process.cwd() + path,
  });
  if (res.failed) {
    showError(`failed to install ${packageName}`);
  }
}

export async function executePackage(
  path: string,
  // eslint-disable-next-line no-shadow
  type: string,
  options = ''
) {
  const res = await execa('npx', [type, options], {
    cwd: process.cwd() + path,
  });
  if (res.failed) {
    showError(`failed to execute ${type}`);
  }
}

export async function executePrisma(type: string, path: string) {
  let res: any;
  if (type === 'migrate') {
    res = await execa('npx', ['prisma', 'migrate dev', '--name init'], {
      cwd: process.cwd() + path,
    });
  } else {
    res = await execa('prisma', ['generate'], {
      cwd: process.cwd() + path,
    });
  }
  if (res.failed) {
    showError(
      `failed to execute ${type === 'migrate' ? 'migrate' : 'generate'}`
    );
  }
}

export async function formatFiles(path: string, typescript: boolean = false) {
  const res = await execa(
    'npx',
    ['prettier', '--write', `**/*.{js,json${typescript ? ',ts' : ''}}`],
    {
      cwd: process.cwd() + path,
    }
  );
  if (res.failed) {
    showWarning('failed to format files');
  }
}
