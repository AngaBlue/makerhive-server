import { Endpoint } from "../api";

import GET_USER from "./GET_USER"; 
import GET_ALL_ITEMS from "./GET_ALL_ITEMS";
import GET_ALL_USERS from "./GET_ALL_USERS";
import GET_ALL_RANKS from "./GET_ALL_RANKS";
import PATCH_USER from "./PATCH_USER";

const endpoints: Endpoint[] = [
    GET_USER,
    GET_ALL_ITEMS,
    GET_ALL_USERS,
    GET_ALL_RANKS,
    PATCH_USER
]

export default endpoints;