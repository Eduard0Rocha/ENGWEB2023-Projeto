var express = require('express');
var router = express.Router();
var axios = require("axios");
var auth = require('../auth/auth')
var file = require("../controllers/file");
var fs = require("fs");
var AdmZip = require('adm-zip');

// TODO: proteger rotas

// TODO: no cursos, considerar se for todos

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

module.exports = router;