import React, { Component, PropTypes } from "react";
import { Form, message, Table } from '../../../base/components/AntdComp';
import ModalComp from '../../../base/mobxComps/ModalComp';
import SearchBarComp from '../../../base/mobxComps/SearchBarComp'
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import { materialPopStore, searchMaterialStore, materialChooseTableStore} from '../stores/SelectAddTableStore';

import {OtherOutboundOrderAddTableStore} from "../stores/AddEditableTableStore";

let FormItem = Form.Item;
let formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19},
};
let { observer } = mobxReact;

@observer
class SelectAddTableComp extends ModalComp {
    store = materialPopStore;
    searchMaterialStore = searchMaterialStore;
    materialChooseTableStore = materialChooseTableStore;


    constructor(props){
        super(props);
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
                dataIndex: 'model',
                key: 'model',
                render: (text,render,index) => <TooltipComp attr={{text:text, wid: 88}}/>
            },  {
                title: '材料',
                dataIndex: 'materialTexture',
                key: 'materialTexture',
            }, {
                title: '代号',
                dataIndex: 'materialCodeName',
                key: 'materialCodeName',
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
                            key: "materialTexture",
                            label: "材料",
                            type: "string"
                        },
                        {
                            key: "materialCodeName",
                            label: "代号",
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
            message.error('请先选择物料1');
        }else if(this.state.selectedRows[0].materialCode){
            OtherOutboundOrderAddTableStore.add(Object.assign({},this.state.selectedRows[0],{planAmount:0}));

            materialPopStore.setVisible(false);
        }
    };

    doubleSubmit = (record,text,index) => {
      /*  if(addOutInfoStore.dataSource.some((perObj) => {
                return (perObj.materialCode == record.materialCode &&
                    perObj.allotOutLocationName == record.freightSpaceName &&
                    perObj.allotOutBatchCode == record.batchCode)
            })){
            message.error('不能选择已添加的物料，请重新选择！');
        } else {
            addOutInfoStore.setRecord(record);
            materialPopStore.setVisible(false);
        }*/
    };

    onSearch = () => {
        this.materialChooseTableStore.fetchTableList();
    };

    getComp = () => {

        return (
            <div>
                <SearchBarComp
                    comps={ this.searchComps }
                    store={ this.searchMaterialStore }/>
                <Table
                    {...this.materialChooseTableStore.Props}

                    columns={this.columns}
                    rowSelection={this.rowSelection}
                    onRowDoubleClick={(record,text,index) => this.doubleSubmit(record,text,index)}
                />
            </div>
        )
    }
}

export default SelectAddTableComp