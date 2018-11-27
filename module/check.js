const db = require('./db');
module.exports = {

    /**
     * @description Function to check whether the value received from the client is null
     * @param values(array)
     * @returns {number}
     */
    checkNull: (values) => {
        for (let v of values) {
            if (v === "" || v === null || v === undefined) {
                return 1;
            }
        }
        return 0;
    },

    /**
     * @description Function to check whether the value duplicate from the signup mail
     * @param query
     * @param value
     * @returns {Promise<*>}
     */
    checkDup: async (query, value) => {
        let result = await db.queryParamArr(query, [value]);
        if (!result) {
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
        else {
            if (result.length >= 1) {
                return 1;
            }
            else return 0;
        }
    }
};
