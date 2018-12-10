const db = require('./db');
const redis =require('../config/redis_pool').client;

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
    },

    checkTop3: async (class_id, question_id) => {
        const io = req.app.get('io');

        try {
            let select_like = `select * from question where class_fk = ? order by like_cnt limit 3`;
            let top_like = await db.queryParamArr(select_like, [class_id]);
            let length = top_like.length;
            if (!top_like) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            }
           else {
               if (redis.get(`${class_id}${length}`).cnt <= top_like[length-1].like_cnt) {

               }
            }
        }
        catch (e) {
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
        // finally {
        //
        // }
    }
};
