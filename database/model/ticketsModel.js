const db = require('../dbConfig');
const moment = require('moment');

/**
 * GET lot, spot, customer, date, and status using id
 * @param id
 * @returns lot, spot, customer, date, and status
 */
async function get(id) {
    try {
        let ticket_rows = await db('lot_ownerships')
            .join('spots', 'lot_ownerships.lot_id', 'spots.lot_id')
            .join('lots', 'lot_ownerships.lot_id', 'lots.id')
            .join(
                'admin_accounts',
                'lot_ownerships.admin_id',
                'admin_accounts.id',
            )
            .join('users', 'admin_accounts.admin_email', 'users.email')
            .select('*');
        ticket_rows = await ticket_rows.map((row, index) => {
            const created = moment(row.created_at);
            const updated = moment(row.updated_at);
            var days_ago_int = updated.diff(created, 'days');
            var days_ago_str = '';
            if (days_ago_int == 1) {
                days_ago_str = '1 day';
            } else {
                days_ago_str = days_ago_int + ' days';
            }
            row.created_at = [created.format('ll'), created.format('LT')];
            row.updated_at = [updated.format('DD-MM-YYYY'), days_ago_str];
            return row;
        });
        return ticket_rows;
    } catch (err) {
        return {err};
    }
}

module.exports = {get};
