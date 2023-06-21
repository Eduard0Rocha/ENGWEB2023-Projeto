var express = require('express');
var router = express.Router();
var axios = require("axios");
var auth = require('../auth/auth');
var file = require("../controllers/file");
var user = require("../controllers/user");
var curso = require("../controllers/curso");
var fs = require("fs");
var AdmZip = require('adm-zip');
const archiver = require('archiver');
const { isReadable } = require('stream');

function listarArquivosRecursivamente(pasta) {

    const arquivos = fs.readdirSync(pasta);

    result = [];

    for (let a of arquivos) {

        var caminhoCompleto = pasta + "/" + a;

        var stat = fs.statSync(caminhoCompleto);

        if (stat.isFile()) {

            result.push(caminhoCompleto);
        }

        else {

            if (stat.isDirectory()) {

                result = result.concat(listarArquivosRecursivamente(caminhoCompleto));
            }
        }
    }

    return result;
}

async function analisaPacote(nomeDaPasta) {

    var relatorio = {};

    try {

        var data = fs.readFileSync(nomeDaPasta + "/manifest.txt", "utf-8")
        
        console.log("manifest.txt encontrado");

        filePaths = data.split("\n");

        for (let filep of filePaths) {

            if (!fs.existsSync(nomeDaPasta + "/" + filep)) {

                relatorio.erro = "Ficheiro " + filep + " não encontrado";

                return relatorio;
            }
        }

        console.log("Todos os ficheiros existem");

        var ficheirosNaPasta = listarArquivosRecursivamente(nomeDaPasta);

        for (let f of ficheirosNaPasta) {

            var f_aux = f.replace(nomeDaPasta+"/","");

            if (f_aux == "manifest.txt") continue;

            if (!filePaths.includes(f_aux)) {

                relatorio.erro = "Ficheiro " + f_aux + " não referido no manifest.txt";

                return relatorio;
            }
        }

        console.log('\x1b[32m%s\x1b[0m',"Tudo OK com o ficheiro :)");

        relatorio.confirmacao = "Ficheiro publicado com sucesso";

        return relatorio;
    }

    catch (err) {

        relatorio.erro = "Ficheiro manifest.txt não encontrado";

        return relatorio;
    }
}

router.post("/addRecurso", auth.verificaAcesso, function(req,res) {

    var newFileInfo = req.body;

    var filename = newFileInfo.filename;

    // cria o registo do ficheiro na base de dados
    file.createFile(newFileInfo)

        .then(data => {

            axios.get("http://localhost:3001/addRecurso/download", {

                params: {

                    key: "key",
                    file: filename
                },
                responseType: 'stream'
            })

            .then(r => {

                // recebe o pacote e armazena na pasta fileStore

                if (!fs.existsSync("fileStore")) {

                    fs.mkdirSync("fileStore");
                }

                const fileStream = fs.createWriteStream("fileStore/" + filename);

                r.data.pipe(fileStream);
  
                fileStream.on('finish', () => {
                   
                    console.log("Ficheiro armazenado");

                    // descomprime o pacote

                    filePath = "fileStore/" + filename;

                    var zipFile = new AdmZip(filePath);

                    var dirPath = filePath + "d";

                    zipFile.extractAllTo(dirPath, true);
                
                    console.log("Conteúdo extraído");

                    fs.unlinkSync(filePath, (err) => {

                        if (err) {

                            console.log("Erro ao eliminar o ficheiro comprimido");
                        }

                        else {

                            console.log("Ficheiro comprimido removido");
                        }                        
                    });

                    // analisa a estrutura do ficheiro

                    analisaPacote(dirPath)
                        .then(relatorio => {

                            if (relatorio.erro) {

                                file.deleteFile(data._id)
                                    .then(data2 => {
                                        console.log("Ficheiro removido da base de dados");
                                    })
                                    .catch(err2 => {
                                        console.log("Erro ao remover o ficheiro da base de dados");
                                    })

                                try {

                                    fs.rmdirSync(dirPath, {recursive: true});

                                    console.log("Recurso removido da API");
                                }

                                catch (erroRemoverRecurso) {

                                    console.log("Erro ao eliminar o recurso: " + erroRemoverRecurso);
                                }
                            }

                            res.send(relatorio);

                        })
                        .catch(errAnalisaPacote => {
                            console.log(errAnalisaPacote);
                        } )
                });
            })

            .catch(err => {

                console.log("Erro ao receber o ficheiro: " + err);
            })
        })

        .catch(erro => {

            res.status(500).json(erro);
        })
});

router.get("/download/:name", function(req,res) {
    
    var folderPath = "fileStore/" + req.params.name + "d";
    var zipPath = "fileStore/" + req.params.name;

    if (fs.existsSync(zipPath)) {

        return res.status(500).send("O ficheiro está a ser utilizado agora. Por favor, aguarde :)")
    }
    
    const outputZip = fs.createWriteStream(zipPath);
    const archive = archiver('zip');

    outputZip.on('close', () => {
        console.log('Arquivo comprimido com sucesso!');

        res.download(zipPath);

        res.on('close', () => {

            fs.unlink(zipPath, (err) => {

                if (err) {
    
                    console.log("Erro ao eliminar o ficheiro");
                }
            })
        })
    });

    archive.on('error', (err) => {
        throw err;
    });
    
    archive.directory(folderPath, false);

    archive.pipe(outputZip);
    archive.finalize();
});

router.get("/consumidorPageData", auth.verificaAcesso, function(req,res) {

    var tema = req.query.tema;
    var produtor = req.query.produtor;

    user.getUserByName(req.user.username)
        .then(data => {

            var curso_nome = data.curso;
            var universidade = data.universidade;

            curso.getIdByInfo(curso_nome,universidade)
                .then(data2 => {

                    var curso_uni = data2;

                    file.getTemas(curso_uni)
                        .then(temas => {

                            file.getNoticias(curso_uni)
                                .then(noticias => {

                                    user.getProdutores()
                                        .then(produtores => {

                                            var hasTema = tema != "";
                                            var hasProdutor = produtor != "";

                                            if (!hasTema && !hasProdutor) { // nao há qualquer filtro

                                                file.getFileInfoForConsumer_noFilter(curso_uni)
                                                    .then(recursos => {

                                                        return res.status(200).json({
                                                            produtores: produtores,
                                                            temas: temas,
                                                            noticias: noticias,
                                                            recursos: recursos
                                                        });
                                                    })
                                                    .catch(err6 => {
                                                        return res.sendStatus(500).json(err6);
                                                    })
                                            }

                                            else {

                                                if (hasTema) { 

                                                    if (hasProdutor) { // ambos os filtros são aplicados

                                                        file.getFileInfoForConsumer_filterByTemaEProdutor(curso_uni,tema,produtor)
                                                            .then(recursos => {

                                                                return res.status(200).json({
                                                                    produtores: produtores,
                                                                    temas: temas,
                                                                    noticias: noticias,
                                                                    recursos: recursos
                                                                });
                                                            })
                                                            .catch(err6 => {
                                                                return res.sendStatus(500).json(err6);
                                                            })
                                                    }

                                                    else { // apenas o filtro do tema é aplicado

                                                        file.getFileInfoForConsumer_filterByTema(curso_uni,tema)
                                                            .then(recursos => {

                                                                return res.status(200).json({
                                                                    produtores: produtores,
                                                                    temas: temas,
                                                                    noticias: noticias,
                                                                    recursos: recursos
                                                                });
                                                            })
                                                            .catch(err6 => {
                                                                return res.sendStatus(500).json(err6);
                                                            })
                                                    }
                                                }

                                                else { // apenas o filtro do produtor é aplicado

                                                    file.getFileInfoForConsumer_filterByProdutor(curso_uni,produtor)
                                                        .then(recursos => {
                                                            
                                                            return res.status(200).json({
                                                                produtores: produtores,
                                                                temas: temas,
                                                                noticias: noticias,
                                                                recursos: recursos
                                                            });
                                                        })
                                                        .catch(err6 => {
                                                            return res.sendStatus(500).json(err6);
                                                        })
                                                }
                                            }
                                        })

                                        .catch(err5 => {

                                            return res.sendStatus(500).json(err5);
                                        })
                                })
                                .catch(err4 => {

                                    return res.sendStatus(500).json(err4);
                                })
                        })
                        .catch(err3 => {
                            return res.sendStatus(500).json(err3);
                        })
                }) 
                .catch(err2 => {
                    return res.sendStatus(500).json(err2);
                })
        })
        .catch(err => {
            return res.sendStatus(500).json(err);
        })
});

router.get("/produtorPageData", auth.verificaAcesso, function(req,res) {

    var produtor = req.user.username;

    file.getRecursosDoProdutor(produtor)
        .then(data => {

            return res.status(200).json(data)
        })
        .catch(err => {

            return res.status(500).json(err);
        })
});

router.delete("/:id", auth.verificaAcesso, function(req,res) {

    var idRecurso = req.params.id;

    user.getUserByName(req.user.username)
        .then(user => {

            var nivel = user.nivel;

            file.getFileById(idRecurso)
                .then(recurso => {

                    var isAdmin = (nivel == "Administrador");
                    var isProdutorDoFich = (recurso.produtor == user.username);

                    if (isAdmin || isProdutorDoFich) {

                        console.log(recurso.filename);

                        fs.rmSync("fileStore/"+recurso.filename+"d", {recursive:true, force:true});

                        file.deleteFile(idRecurso)
                            .then(data => {

                                return res.status(204).json(data);
                            })
                            .catch(err => {
                                
                                return res.status(500).json(err);
                            })
                    }

                    else {

                        return res.status(401).data("Sem permissão para eliminar o ficheiro");
                    }
                })
                .catch(err => {
                    return res.status(500).json(err);
                })
        })
        .catch(err => {
            return res.status(500).json(err);
        })
});

module.exports = router;