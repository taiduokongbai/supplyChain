import React, { Component, PropTypes } from "react";
import { AutoComplete, Form, Input, Spin, Button, message, Row, Col, Icon, Select, DatePicker, TreeSelect } from '../../../base/components/AntdComp';
let { observable } = mobx;
let { observer } = mobxReact;
import moment from "moment";
import FormComp from '../../../base/mobxComps/FormComp';
const FormItem = Form.Item;
const Option = Select.Option;
import { disabledBeforeDate } from '../../../base/consts/Utils';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { selfMadeInStore } from '../stores/SelfMadeInStore';
import { addSelfMadeInStore } from '../stores/AddSelfMadeInStore';
import { enumStore } from '../../../base/stores/EnumStore';
import AddSelfMadeInDetailComp from './AddSelfMadeInDetailComp';
import SourceOrderComp from './SourceOrderComp';

@observer
class AddSelfMadeInComp extends FormComp {
    constructor(props, context) {
        super(props, context);
        this.title = '新建自制件入库';
        this.type = 'add';
        this.store = addSelfMadeInStore;
    }

    @observable show = true;
    setShow = () => this.show = !this.show;
    
    componentDidMount() {
        this.store.initData();
    }
    
    componentWillReact() {
        if (this.store.loading) {
            this.resetFds();
        }
    }
    componentWillUnmount() {
        this.store.resetDetail();
        this.store.detailStore.resetDetail();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.validateFds((err, data) => {
            if (!err) {
                data = Object.assign({}, this.store.detail, data);
                data.detailList = this.store.detailStore.dataSource.slice().map(item => { 
                    item.beginShipQty = Number(item.beginShipQty);
                    item.endShipQty = Number(item.endShipQty);
                    item.shipQty = Number(item.shipQty);
                    if (item.lineNo == '') {
                        delete item.lineNo;
                    }
                    if (this.type == 'edit') {
                        item.delFlag = 0;
                    };
                    delete item.id;
                    return item;
                });
                data.shipDate = moment(data.shipDate).format('YYYY-MM-DD');
                data.planDate = moment(data.planDate).format('YYYY-MM-DD');

                data.orderStatus = Number(data.orderStatus);
                data.orderType = Number(data.orderType);
                data.pushdownStatus = Number(data.pushdownStatus);
                let sc = data.stockCode.split('-');
                data.stockCode = sc[sc.length-1];
                delete data.receiveDate;
                delete data.preDetailList;
                if (this.type == 'edit') {
                    data.detailList = data.detailList.concat(this.store.detailStore.delDatas.slice())
                    delete data.createBy;
                };
                this.store.fetchSubmit(data).then(json => {
                    if (json.status == 2000) {
                        this.onMessage();
                    }
                })
            }
        });
    }
    onMessage = () => {
        message.success('新建成功');
        store.dispatch(TabsAct.TabRemove('addSelfMadeIn', 'selfMadeInList'));
        selfMadeInStore.fetchTableList();
    }
    getDetailComp = () => <AddSelfMadeInDetailComp store={this.store.detailStore}/>
    
    //源单类型下拉
    onTypeChange = (value) => {
        if (value == '0') {
            this.store.sourceOrderStore.fetchSelectList("");
        }
        this.setFdv({ sourceOrderCode: "" });
        this.store.detailStore.resetDetail();
    }
    //来源订单下拉
    onSourceOrderSelect = (value, option) => {
        let {
            list
        } = option.props.data;
        let detailList = [];
        list.forEach(item => {
            let obj = Object.assign({}, item);
            obj.sourceOrderLineNo = item.lineNo
            obj.orderStatus = 1;
            detailList.push(obj);
        });
        this.store.detailStore.resetDetail(detailList);
    }
    //计划单下拉表格选择
    onPlanOrderSelect = (data) => {
        let { orderCode } = data;
        if (orderCode) this.store.detailStore.addLineStore.fetchTableList(orderCode);
        this.store.detailStore.resetDetail();
    }
    //收货仓库下拉
    onWareHouseChange = (value, node, extra) => {
        let pos = extra.triggerNode.props.pos.split('-');
        pos.splice(-1);
        let item = this.store.wareHouseStore.getItem(pos.join('-'));
        this.setFdv({
            receiveSiteCode: item.id,
            receiveSiteName: item.text,
        });
    }
    
    render() {
        let formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 13 },
        };
        const { detail, loading } = this.store;
        return (
            <div className='selfMadeIn-wrap'>
                <Spin spinning={loading}>
                    <div className='selfMadeIn-head'>
                        <span className="title">{this.title}</span>
                        <Button type='primary' onClick={this.handleSubmit} style={{
                            backgroundColor: '#4C80CF',
                            borderColor: '#4C80CF',
                        }} >
                            <i className="c2mfont c2m-baocun" style={{ paddingRight: 7, fontSize: '12px' }}></i>
                            保存
                        </Button>
                        <a className="show-more-info" href="#" onClick={this.setShow}>{this.show ? '收起' : '展开'}</a>
                    </div>
                    <Form>
                        <div className="selfMadeIn-base-info" style={{ display: this.show ? `block` : `none` }}>
                            <div className="title">
                                <strong>基本信息</strong>
                            </div>
                            <Row>
                                <Col span={8}>
                                    <FormItem label="源单类型" {...formItemLayout}>
                                        {this.getFD('sourceOrderType', {
                                            initialValue: String(detail.sourceOrderType),
                                            onChange: this.onTypeChange,
                                            rules: [{ required: true, message: '源单类型 必填！' }],
                                        })(
                                            <Select>
                                                {enumStore.getOptions('sourceOrderType2')}
                                            </Select>
                                            )}
                                    </FormItem>
                                    
                                    <FormItem label="源单据号" {...formItemLayout} >
                                        {this.getFD('sourceOrderCode', {
                                            initialValue: detail.sourceOrderCode,
                                            rules: this.getFdv("sourceOrderType")=='0'?[
                                                { required: true, message: '源单据号 必填！' },
                                                {
                                                    type: "autoselect",
                                                    list: this.store.sourceOrderStore.selectList.slice(),
                                                    keyName: "orderCode",
                                                    message: "请从下拉列表中选择一项！",
                                                }
                                            ] : [{ required: true, message: '源单据号 必填！' }]
                                        })(<SourceOrderComp
                                                store={this.store}
                                                onSourceOrderSelect={this.onSourceOrderSelect}
                                                onPlanOrderSelect={this.onPlanOrderSelect}
                                            />)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="收货仓库" {...formItemLayout}>
                                        {this.getFD('stockCode', {
                                            initialValue: detail.stockCode,
                                            rules: [
                                                { required: true, message: '收货仓库 必填！' },
                                            ],
                                        })(
                                            <TreeSelect
                                                {...this.store.wareHouseStore}
                                                treeData={this.store.wareHouseStore.treeData.slice() || []}
                                                onChange={this.onWareHouseChange}
                                                size='large'
                                            />
                                            )}
                                    </FormItem>

                                    <FormItem label="收货站点" {...formItemLayout} style={{ display: 'none' }}>
                                        {this.getFD('receiveSiteCode', {
                                            initialValue: detail.receiveSiteCode,
                                        })(
                                            <Input disabled/>
                                            )}
                                    </FormItem>
                                    <FormItem label="收货站点" {...formItemLayout}>
                                        {this.getFD('receiveSiteName', {
                                            initialValue: detail.receiveSiteName,
                                        })(
                                            <Input disabled />
                                            )}
                                    </FormItem> 
                                </Col>
                                <Col span={8}>
                                    <FormItem label="备注" {...formItemLayout}>
                                        {this.getFD('remarks', {
                                            initialValue: detail.remarks,
                                            rules: [{ max: 200, message: '备注长度不能超过200!' }]
                                        })(
                                            <Input type='textarea' style={{ height: '72px' }} >
                                            </Input>
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                    <div className="selfMadeIn-detail-info">
                        {
                            this.getDetailComp()
                        }
                    </div>
                </Spin>
            </div>
        )
    }

}

const options = {
    onValuesChange(props, values) {
        addSelfMadeInStore.setDetail(values)
    }
}
export default Form.create(options)(AddSelfMadeInComp);
export { AddSelfMadeInComp }