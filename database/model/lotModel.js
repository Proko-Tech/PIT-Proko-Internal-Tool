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
 * @param parking_lot_info
 */
async function insert (parking_lot_info){
    try {
        await db('lots')
            .insert(parking_lot_info);
   } catch (err) {
        console.log(err);
   }
}
/**
 *  get parking lot using the admin id
 *  @return parking lot information
 */
async function getByID(id){
    try{
        const  lot = await  db('lots')
            .where({id})
            .select('*');
        return lot;
    } catch (err){
        return {err};
    }
}

module.exports={ get, insert, getByID };
