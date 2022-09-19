const db = require('../dbConfig');
const moment = require('moment');

/**
 *  Get all defects from defects table with formatted dates
 *  @returns {Promise<void>}
 */
async function get() {
    const result = await db('defects')
        .join('lots', 'defects.lot_id', 'lots.id')
        .join('admin_accounts', 'defects.admin_id', 'admin_accounts.id')
        .select('*', 'defects.created_at')
        .orderBy('defects.created_at', 'desc');
    return result;
}

/**
 * Get defect by secret hash
 * @param secret_hash
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, ArrayIfAlready<TResult, DeferredKeySelection.Augment<UnwrapArrayMember<TResult>, Knex.ResolveTableType<TRecord>, IncompatibleToAlt<ArrayMember<[string, string]>, string, never>, Knex.IntersectAliases<[string, string]>>>>>}
 */
async function getBySecretHash(secret_hash) {
    const result = await db('defects')
        .join('lots', 'defects.lot_id', 'lots.id')
        .join('admin_accounts', 'defects.admin_id', 'admin_accounts.id')
        .where({secret_hash})
        .select('*', 'defects.created_at');
    return result;
}

/**
 * Update by secret hash.
 * @param secret_hash
 * @param payload
 * @returns {Promise<void>}
 */
async function updateBySecretHash(secret_hash, payload) {
    await db('defects')
        .update(payload)
        .where({secret_hash});
}

module.exports = {get, getBySecretHash, updateBySecretHash};
