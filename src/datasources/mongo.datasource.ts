import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'Mongo',
  connector: 'mongodb',
  host: '127.0.0.1',
  url: '',
  port: 27017,
  user: 'anime',
  password: '',
  database: 'mediaserver',
  useNewUrlParser: true,
};

if (!process.env.MONGO_PWD)
  throw new Error('Missing mongodb password in environment variables.');
config.password = process.env.MONGO_PWD;

config.url =
  `${config.connector}://${config.user}:${config.password}` +
  `@${config.host}:${config.port}/${config.database}`;

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongoDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'Mongo';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Mongo', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
