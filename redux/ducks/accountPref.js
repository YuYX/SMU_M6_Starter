export const LIGHT_MODE = "light_mode";
export const DARK_MODE = "dark_mode";
export const UPLOAD_PIC = "upload_pic";
export const DELETE_PIC = "delete_pic";
export const CHANGE_MODE = "change_mode";
export const UPLOAD_MAC = "upload_mac";

const initialState = {
    isDark : false,
    profilePicture: null,
    macAddress: "",
};

export function lightModeAction() {
    return {
      type: LIGHT_MODE,
    };
}

export function darkModeAction() {
    return {
      type: DARK_MODE,
    };
}

export function changeModeAction(){
    return { type: CHANGE_MODE };
};

export function uploadPicAction(){
    return { type: UPLOAD_PIC };
};

export function deletePicAction(){
    return { type: DELETE_PIC };
};

export function uploadMacAction(){
    return { type: UPLOAD_MAC };
}

export default function accountPrefReducer(state = initialState, action){
    switch (action.type){
        case LIGHT_MODE:
            return {  ...state,  isDark: false };
        case DARK_MODE:
            return {  ...state, isDark: true };
        case CHANGE_MODE:
            return {...state, isDark: !state.isDark };
        case UPLOAD_PIC:
            return { ...state, profilePicture: action.payload };
        case DELETE_PIC:
            return { ...state, profilePicture: null };
        case UPLOAD_MAC:
            return { ...state, macAddress: action.payload };
        default:
            return state;
    }
}
