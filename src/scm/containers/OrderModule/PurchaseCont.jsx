//采购订单
import React, { Component } from "react";
import { connect } from 'react-redux';
import { message } from '../../../base/components/AntdComp';
import { prefixScm } from '../../../base/consts/UrlsConfig';
import PurchaseAct from '../../actions/OrderModule/PurchaseAct';
import TabsAct from '../../actions/TabsAct';
import PurchaseComp from '../../components/OrderModule/PurchaseComp';
import { getCookie } from '../../../base/services/ReqApi';


class PurchaseCont extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            searchPm: {
                page: 1,
                pageSize: 15,
                searchValue: '',
                searchKey: '',
            },

        };
        this.url = prefixScm + '/purchase/exportExcel?tokenid=' + getCookie("tokenId");
    }

    tablePaging = (pageNum) => {
        let { tabLoading, PurchaseList } = this.props;
        if (!tabLoading) {
            if (typeof pageNum === "number") {
                this.state.searchPm.page = pageNum;
            } else {
                this.state.searchPm = { ...this.state.searchPm, ...pageNum };
            };
            let { page, pageSize, searchKey, searchValue } = this.state.searchPm;
            let pm = { page, pageSize, [searchKey]: searchValue };
            PurchaseList(pm).then(json => {
                if (json.status === 2000) {
                } else if (json.status === 4351) {

                };
            });
        }
    }

    onSearch = (searchData) => {
        if (Array.isArray(searchData.val)) {
            searchData.val = `${searchData.val[0]},${searchData.val[1]}`;
        }
        if (!this.props.tabLoading) {
            this.setState({
                searchPm: {
                    ...this.state.searchPm,
                    searchKey: searchData.key,
                    searchValue: searchData.val,
                }
            }, () => this.tablePaging());
            this.url = prefixScm + '/purchase/exportExcel?tokenid=' + getCookie("tokenId") + "&" + searchData.key + "=" + searchData.val;
        }
    }

    onClear = () => {
        // this.setState({
        //     searchPm: {
        //         ...this.state.searchPm, status: 0, supplierName: '', supplierCode: '', page: 1
        //     }
        // },() => this.tablePaging());
    }

    render() {
        let { searchValue } = this.state.searchPm,
            { searchType } = this.state;
        return (
            <div className="supplier-cont">
                <PurchaseComp {...this.props}
                    SearchVal={searchValue}
                    searchType={searchType}
                    tablePaging={this.tablePaging}
                    onSearch={this.onSearch}
                    onSelect={this.onSelect}
                    onClear={this.onClear}
                    url={this.url}
                />

            </div>
        );

    }


}

const mapStateToProps = (state) => {
    return Object.assign({},state.PurchaseRedu.toJS(),state.TabsRedu.toJS());
}

const mapDispatchToProps = (dispatch) => ({
    PurchaseList: (pm) => dispatch(PurchaseAct.PurchaseList(pm)),
    purchaseLoading: () => dispatch(PurchaseAct.PurchaseLoading(true)),
    AddModul: () => dispatch(TabsAct.TabAdd({
        title: "新建采购订单",
        key: "addPurchase"
    })),
    PurchaseViewClick: () => dispatch(TabsAct.TabAdd({
        title: "采购订单详情",
        key: "purchaseViewCont"
    })),
    PurchaseCode: (orderCode) => dispatch(PurchaseAct.PurchaseCode(orderCode)),
    PurchaseViewTable: (orderCode) => dispatch(PurchaseAct.PurchaseViewTable({orderCode})),
    PurchaseDelete: (orderCode) => dispatch(PurchaseAct.PurchaseDel({ orderCode })),
    EditModul: () => dispatch(TabsAct.TabAdd({
        title: "编辑采购订单",
        key: "editPurchase"
    })),
    getMeasureList: (pm) => dispatch(PurchaseAct.MeasureList(pm)),
    CanPurchaseEdit: (orderCode, type) => dispatch(PurchaseAct.CanPurchaseEdit({ orderCode }, type)),
    GetSelectData: () => dispatch(PurchaseAct.GetSelectData()),
    PurchaseDetail: (orderCode) => dispatch(PurchaseAct.PurchaseDetail({ orderCode })),
    DeleteData: (value,type) => dispatch(PurchaseAct.DeleteData(value, type)),
    GetCodeRule: () => dispatch(PurchaseAct.GetCodeRule({businessIndex: 14})),
})


export default connect(mapStateToProps, mapDispatchToProps)(PurchaseCont);