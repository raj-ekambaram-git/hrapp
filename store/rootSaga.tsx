import {call, all} from 'redux-saga/effects';



const appSagas = [

];

export default function* root() {
    yield all(appSagas.map((saga) => call(saga)));
}