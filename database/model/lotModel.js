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
async function insert_lots(park_lot_info){

    const rows = await db('lots').insert(park_lot_info);
    return rows;


}
module.exports={ getAll };
