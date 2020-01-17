const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const phrase = '!@#$%^&*(~~~~1111111ZXCVBNMSDFSDFSDFDIIERE#$%^&*(@#@#@#@';

// HTTP VERBS: GET, POST, PUT/PATCH, DELETE
module.exports = (express, db) => {
    const api = express.Router();

    api.get('/todos', async (req, res) => { // NOTE: You cannot call `await` if it is not surrounded by the async function.
        const todosQuery = 'SELECT * FROM todos ORDER BY id DESC;';
        const result = await db.query(todosQuery);

        const todos = []; // This is an array

        for (let i = 0; i < result.length; i++) {
            todos.push({
                id: result[i].id,
                user_id: result[i].user_id,
                title: result[i].title,
            });
        }
        
        return res
                .status(200)
                .json({
                    message: "Todos successfully retrieved",
                    success: true,
                    data: todos
                });
    });

    api.get('/todos/:user_id', auth, async (req, res) => {
        const userId = req.params.user_id;

        const todosByUserQuery = 'SELECT * FROM todos WHERE user_id = ?';

        const rows = await db.query(todosByUserQuery, [userId])

        const usersTodo = [];

        for(let i = 0; i < rows.length; i++) {
            usersTodo.push({
                id: rows[i].id,
                user_id: rows[i].user_id,
                title: rows[i].title
            });
        }

        return res.status(200)
                .json({
                    success: true,
                    message: "Your todos",
                    data: usersTodo
                });
    });

    api.post('/todos', auth, async (req, res) => {
        const title = req.body.title;

        if (typeof req.headers.authorization === "undefined") { 
            return res.status(403).json({ error: "Authentication is required" });
        }

        if(!title) {
            return res.status(200)
                .json({
                    success: false,
                    message: "Title Field is required"
                });
        }
        // retrieve the authorization header and parse out the
        // JWT using the split function
        let token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, phrase, { algorithm: "HS256" }, async (err, user) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Authentication is required"
                });
            }
            const insertQuery = "INSERT INTO `todos`.todos(user_id,title) VALUES (?,?);";
            try {
                await db.query(insertQuery, [user.id,title]);
                return res.status(200)
                        .json({
                            success: true,
                            message: "Todo successfully created"
                        });
            } catch(err) {
                return res.status(500)
                        .json({
                            success: false,
                            message: err
                        })
            }
        });
    });

    // delete a todo by a given id only if the user created the todo.
    api.delete('/users/:id', async (req, res) => {
        // TODO:: IMPLEMENT.
    });

    // update a todo by a given id using a user id.
    api.put('/users/:id', async (req, res) => {
        // TODO:: IMPLEMENT.
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