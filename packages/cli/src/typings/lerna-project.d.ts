declare module '@lerna/project' {
  import { Options } from 'fast-glob';
  import Package from '@lerna/package';

  type LernaConfig = {
    version: string;
    packages?: string[];
    npmClient?: string;
    useWorkspaces?: boolean;
  };

  class Project {
    static PACKAGE_GLOB: string;
    static LICENSE_GLOB: string;

    constructor(cwd: string);

    config: LernaConfig;
    rootConfigLocation: string;
    rootPath: string;

    version: string;
    version(val: string): void;

    packageParentDirs: string[];
    manifest: Package;
    licensePath: string | undefined;

    fileFinder(
      fileName: string,
      fileMapper?: (filePaths: string[]) => any | null | undefined,
      customGlobOpts?: Options
    ): any;
    getPackages(): Promise<Package[]>;
    getPackageLicensePaths(): Promise<string[]>;
    isIndependent(): boolean;
    serializeConfig(): Promise<void>;
  }

  export default Project;
  export function getPackages(cwd: string): ReturnType<Project['getPackages']>;
}
