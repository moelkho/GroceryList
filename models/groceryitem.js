const mongoose = require('mongoose');

var GroceryItem = mongoose.model('GroceryItem',{

    title : {type: String,
        required: 'Ce champ est obligatoire.'
    },
    quantity : {type: Number,
        required: 'Ce champ est obligatoire.'},
    expectedprice : {type : Number}

});


module.exports = { GroceryItem };