import {useDispatch} from "react-redux";
import {AppDispatchType} from "./types";
import {ActionCreatorsMapObject, bindActionCreators} from "redux";
import {useMemo} from "react";

export const useAppDispatch = () => useDispatch<AppDispatchType>();

export function useActions<T extends ActionCreatorsMapObject>(actions: T) {
  const dispatch = useAppDispatch();

  const boundActions = useMemo(() => {
    return bindActionCreators(actions, dispatch);
  }, []);

  return boundActions;
}
