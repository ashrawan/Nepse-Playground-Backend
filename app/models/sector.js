module.exports = (sequelize, DataTypes) => {
	const Sector = sequelize.define('sector', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING
		}
	}, {
		indexes: [
			{
				unique: true,
				fields: ['name']
			}
		],
		timestamps: false,
	});
	return Sector;
};
