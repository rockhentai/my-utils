'use strict';

module.exports = (sequelize, DataTypes) => {
    const { STRING, INTEGER, DATE } = DataTypes;
  
    const Games = sequelize.define('games', {
        game_id: { 
            type: INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        name: {
            type: STRING(30),
            allowNull: false
        },
        alias: {
            type: STRING(30),
            allowNull: false
        },
        creator_id: {
            type: INTEGER,
            allowNull: false
        },
    }, {
        indexes: [{
            name: 'index_name_on_games',
            fields: ['name'],
        }, {
            name: 'index_alias_on_games',
            fields: ['alias'],
        }],
        engine: 'InnoDB',
        initialAutoIncrement: '10001',
        charset: 'utf8',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false,
        freezeTableName: true
    });
    
    return Games;
};