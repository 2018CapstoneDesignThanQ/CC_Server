const check = require('./check');
module.exports = {
    makeRandNum: async () => {
        let check_result = 1;
        let rand_num = Math.floor(Math.random() * (10000 - 1000)) + 1000;
        while (check_result) {
            console.log(rand_num);
            let check_valid = `select lecture_id from lecture where lecture_id =?`;
            check = await check.checkDup(check_valid, rand_num);
        }
        return rand_num;
    }
};
