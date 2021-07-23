const db = require('../dbConfig');

/**
 * create spots in the spots table
 * @param lot_id
 */
async function create(lot_id){
    try {
        await db('spots')
            .insert([{lot_id : lot_id}]);
    } catch (err) {
        console.log(err);
    }
}
module.exports = {create};

