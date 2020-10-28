'use strict'

const { removeAllListeners } = require('nodemon');
var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Article = require('../models/article');

var controller = {

    datosCurso: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en Framework JS',
            autor : 'Carlos Rios Suarez',
            url : 'carlosriossuarez.pe',
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de artículos'
        });
    },

    save: (req, res) => {
        //recoger los parametros por post
        var params = req.body; 

        //validar datos
        try {
            
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (error) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }

        if(validate_title && validate_content){
            
            //crear el objeto a guardar
            var article = new Article();

            //asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            //guardar el articulo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El artículo no se ha guardado'
                    });   
                } 

                //devolver respuesta
                return res.status(200).send({
                    status:'success',
                    article
                });

            }) 

        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            });    
        }  
    },

    getArticles: (req, res) => {

        var query = Article.find({})

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }

        //Find
        //// -id ordena de manera descendente por id
        query.sort('-id').exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al obtener los articulos'
                });    
            }

            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });    
            }

            return res.status(200).send({
                status: 'success',
                articles
            }); 
        })   

    },

    getArticle: (req, res) => {

        // Recoger el id de la url
        var articleId = req.params.id;

        // Comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el artículo'
            });  
        }

        // Buscar el articulo
        Article.findById(articleId, (err, article) => {

            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el artículo'
                });  
            }

            //Devolver en json

            return res.status(200).send({
                status: 'success',
                article
            });    

        })
   
    },

    update: (req, res) => {
        // Recoger el Id del articulo por la url
        var articleId = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por envíar '
            });  
        }

        
        if (validate_title && validate_title) {
            //Find and update
            Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });     
                }

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el artículo'
                    });  
                }

                // Find and Update
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });  
            })
        }else{
            // Find and Update
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta'
            });  
        } 
    },

    delete: (req, res) => {
        // Recoger el id de la url
        var articleId = req.params.id;
        console.log("1", articleId);
        // Find and delete
        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
            console.log("2", err);
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar'
                });          
            }
            console.log("3");
            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el artículo'
                });          
            }
            console.log("4");
            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });

        });
    },

    upload: (req, res) => {
        // Configurar el modulo del connect multiparty router/article.js


        //Recoger el fichero de la petición

        var file_name = 'Imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: files.file_name
            })
        }

        //Coneguir nombre y extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        // var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // Comprobar la extensión, solo imagenes, si es validoo borrar fichero

        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            // borrar el archivo subido    
            fs.unlink(file_path,(err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extesión de la imagen no es válida'
                });             
            });
        }
        else
        {
            // Si todo es válido - obtener id de la URL
            var articleId = req.params.id;
            // Buscar el articulo y , asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {
                if (err || !articleUpdated) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al guardar la imagen de artículo'
                    });             
                }

                return res.status(404).send({
                    status: 'success',
                    article: articleUpdated
                });  

            });
        } 
    },

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/' + file;

        fs.exists(path_file, (exists) => {
            if(exists)
            {
                return res.sendFile(path.resolve(path_file))
            }   
            else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });   
            }
        })
    },

    search: (req, res) => {

        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        Article.find({ "$or": [
            {"title": { "$regex" : searchString, "$options" : "i"}},
            {"content": { "$regex" : searchString, "$options" : "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }


            if (!articles || articles.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay artículos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });   
        })
        
    } 

}; //end controller

module.exports = controller;