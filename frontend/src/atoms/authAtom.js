// Determine we are in login page or in signup page

import { atom } from 'recoil';

const authScreenAtom = atom({
    key: 'authScreenAtom',  //inorder to differentiate between atoms
    default: 'login', // default to login page when app starts
})

export default authScreenAtom;