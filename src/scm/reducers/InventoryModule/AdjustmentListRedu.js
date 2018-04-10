import { fromJS, Record  } from 'immutable'
import { ADJUSTMENTLISTREDU } from '../../consts/ActTypes'

let initialData = fromJS({
    dataSource: [],
    paging:{
        current:1,
        pageSize:10,
        total:10,
       // showQuickJumper: true, 
    },
    search:{
         pageSize:10,
         page:1,
    },
    suplierData:{},
    side_Loading: false,
    side_visible: false,
    side_visible_sub :false,
    takeOrderPm : '',
    openSideBarLoading:false,
    openSideBarSubLoading:false,
    tableLoading:false,
    dataSourceSide:[],
    openSideBarList:{},
    btnLoading:false,
    busCodeData:[],
});

const AdjustmentListRedu = ( state = initialData, action) => {
    switch (action.type) {
        case ADJUSTMENTLISTREDU: 
            return action.state;
        default:
            return state;
    }
}

export default AdjustmentListRedu