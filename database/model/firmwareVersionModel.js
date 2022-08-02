const db = require('../dbConfig');
const moment = require('moment');
const {default: knex} = require('knex');

/**
 * list all firmware versions
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, ArrayIfAlready<TResult, DeferredKeySelection<TRecord, string>>>>}
 */
async function get() {
    const data = await db('firmware_versions').select('*');
    return data;
}

/**
 * list all firmware versions along with the number of spot with that version
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
async function getWithNumSpots() {
    const data = await db
        .count('spots.id as num_spots')
        .select('firmware_versions.*')
        .from('firmware_versions')
        .leftJoin(
            'spots',
            'firmware_versions.version',
            'spots.available_firmware_version',
        )
        .groupBy('firmware_versions.version');

    return data;
}

/**
 * Insert a new version
 * @param {Object} data
 */
async function insert(data) {
    const result = await db('firmware_versions').insert(data);
    return result;
}

/**
 * Get specific firmware version
 * @param {string} version
 */
async function getByVersion(version) {
    const data = await db('firmware_versions')
        .select('*')
        .where('version', version);
    return data;
}

/**
 * Delete a version
 * @param {string} version
 */
async function deleteByVersion(version) {
    const result = await db('firmware_versions')
        .where('version', version)
        .delete();
    return result;
}

module.exports = {
    get,
    getWithNumSpots,
    insert,
    getByVersion,
    deleteByVersion,
};
