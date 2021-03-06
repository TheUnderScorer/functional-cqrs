# [1.3.0](https://github.com/TheUnderScorer/functional-cqrs/compare/v1.2.3...v1.3.0) (2021-06-14)


### Features

* Add typed CommandBus and QueryBus ([af70231](https://github.com/TheUnderScorer/functional-cqrs/commit/af70231f78a5b8697da883a76c55df32291a94f3))
* Simplify handlers, remove DI ([93a4a4e](https://github.com/TheUnderScorer/functional-cqrs/commit/93a4a4e3dc9e329c4554cf83222460591ee8df10))

## [1.2.3](https://github.com/TheUnderScorer/functional-cqrs/compare/v1.2.2...v1.2.3) (2021-02-01)


### Bug Fixes

* Exclude docs from package ([4533103](https://github.com/TheUnderScorer/functional-cqrs/commit/4533103b22774aa3316bf29dc455d62d45f2b2bd))

## [1.2.2](https://github.com/TheUnderScorer/functional-cqrs/compare/v1.2.1...v1.2.2) (2021-02-01)


### Bug Fixes

* **events-bus:** Support passing event constructor as eventName ([f3eeda7](https://github.com/TheUnderScorer/functional-cqrs/commit/f3eeda7184cf1bf0868cc8beffe4db92ee08ea23))

## [1.2.1](https://github.com/TheUnderScorer/functional-cqrs/compare/v1.2.0...v1.2.1) (2020-12-10)


### Bug Fixes

* Make "Context" generic argument optional in buses ([56c3e20](https://github.com/TheUnderScorer/functional-cqrs/commit/56c3e2002498a984c089d563e6fd45ce0b757180))

# [1.2.0](https://github.com/TheUnderScorer/functional-cqrs/compare/v1.1.1...v1.2.0) (2020-12-09)


### Features

* Change buses from factory functions to classes ([2742f3f](https://github.com/TheUnderScorer/functional-cqrs/commit/2742f3ffe5101271dbe0a63a7385aba437a0f0a4))
* Don't require "name" if instruction is an class ([8ca5a27](https://github.com/TheUnderScorer/functional-cqrs/commit/8ca5a277a2b5e69e7cbe865a5d981cd62f68a493))

## [1.1.1](https://github.com/TheUnderScorer/functional-cqrs/compare/v1.1.0...v1.1.1) (2020-08-19)


### Bug Fixes

* add missing generic types for query handler ([565e6d7](https://github.com/TheUnderScorer/functional-cqrs/commit/565e6d75fc66b19f7e3f1bc386a6de3971533128))

# [1.1.0](https://github.com/TheUnderScorer/functional-cqrs/compare/v1.0.0...v1.1.0) (2020-08-19)


### Features

* Trigger release ([309acfa](https://github.com/TheUnderScorer/functional-cqrs/commit/309acfa28fc11d5cfe97e1facca59f34af27e5be))

# 1.0.0 (2020-08-19)


### Features

* add event subscriber decorators ([7e0660a](https://github.com/TheUnderScorer/functional-cqrs/commit/7e0660a30fae8f07b7be82e7276ad21d454b860c))
* migrate from monorepo to single package ([f7a82e5](https://github.com/TheUnderScorer/functional-cqrs/commit/f7a82e5113262508889023a2c0c31873abfbdba4))
* Support both functional and class handlers ([a0aa493](https://github.com/TheUnderScorer/functional-cqrs/commit/a0aa4932fc1ceb349be300a3c995fd3e5c59bc43))
* Support passing context as function that returns it ([982bfba](https://github.com/TheUnderScorer/functional-cqrs/commit/982bfba751e257804407916da613aa9318db21da))
