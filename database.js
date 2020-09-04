const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/grocery',(err)=> {

if(err)
{console.log('la connection a mongoDB a echoue. :' +JSON.stringify(err,undefined,2));}
else
{console.log('la connection a mongoDB a reussi.');}
} );

module.exports = mongoose;