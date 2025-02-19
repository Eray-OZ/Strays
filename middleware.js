import { User } from './model.js'
import jwt from 'jsonwebtoken'

export const pagination = (model) => {
    return async (req, res, next) => {


        const page = parseInt(req.query.page) || 1
        const limit = 4


        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}


        const totalDocs = await model.countDocuments();

        const totalPage = Math.ceil(totalDocs / limit)

        results.totalPage = totalPage

        results.currentPage = parseInt(req.query.page)

        if (endIndex < totalDocs) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.prev = {
                page: page - 1,
                limit: limit
            }
        }


        try {
            results.results = await model.find().populate('user', "username").limit(limit).skip(startIndex).exec()
        } catch (error) {
            res.status(500).json(error)
        }


        res.paginatedResults = results

        next()
    }
}




export const authenticateToken = async (req, res, next) => {



    try {

        /*
        const authHeader = req.headers["authorization"]
        // authHeader returns => Bearer 'token' 
        const token = authHeader && authHeader.split(" ")[1]  
        if (!token) {
            return res.status(401).json({
                success: false,
                error: "No Token Available"
            })
        }
        req.user = await User.findById(
            jwt.verify(token, process.env.JWT_SECRET).userId
        )
        next()   */


        const token = req.cookies.jsonwt


        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err) => {

                if (err) {
                    console.log(err)

                    res.redirect("/login")
                }

                else {
                    next()
                }
            })
        }

        else {
            res.redirect("/login")
        }


    } catch (error) {
        res.status(401).json({
            success: false,
            error: "Not Authorized"
        })
    }


}






export const checkUser = async (req, res, next) => {

    const token = req.cookies.jsonwt

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {

            if (err) {
                console.log(err)
                res.locals.user = null
                next()
            }

            else {
                const user = await User.findById(decodedToken.userId)

                res.locals.user = user

                next()
            }

        })
    }

    else {
        res.locals.user = null
        next()
    }
}