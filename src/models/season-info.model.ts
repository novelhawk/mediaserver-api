import {model, Model, property} from '@loopback/repository';
import {Anime, Season} from '.';

@model()
export class SeasonInfo extends Model {
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

  constructor(data?: Partial<SeasonInfo>) {
    super(data);
  }
}
