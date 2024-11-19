const db = require('../dbConfig');

/**
 * Gets a list of all the admin accounts
 * @returns {Promise<void>}
 */
async function get() {
    const admin_accounts = await db('admin_accounts').select('*');
    return admin_accounts;
}

/**
 * Gets a list of all the admin accounts
 * @returns {Promise<void>}
 */
async function updateById(id, updated_json) {
    const admin_accounts = await db('admin_accounts')
        .update(updated_json)
        .where({id});
    return admin_accounts;
}

module.exports = {get, updateById};
