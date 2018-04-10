import React, { Component, PropTypes } from "react";
import { Form, message, Table } from '../../../base/components/AntdComp';
import ModalComp from '../../../base/mobxComps/ModalComp';
import SearchBarComp from '../../../base/mobxComps/SearchBarComp'
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import { searchMaterialStore, materialChooseTableStore, materialPopStore, addOutInfoStore} from '../store/AddAllotStore';
let FormItem = Form.Item;
let formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19},
};
let { observer } = mobxReact;

@observer
class MaterialChoosePopComp extends ModalComp {
    constructor(props){
        super(props);
        this.store = materialPopStore;
        this.columns = [
           {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode'
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                render: (text,render,index) => <TooltipComp attr={{text:text, wid: 84}}/>
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                render: (text,render,index) => <TooltipComp attr={{text:text, wid: 88}}/>
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
                render: (text,render,index) => <TooltipComp attr={{text:text, wid: 88}}/>
            },  {
                title: '材料',
                dataIndex: 'materialMaterial',
                key: 'materialMaterial',
            }, {
                title: '代号',
                dataIndex: 'materialSymbol',
                key: 'materialSymbol',
            }, {
                title: '仓位',
                dataIndex: 'freightSpaceCode',
                key: 'freightSpaceCode',
            }, {
                title: '批次号',
                dataIndex: 'batchCode',
                key: 'batchCode',
            }, {
                title: '库存数量',
                dataIndex: 'inventoryQty',
                key: 'inventoryQty',
            }, {
                title: '库存单位',
                dataIndex: 'materialUnitName',
                key: 'materialUnitName',
            }
        ];
        this.searchComps = {
            left: {
                select: {
                    style: {},
                    list: [
                        {
                            key: "materialCode",
                            label: "物料编号",
                            type: "string",
                            defaultValue: ''
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
                            type: "string"
                        },
                        {
                            key: "freightSpaceCode",
                            label: "仓位",
                            type: "string"
                        },
                        {
                            key: "batchCode",
                            label: "批次号",
                            type: "string"
                        }
                    ]
                },
                button: {
                    label: "查询",
                    fn: this.onSearch,
                    className: "",
                    style: {},
                }
            },
        };
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
        };
        this.rowSelection = {
            type:'radio',
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys, selectedRows });
            },
        };

    }

    handleCancel = () => {
        if (!this.store.loading) {
            this.store.setVisible(false);
        }
    };

    handleSubmit = () => {
        if(this.state.selectedRows.length == 0){
            message.error('请先选择物料');
        }else if(this.state.selectedRows[0].materialCode)
            if(addOutInfoStore.dataSource.some((perObj) => {
                    return (perObj.materialCode == this.state.selectedRows[0].materialCode &&
                        perObj.allotOutLocationName == this.state.selectedRows[0].freightSpaceName &&
                        perObj.allotOutBatchCode == this.state.selectedRows[0].batchCode)
                })){
                message.error('不能选择已添加的物料，请重新选择！');
            } else {
                addOutInfoStore.setRecord(this.state.selectedRows[0]);
                materialPopStore.setVisible(false);
            }
    };

    doubleSubmit = (record,text,index) => {
        if(addOutInfoStore.dataSource.some((perObj) => {
                return (perObj.materialCode == record.materialCode &&
                    perObj.allotOutLocationName == record.freightSpaceName &&
                    perObj.allotOutBatchCode == record.batchCode)
            })){
            message.error('不能选择已添加的物料，请重新选择！');
        } else {
            addOutInfoStore.setRecord(record);
            materialPopStore.setVisible(false);
        }
    };

    onSearch = () => {
        materialChooseTableStore.fetchTableList();
    };

    getComp = () => {
        return (
            <div>
                <SearchBarComp
                    comps={ this.searchComps }
                    store={ searchMaterialStore }/>
                <Table
                    {...materialChooseTableStore.Props}
                    rowKey='id'
                    columns={this.columns}
                    rowSelection={this.rowSelection}
                    onRowDoubleClick={(record,text,index) => this.doubleSubmit(record,text,index)}
                />
            </div>
        )
    }
}

export default MaterialChoosePopComp