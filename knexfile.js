// Update with your config settings.

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'todos';

module.exports = {
  client: 'mysql',
	connection: {
		host     : DB_HOST,
		user     :  DB_USER,
		password : DB_PASS,
		database : DB_NAME
	}
};
