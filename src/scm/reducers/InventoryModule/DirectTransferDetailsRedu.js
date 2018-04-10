/**
 * Created by MW on 2017/8/30.
 * 直接调拨单详情
 */
import { fromJS, Record,List } from 'immutable';
import { DIRECT_TRANSFER_DETAILS_REDU } from '../../consts/ActTypes';

let initState = fromJS({
    dataSource: [],
    paging: {
        total: 1,
        current: 1,
        pageSize: 10
    },
    tableLoading: true,
});

const DirectTransferDetailsRedu = (state = initState, action) => {
    switch (action.type) {
        case DIRECT_TRANSFER_DETAILS_REDU:
            return action.state;
        default:
            return state;
    }
}

export default DirectTransferDetailsRedu