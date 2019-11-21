/**
 * All'interno di eventBus troviamo tutti gli eventi generati dalle regole, per poterli rendere vidibili in ogni parte del codie
 * si e' reso neccessario creare una variabile globale
 * @type {internal}
 */
// [Vittoria] è una lista di EventEmitter, ogni volta che c'è un evento viene aggiunto un elemento qui dentro
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('uncaughtException', function (err) {
    console.error(err);
});

module.exports = emitter;