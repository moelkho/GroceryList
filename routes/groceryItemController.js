const express = require('express');
var router = express.Router();

var { GroceryItem } = require('../models/groceryitem');
var ObjectId = require('mongoose').Types.ObjectId;


// page d accueuil
router.get('/', (req, res) => {

    GroceryItem.find((err, docs) => {
        if (err) { console.log('erreur de chargement de la liste des items :' + JSON.stringify(err, undefined, 2)); }
        else {
            res.render('index',
                {
                    viewTitle: "Inserez un nouveau produit",
                    doc: docs
                });
        }
    });

});

// get tous les elements de la liste d'achat
router.get('/list', (req, res) => {

    GroceryItem.find((err, docs) => {
        var total =0;
        if (err) { console.log('erreur de chargement de la liste des items :' + JSON.stringify(err, undefined, 2)); }
        else {

            for(var i=0; i<docs.length;i++)
            { total = total + docs[i].expectedprice;}

            res.render('list',
                { docs: docs,
                totals : total });
                
        }
    });

});
// get with un id pour retourer un element specifique grace a son id
router.get('/:id', (req, res) => {

    // verifier si l'id passe en argument est un id mongodb valide
    if (!ObjectId.isValid(req.params.id)) { return res.status(400).send(`aucun item enregistre avec le id donne : ${req.params.id}`); }

    GroceryItem.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render('index', {
                viewTitle: "Editer un item",
                doc: doc
            });
        }
        else { console.log('erreur de chargement de litem demande :' + JSON.stringify(err, undefined, 2)); }
    });



});

// put request : pour modifier les items

router.put('/edit/:id', (req, res) => {

    // on cherche si l id passe en parametre n'est pas un mongodb id valide
    if (!ObjectId.isValid(req.params.id)) { return res.status(400).send(`aucun item enregistre avec le id donne : ${req.params.id}`); }

    // si c 'est un id valide on cree un objet item avec les donnes modifiees 
    else {
        var item = {

            title: req.body.title,
            quantity: req.body.quantity,
            expectedprice: req.body.expectedprice

        };

        /* on utilise la methode findbyIdAndUpdate on lui passant 4 parametres :l'id , les donnees modifiees
        
        le parametre new a true pour retourner l'item modifie au lieu de l original qui sera stocke dans
        la variable doc(document) et une fonction de call back 
        pour traiter les eventuelles erreurs*/
        GroceryItem.findByIdAndUpdate(req.params.id, { $set: item }, { new: true }, (err, doc) => {
            if (err) { console.log('erreur dans la mise a jour de l item :' + JSON.stringify(err, undefined, 2)); }
            else {
                console.log(doc);
                res.render('index',
                    {
                        viewTitle: "Editez un item"
                    });

            }

        });
    }
});


// delete request : supprimer un item en utilisant la methode get

router.get('/delete/:id', (req, res) => {


    GroceryItem.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/grocery/list');
        }
        else { console.log('Erreur lors de la suppression de l\'item :' + err); }
    });


});
/*post request pour ajouter un item si le 
id est vide si le id n est pas vide donc on modifie l element en question car avec html je n ai pas reussi
a utiliser la methode put et delete, j'etais contraint d utiliser get et post pour les operations
*/
router.post('/', (req, res) => {
    if (req.body._id == '') {
        var item = new GroceryItem({

            title: req.body.title,
            quantity: req.body.quantity,
            expectedprice: req.body.expectedprice

        });
        item.save((err, doc) => {
            if (err) { console.log('erreur dans la sauvegarde de l\'item :' + JSON.stringify(err, undefined, 2)); }
            else {

                res.redirect('list');
            }
        });
    }
    else
    {
       

        
        GroceryItem.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc)=> {
            if (err) { console.log('erreur dans la mise a jour de l item :' + JSON.stringify(err, undefined, 2)); }
            else {
                res.redirect('list');

            }

        });
    }

});

module.exports = router;
