const db = require('../dbConfig');

/**
 * get all parking lots from lots table
 * @returns {Promise<void>}
 */
async function select_lots (){
    const rows = await db('lots')
        .select('*');
    return rows;
}

module.exports={ select_lots };
