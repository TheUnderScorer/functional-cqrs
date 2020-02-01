declare module '@lerna/package-graph' {
  import Package from '@lerna/package';

  class PackageGraphNode {
    readonly name: string;
    readonly location: string;
    readonly prereleaseId: string;
    readonly version: string;
    readonly pkg: Package;

    externalDependencies: Map<string, Package>;
    localDependencies: Map<string, Package>;
    localDependents: Map<string, Package>;
  }

  class PackageGraph extends Map<string, PackageGraphNode> {
    constructor(
      packages: Package[],
      graphType?: 'allDependencies' | 'dependencies',
      forceLocal?: boolean
    );

    readonly rawPackageList: Package[];
  }

  export default PackageGraph;
}
