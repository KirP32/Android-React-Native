import {BSON, ObjectSchema, Realm } from 'realm'

export class Boilers extends Realm.Object<Boilers> {
    _id!: BSON.ObjectId;
    name!: string;
  
    static schema: ObjectSchema = {
      name: 'Boilers',
      properties: {
        _id: 'objectId', 
        name: {type: 'string', indexed: 'full-text'},
      },
      primaryKey: '_id',
    };
  }