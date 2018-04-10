import React, { Component } from 'react';
import { Row, Col, Button, Input, message, Form,Select, DatePicker, AutoComplete, TreeSelect, Popconfirm, Spin } from '../../../base/components/AntdComp';
import FormComp from '../../../base/mobxComps/FormComp';
import { debounce } from '../../../base/consts/Utils';
import moment from "moment";
import AddAllotStepOneComp from './AddAllotStepOneComp'
import MaterialChoosePopComp from './MaterialChoosePopComp';
import AdvancePopComp from './AdvancePopComp';
import AddAllotStepTwoComp from './AddAllotStepTwoComp';
import AddAllotStepThreeComp from './AddAllotStepThreeComp';
import { disabledBeforeDate } from '../../../base/consts/Utils';
import { addAllotStore, allotTypeStore, employeeStore,
    outSiteStore, inSiteStore, addOutInfoStore, allotInListStore,
    advanceTableInfoStore, addAllotTableStore } from '../store/AddAllotStore';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

let FormItem = Form.Item,
    Option = Select.Option,
    { MonthPicker, RangePicker } = DatePicker,
    formItemLayout = {
        labelCol: {span: 5},
        wrapperCol: {span: 19},
    };

@observer
class AddAllot extends FormComp {
    constructor(props){
        super(props);
        this.state = {
            oneComp: true,
            twoComp: false,
            threeComp: false,
            active1: '#4C80CF',
            active2: '#4A4A4A',
            active3: '#4A4A4A',
            visible: false
        };
        this.onProposerSearch = debounce(this.onProposerSearch, 500);
    }
    //员工搜索
    onProposerSearch = (value) => {
        employeeStore.loading = true;
        this.setFdv({
            allotProposerCode: ''
        });
        return employeeStore.fetchSelectList(value);
    };

    //员工下拉
    onProposerSelect = (value, option) => {
        this.setFdv({
            allotProposerCode: option.props.data.empCode
        });
    };

    getMaterial = () => {
        return (
            <div>
                <MaterialChoosePopComp />
            </div>
        )
    };

    getAdvance = () => {
        return (
            <div>
                <AdvancePopComp />
            </div>
        )
    };

    first = (flag) => {
        switch (flag){
            case 1:
                // 跳转到第一步
                let formValues= this.props.form.getFieldsValue();
                formValues.allotDate = formValues.allotDate?formValues.allotDate.format('YYYY-MM-DD'):'';
                formValues.allotOutSiteCode = addAllotStore.allotOutSiteCode;
                formValues.allotInSiteCode = addAllotStore.allotInSiteCode;
                addAllotStore.submitOther({...formValues,id:addAllotStore.id})
                    .then((json) => {
                        if(json.status === 2000) {
                            this.setState({
                                oneComp: true,
                                twoComp: false,
                                active1: '#4C80CF',
                                active2: '#4A4A4A',
                            });
                            addOutInfoStore.fetchTableList({allotId: addAllotStore.id, page: 1, pageSize: 15});
                                // .then(json => {
                                //     if (json.status === 2000) {
                                //         addAllotStore.setLoading(false);
                                //     } else {
                                //         addAllotStore.setLoading(false);
                                //     }
                                // });
                        }
                    });
                break;
            case 2:
                // 跳转到第二步
                if(!addAllotStore.allotOutSiteCode){
                    message.warn('请选择调出仓库！');
                } else if(addOutInfoStore.dataSource.length == 0){
                    message.warn('请选择调出物料！');
                } else if('id' in addOutInfoStore.editingRecord){
                    message.warn('请确认调出信息！');
                } else {
                    // addAllotStore.setLoading(true);
                    let formValues= this.props.form.getFieldsValue();
                    formValues.allotDate = formValues.allotDate?formValues.allotDate.format('YYYY-MM-DD'):'';
                    formValues.allotOutSiteCode = addAllotStore.allotOutSiteCode;
                    formValues.allotInSiteCode = addAllotStore.allotInSiteCode;
                    addAllotStore.submitOther({...formValues,id:addAllotStore.id})
                        .then((json) => {
                            if(json.status === 2000){
                                this.setState({
                                    oneComp: false,
                                    twoComp: true,
                                    threeComp: false,
                                    active1: '#4A4A4A',
                                    active2: '#4C80CF',
                                    active3: '#4A4A4A'
                                });
                                allotInListStore.fetchTableList();
                                addAllotStore.setLoading(false);
                            }
                        });
                }
                break;
            case 3:
                // 跳转到第三步
                if(!addAllotStore.allotInSiteCode){
                    message.warn('请选择调入仓库！');
                }
                else if(
                    allotInListStore.dataSource.some((record) => {
                        return record.allotInQty != record.allotOutQty;
                    })
                ){
                    for( let record = 0; record < allotInListStore.dataSource.length; record++ ){
                        if(allotInListStore.dataSource[record].allotInQty != allotInListStore.dataSource[record].allotOutQty) {
                            message.warn('编号为【'+allotInListStore.dataSource[record].materialCode+'】的物料未执行预收货，请执行完再操作！');
                            break;
                        }
                    }
                } else {
                    let formValues= this.props.form.getFieldsValue();
                    formValues.allotDate = formValues.allotDate?formValues.allotDate.format('YYYY-MM-DD'):'';
                    formValues.allotOutSiteCode = addAllotStore.allotOutSiteCode;
                    formValues.allotInSiteCode = addAllotStore.allotInSiteCode;
                    addAllotStore.submitOther({...formValues,id:addAllotStore.id})
                    .then((json) => {
                        if (json.status === 2000) {
                            this.setState({
                                twoComp: false,
                                threeComp: true,
                                active2: '#4A4A4A',
                                active3: '#4C80CF',
                            });
                            addAllotTableStore.fetchTableList();
                            //     .then(json => {
                            //     if (json.status === 2000) {
                            //         addAllotStore.setLoading(false);
                            //     } else {
                            //         addAllotStore.setLoading(false);
                            //     }
                            // });
                        }
                    });
                }
                break;
            default:
                return null;
        }
    };

    save = (e) => {
        e.preventDefault();
        this.validateFds((err,values) => {
            if(!err) {
               if(addAllotTableStore.dataSource.length == 0){
                    message.warn('明细行不能为空');
               } else {
                       values.allotDate = values.allotDate ? values.allotDate.format('YYYY-MM-DD') : '';
                       values.allotOutSiteCode = addAllotStore.allotOutSiteCode;
                       values.allotInSiteCode = addAllotStore.allotInSiteCode;
                       values.id = addAllotStore.id;
                       addAllotStore.allotConfirm(values);
               }
            }
        });
    };

    render(){

        return (
            <div className="new-direct-transfer">
                {/*<Spin spinning={ addAllotStore.loading }>*/}
                    <div className="new-direct-transfer-top">
                        <Form>
                            <div className="top">
                                <Row>
                                    <Col span={12}>
                                        <span className="title" style={{'color':this.state.active1}}>1.调拨出库</span> >
                                        <span className="title" style={{'color':this.state.active2}}>2.调拨入库</span> >
                                        <span className="title" style={{'color':this.state.active3}}>3.检查</span>
                                    </Col>
                                    <Col className="right" span={12}>
                                        {
                                            this.state.oneComp ?
                                                <Button className="btn" onClick={() => this.first(2)}>下一步<i className="c2mfont c2m-right" style={{"fontSize":"12px"}}></i></Button>
                                                :
                                                (this.state.twoComp ?
                                                        <div>
                                                            <Button className="btn" onClick={() => this.first(1)}><i className="c2mfont c2m-left" style={{"fontSize":"12px"}}></i>上一步</Button>
                                                            <Button className="btn" onClick={() => this.first(3)}>下一步<i className="c2mfont c2m-right" style={{"fontSize":"12px"}}></i></Button>
                                                        </div>
                                                        : (
                                                            this.state.threeComp ?
                                                                <div>
                                                                    <Button className="btn" onClick={() => this.first(2)}><i className="c2mfont c2m-left" style={{"fontSize":"12px"}}></i>上一步</Button>
                                                                    <Popconfirm title="是否保存此单据？" onConfirm={this.save} okText="确定" cancelText="取消">
                                                                        <Button className="btn"><i className="c2mfont c2m-shi" style={{"fontSize":"14px",'paddingRight':'4px'}}></i>保存</Button>
                                                                    </Popconfirm>
                                                                </div>
                                                                : null
                                                        )
                                                )
                                        }
                                    </Col>
                                </Row>
                            </div>
                            <div className="info">
                                <div className="info-first">
                                    <Row className="row-first">
                                        <Col span={16}>
                                            <Row className="title">
                                                <Col>
                                                    <h3>基本信息</h3>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className="col-left" span={12}>
                                                    <Row className="per-col">
                                                        <FormItem className="form-itme"
                                                                  {...formItemLayout}
                                                                  label="单据类型：">
                                                            {this.getFD('allotOrderTypeCode',{
                                                                    initialValue: '',
                                                                    rules: [
                                                                        {
                                                                            required:true,
                                                                            message: '请选择单据类型',
                                                                        }
                                                                    ],
                                                                }
                                                            )(
                                                                <Select>
                                                                    {allotTypeStore.options}
                                                                </Select>
                                                            )
                                                            }
                                                        </FormItem>
                                                    </Row>
                                                    <Row className="per-col">
                                                        <FormItem className="form-itme"
                                                                  {...formItemLayout}
                                                                  label="调拨申请人：">
                                                            {this.getFD('allotProposerCode', {
                                                                initialValue: addAllotStore.allotInfo.allotProposerCode,
                                                                rules: [
                                                                    {
                                                                        type: "autoselect",
                                                                        list: employeeStore.selectList.slice(),
                                                                        keyName: "empCode",
                                                                        message: "请从下拉列表中选择一项！",
                                                                    },
                                                                ],
                                                            })(
                                                                <AutoComplete
                                                                    {...employeeStore.Props}
                                                                    onSelect={this.onProposerSelect}
                                                                    onSearch={this.onProposerSearch}
                                                                />
                                                            )}
                                                        </FormItem>
                                                    </Row>
                                                    <Row className="per-col">
                                                        <FormItem className="form-itme"
                                                                  {...formItemLayout}
                                                                  label="调拨日期：">
                                                            {this.getFD('allotDate', {
                                                            })(
                                                                <DatePicker format="YYYY-MM-DD"
                                                                            disabledDate={(c) => disabledBeforeDate(c, moment())}
                                                                />
                                                            )}
                                                        </FormItem>
                                                    </Row>
                                                </Col>
                                                <Col className="col-center" span={12}>
                                                    <Row>
                                                        <Col>
                                                            <Row className="per-col">
                                                                <FormItem className="form-itme"
                                                                          {...formItemLayout}
                                                                          label="调出仓库：">
                                                                    {this.getFD('allotOutSiteCode', {
                                                                        initialValue: '',
                                                                        rules: [
                                                                            { required: true, message: '调出仓库必填！' },
                                                                            { validator: (rule,val,callback)=>{
                                                                                if(this.getFdv('allotInSiteCode') == this.getFdv('allotOutSiteCode')){
                                                                                    callback("调出仓库应不等于调入仓库");
                                                                                } else {
                                                                                    callback();
                                                                                }
                                                                            }}

                                                                        ],
                                                                    })(
                                                                        <TreeSelect
                                                                            {...outSiteStore.Props}
                                                                            disabled={addOutInfoStore.dataSource.length != 0}
                                                                            onSelect={(value, node, extra) => {
                                                                                addAllotStore.setOutSiteCode(value,outSiteStore.getItem(node.props.pos).attribute.stockCode);
                                                                            }}
                                                                            notFoundContent="暂无数据"
                                                                            onChange={(value, node, extra) => {
                                                                                if(!value){
                                                                                    addAllotStore.setOutSiteCode('','');
                                                                                }
                                                                            }}
                                                                        />
                                                                    )}
                                                                </FormItem>
                                                            </Row>
                                                            <Row className="per-col">
                                                                <FormItem className="form-itme"
                                                                          {...formItemLayout}
                                                                          label="调入仓库：">
                                                                    {this.getFD('allotInSiteCode', {
                                                                        initialValue: '',
                                                                        rules: [
                                                                            { required: true, message: '调出仓库必填！' },
                                                                            {validator: (rule,val,callback)=>{
                                                                                if(this.getFdv('allotInSiteCode') == this.getFdv('allotOutSiteCode')){
                                                                                    callback("调入仓库应不等于调出仓库");
                                                                                } else {
                                                                                    callback();
                                                                                }
                                                                            }}
                                                                        ],
                                                                    })(
                                                                        <TreeSelect
                                                                            {...inSiteStore.Props}
                                                                            disabled={ addAllotStore.disAdvanceTableInfo }
                                                                            onSelect={(value, node, extra) => {
                                                                                addAllotStore.setInSiteCode(value,outSiteStore.getItem(node.props.pos).attribute.stockCode,
                                                                                    outSiteStore.getItem(node.props.pos).text);
                                                                            }}
                                                                            notFoundContent="暂无数据"
                                                                            onChange={(value, node, extra) => {
                                                                                if(!value){
                                                                                    addAllotStore.setInSiteCode('','','');
                                                                                }
                                                                            }}
                                                                        />
                                                                    )}
                                                                </FormItem>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col className="col-right" span={8}>
                                            <Row  className="title">
                                                <Col>
                                                    <h3>其他信息</h3>
                                                </Col>
                                            </Row>
                                            <Row className="per-col-remarks">
                                                <FormItem className="form-itme"
                                                          {...formItemLayout}
                                                          label="备注：">
                                                    {this.getFD('remarks',{
                                                            initialValue: '',
                                                            rules: [
                                                                { max: 200, message: '备注内容要在200字以内'}
                                                            ]
                                                        }
                                                    )(
                                                        <Input type="textarea" rows={4} className="textarea"/>
                                                    )}
                                                </FormItem>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Form>
                    </div>
                    { this.state.oneComp ? <AddAllotStepOneComp /> : null}
                    { this.state.twoComp ? <AddAllotStepTwoComp /> : null}
                    { this.state.threeComp ? <AddAllotStepThreeComp /> : null}
                    {this.getMaterial()}
                    {this.getAdvance()}
                {/*</Spin>*/}
            </div>
        )
    }
}

const options = {
    onValuesChange(props, values) {
        if(!(values.allotOutSiteCode || values.allotInSiteCode)){
            addOutInfoStore.submitValuesTop(values);
        }
    }
}

let AddAllotComp = Form.create(options)(AddAllot);

export default AddAllotComp