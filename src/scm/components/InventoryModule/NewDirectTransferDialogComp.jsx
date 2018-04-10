/**
 * Created by MW on 2017/8/31.
 */
import React, {Component} from 'react'
import ModalComp from '../../../base/components/ModalComp';
import {Form, Input, Button, Select, message, InputNumber} from 'antd';
import SearchBarComp from '../../../base/components/SearchBarComp';
import MTable from '../../../base/components/TableComp'

let FormItem = Form.Item,
     Option = Select.Option;

class NewDirectTransferDialog extends ModalComp{
    constructor(props){
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
        };
        this.searchData={
            left:[
                {
                    key:"orderCode",
                    val:"物料编号",
                    initialValue:"",
                    type:"string"
                },
                {
                    key:"productCode",
                    val:"物料名称",
                    initialValue:"",
                    type:"string"
                },
                {
                    key:"createByName",
                    val:"规格",
                    initialValue:"",
                    type:"string"
                },
                {
                    key:"orderStatus",
                    val:"型号",
                    initialValue:"",
                    type:"string"
                },
                {
                    key:"productName",
                    val:"仓位",
                    initialValue:"",
                    type:"string"
                },
                {
                    key:"productDate",
                    val:"批次号",
                    initialValue:"",
                    type:"string"
                }
            ],
            center:[
                {
                    title:"查询",
                    Func:this.props.onSearch,
                    style:{},
                    type:"button",
                    icon:"c2mfont c2m-search"
                }
            ]
        };

        this.columns = [
            {
                title: '物料编号',
                dataIndex: 'materialCode',
                key: 'materialCode'
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName'
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec'
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel'
            }, {
                title: '仓位',
                dataIndex: 'freightSpaceName',
                key: 'freightSpaceName'
            }, {
                title: '批次号',
                dataIndex: 'batchCode',
                key: 'batchCode'
            },  {
                title: '库存数量',
                dataIndex: 'amount',
                key: 'amount'
            },
        ]
    };

    handleSubmit = () => {
        if(this.state.selectedRows[0].materialCode)
        if(this.props.outData.some((tableData) => {
                return tableData.materialCode == this.state.selectedRows[0].materialCode
            })){
            message.error('不能选择已添加的物料，请重新选择！');
        } else {
            this.props.checked(this.state.selectedRows[0]);
        }
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    }

    getComp= () => {

        let rowSelection = {
            onChange: this.onSelectChange,
            type: "radio"
        };

        let { selectedRowKeys } = this.state;

        let materialList = [
            {
                id: 1,
                materialCode:123456,
                materialName:123456,
                materialSpec:123456,
                materialModel:123456,
                freightSpaceName:123456,
                batchCode:123456,
                amount:123456,
                measureUnitName:12
            }, {
                id: 2,
                materialCode:1456112,
                materialName:1456112,
                materialSpec:1456112,
                materialModel:1456112,
                freightSpaceName:1456112,
                batchCode:1456112,
                amount:1456112,
                measureUnitName:12
            }
        ]

        return (
            <div>
                <SearchBarComp searchData={this.searchData} onSearch={this.onChange} />
                <MTable cols={this.columns}
                        rowSelection={rowSelection}
                        selRows={selectedRowKeys}
                        dataSource={materialList}
                        rowKey={"id"}
                />
            </div>
        )
    }
}

NewDirectTransferDialog.defaultProps = {
    okText: '确定',
    width: 740,
    maskClosable: true,
}

let NewDirectTransferDialogComp = Form.create()(NewDirectTransferDialog)


export default NewDirectTransferDialogComp