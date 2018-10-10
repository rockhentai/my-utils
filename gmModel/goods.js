'use strict';

module.exports = (sequelize, DataTypes) => {
    const { STRING, INTEGER, DATE, FLOAT } = DataTypes;
  
    const Goods = sequelize.define('goods', {
        id: { 
            type: INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        game_id: {
            type: INTEGER,
            allowNull: false
        },
        goods_def: {
            type: STRING,
            allowNull: false
        },
        goods_type: {
            type: STRING(128)
        },
        goods_name: {
            type: STRING
        },
        value_rmb: {
            type: FLOAT(6, 2)
        },
        value_usd: {
            type: FLOAT(6, 2)
        },
        value_twd: {
            type: FLOAT(6, 2)
        }
    }, {
        indexes: [{
            name: 'index_game_id_on_goods',
            fields: ['game_id']
        }, {
            name: 'unique_key_goods_def_on_goods',
            fields: ['goods_def'],
            unique: true
        }],
        engine: 'InnoDB',
        charset: 'utf8',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false,
        freezeTableName: true
    });
    
    return Goods;
};