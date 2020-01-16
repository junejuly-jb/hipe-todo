const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 8;

// HTTP VERBS: GET, POST, PUT/PATCH, DELETE

module.exports = (express, db) => {
    const api = express.Router();

    api.get('/users', async (req, res) => { // NOTE: You cannot call `await` if it is not surrounded by the async function.
        const usersQuery = 'SELECT * FROM users ORDER BY id DESC;';
        const result = await db.query(usersQuery);

        const users = []; // This is an array

        for (let i = 0; i < result.length; i++) {
            users.push({
                id: result[i].id,
                name: result[i].name,
                age: result[i].age,
                password: result[i].password
            });
        }
        
        return res
                .status(200)
                .json({
                    message: "Users successfully retrieved",
                    success: true,
                    data: users
                });
    });

    api.post('/users/login', async (req, res) => {
        // 1. get name, password
        // 2. check if exists(name)
        // 3. compare passwords; if true, otherwise dont login.
        // 4. login

        const { name, password } = req.body;

        if(!name && !password) {
            return res.status(200)
                .json({
                    success: true,
                    message: "Fields cannot be empty!"
                });
        }

        const userQuery = 'SELECT * FROM users WHERE name = ?';
        const rows = await db.query(userQuery, [name]);

        if(rows.length < 0) {
            return res.status(404)
                .json({
                    success: false,
                    message: "User not found"
                });
        }

        const users = [];
        for (let i=0; i < rows.length; i++) {
            users.push({
                name: rows[i].name,
                password: rows[i].password
            });
        }
        const hashedPassword = users[0].password;
        const samePassword = await comparePasswords(password, hashedPassword);
        
        if (!samePassword) {
           return res.json({
               success: false,
               message: "Username/Password is invalid"
           });
        }

        return res.json({
            success: true,
            message: "Login successfully"
        });
    });
    
    api.post('/users', async (req, res) => {
        const name = req.body.name;
        const age = req.body.age;
        const password = req.body.password;
        const confirmPassword = req.body.confirm_password;

        if(password != confirmPassword) {
            return res.status(200)
                .json({
                    success: false,
                    message: "Passwords dont match"
                });
        }

        const query = "SELECT * FROM users WHERE name = ?;";
        const rows = await db.query(query, [name]);
        if (rows.length > 0) {
            return res.status(200)
                .json({
                    success: false,
                    message: "User already exists."
                });
        }

        const insertQuery = "INSERT INTO `users`(name,age,password) VALUES (?,?,?);";
        // using a try catch version
        // try{
        //     const hashedPassword = await hashPassword(password);
        // }catch(err){
        //     console.log(err);
        // }

        const hashedPassword = await hashPassword(password);
        try {
            await db.query(insertQuery, [name,age,hashedPassword]);
            return res.status(200)
                    .json({
                        success: true,
                        message: "User successfully created"
                    });
        } catch(err) {
            return res.status(500)
                    .json({
                        success: false,
                        message: err
                    })
        }
    });

    

    // delete a user by a given id
    api.delete('/users/:id', async (req, res) => {
        const id = req.params.id;
        const deleteQuery = 'DELETE FROM users WHERE id = ?;';
        
        try {
            await db.query(deleteQuery, [id]);
        } catch(err) {
            await db.rollback();
        } finally {
            await db.commit();
        }

        return res.status(200)
            .json({
                success: true,
                message: "User successfully deleted!"
            });
    });

    // update a user by a given id
    api.put('/users/:id', async (req, res) => {
        const id = req.params.id;
        const updateQuery = `UPDATE users
        SET name = ?, age = ?
        WHERE id = ?;`;

        const { name, age } = req.body; // this is the short-hand notation of declaring variables if inside an object.

        try {
            const affected = await db.query(updateQuery, [name,age,id]);
        } catch(err) {
            await db.rollback();
            
            return res.status(500)
                .json({
                    success: false,
                    message: err.sqlMessage
                });
        } finally {
            await db.commit();
        }

        return res.status(200)
            .json({
                success: true,
                message: "User updated successfully"
            });
    });

    return api;
};

async function hashPassword(rawPassword) {
    if (!rawPassword) {
		throw new Error('Password is required');
	}

	const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(rawPassword, SALT_ROUNDS, (err, hash) => {
            if (err) {
                return reject(err);
            }
            return resolve(hash);
        });
	});

	return hashedPassword;
}

async function comparePasswords(rawPassword, hashedPassword) {
    if (!rawPassword) {
		throw new Error('Password is required');
	}

	const hasSamePassword = await new Promise((resolve, reject) => {
		bcrypt.compare(rawPassword, hashedPassword, (err, isMatch) => {
			if (err) {
				return reject(err);
			}

			return resolve(isMatch);
		});
	});

	return hasSamePassword;
}