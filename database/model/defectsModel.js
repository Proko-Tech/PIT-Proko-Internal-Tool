const db = require('../dbConfig');
const moment = require('moment');

/**
 *  get all defects from defects table with formatted dates
 *  @returns {Promise<void>}
 */
async function get() {
    try {
        let defect_rows = await db('defects')
            .join('spots', 'defects.spot_id', 'spots.id')
            .join('lots', 'defects.lot_id', 'lots.id')
            .join('admin_accounts', 'defects.admin_id', 'admin_accounts.id')
            .join('users', 'admin_accounts.admin_email', 'users.email')
            .select('*');
        defect_rows = await defect_rows.map((row) => {
            const created = moment(row.created_at);

            if (row.is_auto_generator) {
                row.is_auto_generator = "Yes";
            } else {
                row.is_auto_generator = "No";
            }

            row.created_at = [created.format('MM-DD-YYYY'), created.format('LT')];
            return row
        });
        return defect_rows;
    } catch (err) {
        return { err };
    }
}

module.exports = { get }