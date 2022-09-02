const db = require('../dbConfig');
const moment = require('moment');

/**
 * get all manual capture images from lots table
 * by the spot_hash
 * @returns 
 * [{
 * id: number,
 * spot_hash: string,
 * admin_id: number,
 * image_url: string,
 * created_at: string,
 * updated_at: string
 * }]
 */
async function getBySpotHash(spot_hash) {
    try {
        const allRows = await db('manual_captured_images').where({spot_hash}).select('*');
        return allRows;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {getBySpotHash}