const db = require('../dbConfig');

/**
 * list all prediction results.
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, ArrayIfAlready<TResult, DeferredKeySelection<TRecord, string>>>>}
 */
async function getJoinSpots () {
    const result = await db('prediction_results')
        .join('spots', 'prediction_results.spot_secret', 'spots.secret')
        .select('*');
    return result;
}

/**
 * get prediction with spot information by prediction_id.
 * @param id
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
async function getJoinSpotsById (id) {
    const result = await db('prediction_results')
        .join('spots', 'prediction_results.spot_secret', 'spots.secret')
        .select('*')
        .where('prediction_results.id', id);
    return result;
}

/**
 * update predictions by id.
 * @param id
 * @param update_body
 * @returns {Promise<{status: string}>}
 */
async function updateById (id, update_body) {
    try {
        await db('prediction_results')
            .update(update_body)
            .where({ id });
        return { status: 'success' };
    } catch (err) {
        return { status: 'failed', payload: err };
    }
}

module.exports={ getJoinSpots, getJoinSpotsById, updateById }
