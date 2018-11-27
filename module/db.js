const pool = require('../config/db_pool');

module.exports = {
    queryParamNone: async (...args) => {
        const query = args[0];
        let result;
        let connection;
        try {
            connection = await pool.getConnection();
            result = await connection.query(query) || null;
        }
        catch (e) {
            console.log(e);
            next(e);
        }
        finally {
            pool.releaseConnection(connection);
            return result;
        }
    },

    queryParamArr: async (...args) => {
        const query = args[0];
        const value = args[1];
        let result;
        let connection;

        try {
            connection = await pool.getConnection();
            result = await connection.query(query, value) || null;

        } catch (e) {
            console.log(e);
            next(e);

        } finally {
            pool.releaseConnection(connection);
            return result;
        }
    },

}
