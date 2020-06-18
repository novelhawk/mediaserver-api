import {
  ensurePromise,
  EntityNotFoundError,
  repository,
} from '@loopback/repository';
import {get, getModelSchemaRef, HttpErrors, param} from '@loopback/rest';
import {Anime, Season, SeasonInfo} from '../models';
import {AnimeRepository} from '../repositories';

export class SeasonsController {
  constructor(
    @repository(AnimeRepository)
    public animeRepository: AnimeRepository,
  ) {}

  @get('/anime/{shortName}/season', {
    responses: {
      200: {
        description: 'Array of Season model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Season),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('shortName') shortName: string,
  ): Promise<Season[]> {
    const anime = await ensurePromise(
      this.animeRepository.findOne({
        where: {shortName},
        fields: {seasons: true},
      }),
    );
    if (!anime) {
      throw new EntityNotFoundError(Anime, shortName);
    }
    return anime.seasons;
  }

  @get('/anime/{shortName}/season/{seasonNumber}', {
    responses: {
      200: {
        description: 'Season model instance',
        content: {'application/json': {schema: getModelSchemaRef(SeasonInfo)}},
      },
    },
  })
  async findByNumber(
    @param.path.string('shortName') shortName: string,
    @param.path.integer('seasonNumber') seasonNumber: number,
  ): Promise<SeasonInfo> {
    const anime = await ensurePromise(
      this.animeRepository.findOne({where: {shortName}}),
    );
    if (!anime) {
      throw new EntityNotFoundError(Anime, shortName);
    }
    const season = anime.seasons.find(s => {
      return s.number === seasonNumber;
    });
    if (!season) {
      throw new HttpErrors.NotFound('Season not found');
    }
    delete anime.seasons;
    return new SeasonInfo({anime, season});
  }
}
