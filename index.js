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
const Stanford = require("stanford-ner"); // biblioteca de stanforn que facilita o uso do Natural Node
let ner = new Stanford.NER(); // nova instancia de NER
let cfg = require('./config.json'); // obtendo o arquivo de configuracao
let MongoClient = require('mongodb').MongoClient; // obtendo o cliente para se conectar no mongo 
let query = require('./query');
let latinize = require('latinize'); // Para tornar a string Latina (sem acentos). Necessario para ser processada no idioma ingles
let colResultado; // referencia da collection que sera salva o resultado
function analisar(docs) {
    return __awaiter(this, void 0, void 0, function* () {
        let val;
        for (let item of docs) {
            if (item.est) {
                if (item.est[0]) {
                    item.est = latinize(item.est.join(''));
                    if (item.est.indexOf('http') > -1) {
                        val = yield ner.getEntities(item.est.split('http')[0]);
                    }
                    else {
                        val = yield ner.getEntities(item.est);
                    }
                    if (val) {
                        val.forEach((entidade) => {
                            entidade.forEach((value, key) => {
                                if (key == 'PERSON') {
                                    value.forEach((nome) => {
                                        item.est = item.est.replace(nome, 'Somewho');
                                    });
                                }
                            });
                        });
                    }
                }
            }
            //salvar(item)
            console.log(item);
        }
        console.log("Processo concluido");
    });
}
function salvar(data) {
    colResultado.save(data, function (e, s) {
        console.log("Inserido");
    });
}
function main() {
    MongoClient.connect(cfg.URI_MONGO, function (err, db) {
        let col = db.collection('questionarios');
        colResultado = db.collection('questionarios_nlp');
        col.aggregate(query).toArray(function (erro, docs) {
            console.log(erro, docs);
            if (!erro) {
                iniciar(docs);
            }
            else {
                console.log("Erro encontrado");
            }
        });
    });
}
function iniciar(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield analisar(data);
        console.log("Finalizando aplicacao");
        ner.exit();
    });
}
main();
//# sourceMappingURL=index.js.map