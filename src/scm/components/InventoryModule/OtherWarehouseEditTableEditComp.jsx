import React, { Component } from "react";
import { store } from "../../data/StoreConfig";
import { Button, Popconfirm, message, Radio, Select, Form, Row, Col, } from '../../../base/components/AntdComp';
import EditableTableComp from '../../../base/components/EditableTableComp';
import OperationsComp from '../../../base/components/OperationsComp';
import OtherWarehouseEditDialogAct from "../../actions/InventoryModule/OtherWarehouseEditDialogAct";
import OtherWarehouseEditDialogCont from "../../dialogconts/InventoryModule/OtherWarehouseEditDialogCont";
import OtherWarehouseEditAct from '../../actions/InventoryModule/OtherWarehouseEditAct';
import TooltipComp from "../../../base/components/TooltipComp"
class TableComp extends EditableTableComp {
    constructor(props, context) {
        super(props, context);
        this.recordKey = 'lineNum';
        this.state = {
            isEdit: null,
            disableds: [],
            current: 1,
            pageSize: 10,
            materialCodeTips: false,
            record: {},
        }
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'lineNum',
                key: 'lineNum',
                hidden: true
            },
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'metarialCode',
                width: 212,
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 90, placement: 'left' }} />
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 90, placement: 'left' }} />
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
            }, {
                title: '计划数量',
                dataIndex: 'planAmount',
                key: 'planAmount',
                obj: {
                    rules: [
                        { type: 'gtZero', label: '计划数量', decimal: 2 }
                    ]
                }
            }, {
                title: '库存单位',
                dataIndex: 'materialUnitName',
                key: 'materialUnitName',
            }, {
                title: '操作',
                dataIndex: 'operation',
                width: 74,
                className: 'table-thead-center'
            }
        ];

        this.columns[this.columns.length - 1].render = this.optColRender;
        this.columns.forEach((item) => {
            //inputNumber
            if (/^planAmount$/i.test(item.dataIndex)) {
                item.render = this.inputNumberColRender(item.dataIndex, item.obj)
            }
        })
    }
    //点击添加
    addNewRow = () => {
        if (this.state.isEdit == null) {
            let newRow = Object.assign({}, this.getNewRow());
            this.data.splice(0, 0, newRow);
            this.editHandler(newRow, 0);
        } else {
            message.warn("已有行处于编辑状态！")
        }
        this.forceUpdate();
    }
    // 新建
    getNewRow = () => {
        store.dispatch(OtherWarehouseEditDialogAct.show())   // 弹出框  -- 8.21
        let id = "-1";
        if (this.data[0] && this.data[0].lineNum < 0) {
            id = this.data[0].lineNum - 1;
        };
        store.dispatch(OtherWarehouseEditAct.indexVal(0))
        return {
            "lineNum": String(id),
            "id": null,
            "materialCode": "",
            "materialName": "",
            "materialSpec": "",
            "materialModel": "",
            "planAmount": 0,
            "materialUnitName": "",
            "valuationNumber": "",
            'opType': 0,  // 操作类型
        }
    }
    // 计划数量变更
    handleChange = (key, index, value) => {
        if (key == 'planAmount') {
            this.record.planAmount = value;
        }
        this.forceUpdate();
    }
    // 编辑
    handleEdit = (record, index) => {
        record.isEdit = 1;
        if (record.opType == 0) {  // 该行为新增行
            record.opType = 0;
        } else {
            record.opType = 1;  // 该行为编辑行
        }
        this.setState({ record })
    }
    // 保存
    handleSave = (record, index) => {
        this.isEdit = true;
        this.record.isEdit = 0;
        let val = this.props;
        if (val.checkedTableList && val.checkedTableList.materialCode) {
            let _mData = val.checkedTableList;
            this.isEdit = true;
            this.record.materialCode = _mData.materialCode;
            this.record.materialName = _mData.materialName;
            this.record.materialSpec = _mData.materialSpec;
            this.record.materialModel = _mData.model;
            this.record.materialUnitName = _mData.materialInventory ? _mData.materialInventory.inventoryUnitName : '';   // 库存单位名称
            this.record.materialUnitCode = _mData.materialInventory ? _mData.materialInventory.inventoryUnitCode : '';   // 库存单位编码
            store.dispatch(OtherWarehouseEditAct.checkedTableList({}))
        }
        store.dispatch(OtherWarehouseEditAct.tableData(this.data))
    }
    // 删除
    handleDel = (realIndex) => {
        if (this.data[realIndex].opType == 0) {  // 该删除行  为  新增行
            return;
        } else { // 该删除行 不是新增行
            this.data[realIndex].opType = 2;
            this.props.actions.delRow(this.data[realIndex]);
        }
        store.dispatch(OtherWarehouseEditAct.tableData(this.data))
    }
    // 取消
    handleCancel = (index) => {
        this.data[index].isEdit = 0;
        this.record.planAmount = this.state.record.planAmount;
        /**
         * 如果取消第一次新增行数据， 在dataSource中直接删除掉这一行
         * 每行数据中，物料编码一定是有值的
         */
        if (this.record.materialCode) {
            let x = Object.assign(this.data[index], this.record);
            this.data[index] = x;
        } else {
            this.data.splice(index, 1)
        }
        store.dispatch(OtherWarehouseEditAct.tableData(this.data))
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.isRemoveNewRow != nextProps.isRemoveNewRow) {
            this.setState({ isEdit: null })
        }
        if (nextProps.tableData !== this.data) {
            this.data = nextProps.tableData;
        } else {
            this.data = this.data;
        }
    }

}
let MTable = Form.create()(TableComp);

class OtherWarehouseEditTableEditComp extends Component {
    constructor(props, context) {
        super(props, context);
    }
    handleSubmit = (data, index) => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(data);
        }
    }
    render() {
        let { initialOrderInfo, tableData } = this.props;
        let dataSource = tableData || [];
        let { paging, onChange, ...props } = this.props;
        let addBtn = this.props.sourceOrderType != '1' ? "添加行" : "";
        return (
            <div className='otherwarehouse-edittable'>
                <OtherWarehouseEditDialogCont />
                <h3 className='edittable-title'>明细信息</h3>
                <MTable
                    {...props}
                    dataSource={dataSource}
                    handleSubmit={this.handleSubmit}
                    rowKey={"key"}
                    addBtn={addBtn}
                />
            </div>
        );
    }
}
export default Form.create()(OtherWarehouseEditTableEditComp);
