const db = require('../dbConfig');

/**
 * insert spot hash using the information given to us
 * @param hash_id
 */
 async function insert (hash_id){
    try {
        await db('spots')
            .insert(hash_id);
    } catch (err) {
        console.log(err);
    }
}

module.exports = { insert };