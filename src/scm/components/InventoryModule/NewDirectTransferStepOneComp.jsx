/**
 * Created by MW on 2017/8/31.
 */
import React, {Component} from 'react'
import EditableTableComp from '../../../base/components/EditableTableComp';
import { store } from "../../data/StoreConfig";
import NewDirectTransferAct from '../../actions/InventoryModule/NewDirectTransferAct'
import { Button, Popconfirm, message, Input, Icon, Table, Select, Radio, Form } from '../../../base/components/AntdComp';

class TableComp extends EditableTableComp {
    constructor(props) {
        super(props)
        this.recordKey = 'line';
        this.state = {
            isEdit: null,
            disableds: [],
            current: 1,
            pageSize: 10,
            materialCodeTips: false,
        };
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'line',
                key: 'line',
                hidden: true
            }, {
                title: '行号',
                dataIndex: 'lineNum',
                key: 'lineNum',
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
            },  {
                title: '仓位',
                dataIndex: 'allotOutLocationCode',
                key: 'allotOutLocationCode',
            }, {
                title: '批次号',
                dataIndex: 'allotOutBatchCode',
                key: 'allotOutBatchCode',
            }, {
                title: '库存数量',
                dataIndex: 'amount',
                key: 'amount',
            }, {
                title: '调出数量',
                dataIndex: 'allotOutQty',
                key: 'allotOutQty',
            }, {
                title: '基本单位',
                dataIndex: 'measureUnitName',
                key: 'measureUnitName',
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
            }
        ];

        //操作列
        this.columns[this.columns.length - 1].render = this.optColRender;

        //可编辑的列
        this.columns.forEach((item) => {
            //编辑物料编码
            if (/^materialCode$/i.test(item.dataIndex)) {
                item.render = this.inputHandler(item.dataIndex, item.obj)
            }
            //编辑调出数量
            if(/^allotOutQty$/i.test(item.dataIndex)) {
                item.render = this.inputNumberColRender(item.dataIndex, item.obj)
            }
        });
    }

    inputHandler = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, ...cellObj } = obj;
        if (this.state.isEdit == record[this.recordKey]) {
            if (this.state.disableds.includes(dataIndex)) {
                return this.record[dataIndex];
            } else {
                let { current, pageSize } = this.state;
                if (current && current != 1) {
                    index = (current - 1) * pageSize + index;
                };
                return (
                    <div className="table-materialCode-style">
                        <p className='a-editStyle'>
                            {record.materialCode}
                            <a onClick={() => this.searchMaterial(index, record)} className='a-dialog-btn' >...&nbsp;</a>
                        </p>
                        {/*<span style={{ display: this.state.materialCodeTips ? 'block' : 'none' }} className='materialCodeTips'>物料编码不能为空!</span>*/}
                    </div>
                )
            }
        } else {
            return <div style={textStyle}>{text}</div>;
        }
    }

    //搜索物料的弹窗
    searchMaterial = () => {
        this.props.searchMaterial();
    }

    addNewRow = () => {
        if(this.props.allotOutSiteCode) {
            let newRow = Object.assign({}, this.getNewRow());
            this.data.splice(0, 0, newRow);
            this.forceUpdate();
            // store.dispatch(NewDirectTransferAct.tableData(this.data))
        } else {
            message.error('请先选择调出仓库，再添加调出信息！');
        }

    };

    //添加行
    getNewRow = () => {
        let id = '-1';
        if(this.data[0] && this.data[0].line < 0) {
            id = this.data[0].line - 1;
        };

        return {
            'line': String(id),
            'id': null,
            'lineNum': '',
            'materialCode': '',
            'materialName': '',
            'materialSpec': '',
            'materialModel': '',
            'allotOutLocationCode': '',
            'allotOutBatchCode': '',
            'amount': '',
            'allotOutQty': '',
            'measureUnitName': ''
        }
    };

    //编辑
    handleEdit = (record) => {
        record.isEdit = 1;   // 当前行为编辑状态
        // store.dispatch(NewDirectTransferAct.tableData(this.data))
        this.setState({ record });
    }

    //删除
    handleDel = (index) => {
        store.dispatch(NewDirectTransferAct.tableData(index,1))
    }

    //点击保存
    saveHandler = (index) => {
        this.validateFds((err, data) => {
            if (!err) {
                let { current, pageSize } = this.state;
                if (current && current != 1) {
                    index = (current - 1) * pageSize + index;
                };
                this.handleSave(index);
                if(this.isEdit){
                    if(this.props.outData.length) {
                        if(this.props.outData.some((order) => {
                                return order.materialCode == this.record.materialCode
                            })){
                            store.dispatch(NewDirectTransferAct.tableData(index,1,this.record))
                        } else {
                            store.dispatch(NewDirectTransferAct.tableData(index,0,this.record));
                        }
                    } else {
                        store.dispatch(NewDirectTransferAct.tableData(index,0,this.record));
                    }

                    Object.assign(this.data[index], this.record);
                    this.setState({ isEdit: null });
                    this.props.handleSubmit(this.data, index);
                }
            }
        });
    }

    //保存
    handleSave = () => {
        let val = this.props;
        if (val.checkedList && val.checkedList.materialCode) {
            this.isEdit = true;
            this.record.materialCode = val.checkedList.materialCode;
            this.record.materialName = val.checkedList.materialName;
            this.record.materialSpec = val.checkedList.materialSpec;
            this.record.materialModel = val.checkedList.materialModel;
            this.record.allotOutLocationCode = val.checkedList.freightSpaceName;
            this.record.allotOutBatchCode = val.checkedList.batchCode;
            this.record.amount = val.checkedList.amount;
            this.record.allotInQty = 0;
            this.record.measureUnitName = val.checkedList.measureUnitName;
            // this.record.id = val.checkedTableList.id;
            store.dispatch(NewDirectTransferAct.checkedTableList(this.record))
        }
        if (!this.record.materialCode) {   // 物料编码为空
            this.isEdit = false;
            this.record.isEdit = 1;
            this.setState({
                materialCodeTips: true
            })
        } else {
            this.record.isEdit = 0;
        }
        store.dispatch(NewDirectTransferAct.tableData(this.data))
    }

    handleCancel = (index) => {
        this.data[index].isEdit = 0;
        this.record.bringNum = this.state.record.bringNum;
        let x = Object.assign(this.data[index], this.record);
        this.data[index] = x;
        // store.dispatch(NewDirectTransferAct.tableData(this.data))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initialOrderInfo !== this.data) {
            this.data = nextProps.initialOrderInfo;
        } else {
            this.data = this.data;
        }
    }
}

let MTable = Form.create()(TableComp);

class NewDirectTransferStepOne extends Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = (data, index) => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(data);
        }
    }

    render(){

        let { initialOrderInfo } = this.props;
        let dataSource = initialOrderInfo || [];
        let { ...props } = this.props;

        return (
            <div className="outInfo">
                <h3 className="outInfoTitle">调出信息</h3>
                <MTable {...props} rowKey={"key"}
                        handleSubmit={this.handleSubmit}
                        dataSource = {dataSource}
                        addBtn="添加行"/>
            </div>
        )
    }
}

export default NewDirectTransferStepOne