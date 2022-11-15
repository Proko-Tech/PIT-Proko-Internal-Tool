const db = require('../dbConfig');
const moment = require('moment');

/**
 * get all parking lots from lots table
 * , formatting the creation date/time to date
 * @returns {Promise<void>}
 */
async function get() {
    try {
        let lotRows = await db('lots').select('*');
        lotRows = await lotRows.map((row, index) => {
            row.created_at = moment(row.created_at).format('MM-DD-YYYY');
            row.updated_at = moment(row.updated_at).format('MM-DD-YYYY');
            return row;
        });
        return lotRows;
    } catch (err) {
        console.log(err);
    }
}

/**
 * insert parking lot using the information given to us
 * @param parking_lot_info
 */
async function insert(parking_lot_info) {
    try {
        await db('lots').insert(parking_lot_info);
    } catch (err) {
        console.log(err);
    }
}

/**
 * Get the row with the max id.
 * @returns {Promise<*>}
 */
async function getMax() {
    try {
        const maxQuery = await db('lots').max('id as maxID').first();
        return maxQuery.maxID;
    } catch (err) {
        console.log(err);
    }
}

/**
 * update parking lot using the information given to us
 * @param id
 * @param changes
 */
async function update(id, changes) {
    try {
        await db('lots').where({id}).update(changes);
    } catch (err) {
        console.log(err);
    }
}

/**
 *  get parking lot using the admin id
 *  @param Admin ID
 *  @return parking lot information
 */
async function getByAdminId(admin_id) {
    try {
        const lots = await db('lot_ownerships')
            .join('lots', 'lot_ownerships.lot_id', 'lots.id')
            .where({admin_id})
            .select('*');
        return lots;
    } catch (err) {
        return {err};
    }
}

/**
 * insert lot with spots, and establish lot ownership with transactions.
 * @param parking_lot_info
 * @param spots_info
 * @param admin_id
 * @returns {Promise<{insertResult: string}>}
 */
async function insertWithSpotsAndOwnership(
    parking_lot_info,
    spots_info,
    admin_id,
) {
    const result = {insertResult: 'failed'};
    await db.transaction(async (transaction) => {
        try {
            const id = await db('lots')
                .insert(parking_lot_info)
                .transacting(transaction)
                .returning('id');
            spots_info.map((spot_info) => (spot_info.lot_id = id));
            await db('spots').insert(spots_info).transacting(transaction);
            await db('lot_ownerships')
                .insert({lot_id: id, admin_id})
                .transacting(transaction);
            result.insertResult = 'success';
            await transaction.commit();
        } catch (err) {
            console.log(err);
            result.insertResult = 'failed';
            await transaction.rollback();
        }
    });
    return result;
}

/**
 * Get lots created greater than a start date.
 * @param startDate
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, ArrayIfAlready<TResult, DeferredKeySelection<TRecord, string>>>>}
 */
async function getByGreaterThanCreatedAt(startDate) {
    const result = await db('lots')
        .where('created_at', '>=', startDate)
        .select('*');
    return result;
}

module.exports = {
    get,
    insert,
    update,
    getByAdminId,
    getMax,
    insertWithSpotsAndOwnership,
    getByGreaterThanCreatedAt,
};
