import { BSON, ObjectSchema, Realm } from "realm";

export class Boilers extends Realm.Object<Boilers> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  name!: string;
  isComplete: boolean = false;
  user_id!: string;

  static primaryKey?: "_id";
}
