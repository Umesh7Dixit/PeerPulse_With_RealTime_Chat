import { useToast } from "@chakra-ui/react"
import { useCallback } from "react";

const useShowToast = () => {
    const toast = useToast();
    const showToast = useCallback((title,description,status) => {
        toast({
            title:title,
            description:description,
            status:status,
            duration: 3000,
            isClosable: true
        });
    },[toast]);

  return showToast;
}

export default useShowToast;

// we use useCallback due to when we use showToast on userPage.jsx we get error
// so we put showToast on adjacent to username then due to this it cause infinity loop
// so to remove this type of error we use useCallback