const db = require('../dbConfig');

/**
 * get all parking lots from lots table
 * @returns {Promise<void>}
 */
async function get (){
    const rows = await db('lots')
        .select('*');
    return rows;
}


module.exports={ get };
