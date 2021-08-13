const db = require('../dbConfig');

/**
 * get lot, spot, and violation info using reservation_id
 * @param reservation_id
 * @returns lot, spot, and violation info
 */
async function get(reservation_id) {
    try {
        const rows = await db('violation')
            .join('spots', 'spots.secret', 'violation.spot_hash')
            .join('lots','lots.id','violation.lot_id')
            .where({reservation_id})
            .select('*');
        return rows;
    } catch (err) {
        return { err };
    }
}

module.exports={ get };
