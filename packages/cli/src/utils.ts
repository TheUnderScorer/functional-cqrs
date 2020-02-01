import Package from '@lerna/package';
import PackageGraph from '@lerna/package-graph';
import execa, { Options } from 'execa';
import { outputJson } from 'fs-extra';
import logSymbols from 'log-symbols';
import readPkgUp from 'read-pkg-up';

// Logging
// ---------------
const logWith = (prefix: string) => (msg: string) =>
  console.log(`${prefix} ${msg}`);

export const log = {
  info: logWith(logSymbols.info),
  success: logWith(logSymbols.success),
  warning: logWith(logSymbols.warning),
  error: logWith(logSymbols.error),
};

// Packages
// ---------------
export const getPackageScope = async (cwd: string) => {
  const result = await readPkgUp({ cwd });
  return `@${result!.package.name}`;
};

export const getFullPackageName = async (
  name: string,
  options: { cwd: string }
) => {
  const scope = await getPackageScope(options.cwd);
  return `${scope}/${name}`;
};

/**
 * Use lerna's `PackageGraph` to find any local dependencies that are required
 * by `packageNames`. Will return only packages that are not included in `packageNames`.
 *
 * Note that you should pass all `packages` to this function. Otherwhise the graph
 * can not be constructed by lerna.
 */
export const getLocalDependenciesFor = (
  packageNames: string[],
  packages: Package[]
) => {
  const graph = new PackageGraph(packages);
  const dependencies = new Set<Package>();

  packageNames.forEach(name => {
    const node = graph.get(name);

    if (!node) {
      throw Error(
        `Are there packages missing? "${name}" is not part of lerna's packages graph!`
      );
    }

    node.localDependencies.forEach(pkg => {
      if (!packageNames.includes(pkg.name)) {
        dependencies.add(pkg);
      }
    });
  });

  return dependencies;
};

// File I/O
// ---------------
export const writeJson = async (filepath: string, o: object) =>
  outputJson(filepath, o, { spaces: 2 });

// Lerna
// ---------------
export const getLernaBinary = async (cwd: string) => {
  const { stdout } = await execa('yarn', ['bin', 'lerna'], { cwd });
  return stdout;
};

export type LernaCommand =
  | 'publish'
  | 'version'
  | 'bootstrap'
  | 'list'
  | 'changed'
  | 'diff'
  | 'exec'
  | 'run'
  | 'init'
  | 'add'
  | 'clean'
  | 'import'
  | 'link'
  | 'create';

export const createLernaRunner = async (
  cwd: string,
  defaultOptions: Options = {}
) => {
  const bin = await getLernaBinary(cwd);
  return async (
    cmd: LernaCommand,
    args: string[] = [],
    options: Options = {}
  ) =>
    execa(bin, [cmd, ...args], {
      stdio: 'inherit',
      ...defaultOptions,
      ...options,
    });
};
