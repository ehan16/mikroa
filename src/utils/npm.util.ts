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
