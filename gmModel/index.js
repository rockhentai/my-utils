const Sequelize = require('sequelize');
const config = require('../config');
const fs = require('fs');
const path = require('path');
let db = {};

var sequelize = new Sequelize(config.gm_db, {
    logging: false,
    define: {
        freezeTableName: true,
        timestamps: true,
        charset: 'utf8',
        collate: 'utf_general_ci'
    }
});

fs.readdirSync(__dirname).filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
.forEach(file => {
    let model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;