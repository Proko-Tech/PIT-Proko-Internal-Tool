const db = require('../dbConfig');
const moment = require('moment');
/**
 * get all complaints from complaints table with formatted dates
 * @returns {Promise<void>}
 */
async function get () {
    let rows = await db('complaints')
        .where({ internal_site: 'VISIBLE' })
        .select('*');
    rows = await rows.map((row) => {
        row.created_at = moment(row.Start_Week).format('MM-DD-YYYY');
        row.updated_at = moment(row.End_Week).format('MM-DD-YYYY');
        return row;
    });
    return rows;
}

/**
 * get all complaints from complaints table with formatted dates
 * @param id
 * @returns {Promise<void>}
 */
async function getById (id) {
    let rows = await db('complaints')
        .select('*');
    rows = await rows.map((row) => {
        row.created_at = moment(row.Start_Week).format('MM-DD-YYYY');
        row.updated_at = moment(row.End_Week).format('MM-DD-YYYY');
        return row;
    });
    return rows;
}

module.exports = { get, getById };
