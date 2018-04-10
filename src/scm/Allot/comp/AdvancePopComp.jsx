import React, { Component, PropTypes } from "react";
import { debounce } from '../../../base/consts/Utils';
import { Form, Row, Col, message, InputNumber, AutoComplete } from '../../../base/components/AntdComp';
import {TableEditComp} from '../../../base/mobxComps/TableEditComp';
import ModalComp from '../../../base/mobxComps/ModalComp';
import { advancePopStore, allotLocationStore, advancePopTableStore, addAllotStore } from '../store/AddAllotStore';

let FormItem = Form.Item;
let formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19},
};
let { observer } = mobxReact;

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
                            <InputNumber style={{ width: 100 }} {...inputProps}/>
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

    //自动搜索列表类型的列使用的Render
    autoCompleteColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, autoCompStore, keyName, onSelect, ...selectProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        if (show) {
            let selectEvent = (value, option) => {
                if (onSelect) {
                    let data = option.props.data;
                    this.setFdv(onSelect(data))
                };
            }
            let searchEvent = (value) => {
                autoCompStore.loading = true;
                return autoCompStore.fetchSelectList({stockId:addAllotStore.allotInSiteId}).then(json => {
                    this.forceUpdate();
                    return json;
                });
            }
            return (
                <div style={{'width':'100px'}}>
                    <FormItem>
                        {this.getFD(dataIndex, {
                            initialValue: editingRecord[dataIndex],
                            rules: [
                                {
                                    required:true,
                                    type: "autoselect",
                                    list: autoCompStore.selectList.slice(),
                                    keyName,
                                    message: "请从下拉列表中选择一项！",
                                },
                                { required: true, message: '仓位必填！'},
                                ...(rules || [])
                            ]
                        })(
                            <AutoComplete
                                {...autoCompStore.Props}
                                {...selectProps}
                                onSelect={selectEvent}
                                onSearch={debounce(searchEvent, 500)}
                            />
                        )}
                    </FormItem>
                </div>
            )
        } else {
            return <div style={textStyle}>{text}</div>;
        }
    }
}

let options = {
    onValuesChange(props, values) {
        props.setEditingRecord(values)
    }
}

let SelfTableEditComp =  Form.create(options)(SelfTableEdit);


@observer
class AdvancePopComp extends ModalComp {
    constructor(props){
        super(props);
        this.store = advancePopStore;
        this.columns = [
            {
                title: '行号',
                dataIndex: 'outLineNo',
                key: 'outLineNo'
            }, {
                title: '仓库',
                dataIndex: 'allotInStockName',
                key: 'allotInStockName',
            }, {
                title: '仓位',
                dataIndex: 'allotInLocationCode',
                key: 'allotInLocationCode',
                width: 110,
                obj: {
                    keyName: 'locationCode',
                    autoCompStore: allotLocationStore,
                    onSelect: (value) => {
                        return {allotInLocationCode: value.locationCode}
                    },
                }
            }, {
                title: '批次号',
                dataIndex: 'allotInBatchCode',
                key: 'allotInBatchCode',
                obj:{
                    rules: [{ max: 20,message:'最大长度为20'}]
                }
            }, {
                title: '预收货数量',
                dataIndex: 'allotInQty',
                key: 'allotInQty',
                obj:{
                    rules: [{ validator: (rule,val,callback)=>{
                        if(val === '' || val === undefined || !(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(val))){
                            callback("请输入数字");
                        } else if(val <= 0){
                            callback('已分配数量要大于0');
                        } else if(!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(val))){
                            callback("小数点后不能超过两位");
                        } else if(val > (Number(advancePopStore.advanceInfo.allotOutQty)-Number(advancePopStore.advanceInfo.allotInQty)).toFixed(2)){
                            callback("小于或等于未清数量");
                        } else {
                            callback();
                        }
                    }}]
                }
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
            }
        ];
    }

    handleCancel = () => {
        if (!this.store.loading) {
            this.store.setVisible(false);
        }
    };

    handleSubmit = () => {
        if('id' in advancePopTableStore.editingRecord){
           message.warn("请确认明细行数据");
        } else {
            advancePopTableStore.popSubmit();
        }
    }

    title = () => {
        return (
                <a href='#' onClick={advancePopTableStore.onAdd}>
                    <i className='c2mfont c2m-tianjia' />
                    添加行
                </a>
            )

    }



    getComp = () => {

        let { advanceInfo } = advancePopStore;

        return (
            <div className="addvance-pop">
                <div className="top">
                    <Row>
                        <Col span={8}>
                            <Row>
                                <Col className="title" span={10}>
                                    物料编码：
                                </Col>
                                <Col span={10}>
                                    {advanceInfo.materialCode}
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row>
                                <Col className="title" span={10}>
                                    库存单位：
                                </Col>
                                <Col span={10}>
                                    {advanceInfo.unitName}
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row>
                                <Col className="title" span={10}>
                                    计划数量：
                                </Col>
                                <Col className="plan-amount" span={10}>
                                    {advanceInfo.allotOutQty}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Row>
                                <Col className="title" span={10}>
                                    物料名称：
                                </Col>
                                <Col className="material-content" span={10}>
                                    {advanceInfo.materialName}
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row>
                                <Col className="title" span={10}>
                                    批次号：
                                </Col>
                                <Col span={10}>
                                    {advanceInfo.allotOutBatchCode}
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row>
                                <Col className="title" span={10}>
                                    预收货数量：
                                </Col>
                                <Col className="distribution-amount" span={10}>
                                    {advanceInfo.allotInQty}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <SelfTableEditComp
                    {...advancePopTableStore.Props}
                    columns={this.columns}
                    title={this.title}
                    pagination={false}
                    rowKey={"id"}
                />
            </div>
        )
    }
}

export default AdvancePopComp