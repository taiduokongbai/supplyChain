import React, { Component } from "react";
import { connect } from 'react-redux';
import { message } from '../../../base/components/AntdComp';
import BusinessPartnerComp from '../../components/RenterModule/BusinessPartnerComp';
import BusinessAct from '../../actions/RenterModule/BusinessAct';
import TabsAct from '../../actions/TabsAct';

class BusinessPartnerCont extends Component{
    constructor(props,context){
        super(props,context);
        this.searchCo = {uscc:'',page: 1,pageSize: 10};
        this.searchAd = {uscc:'',page: 1,pageSize:10};
    }
    contactTablePaging=(page)=>{
        const{contactTabLoading,ContactList,uscc}=this.props;
        this.searchCo.uscc=uscc;
        if (!contactTabLoading){
            if (typeof page === "number") {
                this.searchCo.page = page;
            } else {
                this.searchCo = { ...this.searchCo, ...page };
            };
            ContactList(this.searchCo);
        }
    }
    addressTablePaging=(page)=>{
        const{addressTabLoading,AddressList,uscc}=this.props;
        this.searchAd.uscc=uscc;
        if(!addressTabLoading){
            if (typeof page === "number") {
                this.searchAd.page = page;
            } else {
                this.searchAd = { ...this.searchAd, ...page };
            };
            AddressList(this.searchAd);
        }
    }
    initData = () =>{
    //   const{businessPartnerTabLoading,BusinessDetailsShow,businessBase,businessId,contactTabLoading,addressTabLoading,...props}=this.props;
    //   if(!businessPartnerTabLoading&&businessId){
    //       BusinessDetailsShow(businessId).then(json=>{
    //            if (json.status === 2000) {
    //                 // message.info('获取商业伙伴详情成功!');
    //             } else if (json.status === 4352) {
    //                // handleCancel(null);
    //             };
    //       })
    //   }
    }
    render(){
        return(
            <BusinessPartnerComp 
            {...this.props}
            initData={this.initData}
            loading={this.props.businessPartnerTabLoading}
            contactTablePaging={this.contactTablePaging}
            addressTablePaging={this.addressTablePaging}
            />
        )
    }
}

const mapStateToProps = (state) => { return state.BusinessRedu.toJS() }
const mapDispatchToProps = (dispatch, ownProps) => ({
    BusinessDetailsShow:(businessCode)=>dispatch(BusinessAct.BusinessDetailsShow({businessCode})),
    ContactList:(pm)=>dispatch(BusinessAct.BusinessDetailsContact(pm)),
    AddressList: (pm) => dispatch(BusinessAct.BusinessDetailsAddress(pm)),
    EditModul: () => dispatch(TabsAct.TabAdd({
        title: '编辑商业伙伴',
        key: 'editBusiness'
    })),
    BusinessDetail: (id) => dispatch(BusinessAct.BusinessDetail({ id })),
    BusinessId: (value) => dispatch(BusinessAct.BusinessId(value)),
})
export default connect(mapStateToProps,mapDispatchToProps)(BusinessPartnerCont);