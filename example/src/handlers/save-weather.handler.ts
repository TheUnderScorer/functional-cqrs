import { CommandHandler } from '@functional-cqrs/typings';
import { SaveWeatherCommand } from '../commands';
import * as fs from 'fs';
import * as path from 'path';
import { commandHandler } from '@functional-cqrs/stores';
import { pipeWith, then } from 'ramda';

export interface SaveWeatherConfig {
  dataPath: string;
}

interface CommandWithPath {
  command: SaveWeatherCommand;
  jsonPath: string;
}

interface CommandWithData extends CommandWithPath {
  fileData: object[];
}

const getDataFilePath = (config: SaveWeatherConfig) => async (
  command: SaveWeatherCommand
): Promise<CommandWithPath> => {
  return {
    command,
    jsonPath: path.join(config.dataPath, 'weathers.json'),
  };
};

const validateDirectory = ({ dataPath }: SaveWeatherConfig) => async (
  data: CommandWithPath
): Promise<CommandWithPath> => {
  if (!fs.existsSync(dataPath)) {
    await fs.promises.mkdir(dataPath);
  }

  return data;
};

const validateFile = async (
  data: CommandWithPath
): Promise<CommandWithPath> => {
  const { jsonPath } = data;

  if (!fs.existsSync(jsonPath)) {
    await fs.promises.writeFile(jsonPath, JSON.stringify([]));
  }

  return data;
};

const appendData = async (data: CommandWithPath): Promise<CommandWithData> => {
  const { jsonPath, command } = data;
  const rawFile = await fs.promises.readFile(jsonPath);
  const fileData = JSON.parse(rawFile.toString()) as object[];

  fileData.push({
    response: command.payload.data,
    date: new Date().toISOString(),
    place: command.payload.place,
  });

  return {
    ...data,
    fileData,
  };
};

const writeData = async (data: CommandWithData) => {
  const { jsonPath, fileData } = data;
  const json = JSON.stringify(fileData, null, ' ');

  await fs.promises.writeFile(jsonPath, json);
};

const handler: CommandHandler<
  SaveWeatherCommand,
  SaveWeatherConfig,
  void
> = config =>
  pipeWith(then, [
    getDataFilePath(config),
    validateDirectory(config),
    validateFile,
    appendData,
    writeData,
  ]);

export default commandHandler<SaveWeatherCommand, SaveWeatherConfig>(
  'SaveWeather',
  handler
);
