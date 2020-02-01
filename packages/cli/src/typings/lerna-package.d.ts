declare module '@lerna/package' {
  type Collection = { [name: string]: string };

  class Package {
    readonly name: string;
    readonly location: string;
    readonly private: boolean;
    readonly resolved: string;
    readonly rootPath: string;

    version: string;
    dependencies?: Collection;
    devDependencies?: Collection;
    optionalDependencies?: Collection;
    peerDependencies?: Collection;

    scripts?: Collection;
    manifestLocation: string;
    nodeModulesLocation: string;
    binLocation: string;

    // Map-like retrieval and storage of arbitrary values
    get<K extends keyof Package>(key: K): Package[K];
    set<K extends keyof Package>(key: K, val: Package[K]): this;

    // provide copy of internal pkg for munging
    toJSON(): Pick<
      Package,
      Exclude<keyof Package, 'get' | 'set' | 'toJSON' | 'serialize'>
    >;

    // write changes to disk
    serialize(): void;
  }

  export default Package;
}
