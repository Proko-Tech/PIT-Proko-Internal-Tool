const db = require('../dbConfig');

/**
 * Get by valid user id.
 * @returns {Promise<void>}
 */
async function getByValidUserId() {
    const result = await db('reservations')
        .where('user_id', '!=', -1)
        .select('*');
    return result;
}

/**
 * Get users created greater than a start date.
 * @param startDate
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, ArrayIfAlready<TResult, DeferredKeySelection<TRecord, string>>>>}
 */
async function getByGreaterThanCreatedAtAndValidUserId(startDate) {
    const result = await db('reservations')
        .where('created_at', '>=', startDate)
        .andWhere('user_id', '!=', -1)
        .select('*');
    return result;
}

/**
 * Getby greater than start date and valid user id and paid.
 * @param startDate
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, ArrayIfAlready<TResult, DeferredKeySelection<TRecord, string>>>>}
 */
async function getByGreaterThanCreatedAtAndValidUserIdAndPaid(startDate) {
    const result = await db('reservations')
        .where('created_at', '>=', startDate)
        .andWhere('user_id', '!=', -1)
        .andWhere('is_paid', 1)
        .select('*');
    return result;
}

module.exports={
    getByValidUserId,
    getByGreaterThanCreatedAtAndValidUserId,
    getByGreaterThanCreatedAtAndValidUserIdAndPaid,
}
