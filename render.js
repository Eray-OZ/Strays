



export const getIndex = async (req, res) => {
    res.render('index', { link: "index" })
}


export const getFind = async (req, res) => {

    res.render('find', { link: "find" })
}


export const getAbout = async (req, res) => {
    res.render('about', { link: "about" })
}


export const getRegister = async (req, res) => {
    res.render('register', { link: "register" })
}


export const getLogin = async (req, res) => {
    res.render('login', { link: "login" })
}






