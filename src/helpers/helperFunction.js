import { useSelector } from "react-redux";

export function checkExist(list, key) {
    var found = false;
    list.map(element => {
        if (element._id == key) found = true;
    });
    
    return found;
}