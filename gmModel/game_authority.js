'use strict';

module.exports = (sequelize, DataTypes) => {
    const { STRING, INTEGER, TEXT } = DataTypes;
  
    const GameAuthority = sequelize.define('game_authority', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        game_id: { 
            type: INTEGER, 
            allowNull: false 
        },
        admin_id: {
            type: INTEGER,
            allowNull: false
        }
    }, {
        indexes: [{
            name: 'unique_key_on_game_authority',
            fields: ['game_id', 'admin_id'],
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
    
    return GameAuthority;
};