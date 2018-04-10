import React, { Component, PropTypes } from "react";
import { AutoComplete, Form, Input, Spin, Button, message, Row, Col, Icon, Select, DatePicker, TreeSelect } from '../../../base/components/AntdComp';
import SelectTableComp from '../../../base/mobxComps/SelectTableComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import { measureStore } from '../../data/DropDownStore';
import { enumStore } from '../../../base/stores/EnumStore';
import { debounce } from '../../../base/consts/Utils';
let { observer } = mobxReact;

@observer
export default class SourceOrderComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.store = props.store;
        this.onSourceOrderSelect = props.onSourceOrderSelect;
        this.onPlanOrderSelect = props.onPlanOrderSelect;
        this.onSourceOrderSearch = debounce(this.onSourceOrderSearch, 500);
        this.columns = [{
                title: '计划单号',
                dataIndex: 'orderCode',
                width: 157,
            }, {
                title: '销售订单号',
                dataIndex: 'saleOrderCode',
                width: 143,
            }, {
                title: '合同编码',
                dataIndex: 'contractCode',
                width: 145,
            }, {
                title: '客户名称',
                dataIndex: 'customerCode',
                width: 110,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 90 }} />
            }, {
                title: '产品名称',
                dataIndex: 'materialName',
                width: 115,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 90 }} />
            }, {
                title: '计划数量',
                dataIndex: 'planQty',
                width: 77,
            }, {
                title: '单位名称',
                dataIndex: 'unitName',
                width: 53,
        }];
        this.searchComps = {
            left: {
                select: {
                    list: [
                        {
                            key: "orderCode",
                            label: "计划单号",
                            type: "string"
                        },
                        {
                            key: "saleOrderCode",
                            label: "销售订单号",
                            type: "string",
                        },
                        {
                            key: "contractCode",
                            label: "合同编码",
                            type: "string",
                        },
                        {
                            key: "customerName",
                            label: "客户名称",
                            type: "string",
                        },
                        {
                            key: "materialName",
                            label: "产品名称",
                            type: "string",
                        }
                    ]
                },
                button: {
                    label: "查询",
                    fn: this.onPlanOrderSearch,
                }
            },
        };
    }

    //来源订单搜索
    onSourceOrderSearch = (value) => {
        this.store.detailStore.resetDetail();
        this.store.sourceOrderStore.fetchSelectList(value);
    }
    //计划单搜索
    onPlanOrderSearch = () => {
        this.store.planOrderStore.fetchTableList("");
    }
    getSourceOrderComp = () => {
        const { detail } = this.store;
        switch (detail.sourceOrderType+'') {
            case "0":
                return (
                    <AutoComplete
                        {...this.store.sourceOrderStore.Props}
                        onSelect={this.onSourceOrderSelect}
                        onSearch={this.onSourceOrderSearch}
                        value={this.props.value}
                        onChange={this.props.onChange}
                    />
                )
                break;
            case "1":
                return (
                    <SelectTableComp
                        rowKey='orderCode'
                        store={this.store.planOrderStore}
                        comps={this.searchComps}
                        columns={this.columns}
                        contStyle={{ width: "1012px",zIndex:3 }}
                        onSubmit={this.onPlanOrderSelect}
                        btnProps={{ size: 'large' }}
                        style={{ width: '100%' }}
                        value={this.props.value}
                        onChange={this.props.onChange}
                    />
                )
                break;
            default:
                return (
                    <Input
                        value={this.props.value}
                        disabled
                    />
                );
        }
    }

    render() {
        return (
            <div className="sourceOrder">
                {this.getSourceOrderComp()}
            </div>
        )
    }
}