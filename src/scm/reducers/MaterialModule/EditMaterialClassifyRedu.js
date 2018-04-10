import { fromJS } from 'immutable';
import { EDIT_MATERIAL_CLASSIFY } from '../../consts/ActTypes';

let initState = fromJS({
    visible: false,
    loading: false,
    details: {},
    comboboxList: {},
    isUse: '',
    nodeLevel: 0
});

const EditMaterialClassifyRedu = (state = initState, action) => {
    switch (action.type) {
        case EDIT_MATERIAL_CLASSIFY:
            return action.state;
        default:
            return state;
    }
}

export default EditMaterialClassifyRedu;