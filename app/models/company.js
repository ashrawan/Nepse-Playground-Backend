
module.exports = (sequelize, DataTypes) => {
	const Company = sequelize.define('company', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
		},
		symbol: {
			type: DataTypes.STRING,
		},
		companyCode: {
			type: DataTypes.STRING,
		},
		sectorId: {
			type: DataTypes.INTEGER,
		}
	},
		{
			indexes: [
				{
					unique: true,
					fields: ['companyCode']
				}
			],
			timestamps: false,
		});
	Company.associate = function (models) {
		Company.belongsTo(models.sector, {
			foreignKey: "sectorId",
			as: "sector",
		})
	};
	return Company;
};
