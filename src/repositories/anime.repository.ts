import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Anime} from '../models';

export class AnimeRepository extends DefaultCrudRepository<
  Anime,
  typeof Anime.prototype.id
> {
  constructor(@inject('datasources.Mongo') dataSource: MongoDataSource) {
    super(Anime, dataSource);
  }
}
