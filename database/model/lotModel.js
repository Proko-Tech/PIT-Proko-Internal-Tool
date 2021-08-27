const db = require('../dbConfig');
const moment = require('moment');

/**
 * get all parking lots from lots table
 * , formatting the creation date/time to date
 * @returns {Promise<void>}
 */
async function get() {
    try {
        let lotRows = await db('lots')
            .select('*');
        lotRows = await lotRows.map((row, index) => {
            row.created_at = moment(row.created_at).format('MM-DD-YYYY');
            row.updated_at = moment(row.updated_at).format('MM-DD-YYYY');
            return row;
        });
        return lotRows;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * insert parking lot using the information given to us
 * @param parking_lot_info
 */
async function insert(parking_lot_info) {
    try {
        await db('lots')
            .insert(parking_lot_info)
    } catch (err) {
        console.log(err);
    }
}

async function getMax() {
    try {
        let maxQuery = await db('lots')
            .max('id as maxID')
            .first()
        return maxQuery.maxID;
    }
    catch (err) {
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
        await db('lots')
            .where({ id })
            .update(changes);
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
            .where({ admin_id })
            .select('*');
        return lots;
    } catch (err) {
        return { err };
    }
}

module.exports = { get, insert, update, getByAdminId, getMax };
