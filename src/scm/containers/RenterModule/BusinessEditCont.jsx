import React, { Component } from "react";
import { Modal, message } from "../../../base/components/AntdComp";
import { connect } from 'react-redux';
import BusinessAct from '../../actions/RenterModule/BusinessAct';
import BusinessEditComp from '../../components/RenterModule/BusinessEditComp';
import TabsAct from '../../actions/TabsAct';

class BusinessEditCont extends Component {
    constructor(props, context) {
        super(props, context);
    }
    handleSubmit = (data) => {
        const { handleSubmit, tabRemove, businessList } = this.props;
        handleSubmit(data).then(json => {
            if (json.status == 2000) {
                message.success('编辑成功');
                tabRemove();
                businessList({ page: 1, pageSize: 15 });
            } else {

            };
        });
    }
    render() {
        return (
            <BusinessEditComp
                {...this.props}
                onOk={this.handleSubmit}
                />  
        );
    }
}

const mapStateToProps = (state) => {
    return state.BusinessRedu.toJS();
}
const mapDispatchToProps = (dispatch) => ({
    handleSubmit: (data) => dispatch(BusinessAct.Editbusiness(data)),
    tabRemove: () => {
        dispatch(TabsAct.TabRemove("editBusiness", "business"));
    },
    businessList: (pm) => dispatch(BusinessAct.BusinessList(pm)),
    EditInitData: (pm,list) => dispatch(BusinessAct.EditInitData(pm,list)),
})


export default connect(mapStateToProps, mapDispatchToProps)(BusinessEditCont);
