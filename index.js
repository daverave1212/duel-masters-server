

const express	= require('express')
const cors		= require('cors')
const app		= express()
const path		= require('path')
const u			= require('./utils.js')
const router	= express.Router()
const Queue		= require('./Queue.js').Queue
var   port		= process.env.PORT || 3000
app.use(cors())	// Makes it cross-origin something
var print = console.log
function done(msg){ return { success : true, message : msg}}
function fail(msg){ return { success : false, message : msg}}

function get(link, obligatoryParams, callback){
	app.get(link, (req, res)=>{
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


Connections = {} // If it is equal to its index, then it exists. If -1, then not
ConnectionNames = []

function getRandomConnectionID(){
	let ret = ""
	for(let i = 1; i<=10; i++){
		ret += '0123456789qwertyuiopasdfghjklzxcvbnm'[u.randomInt(0, 34)]
	}
	return ret
}


class Connection{
	constructor(conID){
		this.connectionID = conID
		this.responses = new Queue()
		this.timeConnected = 0
	}
	
	send(obj){
		this.responses.enqueue(obj)
	}
}

app.get('/con/connect', (req, res)=>{
	let connectionID = getRandomConnectionID()
	let conNameIndex = u.getFirstNull(ConnectionNames)
	if(conNameIndex == -1){
		ConnectionNames.push(connectionID)
	} else {
		ConnectionNames[conNameIndex] = connectionID
	}
	Connections[connectionID] = new Connection(connectionID)
	console.log(`Connected ${connectionID}.`)
	res.send(connectionID)
})


app.get('/con/request', (req, res)=>{
	let pars = req.query
	if(u.hasnt(pars, 'connectionID')){
		res.send(fail('No connectionID specified.'))
	} else if(Connections[pars.connectionID] == null){
		res.send(fail('Not connected.'))
	} else {
		let response = done("Received")
		response.data = Connections[pars.connectionID].responses.dequeue()
		Connections[pars.connectionID].timeConnected = 0
		res.send(response)
	}
})

setInterval(()=>{
	for(let i = 0; i<ConnectionNames.length; i++){
		if(ConnectionNames[i] == null) continue
		let con = Connections[ConnectionNames[i]]
		con.timeConnected += 2
		if(con.timeConnected >= 30){
			console.log("Connection " + ConnectionNames[i] + " timed out.")
			Connections[ConnectionNames[i]] = null
			ConnectionNames[i] = null
		}
	}
}, 2000)


get('/test', ['connectionID'], (pars)=>{
	Connections[pars.connectionID].send('Hello World')
	return 'fuck you'
})

app.listen(port, ()=>{
	console.log(`Listening on port ${port}...`)
})



