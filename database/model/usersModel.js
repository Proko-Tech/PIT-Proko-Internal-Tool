const db = require('../dbConfig');

/**
 * Get all of the users.
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, ArrayIfAlready<TResult, DeferredKeySelection<TRecord, string>>>>}
 */
async function get() {
    const result = await db('users')
        .select('*');
    return result;
}

/**
 * Get users created greater than a start date.
 * @param startDate
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, ArrayIfAlready<TResult, DeferredKeySelection<TRecord, string>>>>}
 */
async function getByGreaterThanCreatedAt(startDate) {
    const result = await db('users')
        .where('created_at', '>=', startDate)
        .select('*');
    return result;
}

module.exports={get, getByGreaterThanCreatedAt}
