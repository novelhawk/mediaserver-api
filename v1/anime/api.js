import { getAnimeDirectories, getAnimeInfo, getMediaUrl } from '../../Common';
import format from 'string-format';

// GET: /v1/anime/list
export function list(req, res, next) {
    let json = {
        successful: true,
        data: {
            animes: []
        }
    };

    json.data.animes = getAnimeDirectories().map(dir => {
        return { id: dir }
    });

    // Add generic information about the animes
    let part = req.query.part;
    if (part === 'animeGeneric') {
        for (let i in json.data.animes) {
            let { 
                data,
                error,
                statusCode
            } = getAnimeInfo(json.data.animes[i].id);

            if (error) {
                return res.status(statusCode).json({
                    successful: false,
                    error: error
                });
            }

            json.data.animes[i] = { 
                ...json.data.animes[i], 
                ...data.generic
            };
        }
    }
    
    res.json(json);
}

// GET: /v1/anime/:anime
export function anime(req, res, next) {
    let animeId = req.params.anime;

    let { data, error, statusCode } = getAnimeInfo(animeId);

    if (error) {
        return res.status(statusCode).json({
            successful: false,
            error: error
        });
    }

    let seasons = data.seasons.map(season => {
        return { 
            ...season.generic,

            // Allow references to other fields in display name
            displayName: format(
                season.generic.displayName,
                season.generic),
                
            // Add available episodes count
            availableEpisodes: season.episodes
                .filter(ep => ep.available === true)
                .length
        }
    });

    let output = { 
        ...data.generic, 
        seasons
    };

    res.json({
        successful: true,
        data: output
    });
}

// GET: /v1/anime/:anime/:season
export function season(req, res, next) {
    let animeId = req.params.anime;
    let seasonId = req.params.season;

    let { data, error, statusCode } = getAnimeInfo(animeId);

    if (error) {
        return res.status(statusCode).json({
            successful: false,
            error: error
        });
    }

    if (seasonId < 1 || seasonId > data.seasons.length) {
        return res.status(400).json({
            successful: false,
            error: "Requested season does not exist"
        });
    }

    let seasonInfo = data.seasons[seasonId - 1];

    let episodes = seasonInfo.episodes.map(episode => {
        return { 
            ...episode,

            // Allow references to other fields in display name
            displayName: format(
                episode.displayName,
                episode),
        }
    });

    res.json({ 
        successful: true,
        data: {
            ...seasonInfo.generic,

            // Allow references to other fields in display name
            displayName: format(
                seasonInfo.generic.displayName, seasonInfo.generic),

            // Add available episodes count
            availableEpisodes: seasonInfo.episodes
                .filter(ep => ep.available === true)
                .length,

            trackers: seasonInfo.trackers,

            episodes
        }
    });
}

// GET: /v1/anime/:anime/:season/:episode
export function episode(req, res, next) {
    let animeId = req.params.anime;
    let seasonId = req.params.season;
    let episodeId = req.params.episode;

    // Get anime info
    let { data, error, statusCode } = getAnimeInfo(animeId);

    if (error) {
        return res.status(statusCode).json({
            successful: false,
            error: error
        });
    }
    
    // Get season info
    if (seasonId > data.seasons.length) {
        return res.status(400).json({
            successful: false,
            error: "Requested season does not exist"
        });
    }

    let seasonInfo = data.seasons[seasonId - 1];

    // Get episode info
    let episodeInfo = seasonInfo.episodes.find(episode => {
        return episode.id === episodeId;
    });

    if (!episodeInfo) {
        res.status(400).json({ 
            successful: false,
            error: "Requested episode does not exist"
        });
        return;
    }

    let url = getMediaUrl(
        animeId, 
        seasonInfo.generic.folder,
        episodeInfo.file);

    res.json({
        successful: true,
        data: {
            ...episodeInfo,
            displayName: format(episodeInfo.displayName, episodeInfo),
            mediaUrl: url
        }
    });
}
