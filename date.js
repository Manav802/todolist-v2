
let today  = new Date();
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

module.exports.getDate=function ()
{
	return today.toLocaleDateString("en-US", options); 
}

module.exports.getDay=function ()
{
	return today.toLocaleDateString("en-US", options.weekday); 
}