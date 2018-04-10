import { fromJS } from 'immutable';
import { MATERIALCLASSIFYREDU } from '../../consts/ActTypes';

let initState = fromJS({
    dataSource: [],
    tableLoading: false,
    expandedRowKeys: [],
    forbiddenStatus: 1,
    allList: [],
    details: {},
    detailsModalLoading: false,
    checkChildrenIndex: ''
});

const MaterialClassifyRedu = (state = initState, action) => {
    switch (action.type) {
        case MATERIALCLASSIFYREDU:
            return action.state;
        default:
            return state;
    }
}

export default MaterialClassifyRedu;