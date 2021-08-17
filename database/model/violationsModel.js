const db = require('../dbConfig');


 * get lot, spot, and violation info using reservation_id
 * @param reservation_id
 * @returns lot, spot, and violation info
 */

 * get lot, customer, and reservation info using id
 * @param id
 * @returns lot, customer, and reservation info
 */
 async function get (id) {
    try {
        const rows = await db('violations')
            .join('lots', 'violations.lot_id', 'lots.id')
            .join('reservations', 'violations.reservation_id', 'reservations.id')
            .join('users', 'violations.user_id', 'users.id')
            .where({ id })

            .select('*');
        return rows;
    } catch (err) {
        return { err };
    }
module.exports={ get };