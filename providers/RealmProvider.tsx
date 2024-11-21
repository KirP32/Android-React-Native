import { PropsWithChildren } from "react";
import { RealmProvider } from "@realm/react";
import { Boilers } from "../models/Boiler";

export default function RealmCustomProvider({ children }: PropsWithChildren) {
  return <RealmProvider schema={[Boilers]}>{children}</RealmProvider>;
}
