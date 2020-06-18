import {model, Model, property} from '@loopback/repository';
import {Anime, Season} from '.';
import {Episode} from './episode.model';

@model()
export class EpisodeInfo extends Model {
  @property({
    type: 'object',
    required: true,
  })
  anime: Anime;

  @property({
    type: 'object',
    required: true,
  })
  season: Season;

  @property({
    type: 'object',
    required: true,
  })
  episode: Episode;

  constructor(data?: Partial<EpisodeInfo>) {
    super(data);
  }
}
