import Project from '@lerna/project';
import Package from '@lerna/package';

import chalk from 'chalk';
import { prompt } from 'enquirer';
import findUp from 'find-up';
import { readJson, outputFile } from 'fs-extra';
import { resolve, relative, dirname } from 'path';
import { CompilerOptions, MapLike } from 'typescript';
import { Arguments, CommandBuilder } from 'yargs';

import { getFullPackageName, writeJson, log } from './utils';

// eslint-disable-next-line @typescript-eslint/member-ordering
type TSConfigJson = { compilerOptions?: CompilerOptions; [key: string]: any };

// Constants
// ---------------
const PRIVATE_WORKSPACES = ['tools', 'app'];

const TSCONFIG_CACHE_DIR = '.cache';

const TSCONFIG_JSON_BUILD = {
  name: 'tsconfig.build.json',
  config: {
    compilerOptions: {
      rootDir: 'src',
      outDir: 'build',
      incremental: true,
      tsBuildInfoFile: `${TSCONFIG_CACHE_DIR}/tsbuildinfo`,
      declaration: true,
    },
    include: ['src/**/*'],
    exclude: ['build', 'node_modules', '**/*.test.ts'],
  },
};

// Helper
// ---------------
const hasPackage = (packages: Package[], name: string) =>
  packages.some(pkg => name === pkg.name);

const inquireInstallDirectory = async (choices: string[]) => {
  if (choices.length === 1) {
    return choices[0];
  }

  const answers = await prompt<{ installDir: string }>({
    type: 'select',
    name: 'installDir',
    message: 'Where should the package be installed?',
    choices,
  });

  return answers.installDir;
};

const inquirePackageDescription = async () => {
  const answers = await prompt<{ description: string }>({
    type: 'text',
    name: 'description',
    message: "What's the purpose of the package?",
  });

  return answers.description;
};

const updatePathMapping = (
  tsConfigJson: TSConfigJson,
  mapping: MapLike<string[]>
) => {
  const { compilerOptions = {} } = tsConfigJson;
  compilerOptions.paths = compilerOptions.paths
    ? { ...compilerOptions.paths, ...mapping }
    : mapping;

  return tsConfigJson;
};

const isPrivateWorkspace = (directory: string) =>
  PRIVATE_WORKSPACES.some(ws => directory.includes(ws));

type PackageConfig = {
  name: string;
  version: string;
  description: string;
  isPrivate: boolean;
};

const createPackageJson = ({
  name,
  version,
  description,
  isPrivate,
}: PackageConfig) => ({
  name,
  version,
  description,
  license: 'UNLICENSED',
  ...(isPrivate ? { private: true } : { publishConfig: { access: 'public' } }),
  main: 'build/index.js',
  repository: {
    type: 'git',
    url: 'https://github.com/TheUnderScorer/functional-cqrs.git',
  },
  scripts: {
    dev: `tsc -p ${TSCONFIG_JSON_BUILD.name} -w`,
    build: `yarn run clean && tsc -p ${TSCONFIG_JSON_BUILD.name}`,
    prod: 'node build/index.js',
    clean: `rm -rf ${TSCONFIG_JSON_BUILD.config.compilerOptions.outDir} ${TSCONFIG_CACHE_DIR}`,
    test: 'jest --config ../../jest.config.js',
  },
});

// Command
// ---------------
export const command = 'create <name>';
export const describe = '📦  Create a new package.';

export const builder: CommandBuilder<any, any> = yargs =>
  yargs
    .positional('name', {
      describe: 'Name of the module',
      type: 'string',
    })
    .default('cwd', process.cwd());

export const handler = async (
  argv: Arguments<{ name: string; cwd: string }>
) => {
  const project = new Project(argv.cwd);
  const packages = await project.getPackages();
  const fullName = await getFullPackageName(argv.name, { cwd: argv.cwd });

  if (hasPackage(packages, fullName)) {
    throw Error(
      `Can not create package "${argv.name}" because it already exists!`
    );
  }

  const packageDir = await inquireInstallDirectory(project.packageParentDirs);
  const installDir = resolve(packageDir, argv.name);

  const tsConfigPath = await findUp('tsconfig.json', { cwd: packageDir });
  if (!tsConfigPath) {
    throw new Error(`Could not locate "tsconfig.json" in project.`);
  }

  const tsConfigBasePath = await findUp('tsconfig.build.json', {
    cwd: installDir,
  });
  if (!tsConfigPath) {
    throw new Error(`Could not locate "tsconfig.build.json" in project.`);
  }

  const description = await inquirePackageDescription();

  // Write package.json
  await writeJson(
    resolve(installDir, 'package.json'),
    createPackageJson({
      name: fullName,
      version: project.isIndependent() ? '0.0.1' : project.version,
      description,
      isPrivate: isPrivateWorkspace(installDir),
    })
  );

  // Write tsconfig.build.json and extend from tsconfig.base.json
  await writeJson(resolve(installDir, TSCONFIG_JSON_BUILD.name), {
    ...(tsConfigBasePath
      ? { extends: relative(installDir, tsConfigBasePath) }
      : {}),
    ...TSCONFIG_JSON_BUILD.config,
  });

  // Create empty src/index.ts file
  const sourceDir = resolve(installDir, 'src');
  await outputFile(resolve(sourceDir, 'index.ts'), '');

  // Create README file
  await outputFile(
    resolve(installDir, 'README.md'),
    `# \`${fullName}\`\n\n${description}`
  );

  log.success(`Package created @ ${chalk.underline(installDir)}`);

  // Update paths in root tsconfig.json
  const tsConfig: TSConfigJson = await readJson(tsConfigPath);
  await writeJson(
    tsConfigPath,
    updatePathMapping(tsConfig, {
      [fullName]: [`./${[relative(dirname(tsConfigPath), sourceDir)]}`],
    })
  );

  log.success(
    `Path mapping for ${chalk.blue(fullName)} added to ${chalk.underline(
      tsConfigPath
    )}`
  );
};
