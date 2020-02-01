import Project from '@lerna/project';
import chalk from 'chalk';
import dargs from 'dargs';
import { prompt } from 'enquirer';
import { Arguments, CommandBuilder } from 'yargs';
import { createLernaRunner, getLocalDependenciesFor, log } from './utils';

// Command
// ---------------
export const command = 'start [options]';
export const describe = '🚀  Start developing.';

export const builder: CommandBuilder<any, any> = yargs =>
  yargs
    .option('build', {
      alias: 'b',
      describe: 'Name of the build script.',
      default: 'prepare',
      type: 'string',
    })
    .option('watch', {
      alias: 'w',
      describe: 'Name of the watch script.',
      default: 'start',
      type: 'string',
    })
    .default('cwd', process.cwd());

export const handler = async (
  argv: Arguments<{ cwd: string; build: string; watch: string }>
) => {
  const project = new Project(argv.cwd);
  const packages = await project.getPackages();

  // Set Scope
  // ---------------
  const { selected } = await prompt<{ selected?: string[] }>({
    type: 'multiselect',
    name: 'selected',
    message: `Select packages to start (use space bar to select multiple packages):`,
    choices: packages.map(pkg => {
      const folders = pkg.location.split('/');
      const subFolder = folders.pop();
      const projectFolder = folders.pop();

      return {
        name: pkg.name,
        message: `${projectFolder}/${subFolder}`,
        // @ts-ignore
        hint: `- ${pkg.toJSON().description}`,
      };
    }),
    validate: val => (val.length > 0 ? true : 'Choose at least one package!'),
  });

  if (!selected) {
    return;
  }

  const lerna = await createLernaRunner(argv.cwd);

  // Build local deps
  // ---------------
  const dependencies = getLocalDependenciesFor(selected, packages);
  if (dependencies.size) {
    log.info(chalk.blue('Building required local dependencies...'));
    await lerna('run', [
      argv.build,
      ...dargs({
        scope: [...dependencies].map(pkg => pkg.name),
        includeFilteredDependencies: true,
        stream: true,
      }),
    ]);
    log.success('Build all required local dependencies!');
  }

  // Start developing
  // ---------------
  log.info(chalk.blue('Starting...'));
  await lerna('run', [
    argv.watch,
    ...dargs({
      scope: selected,
      stream: true,
    }),
  ]);
};
