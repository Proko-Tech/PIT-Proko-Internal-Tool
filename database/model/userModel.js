const db = require('../dbConfig');

/**
 * Returns a list of user accounts
 * @returns {Promise<void>}
 */
async function get() {
    const user_accounts = await db('admin_accounts').select('*');
    return user_accounts.length;
}

module.exports = {get};
