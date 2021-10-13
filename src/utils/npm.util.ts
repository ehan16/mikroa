import execa from 'execa';

export async function initPackageJson(path: string) {
  const res = await execa('npm', ['init', '-y'], {
    cwd: process.cwd() + path,
  });
  if (res.failed) {
    console.error('Failed to generate package.json');
  } else {
    console.log('Created package.json');
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
    console.error(`Failed to install ${packageName}`);
  } else {
    console.log(`Installed ${packageName}`);
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
    console.error(`Failed to execute ${type}`);
  } else {
    console.log(`${type} executed correctly`);
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
    console.log(res);
    console.error(`Failed to execute prettier`);
  } else {
    console.log(`Prettier executed correctly`);
  }
}
