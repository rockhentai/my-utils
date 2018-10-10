const co = require('co');
const gm_db = require('../gmModel');
const old_gm_db = require('../oldGmModel');
const Sequelize = require('sequelize');
const gameConfigMap = require('../config/gameConfigMap');
const fieldsMap = require('../config/fieldsMap');

function migrateGame() {
    return co(function*() {
        let sql = `SELECT * FROM manager_game`;
        let result = yield old_gm_db.sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
        let data = result.map(item => {
            return {
                game_id: item.gameId,
                name: item.gameName,
                alias: '',
                creator_id: 98,
                created_at: item.dateTime
            }
        });
        let admins = result.map(item => {
            return {
                game_id: item.gameId,
                admin_id: 98
            }
        })

        yield gm_db.games.bulkCreate(data);
        yield gm_db.game_authority.bulkCreate(admins);
        console.log('finish');
    })
}

function migrateGoods() {
    return co(function*() {
        let games_sql = `SELECT * FROM games`;
        let games = yield gm_db.sequelize.query(games_sql, { type: Sequelize.QueryTypes.SELECT });
        let gamesMap = getGamesMap(games);
        
        let goods_sql = `SELECT * FROM manager_goods`;
        let result = yield old_gm_db.sequelize.query(goods_sql, { type: Sequelize.QueryTypes.SELECT });
        let data = [];
        for(let item of result) {
            let { id, gameName, goodsId, goodsType, goodsName, goodsValueRMB, goodsValueUSD, goodsValueTWD, dateTime } = item;
            if(gamesMap[gameName]) {
                let goods = {
                    id,
                    game_id: gamesMap[gameName],
                    goods_def: goodsId,
                    goods_type: goodsType,
                    goods_name: goodsName,
                    value_rmb: goodsValueRMB,
                    value_usd: goodsValueUSD,
                    value_twd: goodsValueTWD,
                }
                try {
                    yield gm_db.goods.create(goods);
                } catch(e) {
                    data.push(goods)
                    console.log(e);
                }
            }
        }
        console.log('error data: ', data)
    })
}

function migrateChannel() {
    return co(function*() {
        let sql = `SELECT * FROM manager_channel_id`;
        let result = yield old_gm_db.sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
        let data = result.map(item => {
            return {
                id: item.id,
                channel_name: item.channelName,
                channel_def: item.channelId,
                profit_share: item.profitShare
            }
        });
        yield gm_db.channels.bulkCreate(data);
        console.log('finish');
    })
}

function migrateConfigs() {
    return co(function*() {

        let games_sql = `SELECT * FROM games`;
        let games = yield gm_db.sequelize.query(games_sql, { type: Sequelize.QueryTypes.SELECT });
        let gamesMap = getGamesMap(games);

        let config_name_sql = `SELECT gameName FROM manager_game_config GROUP BY gameName`;
        let names = yield old_gm_db.sequelize.query(config_name_sql, { type: Sequelize.QueryTypes.SELECT }).map(item => item.gameName);
        
        for(let name of names) {
            let sql = `SELECT * FROM manager_game_config WHERE gameName='${name}' AND source != 'MAT' AND project != 'Game ID'`;
            let result = yield old_gm_db.sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
            let dataSource = filterConfig(result);
            let { commonConfigs, newConfigs, commonMap } = dataSource;
            let game_name = gameConfigMap[name];
            let game_id = gamesMap[game_name];
            if(game_id) {
                let data = {
                    game_id,
                    config_name: name,
                    is_domestic: commonMap['Is Domestic'] == 'true' ? true : false,
                    is_show_logo: commonMap['Is Show LLH Logo'] == 'true' ? true : false,
                    is_landscape: commonMap['Landscape'] == 'true' ? true : false,
                    service: commonMap['Service']
                }
                let game_config = yield gm_db.game_configs.create(data);
                console.log(`game_config ${name} insert finished`)
                let newData = newConfigs.map(item => {
                    if(!fieldsMap[item.project]) console.log(item)
                    return {
                        game_config_id: game_config.id,
                        platform: fieldsMap[item.platform],
                        source: fieldsMap[item.source],
                        project: fieldsMap[item.project],
                        value: item.value
                    }
                });
                console.log()
                yield gm_db.config_fields.bulkCreate(newData);
                console.log(`${name}'s config_fields insert finished`)
            } else {
                console.log(`game config named ${name} can't find game`)
            }
        }
        console.log('all finished')
    })
}

function getGamesMap(games) {
    let gamesMap = games.reduce((obj, currentValue) => {
        obj[currentValue.name] = currentValue.game_id;
        return obj
    }, {});
    return gamesMap
}

function filterConfig(configs) {
    let project = ['Is Domestic', 'Is Show LLH Logo', 'Landscape', 'Service'];
    let commonConfigs = [];
    let newConfigs = [];
    for(let item of configs) {
        if(item.platform === '通用' && project.indexOf(item.project) > -1) {
            commonConfigs.push(item);
        } else if(!!item.value) {
            newConfigs.push(item);
        }
    }
    let commonMap = commonConfigs.reduce((obj, currentValue) => {
        obj[currentValue.project] = currentValue.value;
        return obj;
    }, {});
    let dataSource = {
        commonConfigs,
        newConfigs,
        commonMap
    }
    
    return dataSource
}

// migrateGame();
// migrateGoods();
// migrateChannel();
migrateConfigs();