import {
  ensurePromise,
  EntityNotFoundError,
  repository,
} from '@loopback/repository';
import {get, getModelSchemaRef, HttpErrors, param} from '@loopback/rest';
import {Anime, Episode, EpisodeInfo} from '../models';
import {AnimeRepository} from '../repositories';

export class EpisodesController {
  constructor(
    @repository(AnimeRepository)
    public animeRepository: AnimeRepository,
  ) {}

  @get('/anime/{shortName}/season/{seasonNumber}/episode', {
    responses: {
      200: {
        description: 'Array of Episode model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Episode),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('shortName') shortName: string,
    @param.path.integer('seasonNumber') seasonNumber: number,
  ): Promise<Episode[]> {
    const anime = await ensurePromise(
      this.animeRepository.findOne({
        where: {shortName},
        fields: {seasons: true},
      }),
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
    return season.episodes;
  }

  @get('/anime/{shortName}/season/{seasonNumber}/episode/{episodeNumber}', {
    responses: {
      200: {
        description: 'Episode model instance',
        content: {'application/json': {schema: getModelSchemaRef(EpisodeInfo)}},
      },
    },
  })
  async findByNumber(
    @param.path.string('shortName') shortName: string,
    @param.path.integer('seasonNumber') seasonNumber: number,
    @param.path.integer('episodeNumber') episodeNumber: number,
  ): Promise<EpisodeInfo> {
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
    const episode = season.episodes.find(e => {
      return e.number === episodeNumber;
    });
    if (!episode) {
      throw new HttpErrors.NotFound('Episode not found');
    }
    delete anime.seasons;
    delete season.episodes;
    return new EpisodeInfo({anime, season, episode});
  }
}
