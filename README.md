# @webantic/w.app

A module which serves as an application core that orchestrates DI and module loading for feature providers.


## Getting started

Install the module:

  `npm i --save @webantic/w.app`

Include it in your application's entry point:

  ```js
  import { Application } from '@webantic/w.app'

  const app = new Application('my-first-app')
  ```

## Providers

### Adding providers

You can either add providers when you instantiate the application, or at a later time. By default, providers are only instantiated when they are first used and not when they are added. This can be overridden by passing `{initialise: true}` as registration options.

to add providers when instantiating the application:

  ```js
  import { Application } from '@webantic/w.app'

  const providerManifest = {
    // key is the provider identifier, value is options for the
    // loader. `config` will be passed as the second argument to
    // the constructor of the provider on initialisation.
    ConsoleLogger: {initialise: false, config: {}}
  }

  const options = {
    // if the app core fails to register a provider, tell it to
    // resume processing others (instead of throwing)
    resumeOnError: true
  }

  const app = new Application('my-first-app', providerManifest, options)
  ```

to add providers later:

  ```js
  import { Application } from '@webantic/w.app'
  import ConsoleLogger from '@webantic/w.providers/ConsoleLogger'

  const app = new Application('my-first-app')

  // (identifier, constructor, registrationOptions)
  app.providers.register('ConsoleLogger', ConsoleLogger, {initialise: false, config: {namespace: 'module1'}})
  ```

### Getting providers

Unless `{initialise: true}` is passed during provider registration, the provider will only be instantiated when it is first requested with `.get()` or `.getNew()`. To get an instance, use one of these methods. The `.get()` method will return a cached instance, the `.getNew()` method will return a new instance (and allow you to specify a config override).

  ```js
  import { Application } from '@webantic/w.app'
  const app = new Application('my-first-app', {ConsoleLogger: {}})

  const logger = app.get('ConsoleLogger')
  logger.log('Hello, world!')

  const otherLogger = app.getNew('ConsoleLogger')
  otherLogger.log('Hello again, world!')
  ```

## Using provider groups

There may be multiple providers for the same functionality. For example, a log provider which outputs messages to the console and a log provider which outputs messages to a file. By aliasing the provider name behind a group name, other providers can tolerate a change in one of their dependencies without needing to change their code. For example, a provider which needs to be able to log data can do the following:

  `const logger = app.get('logger')`

By depending on the "logger" group name, we can use any specialist provider (`ConsoleLogger` or `FileLogger`) at runtime and not have to change this provider's code. For more information, see [below](getting-providers-from-groups)

Most providers will specify what group they belong to, however you can override this by passing `{groupName: 'foo'}` as registration options.



### Registering providers inside provider groups

To register a provider inside a group, use the group name as the manifest keys. If you are registering later, specify the group name in the registration options.

  ```js
  import { Application } from '@webantic/w.app'

  const providerManifest = {
    // key is the group name. the value is a tuple - first element is the
    // provider identifier, second (optional) element is registration options
    logger: ['ConsoleLogger', {initialise: false, config: {}}]
  }

  const app = new Application('my-first-app', providerManifest)

  // or, later:
  app.providers.register('ConsoleLogger', ConsoleLogger, {groupName: 'logger', config: {}})
  ```

After the last example, the provider manifest will contain one group called "logger" which contains one provider called "ConsoleLogger".



### <a name="getting-providers-from-groups">Getting providers from groups</a>

To retrieve a provider from a provider group, pass the group name and provider name to the `.get()` method. If you did not specify a group name (and the provider did not have one configured), the group name can be omitted and the default group will be searched:

  ```js
  app.providers.get('ConsoleLogger', 'logger')
  // or:
  app.providers.get('ConsoleLogger' /* "default" */)
  ```

The above approaches require you to know the specific provider which has been loaded. Obviously this is not always possible from within other providers. The `.find()` method will search the provider store for the referenced provider:

  ```js
  // look for a group called "logger" and get the first provider which is found:
  app.providers.find('logger')
  ```

If a group called "logger" cannot be found, the `.find()` method will search **all** groups for a provider with the matching name. For example:

  ```js
  import { Application } from '@webantic/w.app'
  const app = new Application('my-first-app', {
    fooGroup: [
      ['ProviderA' /* {initialise: false, config: {}} */],
      ['ProviderB' /* {initialise: false, config: {}} */]
    ]
  })

  // first look for a group called "ProviderA", then look in all groups for a Provider called "ProviderA"
  app.providers.find('ProviderA') // returns ProviderA
  // first look for a group called "ProviderB", then look in all groups for a Provider called "ProviderB"
  app.providers.find('ProviderB') // returns ProviderB
  
  // first look for a group called "fooGroup", then look in all groups for a Provider called "fooGroup"
  // NOTE: this time, a matching group will be found, so the first Provider in that group will be returned
  app.providers.find('fooGroup') // returns ProviderA
  ```

### Using the alias

  `app.get()` is an alias of `app.providers.find()`
