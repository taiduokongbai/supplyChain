import React, { Component } from 'react'
import { Button, Popconfirm, message, Input, Icon, Table, Select, Radio, Form } from '../../../base/components/AntdComp';
import EditableTableComp from '../../../base/components/EditableTableComp';
import { store } from "../../data/StoreConfig";
import AddOtherWareHousePageDialogCont from "../../dialogconts/InventoryModule/AddOtherWareHousePageDialogCont";
import AddOtherWareHousePageDialogAct from "../../actions/InventoryModule/AddOtherWareHousePageDialogAct";
import AddOtherWareHousePageAct from "../../actions/InventoryModule/AddOtherWareHousePageAct";
import TooltipComp from '../../../base/components/TooltipComp'
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
            record: {}
        }
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'lineNum',
                key: 'lineNum',
                hidden: true
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width:76
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                width: 188,
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 84 }} />
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 88 }} />
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
                dataIndex: 'measureUnitName',
                key: 'measureUnitName',
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 92,
                className: 'addohter-table-operation'
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
    getNewRow = () => {
        store.dispatch(AddOtherWareHousePageDialogAct.show())
        let id = "-1";
        if (this.data[0] && this.data[0].lineNum < 0) {
            id = this.data[0].lineNum - 1;
        };
        store.dispatch(AddOtherWareHousePageAct.indexVal(0))
        return {
            //"id": String(id),
            "lineNum": String(id),
            "id": null,
            "status": "已保存",
            "materialCode": "",
            "materialName": "",
            "materialSpec": "",
            "planAmount": "",
            "materialModel": "",
            "measureUnitName": "",
            'opType': 0,
        }
    }
    handleEdit = (record) => {
        record.isEdit = 1;   // 当前行为编辑状态
        this.setState({ record })
    }
    handleDel = (index) => {
        store.dispatch(AddOtherWareHousePageAct.tableData(this.data))
    }
    handleSave = () => {
        let val = this.props;
        this.isEdit = true;
        this.record.isEdit = 0;
        if (val.checkedTableList && val.checkedTableList.materialCode) {
            this.isEdit = true;
            this.record.materialCode = val.checkedTableList.materialCode;
            this.record.materialName = val.checkedTableList.materialName;
            this.record.materialSpec = val.checkedTableList.materialSpec;
            this.record.materialModel = val.checkedTableList.model;
            this.record.measureUnitName = val.checkedTableList.materialInventory?val.checkedTableList.materialInventory.inventoryUnitName:'';
            this.record.materialUnitCode = val.checkedTableList.materialInventory?val.checkedTableList.materialInventory.inventoryUnitCode:'';
            store.dispatch(AddOtherWareHousePageAct.checkedTableList({}))
        }
        store.dispatch(AddOtherWareHousePageAct.tableData(this.data))
    }
    handleChange = (key, index, value) => {
        if (key === 'planAmount') {
            this.record.planAmount = value;
        }
        this.forceUpdate();
    }
    handleCancel = (index) => {
        this.data[index].isEdit = 0;
        this.record.planAmount = this.state.record.planAmount;
        if(this.record.materialCode){
            let x = Object.assign(this.data[index], this.record);
            this.data[index] = x;
        }else {
            this.data.splice(index, 1)
        } 
        store.dispatch(AddOtherWareHousePageAct.tableData(this.data))
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.isRemoveNewRow != nextProps.isRemoveNewRow){
            this.setState({isEdit: null})
        }
        if (nextProps.tableData !== this.data) {
            this.data = nextProps.tableData;
        } else {
            this.data = this.data;
        }
    }
}
let MTable = Form.create()(TableComp);

class AddOtherWareHousePageTableComp extends Component {
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
        let { tableData } = this.props;
        let dataSource = tableData || [];
        let { paging, onChange, ...props } = this.props;
        return (
            <div className="add-row-other-table">
                <AddOtherWareHousePageDialogCont />
                <h3 className='add-row-other-table-title'>明细信息</h3>
                <MTable
                    {...props}
                    dataSource={dataSource}
                    rowKey={"key"}
                    addBtn="添加行"
                    handleSubmit={this.handleSubmit}
                    className="addOtherWarePageTable"
                />
            </div>
        );

    }
}

export default AddOtherWareHousePageTableComp;