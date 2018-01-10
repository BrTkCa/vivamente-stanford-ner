"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Stanford = require("stanford-ner"); // biblioteca de Stanford que facilita o uso do Natural Node
let ner = new Stanford.NER(); // nova instancia de NER
let cfg = require('./config.json'); // obtendo o arquivo de configuracao
let MongoClient = require('mongodb').MongoClient; // obtendo o cliente para se conectar no mongo 
let query = require('./query'); // obtendo a string que contém a query inicial que será executada pelo MongoDB
let regras = require('./regras');
let latinize = require('latinize'); // Para tornar a string Latina (sem acentos). Necessario para ser processada no idioma ingles
let colResultado; // referencia da collection que sera salva o resultado
//let Sleep = require('sleep');
/*
 * Esta função é responsável por analisar a propriedade "est" dentro de
 * cada documento e usar a biblioteca Stanford NER como facilitadora do
 * uso da Natural Node. Ela classifica o texto em entidades, tais como
 * Organizações e Pessoas. Identificado as pessoas no texto,
 * é substituído por outro genérico, com o intuito de remover nomes próprios
 * da história recuperada do Facebook.
 * @param docs
 */
function analisar(docs) {
    return __awaiter(this, void 0, void 0, function* () {
        let val, index = 0;
        // Iterando os documentos retornados da consulta
        for (let item of docs) {
            // Verificando se o documento possui a propriedade "est"
            if (item.est) {
                // Verificando a propriedade "est" possui indice valido
                if (item.est[0]) {
                    if (index % 500 == 0) {
                        ner.exit();
                        ner = new Stanford.NER();
                    }
                    ;
                    // Removendo os acentos e outros caracteres e transformando os arrays de historias numa string unica
                    item.est = cleanUp(item.est.join(''));
                    // Se a string contém link, é analisada de forma diferente (sem link)
                    if (item.est.indexOf('http') > -1) {
                        // ner.getEntities obtém as entidades do texto
                        index++;
                        val = yield ner.getEntities(item.est.split('http')[0]);
                    }
                    else {
                        index++;
                        val = yield ner.getEntities(item.est);
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
                                    });
                                }
                            });
                        });
                    }
                }
            }
            // Após o processamento do documento, é salvo
            salvar(item, index);
        }
        // Chegou ao fim desse ciclo
        console.log("Processo concluido");
    });
}
/*
* Esta função salva um documento passado por argumento em uma nova collection do MongoDB
*/
function salvar(data, index) {
    colResultado.save(data, function (e, s) {
        //Callback da operação de salvar
        console.log("Salvando item modificado: ", index);
    });
}
/*
* Esta função troca qualquer caracter que não é uma letra por nada para
* estar apta à Stanford NER
*/
function cleanUp(texto) {
    return latinize(texto.replace(/[^a-z ]+/gi, ''));
}
/*
* Função principal do script, ela se conecta na base de dados e realiza a consulta.
*/
function main() {
    // Conectando no MongoDB
    MongoClient.connect(cfg.URI_MONGO, function (err, db) {
        // salvando o nome da collection onde estão os dados
        let col = db.collection('questionarios');
        // salvando o nome da collection onde será salvo os resultados tratados
        colResultado = db.collection('questionarios_nlp');
        // Execução de agregação do MongoDB
        col.aggregate(query, { allowDiskUse: true }).toArray(function (erro, docs) {
            if (!erro) {
                // se nao houver erro, invoca iniciar
                console.log(docs.length);
                iniciar(docs);
            }
            else {
                console.log("Erro encontrado", erro);
            }
        });
    });
}
/*
* Função separa devido o conteudo ser síncrono. Essa função invoca a função que analisará
* o texto de forma síncrona.
*/
function iniciar(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // await irá esperar até que todos os documentos (registros) sejam processandos 
        yield analisar(data);
        // finalizando o Stanford NER
        ner.exit();
    });
}
/*
* Invocando a função principal que irá iniciar a operação
*/
main();
//# sourceMappingURL=index.js.map