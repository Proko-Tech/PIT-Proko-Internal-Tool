const db = require("../dbConfig");

/**
 * Get all spots.
 * @returns {Promise<void>}
 */
async function get() {
    const result = await db('spots')
        .select('*');
    return result;
}

/**
 * GET for the spots of a specific parking lot by lot_id
 * @param {string} lot_id
 * @returns {Promise<void>}
 **/
async function getByLotId(lot_id) {
    const spots = await db('spots')
        .where({lot_id})
        .select('*');
    return spots;
}

/**
 * update spot info using the information given to us
 * @param {String[]} spot_hashes
 * @param {object} spot_info
 * @returns {Promise<{status: string, error: object}>}
 */
async function update(spot_hashes, spot_info) {
    const result = {status: 'failed', error: ''};
    await db.transaction(async (trx) => {
        try {
            for (let i = 0; i < spot_hashes.length; i++) {
                await db('spots')
                    .where({secret: spot_hashes[i]})
                    .update(spot_info)
                    .transacting(trx);
            }
            await trx.commit();
            result.status = 'success';
        } catch (err) {
            await trx.rollback();
            result.error = err;
        }
    });
    return result;
}

/**
 * create spots in the spots table
 * @param {object} spot_info
 */
async function create(spot_info) {
    await db('spots')
        .insert(spot_info);
}

/**
 * Get spots created greater than a start date.
 * @param startDate
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, ArrayIfAlready<TResult, DeferredKeySelection<TRecord, string>>>>}
 */
async function getByGreaterThanCreatedAt(startDate) {
    const result = await db('spots')
        .where('created_at', '>=', startDate)
        .select('*');
    return result;
}

/**
 * update spot by lot id
 * @param lot_id 
 * @param updated_json 
 * @returns 
 */
async function updateByLotId(lot_id, updated_json) {
    const data = await db('spots').where({lot_id}).update(updated_json);
    return data;
}

module.exports = {
    create, get, update, getByLotId, getByGreaterThanCreatedAt, updateByLotId
};
