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

/**
 * insert parking lot using the information given to us
 * @returns {Promise<void>}
 */
async function insert (parking_lot_info){
    try {
        await db('lots')
            .insert('*');
   } catch (err) {
        console.log(err);
   }
}
module.exports={ get, insert };
