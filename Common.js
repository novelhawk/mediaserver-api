import { AnimeDataFile, AnimeDirectory, AnimeProxyServer } from './Configuration';
import { openSync, readFileSync, readdirSync, existsSync } from 'fs';
import { join as pathjoin } from 'path';
import urljoin from 'url-join';

/**
 * Gets the path to the file containing information about the requested anime.
 * @param {string} anime The ID of the requested anime
 * @returns {string} Path to the anime informations file
 */
function getAnimeInfoFile(anime) {
    return pathjoin(AnimeDirectory, anime, AnimeDataFile)
}

/**
 * Reads anime file and extracts anime informations.
 * @param {string} anime The ID of the requested anime
 * @returns {{ data?, statusCode?, error? }} An object containing the json 
 * parsed anime file or 'error' and 'statusCode' if an error encountered
 */
export function getAnimeInfo(anime) {
    let fd;
    try {
        fd = openSync(getAnimeInfoFile(anime), 'r');
    } catch (err) {
        // File does not exist
        return {
            statusCode: 400,
            error: "Requested anime does not exist"
        };
    }

    let content = readFileSync(fd, { encoding: 'utf-8' });
    try {
        return {
            data: JSON.parse(content)
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            error: "Internal server error: Invalid json syntax"
        };
    }
}

/**
 * Gets a list of anime directories
 * @returns {string[]} The list of all available anime directory names 
 */
export function getAnimeDirectories() {
    return readdirSync(AnimeDirectory, { withFileTypes: true })
        .filter(dirent => {
            return dirent.isDirectory() && 
                existsSync(getAnimeInfoFile(dirent.name));
        })
        .map(dirent => { 
            return dirent.name;
        });
}

/**
 * Gets the URL of the episode resource 
 * @param {string} animeId The ID of the anime that contains the episode
 * @param {string} seasonFolder The season folder that contains the episode
 * @param {string} episodeFile The name of the episode file
 * @returns {string} Remote accessible URL of the episode resouce
 */
export function getMediaUrl(animeId, seasonFolder, episodeFile) {
    return urljoin(
        AnimeProxyServer, 
        animeId, 
        seasonFolder, 
        episodeFile);
}