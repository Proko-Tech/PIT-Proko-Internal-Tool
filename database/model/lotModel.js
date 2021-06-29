const db = require('../dbConfig');

/**
 * get all parking lots from lots table
 * @returns {Promise<void>}
 */
async function getAll (){
    const rows = await db('lots')
        .select('*');
    return rows;
}

module.exports={ getAll };
