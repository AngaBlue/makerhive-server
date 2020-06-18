import { Endpoint } from "../api";

import GET_USER from "./GET_USER";
import GET_ALL_ITEMS from "./GET_ALL_ITEMS";
import GET_ALL_USERS from "./GET_ALL_USERS";
import GET_ALL_RANKS from "./GET_ALL_RANKS";
import PATCH_USER from "./PATCH_USER";
import PATCH_RETURN_LOAN from "./PATCH_RETURN_LOAN"
import GET_ITEM from "./GET_ITEM";
import GET_USER_PROFILE from "./GET_USER_PROFILE"
import GET_ALL_RESERVATIONS from "./GET_ALL_RESERVATIONS"
import GET_ALL_LOANS from "./GET_ALL_LOANS"
import GET_NOTIFICATIONS from "./GET_NOTIFICATIONS"
import POST_LOAN_ITEM from "./POST_LOAN_ITEM"
import POST_ADD_ITEM from "./POST_ADD_ITEM"
import PATCH_ITEM from "./PATCH_ITEM"



const endpoints: Endpoint[] = [
    GET_USER,
    GET_ALL_ITEMS,
    GET_ALL_USERS,
    GET_ALL_RANKS,
    PATCH_USER,
    GET_ITEM,
    GET_USER_PROFILE,
    PATCH_RETURN_LOAN,
    GET_ALL_RESERVATIONS,
    GET_ALL_LOANS,
    GET_NOTIFICATIONS,
    POST_ADD_ITEM,
    POST_LOAN_ITEM,
    PATCH_ITEM
]

export default endpoints;