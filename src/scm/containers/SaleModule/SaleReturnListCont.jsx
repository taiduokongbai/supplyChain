import React, { Component } from 'react';
import { connect } from 'react-redux';
import SaleReturnAct from '../../actions/SaleModule/SaleReturnAct';
import LinkInputComp from '../../components/SaleModule/SaleReturnLinkInputComp';
import SaleReturnTableComp from '../../components/SaleModule/SaleReturnTableComp';

class SaleReturnListCont extends Component {
    constructor(props) {
        super(props);
        this.searchPm = {saleReturnCode: '', customerName: '', status:'',sourceCode:'',page: 1, pageSize: 15};
        this.inputValue = {saleReturnCode: '', customerName: '',status:'',sourceCode:'',};
    }


    tablePaging = (page) => {
        // console.log('tablePaging...');
        const { tabLoading, SaleReturnList } = this.props;
        if (!tabLoading) {
            if (typeof page === "number") {
                this.searchPm.page = page;
            } else {
                this.searchPm = {...this.searchPm, ...page};
            }

            SaleReturnList(this.searchPm);
        }
    };
    onSearch = (val) => {
        this.searchPm = Object.assign({}, this.inputValue, val)
        if (!this.props.tabLoading) {
            this.searchPm = {...this.searchPm, page: 1,pageSize: 15};
            this.tablePaging();
        }
    };
    onClear = () => {
        this.searchPm = {...this.searchPm, page: 1};
        this.tablePaging();
    };

    render() {
        return (
            <div className="saleReturn-list">
                <LinkInputComp
                    {...this.props}
                    onSearch={this.onSearch}
                    onClear={this.onClear}/>
                
                <SaleReturnTableComp
                    {...this.props}
                    tablePaging={this.tablePaging}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => state.SaleReturnRedu.toJS();

const mapDispatchToProps = (dispatch) => ({
    SaleReturnList: (searchPm) => dispatch(SaleReturnAct.SaleReturnList(searchPm)),
    DeleteSaleReturn: (saleReturnCode) => dispatch(SaleReturnAct.DeleteSaleReturn({saleReturnCode})),
    GetSaleReturn: (saleReturnCode, flag) => dispatch(SaleReturnAct.GetSaleReturn(saleReturnCode, flag)),
    CheckLockingStatus: (saleReturnCode) => dispatch(SaleReturnAct.CheckLockingStatus({saleReturnCode})),
    GetCodeRule: () => dispatch(SaleReturnAct.GetCodeRule({businessIndex: 17})),
})
export default connect(mapStateToProps, mapDispatchToProps)(SaleReturnListCont);
