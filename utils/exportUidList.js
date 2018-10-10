const fs = require('fs');
const co = require('co');
const db = require('../model');
const Sequelize = require('sequelize');
const xlsx = require('node-xlsx');
const path = require('path');

co(function*() {
    try {
        let sql = `SELECT * FROM uid_list`;
        let result = yield db.sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
        let data = result.map(item => {
            return [
                item.uid,
                item.server
            ]
        });
        console.log('去重前：', data.length);
        let temp_set = new Set(data);
        let new_data = Array.from(temp_set);
        console.log('去重后：', new_data.length);
        new_data.unshift([
            'uid', 
            '服务器'
        ]);
        let fileName = path.resolve(__dirname, '../files', 'works.xlsx');
        if(fs.existsSync(fileName)) {
            fs.unlinkSync(fileName);
        } 
        let buffer = xlsx.build([{data: new_data}]);
        fs.writeFileSync(fileName, buffer, {mode: 777});
    } catch(e) {
        console.log(e)
    }
})