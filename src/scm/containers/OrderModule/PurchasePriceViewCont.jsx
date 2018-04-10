import React,{Component} from "react";
import PurchasePriceViewComp from '../../components/OrderModule/PurchasePriceViewComp';
import { connect } from 'react-redux';
import PurchasePriceAct from '../../actions/OrderModule/PurchasePriceAct';
import TabsAct from '../../actions/TabsAct';

class PurchasePriceViewCont extends Component{
    constructor(props,context){
        super(props,context);
    }
    
    render(){
        return (
            <div className='sale-order-box'>
                <PurchasePriceViewComp {...this.props}/>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
     return Object.assign({},state.PurchasePriceRedu.toJS(),state.TabsRedu.toJS());
}
    
const mapDispatchToProps = (dispatch) => ({
    OpenAddPurchasePrice: () => dispatch(TabsAct.TabAdd({
        title: "新建采购价格清单",
        key: "addPurchasePrice"
    })),
    OpenEditPurchasePrice: () => dispatch(TabsAct.TabAdd({
        title: "编辑采购价格清单",
        key: "editPurchasePrice"
    })),
    RemoveEditPurchasePrice: () => dispatch(TabsAct.TabRemove("purchasePriceView", "editPurchasePrice")),
    EditModul: () => dispatch(TabsAct.TabRemove("purchasePriceView", "editPurchase")),
    TabsRemove: () => {
        dispatch(TabsAct.TabAdd({
            title: "采购价格清单",
            key: "purchasePrice"
        }));
        dispatch(TabsAct.TabRemove("purchasePriceView", "purchasePrice"));
    },
    PurchasePriceView:(data) =>{ return dispatch(PurchasePriceAct.PurchasePriceView(data))},
    PurchasePriceList: (pm) => dispatch(PurchasePriceAct.PurchasePriceList(pm)),     
    PurchasePriceSubmit:(data) =>{ return dispatch(PurchasePriceAct.PurchasePriceSubmit(data))},
    PurchasePriceRecall:(data) =>{ return dispatch(PurchasePriceAct.PurchasePriceRecall(data))},
    PurchasePriceCopy: (data) => { dispatch(PurchasePriceAct.PurchasePriceCopy(data)) },
    PurchasePriceCode: (type,orderCode) => { dispatch(PurchasePriceAct.PurchasePriceCode(type,orderCode)) },
    PurchasePriceCheckStatus: (supplierCode) => dispatch(PurchasePriceAct.PurchasePriceCheckStatus({ supplierCode })),
})

export default connect(mapStateToProps, mapDispatchToProps)(PurchasePriceViewCont);
