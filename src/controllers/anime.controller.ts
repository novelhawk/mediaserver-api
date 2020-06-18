import {
  Count,
  CountSchema,
  ensurePromise,
  EntityNotFoundError,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Anime} from '../models';
import {AnimeRepository} from '../repositories';

export class AnimeController {
  constructor(
    @repository(AnimeRepository)
    public animeRepository: AnimeRepository,
  ) {}

  @get('/anime', {
    responses: {
      200: {
        description: 'Array of Anime model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Anime),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Anime) filter?: Filter<Anime>): Promise<Anime[]> {
    return this.animeRepository.find(filter);
  }

  @get('/anime/count', {
    responses: {
      '200': {
        description: 'Anime model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Anime) where?: Where<Anime>): Promise<Count> {
    return this.animeRepository.count(where);
  }

  @get('/anime/{shortName}', {
    responses: {
      200: {
        description: 'Anime model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Anime)},
        },
      },
    },
  })
  async findByShortName(
    @param.path.string('shortName') shortName: string,
    @param.filter(Anime, {exclude: 'where'})
    filter?: FilterExcludingWhere<Anime>,
  ): Promise<Anime> {
    const anime = await ensurePromise(
      this.animeRepository.findOne({where: {shortName}, ...filter}),
    );
    if (!anime) {
      throw new EntityNotFoundError(Anime, shortName);
    }
    return anime;
  }
}
