import express from 'express'
import { getAbout, getFind, getIndex, getRegister, getLogin } from './render.js'
import { getAllPets, getOnePet, addPet, deletePet, updatePet, getUpdate, registerUser, loginUser, getUser, logoutUser } from './controller.js'
import { pagination, authenticateToken } from './middleware.js'
import { Pet } from './model.js'

const router = express.Router()



// RENDER
router.get("/", getIndex)
router.get("/find", getFind)
router.get("/about", getAbout)
router.get("/register", getRegister)
router.get("/login", getLogin)
router.get("/update/:id", getUpdate)
// RENDER




// PET CONTROLLER
router.get("/pet", pagination(Pet), getAllPets)
router.post("/pet", addPet)
router.get("/pet/:id", getOnePet)
router.delete("/pet/:id", deletePet)
router.put("/update/:id", updatePet)
// PET CONTROLLER



// USER CONTROLLER
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/user", authenticateToken, getUser)
router.get("/logout", logoutUser)
// USER CONTROLLER


export default router