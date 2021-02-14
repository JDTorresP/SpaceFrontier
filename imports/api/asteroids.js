// Felipe Iregui : No tienen los meteor methods para el uso de las bases de datos. El documentos tasks.js deberia estar en api
import { Mongo } from 'meteor/mongo';
 
export const AsteroidsDB = new Mongo.Collection('Asteroids');
