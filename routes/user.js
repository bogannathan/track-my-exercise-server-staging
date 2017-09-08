let router = require('express').Router()
let sequelize = require('../db.js')
let User = sequelize.import('../models/user')
let bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')

router.post('/', function(req, res) {
	// when we post to api user, it will want a user object in the body
	let username = req.body.user.username
	let pass = req.body.user.password  //to do: hash this password
	//need to create a user object and use sequelize to put that user into our database
	//needs to match the model above (the username password)
	User.create({
		username: username,
		passwordhash: bcrypt.hashSync(pass, 10)
	}).then(
			//sequelize is going to return the object it created from db
		function createSuccess(user){
			let token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
			res.json({
				user: user,
				message: 'create',
				sessionToken: token
			})		
		},
		function createError(err){
			res.send(500, err.message)
		}
	)
})

module.exports = router;

