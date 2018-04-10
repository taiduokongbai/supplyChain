import React, { Component, PropTypes } from "react";
import { Form, Input, Spin, Button, Modal, Row, Col, Select, Popconfirm } from '../../../base/components/AntdComp';
import FormModalComp from '../../../base/components/FormModalComp';
import { formatNullStr } from "../../../base/consts/Utils";
const FormItem = Form.Item;

class SalesReturnStoreEidtTopComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false,
            sendLoading: false,
            text: "收起",
            putAway: "展开更多隐藏信息",
            infoClassName: "purchase-eidt-info-show",
            putAwayClassName: "purchase-eidt-sourceInfo purchase-eidt-sourceInfo-hide",
            count: 1,
            index: 0,
        }
    }
    generalInfo = () => {
        let { state } = this.props;
        return (
            <div>
                <div>
                    <p className='info-p'>
                        <span className='info-p-label'>源单据号：</span>
                        <span className='info-p-data'>{formatNullStr(state.formInfo.sourceOrderCode)}</span>
                    </p>
                    <p className='info-p'>
                        <span className='info-p-label'>源单据类型：</span>
                        <span className='info-p-data'>{state.formInfo.sourceOrderType ? window.ENUM.getEnum("sourceOrderType", state.formInfo.sourceOrderType) : "--"}</span>
                    </p>
                </div>
            </div>
        )
    }
    sourceListInfo = () => {
        let { state } = this.props;
        return (
            <div>
                <p className='info-p'>
                    <span className='info-p-label'>客户：</span>
                    <span className='info-p-data'>{formatNullStr(state.formInfo.bpName)}</span>
                </p>
                <p className='info-p'>
                    <span className='info-p-label'>联系人：</span>
                    <span className='info-p-data'>{formatNullStr(state.formInfo.linkman)}</span>
                </p>
            </div>
        )
    }
    othersInfo = () => {
        let { state } = this.props;
        return (
            <div>
                <p className='info-p'>
                    <span className='info-p-label'>电话：</span>
                    <span className='info-p-data'>{formatNullStr(state.formInfo.linkmanTel)}</span>
                </p>
                <div className="purchase-eidt-putaway-info" onClick={this.putAwayHandle} style={{marginTop: 45}}>
                    <a style={{ width: '100%' }}>{this.state.putAway}</a>
                </div>
            </div>
        )
    }
    putAwayHandle = () => {
        this.setState({
            index: this.state.index + 1,
        })
        if (this.state.index % 2 == 0) {
            this.setState({
                putAway: "收起更多隐藏信息",
                putAwayClassName: "purchase-eidt-sourceInfo purchase-eidt-sourceInfo-show"
            })
        } else {
            this.setState({
                putAway: "展开更多隐藏信息",
                putAwayClassName: "purchase-eidt-sourceInfo purchase-eidt-sourceInfo-hide"
            })
        }
    }
    receiptHandle = () => {
        // 判断预收货信息   是否可以收货
        this.props.actions.preReceiptInfoStatus() ?
            this.props.form.validateFields((err, values) => { // 可以收货
                this.setState({ visible: false })
                if (!err) {
                    this.props.actions.receiptHandle({ remarks: values.remarks })
                }
            }) : this.setState({ visible: true })
    }
    confirmHandler = () => {
        this.setState({ visible: false })
    }
    cancelHandler = () => {
        this.setState({ visible: false })
    }
    statusHandler = (status) => {
        switch (status) {
            case 1:
            case 3: 
                return <a style={{ color: '#4C80CF' }}>{window.ENUM.getEnum("orderStatus", status)}</a>
            case 2:
            case 4: 
                return <a style={{ color: '#F6A623' }}>{window.ENUM.getEnum("orderStatus", status)}</a>
            case 5:
                return <a style={{ color: '#417505' }}>{window.ENUM.getEnum("orderStatus", status)}</a>
            case 6:
                return <a style={{ color: '#D0011B' }}>{window.ENUM.getEnum("orderStatus", status)}</a>
            default:
                return '--'
        }
    }
    infoHandle = () => {
        this.setState({
            count: this.state.count + 1,
        })
        if (this.state.count % 2 == 0) {
            let putAway = this.state.putAway;
            this.setState({
                text: "收起",
                infoClassName: "purchase-eidt-info-show",
            })
            if (putAway == "收起更多隐藏信息") {
                this.setState({
                    index: this.state.index + 1,
                    putAway: "展开更多隐藏信息",
                    putAwayClassName: "purchase-eidt-sourceInfo purchase-eidt-sourceInfo-hide"
                })
            }
        } else {
            this.setState({
                text: "展开",
                infoClassName: "purchase-eidt-info-hide",
            })
        }
    }
    render() {
        let { getFieldDecorator } = this.props.form;
        let { state } = this.props;
        const layoutForm = {
            labelCol: { span: 6 },
        };
        return (
            <div className='purchase-eidt'>
                <Form>
                    <div className='purchase-eidt-title'>
                        <div className='title-box'>
                            <p className='title-allInfo'>信息总览：{formatNullStr(state.formInfo.orderCode)}</p>
                            <p className='title-detailInfo'>
                                <span>状态：
                                    {
                                        this.statusHandler(state.formInfo.status)
                                    }
                                </span>
                                <span>收货站点：{formatNullStr(state.formInfo.deliverySiteName)}</span>
                                <span>收货仓库：{formatNullStr(state.formInfo.stockName)}</span>
                            </p>
                        </div>
                        <Button type='default' onClick={() => this.receiptHandle()} loading={state.receiveBtnLoading}>
                            <Popconfirm
                                placement="topRight"
                                title="没有预收货记录待收货"
                                okText="确定"
                                cancelText="取消"
                                visible={this.state.visible}
                                onConfirm={() => this.confirmHandler()}
                                onCancel={() => this.cancelHandler()}
                            >
                                <span><i className='c2mfont c2m-fahuo'></i>收货</span>
                            </Popconfirm>
                        </Button>
                    </div>
                    <div className="sale-carryout-doc-no" onClick={this.infoHandle}>{this.state.text}</div>
                    <div className={this.state.infoClassName}>
                        <Row className='purchase-eidt-info'>
                            <Col span={8}>
                                <div className='purchase-eidt-info-item'>
                                    <h3>基本信息</h3>
                                    {
                                        this.generalInfo()
                                    }
                                </div>
                            </Col>
                            <Col span={8} style={{borderRight: 0}}>
                                <div className='purchase-eidt-info-item'>
                                    <h3>源单信息</h3>
                                    {
                                        this.sourceListInfo()
                                    }
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className='purchase-eidt-info-item'>
                                    <h3 style={{height: 21}}></h3>
                                    {
                                        this.othersInfo()
                                    }
                                </div>
                            </Col>
                        </Row>
                        <div className={this.state.putAwayClassName}>
                            <p className='info-p'>
                                <span className='info-p-label'>源单据备注：</span>
                                <span className='info-p-data'>{formatNullStr(state.formInfo.sourceRemark)}</span>
                            </p>
                            <FormItem
                                {...layoutForm}
                                label="备注"
                            >
                                {getFieldDecorator('remarks', {
                                    initialValue: state.formInfo.remarks || '',
                                    rules: [{ max: 200, message: '备注不能超过200字符！' }]
                                })(
                                    <Input className='ant-input-textarea-second' type="textarea" />
                                    )}
                            </FormItem>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }

}


export default Form.create()(SalesReturnStoreEidtTopComp);
