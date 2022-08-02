const db = require('../dbConfig');

/**
 * get lot, customer, and reservation info using id
 * @param id
 * @returns lot, customer, and reservation info
 */
async function get(id) {
    try {
        const rows = await db('violations')
            .join('lots', 'violations.lot_id', 'lots.id')
            .join(
                'reservations',
                'violations.reservation_id',
                'reservations.id',
            )
            .join('users', 'violations.user_id', 'users.id')
            .where('violations.id', '=', id)
            .select('*');
        return rows;
    } catch (err) {
        return {err};
    }
}
/**
 * get spot number, serial code, address and update info using id
 * @param id
 * @returns spot number, serial code, address and update info
 */
async function ticket_detail_get(id) {
    try {
        const rows = await db('violations')
            .join('lots', 'violations.lot_id', 'lots.id')
            .join('spots', 'violations.spot_hash', 'spots.secret')
            .where('violations.id', '=', id)
            .select('*');
        return rows;
    } catch (err) {
        return {err};
    }
}

module.exports = {get, ticket_detail_get};
