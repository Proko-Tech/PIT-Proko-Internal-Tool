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

module.exports={ getJoinSpots }
