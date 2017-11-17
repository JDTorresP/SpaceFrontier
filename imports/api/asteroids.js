import { Mongo } from 'meteor/mongo';
 
export const AsteroidsDB = new Mongo.Collection('Asteroids');
//Samuel Baquero no qutiaron el autopublish ni el insecure.
//Deberían verse en esta página los publish de los datos del collection.
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('Asteroids', function asteroidsPublication() {
    return AsteroidsDB.find();
  });
}
//Y los métodos que modifican la base de datos.
Meteor.methods({
  'asteroids.insert'({asteroid}) {
   //Algo que identifique que el usuario puede realizar la operación.
    AsteroidsDB.insert({
      asteroid
    });
  },
  'asteroids.remove'(asteroidId) {
    AsteroidsDB.remove(asteroidId);
  },
});
