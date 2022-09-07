const db = require('../dbConfig');

/**
 * list all prediction results.
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, ArrayIfAlready<TResult, DeferredKeySelection<TRecord, string>>>>}
 */
async function getJoinSpots() {
    const result = await db('prediction_results')
        .join('spots', 'prediction_results.spot_secret', 'spots.secret')
        .select(
            '*',
            'prediction_results.id as prediction_result_id',
            'prediction_results.created_at as created_at',
            'spots.created_at as spot_created_at',
        )
        .orderBy('prediction_results.created_at', 'desc');
    return result;
}

/**
 * get prediction with spot information by prediction_id.
 * @param id
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
async function getJoinSpotsById(id) {
    const result = await db('prediction_results')
        .join('spots', 'prediction_results.spot_secret', 'spots.secret')
        .select(
            '*',
            'prediction_results.id as prediction_results_id',
            'prediction_results.created_at as created_at',
            'spots.created_at as spot_created_at',
        )
        .where('prediction_results.id', id)
        .orderBy('prediction_results.created_at', 'desc');
    return result;
}

/**
 * get all predictions greater than id.
 * @param id
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
async function getByIdGreaterThan(id) {
    const result = await db('prediction_results')
        .select('*')
        .where('id', '>', id);
    return result;
}

/**
 * update predictions by id.
 * @param id
 * @param update_body
 * @returns {Promise<{status: string}>}
 */
async function updateById(id, update_body) {
    try {
        await db('prediction_results').update(update_body).where({id});
        return {status: 'success'};
    } catch (err) {
        return {status: 'failed', payload: err};
    }
}

module.exports = {
    getJoinSpots,
    getJoinSpotsById,
    updateById,
    getByIdGreaterThan,
};
