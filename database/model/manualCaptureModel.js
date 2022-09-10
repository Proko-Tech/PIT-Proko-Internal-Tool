const db = require('../dbConfig');
const moment = require('moment');

/**
 * get all manually capture images from lots table
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
async function getBySpotHash(spot_secret) {
    try {
        const allRows = await db('manually_captured_images').where({spot_secret}).select('*');
        return allRows;
    } catch (err) {
        console.log(err);
    }
}

/**
 * delete manually captured image by id
 * @param id - the id of the image to be deleted
 * @returns
 */
async function deleteById(id) {
    try {
        const delete_stat = await db('manually_captured_images').where({id}).del();
        return delete_stat;
    } catch (err) {
        console.log(err);
    }
}

/**
 * get manually captured image by id
 * @param id - number
 */
async function getById(id) {
    try {
        const spotCaptureData = await db('manually_captured_images').where({id}).select('*');
        return spotCaptureData;
    } catch (err) {
        console.log(err);
    }
}
module.exports = {getBySpotHash, deleteById, getById};