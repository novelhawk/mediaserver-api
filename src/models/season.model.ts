import {Model, model, property} from '@loopback/repository';
import {Episode} from './episode.model';

@model()
export class Season extends Model {
  @property({
    type: 'number',
    required: true,
  })
  number: number;

  @property({
    type: 'string',
    required: true,
  })
  displayName: string;

  @property({
    type: 'string',
    required: true,
  })
  fullName: string;

  @property({
    type: 'string',
    required: true,
  })
  englishName: string;

  @property({
    type: 'string',
  })
  coverResourceUrl?: string;

  @property({
    type: 'number',
    required: true,
  })
  episodeCount: number;

  @property.array(Episode, {
    type: 'array',
    itemType: 'object',
    required: true,
  })
  episodes: Episode[];

  constructor(data?: Partial<Season>) {
    super(data);
  }
}

export interface SeasonRelations {
  // describe navigational properties here
}

export type SeasonWithRelations = Season & SeasonRelations;
