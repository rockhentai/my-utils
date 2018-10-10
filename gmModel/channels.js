'use strict';

module.exports = (sequelize, DataTypes) => {
    const { STRING, INTEGER, DOUBLE } = DataTypes;
  
    const Channels = sequelize.define('channels', {
        id: { 
            type: INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        channel_name: {
            type: STRING,
            allowNull: false
        },
        channel_def: {
            type: STRING,
            allowNull: false
        },
        profit_share: {
            type: DOUBLE,
            allowNull: false
        }
    }, {
        indexes: [{
            name: 'unique_key_channel_def_on_channels',
            fields: ['channel_def'],
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
    
    return Channels;
};