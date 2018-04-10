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
import { saleDeliveryNoticeStore } from '../stores/SaleDeliveryNoticeStore';
import { addSaleDeliveryNoticeStore, sourceOrderStore, siteStore, wareHouseStore, contactsStore, recSiteStore, addSaleDeliveryNoticeDetailStore } from '../stores/AddSaleDeliveryNoticeStore';
import { enumStore } from '../../../base/stores/EnumStore';
import AddSaleDeliveryNoticeDetailComp from './AddSaleDeliveryNoticeDetailComp';
import { debounce } from '../../../base/consts/Utils';

@observer
class AddSaleDeliveryNoticeComp extends FormComp {
    constructor(props, context) {
        super(props, context);
        this.title = '新建发货通知单';
        this.type = 'add';
        this.store = addSaleDeliveryNoticeStore;
        this.sourceOrderStore = sourceOrderStore;
        this.siteStore = siteStore;
        this.wareHouseStore = wareHouseStore;
        this.contactsStore = contactsStore;
        // this.recSiteStore = recSiteStore;
        this.detailStore = addSaleDeliveryNoticeDetailStore;

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
                    item.beginShipQty = Number(item.beginShipQty);
                    item.endShipQty = Number(item.endShipQty);
                    item.shipQty = Number(item.shipQty);
                    if (item.lineNo == '') {
                        delete item.lineNo;
                    }
                    return item;
                });

                data.shipDate = moment(data.shipDate).format('YYYY-MM-DD');
                data.planDate = moment(data.planDate).format('YYYY-MM-DD');

                data.orderStatus = Number(data.orderStatus);
                data.orderType = Number(data.orderType);
                data.pushdownStatus = Number(data.pushdownStatus);
                

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
        store.dispatch(TabsAct.TabRemoveAdd('addSaleDeliveryNotice', 'saleDeliveryNoticeList'));
        saleDeliveryNoticeStore.fetchTableList();
    }
    getDetailComp = () => <AddSaleDeliveryNoticeDetailComp />


    //来源订单下拉
    onSourceOrderSelect = (value, option) => {
        let {
            customerCode,
            customerName,
            planDate,
            receiveSiteCode,
            receiveSiteName,
            receiveAddressDetl,
            receivePerson,
            receivePersonTel,
            shipSiteCode,
            shipSiteName,
            shipAddressDetl,
            list
        } = option.props.data;
        this.setFdv({
            customerCode,
            customerName,
            planDate: moment(planDate),
            receiveSiteCode,
            receiveSiteName,
            receiveAddressDetl,
            receivePerson,
            receivePersonTel,
            shipSiteCode,
            shipSiteName,
            shipAddressDetl,
            stockCode: "",
        });
        let detailList = [];
        list.forEach(item => {
            let obj = Object.assign({}, item);
            obj.beginShipQty = 0;
            obj.endShipQty = 0;
            obj.shipQty = 0;
            obj.sourceOrderLineNo = item.lineNo;
            obj.lineNo = "";
            detailList.push(obj);
        });
        this.store.shipAddressDetl = shipAddressDetl;
        this.detailStore.resetDetail(detailList);
        this.siteStore.fetchSelectList(shipSiteCode);
        this.wareHouseStore.fetchSelectList('', { siteCode: shipSiteCode });
        this.contactsStore.fetchSelectList(receivePerson, { bpCode: customerCode });
        // this.recSiteStore.fetchSelectList(receiveSiteCode,{bpCode:customerCode});
    }

    //来源订单搜索
    onSourceOrderSearch = (value) => {
        this.setFdv({
            customerCode:"",
            customerName: "",
            planDate: null,
            receiveSiteCode: "",
            receiveSiteName: "",
            receiveAddressDetl: "",
            receivePerson: "",
            receivePersonTel: "",
            shipSiteCode: "",
            shipSiteName: "",
            stockCode: "",
            shipAddressDetl: "",
        });
        this.store.shipAddressDetl = "";
        this.detailStore.resetDetail();
        this.siteStore.selectList = [];
        this.wareHouseStore.selectList = [];
        this.contactsStore.selectList = [];
        // this.recSiteStore.selectList = [];
        this.sourceOrderStore.fetchSelectList(value);
    }

    //发货站点下拉
    onSiteSelect = (value, option) => {
        let {
            addressDetl
        } = option.props.data;
        this.setFdv({
            stockCode: "",
            shipAddressDetl: addressDetl,
        });
        this.wareHouseStore.fetchSelectList('', { siteCode: value });
    }

    //发货站点搜索
    onSiteSearch = (value) => {
        this.setFdv({
            stockCode: "",
            shipAddressDetl: "",
        });
        this.wareHouseStore.selectList = [];
        this.siteStore.fetchSelectList(value);
    }
    //发货仓库下拉
    onWareHouseSelect = (value, option) => {
        let {
            addressDetl
        } = option.props.data;
        this.setFdv({
            shipAddressDetl: addressDetl,
        });
    }

    //发货仓库搜索
    onWareHouseSearch = (value) => {
        if (value == "") {
            this.setFdv({
                shipAddressDetl: this.store.shipAddressDetl,
            })
        } else {
            this.setFdv({
                shipAddressDetl: "",
            });
        };
        this.validateFds(['shipSiteCode'],(err, data) => { 
            if (!err) {
                let siteCode = this.getFdv("shipSiteCode");
                this.wareHouseStore.fetchSelectList(value, { siteCode });
            }
        })
    }

    //收货人下拉
    onContactsSelect = (value, option) => {
        let {
            phone
        } = option.props.data;
        this.setFdv({
            receivePersonTel: phone,
        });
    }

    //收货人搜索
    onContactsSearch = (value) => {
        this.setFdv({
            receivePersonTel: "",
        });
        let customerCode = this.getFdv("customerCode");
        if (customerCode){
            this.contactsStore.fetchSelectList(value, { bpCode: customerCode });
        }
    }

    //收货站点下拉
    // onRecSiteSelect = (value, option) => {
    //     let {
    //         addressDetl
    //     } = option.props.data;
    //     this.setFdv({
    //         receiveAddressDetl: addressDetl,
    //     });
    // }

    //收货站点搜索
    // onRecSiteSearch = (value) => {
    //     this.setFdv({
    //         receiveAddressDetl: "",
    //     });
    //     let customerCode = this.getFdv("customerCode");
    //     if (customerCode) {
    //         this.recSiteStore.fetchSelectList(value, { bpCode: customerCode });
    //     }
    // }
    render() {
        let formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 13 },
        };
        const { detail, loading } = this.store;
        return (
            <div className='saleNotice-wrap'>
                <Spin spinning={loading}>
                    <div className='saleNotice-head'>
                        <span className="title">{this.title}</span>
                        <Button type='primary' onClick={this.handleSubmit} style={{
                            backgroundColor: '#4C80CF',
                            borderColor: '#4C80CF',
                        }} >
                            <i className="c2mfont c2m-baocun" style={{ paddingRight: 7, fontSize: '12px' }}></i>
                            保存
                        </Button>
                    </div>
                    <Form>
                        <div className="saleNotice-base-info">
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
                                    <FormItem label="发货日期" {...formItemLayout}>
                                        {this.getFD('shipDate', {
                                            initialValue: detail.shipDate,
                                        })(
                                            <DatePicker
                                                style={{ width: '100%' }}
                                                disabledDate={(date) => disabledBeforeDate(date)}
                                            />
                                            )}
                                    </FormItem>
                                    {/* <FormItem label="发货站点" {...formItemLayout} style={{ display: 'none' }}>
                                        {this.getFD('shipSiteCode', {
                                            initialValue: detail.shipSiteCode,
                                        })(
                                            <Input disabled />
                                            )}
                                    </FormItem> */}
                                    {/* <FormItem label="发货站点" {...formItemLayout}>
                                        {this.getFD('shipSiteName', {
                                            initialValue: detail.shipSiteName,
                                            rules: [
                                                { required: true, message: '发货站点 必填！' },
                                            ]
                                        })(
                                            <Input disabled />
                                            )}
                                    </FormItem>  */}
                                    <FormItem label="发货站点" {...formItemLayout}>
                                        {this.getFD('shipSiteCode', {
                                            initialValue: detail.shipSiteCode,
                                            rules: [
                                                { required: true, message: '发货站点 必填！' },
                                                {
                                                    type: "autoselect",
                                                    list: this.siteStore.selectList.slice(),
                                                    keyName: "siteCode",
                                                    message: "请从下拉列表中选择一项！",
                                                },
                                            ],
                                        })(
                                        <AutoComplete
                                            {...this.siteStore.Props}
                                            onSelect={this.onSiteSelect}
                                            onSearch={this.onSiteSearch}
                                            disabled={this.getFdv("orderType") == 1 ? false : true}
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem label="发货仓库" {...formItemLayout}>
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
                                    <FormItem label="发货地址" {...formItemLayout}>
                                        {this.getFD('shipAddressDetl', {
                                            initialValue: detail.shipAddressDetl,
                                            rules: [
                                                { required: true, message:'发货地址 必填！'}
                                            ],
                                        })(
                                            <Input disabled/>
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="客户编码" {...formItemLayout} style={{display:'none'}}>
                                        {this.getFD('customerCode', {
                                            initialValue: detail.customerCode,
                                        })(
                                            <Input disabled/>
                                            )}
                                    </FormItem>
                                    <FormItem label="客户名称" {...formItemLayout}>
                                        {this.getFD('customerName', {
                                            initialValue: detail.customerName,
                                        })(
                                            <Input disabled/>
                                            )}
                                    </FormItem>
                                    <FormItem label="计划收货日期" {...formItemLayout}>
                                        {this.getFD('planDate', {
                                            initialValue: detail.planDate,
                                            rules: [{ type: 'object', required: true, message: '计划收货日期 必填！' }],
                                        })(
                                            <DatePicker style={{ width: '100%' }} disabled/>
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
                                    {/* <FormItem label="收货站点" {...formItemLayout}>
                                        {this.getFD('receiveSiteCode', {
                                            initialValue: detail.receiveSiteCode,
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    list: this.recSiteStore.selectList.slice(),
                                                    keyName: "addressCode",
                                                    message: "请从下拉列表中选择一项！",
                                                },
                                            ],
                                        })(
                                            <AutoComplete
                                                {...this.recSiteStore.Props}
                                                onSelect={this.onRecSiteSelect}
                                                onSearch={this.onRecSiteSearch}
                                                disabled={this.getFdv("orderType")==0?false:true}
                                            />
                                            )}
                                    </FormItem> */}
                                    <FormItem label="收货地址" {...formItemLayout}>
                                        {this.getFD('receiveAddressDetl', {
                                            initialValue: detail.receiveAddressDetl,
                                            rules: [{ required: true, message: '收货地址 必填！' }],
                                        })(
                                            <Input disabled />
                                            )}
                                    </FormItem>
                                    <FormItem label="单据类型" {...formItemLayout}>
                                        {this.getFD('orderType', {
                                            initialValue: String(detail.orderType),
                                            onChange: () => { this.setFdv({ sourceJobOrderCode: this.getFdv("sourceJobOrderCode")})}
                                            // rules: [{ required: true, message: '来源单据类型 必填！' }],
                                        })(
                                            <Select disabled>
                                            {enumStore.getOptions('noticeOrderType')}
                                            </Select>
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="来源通知单" {...formItemLayout}>
                                        {this.getFD('sourceJobOrderCode', {
                                            initialValue: detail.sourceJobOrderCode,
                                            rules: this.store.detail.orderType == 1 ?[{
                                                required: true,
                                                message: '选择线上通知单时，来源通知单不能为空！',
                                            }]:[]
                                        })(
                                            <Input disabled />
                                            )}
                                    </FormItem>
                                    <FormItem label="收货人" {...formItemLayout}>
                                        {this.getFD('receivePerson', {
                                            initialValue: detail.receivePerson,
                                            rules: [{ required: true, message: '收货人 必填！' }],
                                        })(
                                            <AutoComplete
                                                {...this.contactsStore.Props}
                                                onSelect={this.onContactsSelect}
                                                onSearch={this.onContactsSearch}
                                                optionLabelProp="value"
                                                disabled={this.getFdv("orderType") == 0 ? false : true}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="收货人电话" {...formItemLayout}>
                                        {this.getFD('receivePersonTel', {
                                            initialValue: detail.receivePersonTel,
                                            rules: [{
                                                type: "phone",
                                                message: "不是有效的手机号码！",
                                            }]
                                        })(
                                            <Input
                                                disabled={this.getFdv("orderType") == 0 ? false : true}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="备注" {...formItemLayout}>
                                        {this.getFD('remarks', {
                                            initialValue: detail.remarks,
                                            rules: [{ max: 200, message: '备注长度不能超过200!' }]
                                        })(
                                            <Input type='textarea' style={{ height: '73px' }} >
                                            </Input>
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                    <div className="saleNotice-detail-info">
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
        addSaleDeliveryNoticeStore.setDetail(values)
    }
}
export default Form.create(options)(AddSaleDeliveryNoticeComp);
export { AddSaleDeliveryNoticeComp }