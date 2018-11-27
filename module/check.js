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
     * @returns {number}
     */
    checkDup: async (query, value) => {
        let result;
        try {
            result = await db.queryParamArr(query, [value]) || null;

        } catch (e) {
            console.log(e);
            next(e);

        } finally {
            if (!result) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            }
            if (result.length >= 1) {
                return 1;
            }
            else return 0;
        }
    }
};
