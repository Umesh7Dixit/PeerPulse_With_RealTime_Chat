import { Button } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil"
import userAtom from "../atoms/userAtom"
import useShowToast from "../hooks/useShowToast";
import { IoLogOutOutline } from "react-icons/io5";

const LogoutButton = () => {

    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast();  //creating toast by useShowToast.jsx

    const handleLogout = async () => {
        try {
            // fetch
            const res = await fetch("/api/users/logout",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = await res.json();
            console.log(data);

            if(data.error) {
                // Toast
                 showToast("Error", data.error,"error"); //toast by useShowToast.jsx passing only values to reduce code
                 return ;
            }

            localStorage.removeItem("user-threads");
            setUser(null);

        } catch (error) {
            showToast("Error", error,"error");
        }
    }

  return (
    <Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout} >
        Logout
        <IoLogOutOutline  size={27} />
    </Button>
  )
}

export default LogoutButton