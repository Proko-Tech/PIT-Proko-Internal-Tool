const db = require('../dbConfig');

/**
 * create spots in the spots table
 * @param spot_info
 */
async function create(spot_info){
    try {
        await db('spots')
            .insert(spot_info);
    } catch (err) {
        console.log(err);
    }
}
module.exports = {create};

