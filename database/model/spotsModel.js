const db = require("../dbConfig");

/**
 * GET for the spots of a specific parking lot by lot_id
 * @param {string} lot_id
 * @returns {Promise<void>}
 **/
async function getByLotId (lot_id) {
    const spots = await db('spots')
        .where({ lot_id })
        .select('*');
    return spots;
}

/**
 * update spot info using the information given to us
 * @param {String[]} spot_hashes
 * @param {object} spot_info
 * @returns {Promise<{status: string, error: object}>}
 */
async function update (spot_hashes, spot_info) {
    const result = { status: 'failed', error: '' };
    await db.transaction(async (trx) => {
        try {
            for (let i = 0; i < spot_hashes.length; i++) {
                await db('spots')
                    .where({ secret: spot_hashes[i] })
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
async function create (spot_info) {
    await db('spots')
        .insert(spot_info);
}



module.exports = { create, update, getByLotId };
