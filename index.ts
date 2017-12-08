import * as Stanford from "stanford-ner"; // biblioteca de Stanford que facilita o uso do Natural Node
let ner = new Stanford.NER(); // nova instancia de NER
let cfg = require('./config.json'); // obtendo o arquivo de configuracao
let MongoClient = require('mongodb').MongoClient; // obtendo o cliente para se conectar no mongo 
let query = require('./query'); // obtendo a string que contém a query inicial que será executada pelo MongoDB
let regras = require('./regras'); // obtendo a string que contém a query inicial que será executada pelo MongoDB
let latinize = require('latinize'); // Para tornar a string Latina (sem acentos). Necessario para ser processada no idioma ingles
let colResultado; // referencia da collection que sera salva o resultado

/*
 * Esta função é responsável por analisar a propriedade "est" dentro de 
 * cada documento e usar a biblioteca Stanford NER como facilitadora do 
 * uso da Natural Node. Ela classifica o texto em entidades, tais como 
 * Organizações e Pessoas. Identificado as pessoas no texto,
 * é substituído por outro genérico, com o intuito de remover nomes próprios
 * da história recuperada do Facebook.
 * @param docs 
 */
async function analisar(docs) {
    let val;

    // Iterando os documentos retornados da consulta
    for (let item of docs) {
        // Verificando se o documento possui a propriedade "est"
        if (item.est) {
            // Verificando a propriedade "est" possui indice valido
            if (item.est[0]) {
                // Removendo os acentos e outros caracteres e transformando os arrays de historias numa string unica
                item.est = latinize(item.est.join(''));
                // Se a string contém link, é analisada de forma diferente (sem link)
                if (item.est.indexOf('http') > -1) {
                    // ner.getEntities obtém as entidades do texto
                    val = await ner.getEntities(item.est.split('http')[0]);
                } else {
                    val = await ner.getEntities(item.est);
                }
                // Com as entidades recuperadas, é iterado para verificar se contém PERSON (Pessoas)
                if (val) {
                    val.forEach((entidade) => {
                        entidade.forEach((value, key) => {
                            // Verifica se o Mapa tem PERSON
                            if (key == 'PERSON') {
                                // Se tiver, itera sobre os nomes (PEOPLE)
                                value.forEach((nome) => {
                                    // Troca o nome identificado por um texto
                                    item.est = item.est.replace(nome, 'Somewho');
                                    item.subject = regras(item.est);
                                })
                            }
                        });
                    })
                }
            }
        }
        // Após o processamento do documento, é salvo
        salvar(item);
    }
    // Chegou ao fim desse ciclo
    console.log("Processo concluido");
}

/*
* Esta função salva um documento passado por argumento em uma nova collection do MongoDB
*/ 
function salvar(data) {
    colResultado.save(data, function(e, s) {
        // Callback da operação de salvar
        console.log("Inserido");
    });
}

/*
* Função principal do script, ela se conecta na base de dados e realiza a consulta. 
*/ 
function main() {
    
    // Conectando no MongoDB
    MongoClient.connect(cfg.URI_MONGO, function(err, db) {
        // salvando o nome da collection onde estão os dados
        let col = db.collection('questionarios');
        // salvando o nome da collection onde será salvo os resultados tratados
        colResultado = db.collection('questionarios_nlp');
        // Execução de agregação do MongoDB
        col.aggregate(query, {
            allowDiskUse: true
        }).toArray(function(erro, docs) {
            if (!erro) {
                // se nao houver erro, invoca iniciar
                iniciar(docs);
            } else {
                console.log("Erro encontrado", erro);
            }
        })
    });

}

/*
* Função separa devido o conteudo ser síncrono. Essa função invoca a função que analisará 
* o texto de forma síncrona. 
*/ 
async function iniciar(data) {
    
    // await irá esperar até que todos os documentos (registros) sejam processandos 
    await analisar(data);
    // finalizando o Stanford NER
    ner.exit();
}

/*
* Invocando a função principal que irá iniciar a operação
*/ 
main();