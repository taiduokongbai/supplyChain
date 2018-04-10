import React, { Component, PropTypes } from "react";
import { Table, Button, Popconfirm, message, Radio, Select, Form } from '../../../base/components/AntdComp';
import ModalComp from '../../../base/mobxComps/ModalComp';
import SelectTableComp from '../../../base/mobxComps/SelectTableComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import SearchBarComp from '../../../base/mobxComps/SearchBarComp';

const FormItem = Form.Item;
let { observer } = mobxReact;
import { enumStore } from '../../../base/stores/EnumStore';

@observer
class AddLineComp extends ModalComp {
    constructor(props, context) {
        super(props, context);
        this.store = props.store;
        this.columns = [{
                title: '行号',
                dataIndex: 'lineNo',
                width: 49,
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                width: 152,
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                width: 103,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 82 }} />
            }, {
                title: '物料规格',
                dataIndex: 'materialSpec',
                width: 112,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 82}} />
            }, {
                title: '物料材料',
                dataIndex: 'materialTexture',
                width: 114,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 82 }} />
            }, {
                title: '物料代号',
                dataIndex: 'materialCodeName',
                width: 113,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 82 }} />
            }, {
                title: '数量',
                dataIndex: 'qty',
                width: 92,
                render: (text, index, record) => text ? Number(text).toFixed(2) : text,
            }, {
                title: '单位',
                dataIndex: 'unitName',
                width: 52,
            },{
                title: '库存数量',
                dataIndex: 'inventoryQty',
                width: 92,
                render: (text, index, record) => text ? Number(text).toFixed(2) : text,
            }, {
                title: '库存单位',
                dataIndex: 'inventoryUnitName',
                width: 52,
            },{
                title: '计划方式',
                dataIndex: 'planMode',
                width: 69,
                render: (text, record, index) => enumStore.getEnum("planMode", text),
            }];
        this.searchComps = {
            left: {
                select: {
                    list: [
                        {
                            key: "materialCode",
                            label: "物料编码",
                            type: "string"
                        },
                        {
                            key: "materialName",
                            label: "物料名称",
                            type: "string",
                        },
                        {
                            key: "materialSpec",
                            label: "规格",
                            type: "string",
                        },
                        {
                            key: "materialModel",
                            label: "型号",
                            type: "string",
                        },
                        {
                            key: "materialTexture",
                            label: "材料",
                            type: "string",
                        },
                        {
                            key: "materialCodeName",
                            label: "代号",
                            type: "string",
                        },
                    ]
                },
                button: {
                    label: "查询",
                    fn: this.onSearch,
                }
            },
        };
    }
    onSearch = () => {
        this.store.fetchTableList();
    }
    handleCancel = () => {
        if (!this.store.loading) {
            this.store.setVisible(false);
        }
    }
    handleSubmit = () => {
        if (!this.store.loading) {
            let selectedRows = this.store.selectedRows.slice();
            this.store.pStore.onMaterialAdd(selectedRows[0]);
            this.handleCancel();
        }
    }
    onChange = (keys, rows) => {
        this.store.onSelectChange(keys, rows);
    }
    getCheckboxProps = (record) => ({
        disabled: this.store.pStore.dataSource.map(d=>d.id).includes(record.id),
    })
    getComp = () => {
        let { visible, detail, selectMaterialStore } = this.store;
        return (
                <div>
                    <SearchBarComp
                        comps={this.searchComps}
                        store={this.store.searchBarStore}
                        style={{ borderBottom: '0', marginLeft: 20 }}
                    />
                    <Table
                        {...this.store.Props}
                        columns={this.columns}
                        rowKey="id"
                        style={{ padding: '0 20px' }}
                        rowSelection={{
                            type: 'radio',
                            onChange: this.onChange,
                            getCheckboxProps: this.getCheckboxProps,
                        }}
                    />
                </div>
        )
    }

}

export default AddLineComp;