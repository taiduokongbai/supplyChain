import React,{Component} from "react";
import { Modal, message } from "../../../base/components/AntdComp";
import { connect } from 'react-redux';
import SupplierAct from '../../actions/RenterModule/SupplierAct';
import AddSupplierComp from '../../components/RenterModule/AddSupplierComp';
import TabsAct from '../../actions/TabsAct';

class AddSupplierCont extends Component{
    constructor(props, context) {
        super(props, context);
    }
    handleSubmit = (data) => {
        const { loading, handleSubmit, SupplierList,tablePaging,ContactList, getEditData, Record, tabAdd, tabRemove, getBusinessPartnerData, getCurrencyList, showComponentMsg, supplierloading} = this.props;
        // if (loading) {
        //     return;
        // }
        handleSubmit(data).then(json => {
            if (json.status == "2000") {
                let uscc=json.data.uscc;
                let supplierCode=json.data.supplierCode;
                let id=json.data.id;
                 getEditData(id,"detail",uscc,supplierCode)
                 tabAdd();
                 tabRemove();
                 SupplierList({ page:1,pageSize:15});
                 ContactList({uscc:json.data.uscc,page:1,pageSize:10})
                 getBusinessPartnerData({
                     "page": "1",
                     "pageSize": "10"
                 });
                 getCurrencyList({
                     "page": "1",
                     "pageSize": "10"
                 });
                 showComponentMsg(false);
                 supplierloading(false);
            } else {
                 supplierloading(false);
            };
        });
    }
    render() {
        const { add_supplier_visiable, supplierLoading } = this.props;
        return (
            <AddSupplierComp
                {...this.props}
                loading={supplierLoading}
                onOk={this.handleSubmit}
            />
        );
    }
}

AddSupplierCont.defaultProps = {
    title: "新建供应商",
    width: 800,
    type:'add'
}

const mapStateToProps = (state) => {
    return state.SupplierRedu.toJS();
}
const mapDispatchToProps = (dispatch) => ({
    supplierloading: (pm)=>{dispatch(SupplierAct.supplierLoading(pm))},
    showComponentMsg: (pm)=>{dispatch(SupplierAct.showCompMsg(pm))},
    getEditData:(id,type,uscc,supplierCode)=>dispatch(SupplierAct.getSupplierData({id},type,uscc,supplierCode)),
    getEmployeesList:(pm)=>dispatch(SupplierAct.getEmpList(pm)),
    getBusinessPartnerData:(pm)=>dispatch(SupplierAct.getBusinessPartnerData(pm)),
    getCurrencyList:(pm)=>dispatch(SupplierAct.getCurList(pm)),
    handleSubmit: (data) => { return dispatch(SupplierAct.AddSupplier(data)) },
    tabAdd: () => {
        dispatch(TabsAct.TabAdd({
            title:"供应商详情",
            key:"supplierViewCont"
        }));
    },
    tabRemove: () =>{
        dispatch(TabsAct.TabRemove("AddSupplier","supplierViewCont"));
    },
    getSubjectList:(pm)=>{dispatch(SupplierAct.getSearchInitData(pm))},
    getBusinessPartnerDetail:(pm)=>{return dispatch(SupplierAct.getBusinessPartnerDetail(pm))},
    bpSearchData: (data) => { dispatch(SupplierAct.bpSearchData(data)) },
    getDeptList: (pm) => { dispatch(SupplierAct.getDeptData(pm)) },
    SupplierList: (pm) => dispatch(SupplierAct.SupplierList(pm)),
    ContactList: (pm) => dispatch(SupplierAct.ContactList(pm)),
    settleList:(pm) => dispatch(SupplierAct.settleList(pm)),
})


export default connect(mapStateToProps,mapDispatchToProps)(AddSupplierCont);
