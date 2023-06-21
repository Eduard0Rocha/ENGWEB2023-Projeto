var file = require("../models/file");

var comentarioController = require("./comentario");

module.exports.getFileById = id => {

    return file.findOne({_id:id})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
}

module.exports.list = () => {

    return file.find()
        .then(res => {
            
            var res_w_data = [];

            var promises = res.map(entrada => {

            return comentarioController.getComentariosDoRecurso(entrada._id)
                
                .then(comentarios => {
                    
                    res_w_data.push({
                        
                        _id: entrada._id,
                        createdAt: entrada._id.getTimestamp(),
                        titulo: entrada.titulo,
                        subtitulo: entrada.subtitulo,
                        tipo: entrada.tipo,
                        visibilidade: entrada.visibilidade,
                        produtor: entrada.produtor,
                        filename: entrada.filename,
                        temas: entrada.temas,
                        comentarios: comentarios
                    });
                })
                
                .catch(err2 => {
                    
                    console.log("Erro ao obter os comentários: " + err2);
                });
            });

            return Promise.all(promises).then(() => res_w_data);
        })
        .catch(err => {
            return err;
        })
}

module.exports.createFile = f => {

    f.file = f.file+"d";

    return file.create(f)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
}

module.exports.deleteFile = id => {

    return file.deleteOne({"_id" : id})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
}

module.exports.getTemas = curso_uni => {

    return file.find({
        visibilidade:"público", 
        $or:[
            {curso_uni:curso_uni}, 
            {curso_uni:null}]
        },
        {_id: 0, temas: 1})
        
        .then(res => {

            var temasUnicos = [];

            res.forEach(entrada => {

                entrada.temas.forEach(tema => {
                  
                    if (!temasUnicos.includes(tema)) {
                        
                        temasUnicos.push(tema);
                  }
                });
            });

            return temasUnicos;
        })

        .catch(err => {
            return err;
        })
}

module.exports.getNoticias = curso_uni => {

    return file.find({
        visibilidade: "público", 
        $or: [ 
            { curso_uni: curso_uni }, 
            { curso_uni: null }] 
        }, 
        {_id:1,titulo:1,produtor:1})
        .sort({_id:-1})

        .then(res => {

            res_w_data = [];

            res.forEach(entrada => {

                res_w_data.push({

                    createdAt: entrada._id.getTimestamp(),
                    titulo: entrada.titulo,
                    produtor: entrada.produtor
                });
            });

            return res_w_data;
        })

        .catch(err => {

            return err;
        });
}

module.exports.getFileInfoForConsumer_noFilter = (curso_uni) => {

    return file.find({
        visibilidade: "público", 
        $or: [ 
            {curso_uni: curso_uni}, 
            { curso_uni: null }
        ]})
        .sort({_id:-1})

        .then(res => {

            var res_w_data = [];

            var promises = res.map(entrada => {

            return comentarioController.getComentariosDoRecurso(entrada._id)
                
                .then(comentarios => {
                    
                    res_w_data.push({
                        
                        _id: entrada._id,
                        createdAt: entrada._id.getTimestamp(),
                        titulo: entrada.titulo,
                        subtitulo: entrada.subtitulo,
                        tipo: entrada.tipo,
                        visibilidade: entrada.visibilidade,
                        produtor: entrada.produtor,
                        filename: entrada.filename,
                        temas: entrada.temas,
                        comentarios: comentarios
                    });
                })
                
                .catch(err2 => {
                    
                    console.log("Erro ao obter os comentários: " + err2);
                });
            });

            return Promise.all(promises).then(() => res_w_data);
        })

        .catch(err => {

            return err;
        });
}

module.exports.getFileInfoForConsumer_filterByTema = (curso_uni, tema) => {

    return file.find({
        visibilidade: "público", 
        $or: [ 
            {curso_uni: curso_uni}, 
            { curso_uni: null }
        ]})
        .sort({_id:-1})

        .then(res => {

            var res_w_data = [];

            var promises = res.map(entrada => {

            return comentarioController.getComentariosDoRecurso(entrada._id)
                
                .then(comentarios => {

                    if (entrada.temas.includes(tema)) {

                        res_w_data.push({
                        
                            _id: entrada._id,
                            createdAt: entrada._id.getTimestamp(),
                            titulo: entrada.titulo,
                            subtitulo: entrada.subtitulo,
                            tipo: entrada.tipo,
                            visibilidade: entrada.visibilidade,
                            produtor: entrada.produtor,
                            filename: entrada.filename,
                            temas: entrada.temas,
                            comentarios: comentarios
                        });
                    }
                })
                
                .catch(err2 => {
                    
                    console.log("Erro ao obter os comentários: " + err2);
                });
            });

            return Promise.all(promises).then(() => res_w_data);
        })

        .catch(err => {

            return err;
        });
}

module.exports.getFileInfoForConsumer_filterByProdutor = (curso_uni, produtor) => {

    return file.find({
        visibilidade: "público", 
        $or: [ 
            {curso_uni: curso_uni}, 
            { curso_uni: null }
        ]})
        .sort({_id:-1})

        .then(res => {

            var res_w_data = [];

            var promises = res.map(entrada => {

            return comentarioController.getComentariosDoRecurso(entrada._id)
                
                .then(comentarios => {

                    if (entrada.produtor == produtor) {

                        res_w_data.push({
                        
                            _id: entrada._id,
                            createdAt: entrada._id.getTimestamp(),
                            titulo: entrada.titulo,
                            subtitulo: entrada.subtitulo,
                            tipo: entrada.tipo,
                            visibilidade: entrada.visibilidade,
                            produtor: entrada.produtor,
                            filename: entrada.filename,
                            temas: entrada.temas,
                            comentarios: comentarios
                        });
                    }
                })
                
                .catch(err2 => {
                    
                    console.log("Erro ao obter os comentários: " + err2);
                });
            });

            return Promise.all(promises).then(() => res_w_data);
        })

        .catch(err => {

            return err;
        });
}

module.exports.getFileInfoForConsumer_filterByTemaEProdutor = (curso_uni, tema, produtor) => {

    return file.find({
        visibilidade: "público", 
        $or: [ 
            {curso_uni: curso_uni}, 
            { curso_uni: null }
        ]})
        .sort({_id:-1})

        .then(res => {

            var res_w_data = [];

            var promises = res.map(entrada => {

            return comentarioController.getComentariosDoRecurso(entrada._id)
                
                .then(comentarios => {

                    if (entrada.temas.includes(tema) && entrada.produtor == produtor) {

                        res_w_data.push({
                        
                            _id: entrada._id,
                            createdAt: entrada._id.getTimestamp(),
                            titulo: entrada.titulo,
                            subtitulo: entrada.subtitulo,
                            tipo: entrada.tipo,
                            visibilidade: entrada.visibilidade,
                            produtor: entrada.produtor,
                            filename: entrada.filename,
                            temas: entrada.temas,
                            comentarios: comentarios
                        });
                    }
                })
                
                .catch(err2 => {
                    
                    console.log("Erro ao obter os comentários: " + err2);
                });
            });

            return Promise.all(promises).then(() => res_w_data);
        })

        .catch(err => {

            return err;
        });
}

module.exports.getRecursosDoProdutor = produtor => {

    return file.find({produtor:produtor})
        .then(res => {

            var res_w_data = [];

            var promises = res.map(entrada => {

            return comentarioController.getComentariosDoRecurso(entrada._id)
                
                .then(comentarios => {

                        res_w_data.push({
                        
                            _id: entrada._id,
                            createdAt: entrada._id.getTimestamp(),
                            titulo: entrada.titulo,
                            subtitulo: entrada.subtitulo,
                            tipo: entrada.tipo,
                            visibilidade: entrada.visibilidade,
                            produtor: entrada.produtor,
                            filename: entrada.filename,
                            temas: entrada.temas,
                            comentarios: comentarios
                        });
                })
                
                .catch(err2 => {
                    
                    console.log("Erro ao obter os comentários: " + err2);
                });
            });

            return Promise.all(promises).then(() => res_w_data);
        })
        .catch(err => {
            return err;
        })
}