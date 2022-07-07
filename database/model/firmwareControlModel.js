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
        let firmware_rows = await db.count('spots.id as num_spots').select(['lots.name as name', 'lots.id as id', 'lots.created_at as created_at', 'lots.updated_at as updated_at', 'users.first_name as first_name', 'users.last_name as last_name'])
            .from('lots')
            .leftJoin('spots', 'lots.id', 'spots.lot_id')
            .leftJoin('lot_ownerships', 'lots.id', 'lot_ownerships.lot_id')
            .leftJoin('admin_accounts', 'lot_ownerships.admin_id', 'admin_accounts.id')
            .leftJoin('users', 'admin_accounts.admin_email', 'users.email').groupBy('lots.id')

        
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

            return row
        });
        return firmware_rows;
    } catch (err) {
        return { err };
    }
}

module.exports = { get }