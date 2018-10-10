'use strict';

module.exports = (sequelize, DataTypes) => {
    const { STRING, INTEGER, DATE, BOOLEAN } = DataTypes;
  
    const GameConfigs = sequelize.define('game_configs', {
        id: {
            type: INTEGER,
            primaryKey: true, 
            autoIncrement: true 
        },
        game_id: { 
            type: INTEGER, 
            allowNull: false
        },
        config_name: {
            type: STRING,
            allowNull: false
        },
        is_domestic: {
            type: BOOLEAN,
            allowNull: false
        },
        is_show_logo: {
            type: BOOLEAN,
            allowNull: false
        },
        is_landscape: {
            type: BOOLEAN,
            allowNull: false
        },
        service: {
            type: STRING(32),
            allowNull: false
        }
    }, {
        indexes: [{
            name: 'index_game_id_on_game_configs',
            fields: ['game_id']
        }, {
            name: 'index_config_name_on_game_configs',
            fields: ['config_name'],
        }],
        engine: 'InnoDB',
        charset: 'utf8',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false,
        freezeTableName: true
    });

    // GameConfigs.associate = function() {
    //     app.model.GameConfigs.belongsTo(app.model.Games, {
    //         foreignKey: 'game_id'
    //     })
    // }
    
    return GameConfigs;
};