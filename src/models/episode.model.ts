import {Model, model, property} from '@loopback/repository';

@model()
export class Episode extends Model {
  @property({
    type: 'number',
    required: true,
  })
  number: number;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  displayName: string;

  @property({
    type: 'boolean',
    required: true,
  })
  available: boolean;

  @property({
    type: 'string',
    required: false,
  })
  resourceUrl?: string;

  constructor(data?: Partial<Episode>) {
    super(data);
  }
}

export interface EpisodeRelations {
  // describe navigational properties here
}

export type EpisodeWithRelations = Episode & EpisodeRelations;
