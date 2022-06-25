import {useDispatch} from "react-redux";
import {AppDispatchType} from "./types";

export const useAppDispatch = () => useDispatch<AppDispatchType>();
