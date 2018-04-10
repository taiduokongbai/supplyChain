import React, { Component, PropTypes } from "react";
import { AutoComplete, Form, Input, Spin, Button, message, Row, Col, Icon, Select, DatePicker, TreeSelect } from '../../../base/components/AntdComp';
let { observer } = mobxReact;
import moment from "moment";
import FormComp from '../../../base/mobxComps/FormComp';
const FormItem = Form.Item;
const Option = Select.Option;
import { disabledBeforeDate } from '../../../base/consts/Utils';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { purRecNoticeStore } from '../stores/PurRecNoticeStore';
import { addPurRecNoticeStore, sourceOrderStore, wareHouseStore, employeeStore, addPurRecNoticeDetailStore } from '../stores/AddPurRecNoticeStore';
import { enumStore } from '../../../base/stores/EnumStore';
import AddPurRecNoticeDetailComp from './AddPurRecNoticeDetailComp';
import { debounce } from '../../../base/consts/Utils';

@observer
class AddPurRecNoticeComp extends FormComp {
    constructor(props, context) {
        super(props, context);
        this.title = '新建收货通知单';
        this.type = 'add';
        this.store = addPurRecNoticeStore;
        this.sourceOrderStore = sourceOrderStore;
        this.wareHouseStore = wareHouseStore;
        this.employeeStore = employeeStore;
        this.detailStore = addPurRecNoticeDetailStore;
        this.onSourceOrderSearch = debounce(this.onSourceOrderSearch, 500);
        this.onWareHouseSearch = debounce(this.onWareHouseSearch, 500);
        this.onContactsSearch = debounce(this.onContactsSearch, 500);
    }

    componentWillReact() {
        if (this.store.loading) {
            this.resetFds();
        }
    }
    componentWillUnmount() {
        this.store.resetDetail();
        this.detailStore.resetDetail();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.validateFds((err, data) => {
            if (!err) {
                data = Object.assign({}, this.store.detail, data);
                data.list = this.detailStore.dataSource.slice().map(item => { 
                    item.beginReceiveQty = Number(item.beginReceiveQty);
                    item.endReceiveQty = Number(item.endReceiveQty);
                    item.receiveQty = Number(item.receiveQty);
                    if (item.lineNo == '') {
                        delete item.lineNo;
                    }
                    return item;
                });
                data.planDate = moment(data.planDate).format('YYYY-MM-DD');
                data.orderStatus = Number(data.orderStatus);
                data.orderType = Number(data.orderType);
                data.pushdownStatus = Number(data.pushdownStatus);
                data.purchaseType = Number(data.purchaseType);
                

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
        store.dispatch(TabsAct.TabRemove('addPurRecNotice', 'purRecNoticeList'));
        purRecNoticeStore.fetchTableList();
    }
    getDetailComp = () => <AddPurRecNoticeDetailComp />


    //来源订单下拉
    onSourceOrderSelect = (value, option) => {
        let {
            supplierCode,
            supplierName,
            planDate,
            receiveSiteCode,
            receiveSiteName,
            receiveAddressDetl,
            receivePersonCode,
            receivePerson,
            receivePersonTel,
            purchaseType,
            list
        } = option.props.data;
        this.setFdv({
            supplierCode,
            supplierName,
            planDate: moment(planDate),
            receiveSiteCode,
            receiveSiteName,
            receiveAddressDetl,
            receivePersonCode,
            receivePerson,
            receivePersonTel,
            purchaseType,
            stockCode: "",
        });
        let detailList = [];
        list.forEach(item => {
            let obj = Object.assign({}, item);
            obj.beginReceiveQty = 0;
            obj.endReceiveQty = 0;
            obj.receiveQty = 0;
            obj.sourceOrderLineNo = item.lineNo;
            obj.lineNo = "";
            detailList.push(obj);
        });
        this.store.receiveAddressDetl = receiveAddressDetl;
        this.detailStore.resetDetail(detailList);
        this.wareHouseStore.fetchSelectList('', { siteCode: receiveSiteCode });
        if (receivePerson) {
            this.employeeStore.fetchSelectList({ employeeName: receivePerson, page: 1, pageSize: 10 });
        }
    }

    //来源订单搜索
    onSourceOrderSearch = (value) => {
        this.setFdv({
            supplierCode: "",
            supplierName: "",
            planDate: null,
            receiveSiteCode: "",
            receiveSiteName: "",
            receiveAddressDetl: "",
            receivePersonCode: "",
            receivePerson: "",
            receivePersonTel: "",
            stockCode: "",
            purchaseType: "",
        });
        this.store.receiveAddressDetl = "";
        this.detailStore.resetDetail();
        this.wareHouseStore.selectList = [];
        this.employeeStore.selectList = [];
        this.sourceOrderStore.fetchSelectList(value);
    }
    //收货仓库下拉
    onWareHouseSelect = (value, option) => {
        let {
            addressDetl
        } = option.props.data;
        this.setFdv({
            receiveAddressDetl: addressDetl,
        });
    }

    //收货仓库搜索
    onWareHouseSearch = (value) => {
        if (value == "") {
            this.setFdv({
                receiveAddressDetl: this.store.receiveAddressDetl,
            })
        } else {
            this.setFdv({
                receiveAddressDetl: "",
            });
        };
        let siteCode = this.getFdv("receiveSiteCode");
        if (siteCode) {
            this.wareHouseStore.fetchSelectList(value, { siteCode });
        }
    }

    //收货人下拉
    onContactsSelect = (value, option) => {
        let {
            phone,
            empCode,
        } = option.props.data;
        this.setFdv({
            receivePersonTel: phone,
            receivePersonCode: empCode,
        });
    }

    //收货人搜索
    onContactsSearch = (value) => {
        this.setFdv({
            receivePersonTel: "",
            receivePersonCode: "",
        });
        this.employeeStore.fetchSelectList({ employeeName: value, page: 1, pageSize: 10 });
    }

    render() {
        let formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 13 },
        };
        let formItemLayout2 = {
            labelCol: { span: 2 },
            wrapperCol: { span: 20 },
        };
        const { detail, loading } = this.store;
        return (
            <div className='purRecNotice-wrap'>
                <Spin spinning={loading}>
                    <div className='purRecNotice-head'>
                        <span className="title">
                            {this.title}
                            {this.type == 'edit' ? detail.orderCode : null}
                        </span>
                        <Button type='primary' onClick={this.handleSubmit} style={{
                            backgroundColor: '#4C80CF',
                            borderColor: '#4C80CF',
                        }} >
                            <i className="c2mfont c2m-baocun" style={{ paddingRight: 7, fontSize: '12px' }}></i>
                            保存
                        </Button>
                    </div>
                    <Form>
                        <div className="purRecNotice-base-info">
                            <div className="title">
                                <strong>基本信息</strong>
                            </div>
                            <Row>
                                <Col span={8}>
                                    <FormItem label="来源订单号" {...formItemLayout}>
                                        {this.getFD('sourceOrderCode', {
                                            initialValue: detail.sourceOrderCode,
                                            rules: [
                                                { required: true, message: '来源订单号 必填！' },
                                                this.type == 'add' ?{
                                                    type: "autoselect",
                                                    list: this.sourceOrderStore.selectList.slice(),
                                                    keyName: "orderCode",
                                                    message: "请从下拉列表中选择一项！",
                                                }:{}
                                            ],
                                        })(
                                            <AutoComplete
                                                {...this.sourceOrderStore.Props}
                                                onSelect={this.onSourceOrderSelect}
                                                onSearch={this.onSourceOrderSearch}
                                                disabled={this.type == 'add' ? false : true}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="来源通知单" {...formItemLayout}>
                                        {this.getFD('sourceJobOrderCode', {
                                            initialValue: detail.sourceJobOrderCode,
                                        })(
                                            <Input disabled />
                                            )}
                                    </FormItem>
                                    <FormItem label="供应商编码" {...formItemLayout} style={{ display: 'none' }}>
                                        {this.getFD('supplierCode', {
                                            initialValue: detail.supplierCode,
                                        })(
                                            <Input disabled/>
                                            )}
                                    </FormItem>
                                    <FormItem label="供应商名称" {...formItemLayout}>
                                        {this.getFD('supplierName', {
                                            initialValue: detail.supplierName,
                                        })(
                                            <Input disabled />
                                            )}
                                    </FormItem>
                                    <FormItem label="预计到货日期" {...formItemLayout}>
                                        {this.getFD('planDate', {
                                            initialValue: detail.planDate,
                                            rules: [{ type: 'object', required: true, message: '预计到货日期 必填！' }],
                                        })(
                                            <DatePicker style={{ width: '100%' }}
                                                disabled={detail.orderType == 0 ? false : true}
                                            />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="收货站点" {...formItemLayout}>
                                        {this.getFD('receiveSiteName', {
                                            initialValue: detail.receiveSiteName,
                                        })(
                                            <Input disabled />
                                            )}
                                    </FormItem>
                                    <FormItem label="收货仓库" {...formItemLayout}>
                                        {this.getFD('stockCode', {
                                            initialValue: detail.stockCode,
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    list: this.wareHouseStore.selectList.slice(),
                                                    keyName: "stockCode",
                                                    message: "请从下拉列表中选择一项！",
                                                },
                                            ],
                                        })(
                                            <AutoComplete
                                                {...this.wareHouseStore.Props}
                                                onSelect={this.onWareHouseSelect}
                                                onSearch={this.onWareHouseSearch}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="收货地址" {...formItemLayout}>
                                        {this.getFD('receiveAddressDetl', {
                                            initialValue: detail.receiveAddressDetl,
                                            rules: [{ required: true, message: '收货地址 必填！' }],
                                        })(
                                            <Input
                                                disabled
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="单据类型" {...formItemLayout}>
                                        {this.getFD('orderType', {
                                            initialValue: String(detail.orderType),
                                        })(
                                            <Select disabled>
                                                {enumStore.getOptions('noticeOrderType')}
                                            </Select>
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="收货人编码" {...formItemLayout} style={{ display: 'none' }}>
                                        {this.getFD('receivePersonCode', {
                                            initialValue: detail.receivePersonCode,
                                        })(
                                            <Input disabled/>
                                            )}
                                    </FormItem>
                                    <FormItem label="收货人" {...formItemLayout}>
                                        {this.getFD('receivePerson', {
                                            initialValue: detail.receivePerson,
                                            rules: [{ required: true, message: '收货人 必填！' }],
                                        })(
                                            <AutoComplete
                                                {...this.employeeStore.Props}
                                                onSelect={this.onContactsSelect}
                                                onSearch={this.onContactsSearch}
                                                optionLabelProp="value"
                                                disabled={detail.orderType == 0 ? false : true}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="联系电话" {...formItemLayout}>
                                        {this.getFD('receivePersonTel', {
                                            initialValue: detail.receivePersonTel,
                                            rules: [{
                                                type: "phone",
                                                message: "不是有效的手机号码！",
                                            }]
                                        })(
                                            <Input
                                                disabled={detail.orderType == 0 ? false : true}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="备注" {...formItemLayout}>
                                        {this.getFD('remarks', {
                                            initialValue: detail.remarks,
                                            rules: [{ max: 200, message: '备注长度不能超过200!' }]
                                        })(
                                            <Input type='textarea' style={{ height: '72px' }}
                                                disabled={detail.orderType == 0 ? false : true}
                                            >
                                            </Input>
                                            )}
                                    </FormItem>
                                    <FormItem label="采购类型" {...formItemLayout} style={{ display: 'none' }}>
                                        {this.getFD('purchaseType', {
                                            initialValue: detail.purchaseType,
                                        })(
                                            <Input disabled />
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                    <div className="purRecNotice-detail-info">
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
        addPurRecNoticeStore.setDetail(values)
    }
}
export default Form.create(options)(AddPurRecNoticeComp);
export { AddPurRecNoticeComp }