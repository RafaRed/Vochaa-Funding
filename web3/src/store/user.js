import {loadState} from '../store/localstorage';


function hasSameKeys(mainCollection,newCollection){
    for(var key in mainCollection) {
        if(!(key in newCollection))
        {
            return false;
        }
      }
      return true ;
}

function loadInitialState(){
    const INITIAL_STATE={username: ""}
    const persistedState = loadState();
    if(hasSameKeys(INITIAL_STATE,persistedState)){
        return persistedState
    }
    else{
        return INITIAL_STATE
    }
}

export default function user(state = loadInitialState(), action){
    switch(action.type){
        case 'SET':
            return {...state, username: action.payload.username}
        default:
            return state
    }
}