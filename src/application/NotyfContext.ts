import { createContext } from "react";
import { Notyf } from "notyf";

const NotyfContext = createContext(
    new Notyf({
        // @ts-ignore
        className: "z-50",
        duration: 5000,
        position: {
            x: "right",
            y: "top"
        },
        ripple: true,
        dismissible: true
    })
);

export default NotyfContext;
export { NotyfContext };
