const fetch = require('node-fetch');
const API_BASE_URL = "http://localhost:3000/api/v1";

module.exports = (express) => {
    const router = express.Router();

    router.get("", (req, res) => {
        const usersURL = API_BASE_URL+"/users";
        const token = req.cookies.userToken;

        let isLogin = false;

        if (token !== undefined) {
            isLogin = true;
        }

        getAllUsers(usersURL, token)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if(!data.success) {
                    return res.render('index/', {
                        isLogin: isLogin,
                        showHeader: true,
                        message: "This is the message from index page"
                    });
                }
                
                return res.render('index/', {
                    showHeader: true,
                    message: "This is the message from index page",
                    isLogin: isLogin,
                    users: data.data
                });
            });
    });

    router.get("/login", (req, res) => {
        return res.render('login/login', {
            showHeader: false,
            title: "This is the login form"
        })
    });

    router.get("/logout", (req, res) => {
        return res.clearCookie("userToken")
            .redirect("/login");
    });

    router.get("/register", (req, res) => {
        return res.render('register/register', {
            showHeader: false,
            title: "Please register"
        });
    });

    // users
    router.get("/users/:id", (req, res) => {
        return res.render('profile/profile', {
            id: req.params.id
        });
    });
    return router;
};

function getAllUsers(url, token) {
    const options = {
        method: 'GET',
        headers: {
            'Authorization': "Bearer "+token,
            "Content-Type": "application/json"
        }
    }
    return fetch(url, options);
}