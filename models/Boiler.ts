import { BSON, ObjectSchema, Realm } from "realm";
import UUID from "react-native-uuid";

export class Boiler extends Realm.Object<Boiler> {
  id!: string;
  name!: string;
  status: boolean = false;
  sensor_data!: {
    humidity: number;
    pressure: number;
    temperature: number;
    rotation_speed: number;
  };

  static primaryKey = "id";
}
