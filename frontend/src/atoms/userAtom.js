// redirect into home page after signup/login
import { atom } from "recoil";

const userAtom = atom({
	key: "userAtom",
	default: JSON.parse(localStorage.getItem("user-threads")),
});

//3:50

// all information of user are stored in localStorage(browser   )

export default userAtom;