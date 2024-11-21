import { PropsWithChildren } from "react";
import { RealmProvider } from '@realm/react'
import {Boilers} from '../models/Task'

export default function RealmCustomProvider({ children }: PropsWithChildren) {
    return (
        <RealmProvider schema={[]}>
            {children}
        </RealmProvider>
    );
}