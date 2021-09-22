import React from "react";
import styles from "./Button.module.css";

type propsType={
    title: string
    activeStatus?: boolean
    callBack: () => void
}

export const Button = (props:propsType) => {
    const callBackHandler = () => props.callBack();

    let getValidClassNameForButton = props.activeStatus ? styles.active : "";

    return(
        <button
            className={getValidClassNameForButton}
            onClick={callBackHandler}
        >
            {props.title}
        </button>
    )
}