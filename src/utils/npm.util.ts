import execa from 'execa';
import { showError, showWarning } from './logger.util';

export async function initPackageJson(path: string) {
  const res = await execa('npm', ['init', '-y'], {
    cwd: process.cwd() + path,
  });
  if (res.failed) {
    showWarning('failed to generate package.json');
  }
}

// npm install --save --package-lock-only --no-package-lock <package>
export async function installPackage(
  path: string,
  packageName: string,
  install: boolean = true,
  options: string[] = []
) {
  const res = await execa(
    'npm',
    [
      'install',
      '--save',
      '--legacy-peer-deps',
      install ? '' : '--package-lock-only',
      install ? '' : '--no-package-lock',
      packageName,
      ...options,
    ],
    {
      cwd: process.cwd() + path,
    }
  );
  if (res.failed) {
    showWarning(`failed to install ${packageName}`);
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
    showWarning(`failed to execute ${type}`);
  }
}

export async function executePrisma(
  type: string,
  path: string,
  development: boolean = false
) {
  if (type === 'migrate') {
    if (development) {
      const devRes = await execa('npm', ['run', 'p:migrate'], {
        cwd: process.cwd() + path,
      });

      if (devRes.failed) {
        showError(
          `failed to execute migrate on path: ${process.cwd()}/${path}`
        );
        showWarning(
          'Please check that p:migrate script exists in package.json'
        );
      }
    } else {
      const deployRes = await execa('npm', ['run', 'p:migrate:deploy'], {
        cwd: process.cwd() + path,
      });

      if (deployRes.failed) {
        showError(deployRes.stderr);
        showError(
          `failed to execute migrate on path: ${process.cwd()}/${path}`
        );
        showWarning(
          'Please check that p:migrate:deploy script exists in package.json'
        );
      }
    }
  } else {
    const generateRes = await execa('npm', ['run', 'p:generate'], {
      cwd: process.cwd() + path,
    });

    if (generateRes.failed) {
      showError(`failed to execute generate on path: ${process.cwd()}/${path}`);
      showWarning(
        'Please check that p:generate scripts exists in package.json'
      );
    }
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
