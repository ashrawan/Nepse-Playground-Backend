
const company = require('./company');

module.exports = (sequelize, DataTypes) => {
    const StockPrice = sequelize.define('stockprice', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        date: {
            type: DataTypes.STRING,
            unique: "unique_tag"
        },
        timestamp: {
            type: DataTypes.STRING,
            unique: "unique_tag"
        },
        totalTransactions: {
            type: DataTypes.INTEGER,
        },
        totalTradeShares: {
            type: DataTypes.INTEGER,
        },
        totalTradeAmount: {
            type: DataTypes.INTEGER,
        },
        maxPrice: {
            type: DataTypes.INTEGER,
        },
        minPrice: {
            type: DataTypes.INTEGER,
        },
        closePrice: {
            type: DataTypes.INTEGER,
        },
        companyId: {
            type: DataTypes.INTEGER,
            unique: "unique_tag"
        }
    },
    {
        uniqueKeys: {
          unique_tag: {
            customIndex: true,
            fields: ["timestamp", "date", "companyId"]
          }
        },
        timestamps: false,
      }    
    );

    StockPrice.associate = function (models) {
        StockPrice.belongsTo(models.company, {
            foreignKey: "companyId",
            as: "company",
        })
    };
    return StockPrice;
};
