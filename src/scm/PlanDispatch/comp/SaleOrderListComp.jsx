/**
 * 计划订单-新建 - 销售订单列表 modal
 */
import React, { Component } from 'react';
import { Table, Button, Input, Form, Icon, message } from '../../../base/components/AntdComp';
import { _searchBarStore, _add_PlanDispatch_Store, _pdEditTableStore } from "../store/AddPlanDispatchStore";
import FormModalComp from '../../../base/mobxComps/FormModalComp';
import SearchBarComp from "../../../base/mobxComps/SearchBarComp";

let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
class SaleOrderListComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        this.store = this.props.store;
        this.state = {
            selectedRows: [],
            selectedRowKeys: [],
            filterDropdownVisible: false,
            filtered: false
        }
        this.searchComps = {
            left: {
                select: {
                    style: {},
                    list: [
                        {
                            key: "contractCode",
                            label: "合同编号",
                            type: "string",
                        },
                        {
                            key: "sellOrderCode",
                            label: "销售订单编码",
                            type: "string",
                        },
                        {
                            key: "materialName",
                            label: "物料名称",
                            type: "string",
                        },
                        {
                            key: "preProvideDate",
                            label: "预计交货日期",
                            type: "dateRange",
                            format: "YYYY-MM-DD",
                        },
                    ]
                },
                button: {
                    label: "查询",
                    fn: this.onSearch,
                    className: "",
                    style: {},
                }
            },
            right: []
        };
        this.columns = [
            {
                title: '销售订单编码',
                dataIndex: 'sellOrderCode',
                key: 'sellOrderCode',
            }, {
                title: '订单明细行号',
                dataIndex: 'sellDetailLineNum',
                key: 'sellDetailLineNum',
            }, {
                title: '合同编号',
                dataIndex: 'contractCode',
                key: 'contractCode',
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
            }, {
                title: '销售数量',
                dataIndex: 'sellQty',
                key: 'sellQty',
            }, {
                title: '单位',
                dataIndex: 'unitName',
                key: 'unitName',
            }, {
                title: '预计交货日期',
                dataIndex: 'predictProvideDate',
                key: 'predictProvideDate',
            }, {
                title: '累计计划数量',
                dataIndex: 'sumPlanQty',
                key: 'sumPlanQty',
            }, {
                title: '是否导入',
                dataIndex: 'isImport',
                key: 'isImport',
                render: (text, record, index) => { return record.isImport ? '是' : '否' }
            },
        ]
    }
    onSearch = () => {
        this.store.fetchTableList();
    }
    handleCancel = () => {
        this.store.visibleHandler(false)
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let selectRow = this.state.selectedRows;
        if (!this.store.loading) {
            if (selectRow[0].isImport) {
                _add_PlanDispatch_Store.setDetails(Object.assign({}, selectRow[0], { isFixed: false }));
                _pdEditTableStore.dataSource = [];
                this.setState({
                    selectedRows: [],
                    selectedRowKeys: []
                })
                this.handleCancel()
            } else message.info('该销售订单对应的产品的设计BOM未导入，请检查！')
        }
    }
    rowSelection = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows })
    }
    getComp = () => {
        let { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.rowSelection,
            type: 'radio',
        };
        return (
            <div>
                <SearchBarComp
                    comps={this.searchComps}
                    store={_searchBarStore}
                />
                <Table
                    {...this.store.Props}
                    rowKey='id'
                    columns={this.columns}
                    rowSelection={rowSelection}
                    onRowClick={(record) => this.rowSelection([record.id], [record])}
                />
            </div>
        )

    }
}

const options = {
    onValuesChange(props, values) {

    }
}
export default Form.create(options)(SaleOrderListComp);
