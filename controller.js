import { Pet, User } from './model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'





export const getAllPets = async (req, res) => {

    try {

        const pets = res.paginatedResults

        if (!req.query.page) {
            return res.redirect("/pet?page=1")
        }

        // res.json({ pets })
        res.render('pet', { pets, link: "pets" })

    } catch (error) {
        console.log("ERR:: " + error)
    }
}



export const getOnePet = async (req, res) => {
    try {

        const { id } = req.params

        const pet = await Pet.findById(id).populate('user')

        res.json({ pet })

    } catch (error) {
        console.log("ERR:: " + error)
    }
}


export const getUser = async (req, res) => {

    try {

        const token = req.cookies.jsonwt

        const id = jwt.verify(token, process.env.JWT_SECRET).userId

        const userPets = await Pet.find({ user: id })


        res.render('user', { link: "user", userPets })
    } catch (error) {
        res.json({ error })
    }
}



export const addPet = async (req, res) => {

    // const pet = req.body

    // const newPet = new Pet(pet)

    try {

        const token = req.cookies.jsonwt

        const id = jwt.verify(token, process.env.JWT_SECRET).userId

        await Pet.create({
            city: req.body.city,
            district: req.body.district,
            category: req.body.category,
            description: req.body.description,
            number: req.body.number,
            address: req.body.address,
            image: req.body.image,
            user: id
        })


        res.redirect("/pet")

    } catch (error) {
        console.log("ERR:: " + error)
    }
}



export const deletePet = async (req, res) => {


    try {


        await Pet.findByIdAndDelete(req.params.id)


        res.status(200).redirect('/user');

    } catch (error) {
        console.log("ERR:: " + error)
    }
}


export const getUpdate = async (req, res) => {

    const { id } = req.params

    const pet = await Pet.findById(id)

    res.render('update', { link: "user", pet })
}


export const updatePet = async (req, res) => {


    try {


        const { id } = req.params;

        const pet = req.body


        const updatedPet = await Pet.findByIdAndUpdate(id, pet, { new: true });


        res.status(200).redirect('/user');

    } catch (error) {
        console.log("ERR:: " + error)
    }
}





export const registerUser = async (req, res) => {

    try {
        const user = await User.create(req.body);
        res.redirect("/login")

    } catch (error) {
        res.json(error)
    }
}



export const createToken = /*PAYLOAD*/ (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
}



export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        let same = false


        if (user) {
            same = await bcrypt.compare(password, user.password)
        }
        else {
            return res.status(401).json({
                succeded: false,
                error: 'There is no such user',
            })
        }


        if (same) {

            const token = createToken(user._id)

            res.cookie("jsonwt", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            })

            res.redirect("/user")

        }

        else {
            res.status(401).json({
                succeded: false,
                error: 'Paswords are not matched',
            });
        }

    } catch (error) {
        res.json(error)
    }
}



export const logoutUser = async (req, res) => {
    try {


        res.cookie('jsonwt', '', {
            maxAge: 1,
        })

        res.redirect('/')


    } catch (error) {
        res.json({ error })
    }
}