

const express	= require('express')
const cors		= require('cors')
const app		= express()
const path		= require('path')
const utils		= require('./utils.js')
const router	= express.Router()
var   port		= process.env.PORT || 3000
app.use(cors())	// Makes it cross-origin something

const FAIL		= false
const DONE		= true


// ----------------------------------------------------------------------------
// --------------------  UTILS  -----------------------------------------------
// ----------------------------------------------------------------------------

var print = console.log

function has(){
	let obj = arguments[0]
	console.log("\t > Does:")
	console.log(obj)
	console.log("\t > Have:")
	console.log(arguments.length)
	console.log(arguments)
	for(let i = 1; i<arguments.length; i++){
		console.log(arguments[i])
		console.log("ADADAS")
		if(obj[arguments[i]] == null) return false
	}
	return true
}

function hasnt(){
	let obj = arguments[0]
	for(let i = 1; i<arguments.length; i++){
		if(obj[arguments[i]] == null) return true
	}
	return false
}

function fail(msg){
	return {
		success : false,
		message : msg
	}
}

function done(msg){
	return {
		success : true,
		message : msg
	}
}


Games = {}

app.get('/game', (req, res)=>{
	res.sendFile(path.join(__dirname+'/HTML/game.html'))
})

app.get('/new_game', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'gameID')){
		 res.send(false)
		 return
	}
	let gameID = pars.gameID
	Games[gameID] = new Game(gameID)
	res.send(true)
})

app.get('/join_game', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'name', 'gameID')){
		res.send(false)
		return
	}
	Games[pars.gameID].addPlayer(pars.name)
	res.send(true)
})

app.get('/start_game', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'gameID')){
		res.send(false)
		return
	}
	Games[pars.gameID].start()
	res.send(true)
})

app.get('/turn', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'name', 'action', 'gameID')){
		res.send(false)
		return
	}
	let game = Games[pars.gameID]
	if(game == null){
		res.send(fail(`No such game ${pars.gameID}`))
		console.log("Games:")
		console.log(Games)
		return
	}
	if(game.getCurrentPlayer().name != pars.name){
		res.send(fail(`Not your turn!`)) // Not your turn!
		return
	}
	let didItWork = game.takeTurn(pars.name, pars.action, pars)
	res.send(didItWork)
})



app.get('/info/game_exists', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'gameID')){
		res.send(fail("No gameID passed"))
		return
	}
	if(Games[pars.gameID] == null){
		res.send(false)
	} else {
		res.send(true)
	}
})

app.get('/info/board', (req, res)=>{
	let pars = req.query
	console.log(pars)
	if(hasnt(pars, 'gameID')){
		res.send(fail("No gameID passed"))
		return
	}
	console.log(Games[pars.gameID].board.getSimpleData())
	res.send(Games[pars.gameID].board.getSimpleData())	// Just the tile matrix
})
app.get('/info/structs', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'gameID')){
		res.send(fail("No gameID passed"))
		return
	}
	let b = Games[pars.gameID].board
	let r = ""
	for(let i = 0; i<b.height; i++){
		for(let j = 0; j<b.width; j++){
			let st = "_"
			if(b.getTile(j, i).structure != null){
				print(b.getTile(j, i).structure.name)
				st = b.getTile(j, i).structure.name[0]	// First letter
			}
			r += st + "&nbsp;&nbsp;&nbsp;"
		}
		r += "<br>"
	}
	res.send(r)
})
app.get('/info/player', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'gameID', 'name')){
		res.send(fail("gameID or name not specified"))
		return
	}
	let player = Games[pars.gameID].getPlayer(pars.name)
	if(player == null){
		res.send(fail("Player not found..."))
		return
	}
	res.send({
		name : player.name,
		res : player.res
	})
})
app.get('/info/current_player', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'gameID')){
		res.send(fail("No gameID specified"))
		return
	}
	if(Games[pars.gameID].isStarted == false){
		res.send("~None~")
		return
	}
	let currentPlayer = Games[pars.gameID].getCurrentPlayer()
	if(currentPlayer == null){
		res.send(fail("Something went wrong..."))
		return
	}
	res.send(Games[pars.gameID].getCurrentPlayer().name)
})
app.get('/__reset', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'gameID')) res.send(false)
	_test()
	res.send("game1 reset")
})






function _test(){
	Games['game1'] = new Game('game1')	// Create game
	Games['game1'].addPlayer('Dave')
	Games['game1'].addPlayer('Daisy')
	Games['game1'].start()
}

app.get('/test', (req, res)=>{
	_test()
	res.send(true)
})


app.get('/templ', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'name')) res.send(false)
	res.send(true)
})

app.listen(port, ()=>{
	console.log(`Listening on port ${port}...`)
	_test()
})



















/*
// REMINDER: When you make requests, always include the link with http:// in fata!

// Just sends this
app.get('/', (request, response) => {
	response.send('Hello World')
})

// When this page is accessed, return the index.html file
app.get('/index.html', (req, res) => {
	res.sendFile(path.join(__dirname+'/index.html'));
})

// When our index.html loads, it requests the style from the same server. That's why we need this
app.get('/style.css', (req, res) => {
	res.sendFile(path.join(__dirname+'/style.css'));
})



app.get('/api/courses', (request, response)=>{
	response.send([1,2,3,4,5,6,2])
})

// Nice littlr trick ;)
app.route('/book')
	.get((req, res) => {
		res.send('Get a random book')
	})
	.post((req, res) => {
		res.send('Add a book')
	})
	.put((req, res) => {
		res.send('Update the book')
	})

'Try /api/courses/dave/21?a=20&b=30'
app.get('/api/courses/:name/:age', (request, response)=>{
	console.log(request.params)	// Params from url as p1/p2/
	console.log(request.query)	// Params from ?a=20&b=30
	if(false)response.send(request.params)
	else response.status(404).send('Something not found :c')
	if(false) response.status(400).send('Bad Request (wrong or incomplete params sent, for example)')
})

app.post('/api/courses', (req, res)=>{
	console.log(req.body)		// Params from post, JSON format
	res.send({"Dingo" : req.body})
})

*/