const db = require('../dbConfig');
const moment = require('moment');
const knex = require('knex');

/**
 * get basic info on lots that use sensor firmware
 * @returns lot, customer, date created, date updated
 */
async function get() {
    try {
        // Groups list of parking lots by name
        let firmware_rows = await db('lots')
            .join('lot_ownerships', 'lots.id', 'lot_ownerships.lot_id')
            .join('admin_accounts', 'lot_ownerships.admin_id', 'admin_accounts.id')
            .join('users', 'admin_accounts.admin_email', 'users.email')
            .whereIn('lots.id', db('lots').max('lots.id').groupBy('name'))
            .select('*');

        // Counts up spots associated with each lot id
        let num_spots = await db('spots')
            .count('* as num_spots')
            .groupBy('spots.lot_id'); 
        
        firmware_rows = await firmware_rows.map((row, index) => {
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

            // Adds num_spots: value to each row data
            if (num_spots[row.lot_id] == null) {
                row['num_spots'] = 0;
            } else {
                row['num_spots'] = num_spots[row.lot_id].num_spots;
            }
            return row
        });
        return firmware_rows;
    } catch (err) {
        return { err };
    }
}

module.exports = { get }