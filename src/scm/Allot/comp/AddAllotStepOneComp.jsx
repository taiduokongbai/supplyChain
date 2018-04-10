import React, { Component } from 'react';
import { Form, Row, Col, InputNumber } from '../../../base/components/AntdComp';
import {TableEditComp} from '../../../base/mobxComps/TableEditComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
let { observable, action, computed, runInAction, toJS } = mobx;
import { addAllotStore, addOutInfoStore, materialChooseTableStore, materialPopStore } from '../store/AddAllotStore';
let { observer } = mobxReact;

let FormItem = Form.Item;
@observer
class SelfTableEdit extends TableEditComp {
    constructor(props) {
        super(props);
        this.columns = props.columns;
        this.columns.forEach((item) => {
            if (props.disableds.includes(item.dataIndex)) {
                item.render = this.textColRender(item.dataIndex, item.obj);
            } else if (props.inputCell.includes(item.dataIndex)) {
                item.render = this.inputColRender(item.dataIndex, item.obj);
            } else if (props.inputNumberCell.includes(item.dataIndex)) {
                item.render = this.inputNumberColRender(item.dataIndex, item.obj);
            } else if (props.selectCell.includes(item.dataIndex)) {
                item.render = this.selectColRender(item.dataIndex, item.obj);
            } else if (props.autoCompleteCell.includes(item.dataIndex)) {
                item.render = this.autoCompleteColRender(item.dataIndex, item.obj);
            } else if (props.radioCell.includes(item.dataIndex)) {
                item.render = this.radioColRender(item.dataIndex, item.obj);
            } else if (props.datePickerCell.includes(item.dataIndex)) {
                item.render = this.datePickerColRender(item.dataIndex, item.obj);
            } else if(props.inputHandler.includes(item.dataIndex)){
                item.render = this.inputHandler(item.dataIndex, item.obj);
            } else {
                item.render = this.textColRender(item.dataIndex, item.obj);
            }

        });
        this.columns[this.columns.length - 1].render = this.optColRender;
    };

    //数值输入框类型的列使用的Render
    inputNumberColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, render, onChange, ...inputProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        if (show) {
            let changeEvent = (value) => {
                if (onChange) {
                    this.setFdv(onChange(value));
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD(dataIndex, {
                            initialValue: editingRecord[dataIndex],
                            rules: rules || [],
                            onChange: changeEvent,
                        })(
                            <InputNumber
                                style={{ width: 100 }}
                                {...inputProps}
                            />
                        )}
                    </FormItem>
                </div>
            )
        } else if (render) {
            if (render.wid) {
                return <TooltipComp attr={{ text: text, ...render }} />
            }
            if (typeof render == 'function') {
                return render(text, record, index);
            }
        } else {
            return <div style={textStyle}>{text}</div>;
        }
    };

    inputHandler = (dataIndex, obj = {}) => (text, record, index) => {

        let { textStyle, rules, render, onChange, ...inputProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        if (show) {
            let changeEvent = (e) => {
                if (onChange) {
                    let value = e.target.value;
                    this.setFdv(onChange(value));
                }
            };
            return (
                <div>
                    {'id' in editingRecord ?
                        <FormItem>
                            <div className="table-materialCode-style">
                                <p className='a-editStyle'>
                                    {editingRecord.materialCode}
                                    <a className='a-dialog-btn' onClick={(e) => this.searchMaterial(index)} >...&nbsp;</a>
                                </p>
                            </div>
                        </FormItem>
                        :
                        <FormItem>
                            {this.getFD(dataIndex, {
                                initialValue: editingRecord[dataIndex],
                                rules: rules || [],
                                onChange: changeEvent,
                            })(
                                <div className="table-materialCode-style">
                                    <p className='a-editStyle'>
                                        <input type="text" value={record.materialCode}/>
                                        <a className='a-dialog-btn' onClick={(e) => this.searchMaterial(index)} >...&nbsp;</a>
                                    </p>
                                </div>
                            )}
                        </FormItem>
                    }
                </div>
            )
        } else if (render) {
            if (render.wid) {
                return <TooltipComp attr={{ text: text,  ...render }} />
            }
        } else {
            return <div style={textStyle}>{text}</div>;
        }
    };

    //搜索物料的弹窗
    searchMaterial = (index) => {
        materialPopStore.setVisible(true);
        addOutInfoStore.setIndex(index);
        materialChooseTableStore.fetchTableList({ page: 1,pageSize: 5, stockId: addAllotStore.allotOutSiteId});
    };

    //操作列使用的Render
    optColRender = (txt, record, index) => {
        let { editingRecord, editingIndex, recordKey, disableds,
            handleSave, onCancel, onEdit, onDelete
        } = this.props;
        let show = (editingRecord[recordKey] == record[recordKey] && record.allotInQty == 0);
        let opts = [
            {
                title: '确定',
                fun: () => this.validateFds((err, data) => {
                    if (!err) {
                        handleSave();
                    }
                }),
                show,
            },
            {
                title: '取消',
                fun: () => onCancel(),
                show,
            },
            {
                title: '编辑',
                fun: () => onEdit(record, index),
                show: (editingIndex == null && record.allotInQty == 0),
            },
            {
                title: "删除",
                titleText: ['确认要删除该明细项吗？'],
                fun: () => onDelete(index),
                show: (editingIndex == null && record.allotInQty == 0),
            },
        ];
        return <OperationsComp operations={opts} />;
    }
}

let options = {
    onValuesChange(props, values) {
        props.setEditingRecord(values)
    }
}

let SelfTableEditComp =  Form.create(options)(SelfTableEdit);

@observer
class AddAllotStepOneComp extends Component {
    constructor (props){
        super(props);
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNo',
                key: 'lineN0',
                width: 50,
                render: (record, text, index) => <span>{'--'}</span>
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                width: 172
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
                dataIndex: 'inventoryQty',
                key: 'inventoryQty',
            }, {
                title: '调出数量',
                dataIndex: 'allotOutQty',
                key: 'allotOutQty',
                obj: {
                    rules: [{ validator: (rule,val,callback)=>{
                        if(val === '' || val === undefined || !(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(val))){
                            callback("请输入数字");
                        } else if(val <= 0 ){
                            callback('已分配数量要大于0');
                        } else if(!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(val))){
                            callback("小数点后不能超过两位");
                        } else if(val > addOutInfoStore.editingRecord.inventoryQty){
                            callback("小于或等于库存数量");
                        } else {
                            callback();
                        }
                    }}]
                }
            }, {
                title: '库存单位',
                dataIndex: 'unitName',
                key: 'unitName',
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
            }
        ];
    }

    title = () => {
        return (
            <div className="new-allot-title">
                <Row>
                    <Col span={22}>
                        <h3 className="title">调出信息</h3>
                    </Col>
                    <Col span={2} style={{"textAlign":'right'}}>
                        <a className="operator" href='#' onClick={addOutInfoStore.onAdd}>
                            <i className='c2mfont c2m-tianjia' />
                            添加行
                        </a>
                    </Col>
                </Row>
            </div>
        );
    }

    render(){
        return (
            <div className='purchaseDetail-table'>
                <SelfTableEditComp
                    {...addOutInfoStore.Props}
                    rowKey={"id"}
                    columns={this.columns}
                    title={this.title}
                />
            </div>
        )
    }
}

export default AddAllotStepOneComp