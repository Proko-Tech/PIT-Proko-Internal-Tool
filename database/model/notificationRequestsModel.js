const db = require('../dbConfig');

/**
 * Get all notification requests.
 * @returns {Promise<void>}
 */
async function get() {
    const result = await db('notification_requests')
        .select('*');
    return result;
}

/**
 * Get lots created greater than a start date.
 * @param startDate
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, ArrayIfAlready<TResult, DeferredKeySelection<TRecord, string>>>>}
 */
async function getByGreaterThanCreatedAt(startDate) {
    const result = await db('notification_requests')
        .where('created_at', '>=', startDate)
        .select('*');
    return result;
}

module.exports = {
    get,
    getByGreaterThanCreatedAt,
};
