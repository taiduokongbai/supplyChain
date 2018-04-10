import { fromJS } from 'immutable';
import { ADD_MATERIAL_CLASSIFY } from '../../consts/ActTypes';

let initState = fromJS({
    visible: false,
    loading: false,
    comboboxList: {},
});

const AddMaterialClassifyRedu = (state = initState, action) => {
    switch (action.type) {
        case ADD_MATERIAL_CLASSIFY:
            return action.state;
        default:
            return state;
    }
}

export default AddMaterialClassifyRedu;