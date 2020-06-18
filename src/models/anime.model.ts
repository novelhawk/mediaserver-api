import {Entity, model, property} from '@loopback/repository';
import {Season} from '.';

@model({
  settings: {
    mongodb: {collection: 'anime'},
  },
})
export class Anime extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  shortName: string;

  @property({
    type: 'string',
    required: true,
  })
  displayName: string;

  @property({
    type: 'string',
  })
  coverResourceUrl?: string;

  @property.array(Season, {
    type: 'array',
    itemType: 'object',
    required: true,
  })
  seasons: Season[];

  constructor(data?: Partial<Anime>) {
    super(data);
  }
}
