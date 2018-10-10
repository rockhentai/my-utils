'use strict';

module.exports = (sequelize, DataTypes) => {
    const { STRING, INTEGER, TEXT } = DataTypes;
  
    const ConfigFields = sequelize.define('config_fields', {
        id: {
            type: INTEGER,
            primaryKey: true, 
            autoIncrement: true 
        },
        game_config_id: { 
            type: INTEGER, 
            allowNull: false
        },
        platform: {
            type: STRING(32),
            allowNull: false
        },
        source: {
            type: STRING(32),
            allowNull: false
        },
        project: {
            type: STRING(128),
            allowNull: false
        },
        value: {
            type: TEXT,
            allowNull: true
        }
    }, {
        indexes: [{
            name: 'unique_key_on_config_fields',
            fields: ['game_config_id', 'platform', 'source', 'project'],
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

    // ConfigFields.associate = function() {
    //     app.model.ConfigFields.belongsTo(app.model.GameConfigs, {
    //         foreignKey: 'game_config_id'
    //     })
    // }
    
    return ConfigFields;
};