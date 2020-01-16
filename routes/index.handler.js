module.exports = (express) => {
    const router = express.Router();

    router.get("", (req, res) => {
        return res.render('index/', {
            showHeader: true,
            message: "This is the message from index page"
        });
    });

    router.get("/login", (req, res) => {
        return res.render('login/login', {
            showHeader: false,
            title: "This is the login form"
        })
    });

    router.get("/register", (req, res) => {
        return res.render('register/register', {
            showHeader: false,
            title: "Please register"
        });
    });
    return router;
};