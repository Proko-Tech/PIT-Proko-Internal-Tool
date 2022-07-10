const db = require('../dbConfig');
const moment = require('moment');
const { default: knex } = require('knex');

/**
 * get spots by ids.
 * @param ids
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, ArrayIfAlready<TResult, DeferredKeySelection<TRecord, string>>>>}
 */
async function get () {
    const data = await db('firmware_version')
        .select('*');
    return data;
}

async function getWithNumSpots (){
    const data = await db.count('spots.id as num_spots').select('firmware_version.*')
        .from('firmware_version')
        .leftJoin('spots', 'firmware_version.version', 'spots.available_firmware_version')
        .groupBy('firmware_version.version');

    return data;
}

async function getByVersion (version) {
    const data = await db('firmware_version')
        .select('*')
        .where('version', version);
    return data;
}

// check this primary key exists
async function exists (version) {
    const data = await db('firmware_version')
        .select('*')
        .where('version', version);
    return data.length > 0;
}

async function insert (data) {
    const result = await db('firmware_version')
        .insert(data);
    return result;
}

async function deleteByVersion (version) {
    const result = await db('firmware_version')
        .where('version', version)
        .delete();
    return result;
}

module.exports = {
    get, insert, getByVersion, deleteByVersion, exists, getWithNumSpots
};
