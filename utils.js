
function getFirstNull(arr){
	for(let i = 0; i<arr.length; i++){
		if(arr[i] == null) return i
	}
	return -1
}

function findInArray(arr, prop, val){
	for(let i = 0; i<arr.length; i++){
		if(arr[i][prop] == val) return i
	}
	return null
}

function randomOf(...args){
	return args[randomInt(0, args.length - 1)];
}

function randomInt(low, high){
	return Math.floor(Math.random() * (high - low + 1) + low);
}


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

function forEachKey(object, func){
	for (var key in object) {
		if (!object.hasOwnProperty(key)) continue;
		func(key);
	}
}


module.exports.findInArray = findInArray
module.exports.randomOf = randomOf
module.exports.randomInt = randomInt
module.exports.has = has
module.exports.hasnt = hasnt
module.exports.forEachKey = forEachKey
module.exports.getFirstNull = getFirstNull









