const fs = require('fs');
const co = require('co');
const db = require('../model');
const Sequelize = require('sequelize');
const xlsx = require('node-xlsx');
const path = require('path');
const moment = require('moment');

co(function*() {
    try {
        let sql = `SELECT * FROM cp_servers`;
        let result = yield db.sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
        let data = result.map(item => {
            return [
                item.game_id,
                item.game_alias,
                item.region,
                item.server_id,
                item.server_name,
                moment(item.open_time*1000).format('YYYY-MM-DD HH:mm:ss'),
                item.limit,
                item.accounts,
                item.cost_usd
            ]
        });
        data.unshift([
            'game id',
            'game alias',
            '区域',
            'server id',
            'server name',
            'open time',
            'limit',
            'accounts',
            'cost usd'
        ]);
        let fileName = path.resolve(__dirname, '../files', 'servers.xlsx');
        if(fs.existsSync(fileName)) {
            fs.unlinkSync(fileName);
        } 
        let buffer = xlsx.build([{data: data}]);
        fs.writeFileSync(fileName, buffer, {mode: 777});
    } catch(e) {
        console.log(e)
    }
})