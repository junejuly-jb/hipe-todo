module.exports = (express) => {

    const router = express.Router();

    router.get('/todo', async (req, res) => {
        return res.render('todo/new', {
            title: "Create a new todo"
        });
    });

    return router;
};