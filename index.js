

const express	= require('express')
const cors		= require('cors')
const app		= express()
const path		= require('path')
const u			= require('./utils.js')
const router	= express.Router()
var   port		= process.env.PORT || 3000
app.use(cors())	// Makes it cross-origin something
var print = console.log
function done(msg){ return { success : true, message : msg}}
function fail(msg){ return { success : false, message : msg}}

function get(link, obligatoryParams, callback){
	app.get(link, (req, res)=>{
		console.log(req.ip)
		let pars = req.query
		for(let i = 0; i<obligatoryParams.length; i++){
			if(u.hasnt(pars, obligatoryParams[i])){
				res.send(fail("ERROR: " + link + " doesn't have parameter: " + obligatoryParams[i]))
				return
			}
		}
		let send = callback(pars)
		if(send != null) res.send(send)
	})
} 




// - - - - Virtual Socket Code - - - -


app.get('/con/connect', (req, res)=>{
	console.log(req.body)
	res.send(req.body)
})








app.listen(port, ()=>{
	console.log(`Listening on port ${port}...`)
})



