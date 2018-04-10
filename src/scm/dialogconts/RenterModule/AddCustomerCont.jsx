import React,{Component} from "react";
import { Modal, message } from "../../../base/components/AntdComp";
import { connect } from 'react-redux';
import CustomerAct from '../../actions/RenterModule/CustomerAct';
import AddCustomerComp from '../../components/RenterModule/AddCustomerComp';
import TabsAct from '../../actions/TabsAct';

class AddCustomerCont extends Component{
    constructor(props, context) {
        super(props, context);
    }
    handleSubmit = (data) => {
        const { loading, handleSubmit, CustomerList, ContactList,getEditData, Record, tabAdd, tabRemove, getBusinessPartnerData, getCurrencyList, showComponentMsg, customerloading} = this.props;
        handleSubmit(data).then(json => {
            if (json.status == "2000") {
                let uscc=json.data.uscc;
                let customerCode=json.data.customerCode;
                let id=json.data.id;
                 getEditData(id,"detail",uscc,customerCode);
                 tabAdd();
                 tabRemove();
                 CustomerList({page:1,pageSize:15});
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
                 customerloading(false);
            } else {
                 customerloading(false);
            };
        });
    }
    render() {
        const { add_customer_visiable, customerLoading } = this.props;
        return (
            <AddCustomerComp
                {...this.props}
                loading={customerLoading}
                onOk={this.handleSubmit}
            />
        );
    }
}

AddCustomerCont.defaultProps = {
    title: "新建客户",
    width: 800,
    type:"add"
}

const mapStateToProps = (state) => {
    return state.CustomerRedu.toJS();
}
const mapDispatchToProps = (dispatch) => ({
    customerloading: (pm)=>{dispatch(CustomerAct.customerLoading(pm))},
    showComponentMsg: (pm)=>{dispatch(CustomerAct.showCompMsg(pm))},
    getEditData:(id,type,uscc,customerCode)=>dispatch(CustomerAct.getCustomerData({id},type,uscc,customerCode)),
    getEmployeesList:(deptCode)=>dispatch(CustomerAct.getEmpList(deptCode)),
    getBusinessPartnerData:(pm)=>dispatch(CustomerAct.getBusinessPartnerData(pm)),
    getCurrencyList:(pm)=>dispatch(CustomerAct.getCurList(pm)),
    handleSubmit: (data) => { return dispatch(CustomerAct.AddCustomer(data)) },
    tabAdd: () => {
        dispatch(TabsAct.TabAdd({
            title:"客户详情",
            key:"customerViewCont"
        }));
    },
    tabRemove: () =>{
        dispatch(TabsAct.TabRemove("AddCustomer","customerViewCont"));
    },
    getSubjectList:(pm)=>{dispatch(CustomerAct.getSearchInitData(pm))},
    getBusinessPartnerDetail:(pm)=>{return dispatch(CustomerAct.getBusinessPartnerDetail(pm))},
    bpSearchData:(data)=>{dispatch(CustomerAct.bpSearchData(data))},
    getDept: (pm) => dispatch(CustomerAct.getDeptData(pm)),
    CustomerList: (pm) => dispatch(CustomerAct.CustomerList(pm)),
    ContactList: (pm) => dispatch(CustomerAct.ContactList(pm)),
    settleList:(pm) => dispatch(CustomerAct.settleList(pm)),
})


export default connect(mapStateToProps,mapDispatchToProps)(AddCustomerCont);
