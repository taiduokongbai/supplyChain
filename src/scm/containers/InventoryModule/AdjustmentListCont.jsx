import React,{Component} from "react";
import AdjustmentListComp from '../../components/InventoryModule/AdjustmentListComp';
import { connect } from 'react-redux'
import AdjustmentListAct from '../../actions/InventoryModule/AdjustmentListAct';
import TabsAct from '../../actions/TabsAct';

import * as InventoryAdjustmentAddAct  from "../../actions/InventoryModule/InventoryAdjustmentAddAct";
class AdjustmentListCont extends Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        let {newState} = this.props;
        return (
            <div>
                    <AdjustmentListComp {...this.props} />
            </div>
        );
    }
}
const mapStateToProps = (state) =>  {   
    return {
        newState: state.AdjustmentListRedu.toJS(),
    }
};

const mapDispatchToProps = (dispatch) => ({
    newCreate: () => {
        dispatch(InventoryAdjustmentAddAct.show());
        dispatch(TabsAct.TabAdd({title:'新建库存调整单', key:'inventoryAdjustmentAdd'}));
    },
     receiptDetails: (pm) => {
        dispatch(TabsAct.TabAdd({title:'库存调整单详情', key:'AdjustmentMoveDetailsCont'}));
        dispatch(AdjustmentListAct.details(pm))
    },
    PurchaseList: (pm) => {
        dispatch( AdjustmentListAct.PurchaseList(pm) )
    },
    takeBtnLoading:()=>{
        dispatch(AdjustmentListAct.btnLoading(true))
    },
    GetCodeRule: () => dispatch(AdjustmentListAct.GetCodeRule({businessIndex:24})),
    BusCodeList:(pm)=>{
        return dispatch(AdjustmentListAct.BusCodeList(pm)) 
    },
})
export default connect( mapStateToProps, mapDispatchToProps )(AdjustmentListCont)


