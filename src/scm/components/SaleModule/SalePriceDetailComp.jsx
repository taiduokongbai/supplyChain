import React, { Component } from "react";
import { Form, Row, Modal, Col, Spin, Table, Input, Icon, Button, Tabs, message, Popconfirm, Checkbox, Radio, Dropdown, Menu, } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import { formatNullStr } from '../../../base/consts/Utils';
import TooltipComp from "../../../base/components/TooltipComp";
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const colors = {
    0: '#4C80CF',
    1: '#F6A623',
    2: '#417505',
    3: '#D0011B',
    4: '#D0011B',
    6: '#D0011B',
}

class SalePriceDetailComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false,
            recallDisable: true,
            submitText: "",
            recallVisible: false,
            recallText: "",
            copyVisible: false,
            copyText: "",
            checkVisible: false,
            checkText: "",
            tip: '展开',
            show: true,
        }
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNumber',
                key: 'lineNumber',
            },
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
            },
            {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
            },{
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
            }, {
                title: '型号',
                dataIndex: 'model',
                key: 'model',
            }, {
                title: '数量',
                dataIndex: 'materialQty',
                key: 'materialQty',
                render:(text,record,index)=>{
                    return Number(text).toFixed(2)
                }
            }, {
                title: '单位',
                dataIndex: 'unitName',
                key: 'unitName',
            },  {
                title: '税率(%)',
                dataIndex: 'taxRate',
                key: 'taxRate',
                render:(text,record,index)=>{
                    return Number(text).toFixed(2)
                }
            },{
                title: '批量价格',
                dataIndex: 'batchPrice',
                key: 'batchPrice',
                render:(text,record,index)=>{
                    return Number(text).toFixed(2)
                }
        
            }, {
                title: '批量价格含税',
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                render:(text,record,index)=>{
                    return Number(text).toFixed(2)
                }
            }, {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                render: (text, index, record) => {
                    return <TooltipComp attr={{text: text, wid: 70, placement: 'left'}}/>
                }
            }];
    };
    toggle = () => {
        this.setState({
            tip: this.state.show ? '收起' : '展开',
            show: this.state.show ? false : true
        })
    };
    showModal = () => {
        this.setState({
            visible: !this.state.visible,
        });
    }
    hidden_visible = (value) => {
        this.props.hidden_visible(!value);
    }
    handleOk = () => {
        this.setState({ visible: false });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    handleSubmit = () => {
        let { materialBaseSource } = this.props;
        this.props.checkOrderStatus().then(json => {
            if (json.status === 2000) {
                this.props.SalePriceSubmit({ orderCode: materialBaseSource.orderCode, orderStatus: materialBaseSource.orderStatus }).then(json => {
                    if (json.status == 2000) {
                        message.success("数据提交成功!");
                        this.props.TabsRemove();
                        this.props.SalePriceList({ page: 1, pageSize: 10 });
                    } else if (json.status = 6011) {
                        this.setState({
                            visible: true,
                            submitText: "当前销售价格清单有待审核的销售价格清单，不能再次提交！"
                        });
                    } else {
                        message.error(json.message[0].msg);
                    }
                })
            } else if (json.status == 6600) {
                this.setState({
                    checkVisible: true,
                    checkText: "当前销售价格清单存在已生效的价格清单，当前价格清单提交审批后会替代原价格清单！"
                });
            } else {
                message.error(json.message[0].msg);
            }
        })

    }
    checkOk = (e) => {
        let { materialBaseSource } = this.props;
        this.setState({
            checkVisible: false,
        });
        this.props.SalePriceSubmit({ orderCode: materialBaseSource.orderCode, orderStatus: materialBaseSource.orderStatus }).then(json => {
            if (json.status == 2000) {
                message.success("数据提交成功!");
                this.props.TabsRemove();
                this.props.SalePriceList({ page: 1, pageSize: 10 });
            } else if (json.status = 6011) {
                this.setState({
                    visible: true,
                    submitText: "当前供应商有待审核的采购价格清单，不能再次提交！"
                });
            } else {
                message.error(json.message[0].msg);
            }
        })
    }
    editMaterial = (orderCode) => {
        this.props.EditModul();
        this.props.getEditData(orderCode);
    }
    SalePriceRepeal = (orderCode, orderStatus) => {
        this.props.SalePriceRepeal(orderCode, orderStatus)
            .then(json => {
                if (json.status == 2000) {
                    this.props.getEditData(orderCode);
                }
            })
    }
    getE = (key, val) => {
        if (val !== 'undefined' && val !== undefined && val !== null && val !== "") {
            return window.ENUM.getEnum(key, val)
        }
    };
    submitCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    recallOk = (e) => {
        let { materialBaseSource } = this.props;
        this.setState({
            recallVisible: false,
        });
        this.props.SalePriceRepeal({ orderCode: materialBaseSource.orderCode, orderStatus: materialBaseSource.orderStatus }).then(json => {
            if (json.status === 2000) {
                this.props.TabsRemove();
                this.props.SalePriceList({ page: 1, pageSize: 10 });
            }
        })

    }
    recallCancel = (e) => {
        this.setState({
            recallVisible: false,
        });
    }
    handleRecall = () => {
        this.setState({
            recallVisible: true,
            recallText: "是否要撤回此单据？"
        });
    }
    handleCopy = () => {
        let { OpenSalePriceAdd, SalePriceCopy, tabs } = this.props;
        tabs = tabs.map(item => item.key);
        if (tabs.includes('SalePriceAdd')) {
            this.setState({
                copyVisible: true,
                copyText: "新建页面已打开并且数据未保存，若要继续复制此单据，此单据内容将会覆盖原有数据？"
            });
        } else {
            OpenSalePriceAdd();
            let newData = JSON.parse(JSON.stringify(this.props.materialBaseSource))
            newData.isTaxValue = [];
            newData.orderStatus = 0;
            newData.list.map(item => {
                item.lineNumber = '';
                return item
            })
            this.props.SalePriceCopy(newData);
        }
    }
    copyOk = (e) => {
        this.setState({
            copyVisible: false,
        });
        this.props.OpenSalePriceAdd();
        let newData = JSON.parse(JSON.stringify(this.props.materialBaseSource))
        newData.isTaxValue = [];
        newData.orderStatus = 0;
        newData.list.map(item => {
            item.lineNumber = '';
            return item
        })
        this.props.SalePriceCopy(newData);
    }
    copyCancel = (e) => {
        this.setState({
            copyVisible: false,
        });
    }
    handleChange = (value) => {
        switch (value) {
            case 'submit':
                this.handleSubmit()
                break;
            case 'recall':
                this.handleRecall()
                break;
            case 'copy':
                this.handleCopy()
                break;
            default:
        }
    };
    onClick = (obj) => {
        this.handleChange(obj.key);
    }
    render() {
        const { hiddenVisible, supplierBaseLoading, materialBaseSource, ...props } = this.props;
        let columns = this.columns;
        let rightStyle = {
            textAlign: 'right',
        };
        let companyDetails = {
            width: '93%',
        };
        let status = materialBaseSource.orderStatus;
        let menu = (
            <Menu onClick={this.onClick}>
                {materialBaseSource.orderStatus == 0 || materialBaseSource.orderStatus == 4 || materialBaseSource.orderStatus == 6 ? <Menu.Item key="submit" disabled={false}>提交</Menu.Item> : <Menu.Item key="submit" disabled={true}>提交</Menu.Item>}
                {materialBaseSource.orderStatus == 1 ? <Menu.Item key="recall" disabled={false}>撤回</Menu.Item> : <Menu.Item key="recall" disabled={true}>撤回</Menu.Item>}
                {materialBaseSource.orderStatus == 2 ? <Menu.Item key="copy" disabled={false}>复制</Menu.Item> : <Menu.Item key="copy" disabled={true}>复制</Menu.Item>}
                {/* <Menu.Item key="print">打印</Menu.Item> */}
            </Menu>
        );
        return (

            <div className="saleprice-BaseInfo">
                <Spin spinning={supplierBaseLoading}>
                    <div className="saleprice-Title">
                        <div className="saleprice-BigTitle">
                            <span className='basetitle'>价格编码：{formatNullStr(materialBaseSource.orderCode)} &nbsp;&nbsp;&nbsp;&nbsp;价格名称:{formatNullStr(materialBaseSource.priceName)}</span>
                            <div className="saleprice-SmallTitle">
                                单据状态：
                                <a style={{ color: colors[status] }}>{this.getE("orderStatusType", status + '')}</a>
                            </div>
                        </div>
                        <div className="viewbtn">
                            {
                                materialBaseSource.orderStatus == '0' || materialBaseSource.orderStatus == '4' || materialBaseSource.orderStatus == '6' ?
                                    <Button   className="default-btn"  onClick={() => this.editMaterial(materialBaseSource.orderCode)}><i className="c2mfont c2m-bianji1" style={{fontSize:`12px`}}>编辑</i></Button> : null
                            }

                            <Dropdown overlay={menu}><Button type="ghost" className="select-btn">更多操作<Icon type="down" /></Button></Dropdown>
                            {this.state.recallVisible ? <Modal
                                title="撤回"
                                visible={this.state.recallVisible}
                                onOk={this.recallOk}
                                onCancel={this.recallCancel}
                            >
                                {this.state.recallText}
                            </Modal> : null}
                            {this.state.copyVisible ? <Modal
                                title="复制"
                                visible={this.state.copyVisible}
                                onOk={this.copyOk}
                                onCancel={this.copyCancel}
                            >
                                {this.state.copyText}
                            </Modal> : null}
                            {this.state.checkVisible ? <Modal
                                title="提交"
                                visible={this.state.checkVisible}
                                onOk={this.checkOk}
                                onCancel={this.checkCancel}
                            >
                                {this.state.checkText}
                            </Modal> : null}
                        </div>
                    </div>
                    <a className="show-or-hide" href="#" onClick={this.toggle}>{this.state.tip}</a>
                    <div className="saleprice-conventionalBase" style={{ display: this.state.show ? `none` : `block` }}>
                    <div className="left-content">
                        <Row>
                            <Col span={1} className="conventional-right"><h3>&nbsp;价格条件</h3></Col>
                        </Row>
                        <Row>
                            <Col span={4} className="conventional-right">价格名称：</Col>
                            <Col span={4}>{formatNullStr(materialBaseSource.priceName)}</Col>
                            <Col span={4} className="conventional-right">价格生效日期：</Col>
                            <Col span={4}>{formatNullStr(materialBaseSource.startTime)}</Col>
                        </Row>
                        <Row>
                            <Col span={4} className="conventional-right">币种：</Col>
                            <Col span={4}>{formatNullStr(materialBaseSource.currency)}</Col>
                            <Col span={4} className="conventional-right">价格失效日期：</Col>
                            <Col span={4}>{formatNullStr(materialBaseSource.endTime)}</Col>
                        </Row>
                        <Row>
                            <Col span={4} className="conventional-right">含税：</Col>
                            <Col span={4}>{formatNullStr(this.getE("isTax", materialBaseSource.isTax + ''))}</Col>
                        </Row>
                    </div>
                    <div className="right-content">
                        <Row>
                            <Col span={1} className="conventional-right remark"><h3>&nbsp;备注</h3></Col>
                        </Row>
                        <Row  className="remark-content">
                            <Col span={4} className="conventional-right">备注：</Col>
                            <Col span={4} className="remark-content">{formatNullStr(materialBaseSource.remark)}</Col>
                        </Row>
                    </div>
                    </div>
                     <h3 className="detail-title">明细项</h3>
                    <div>
                        <MTable
                            cols={columns}
                            dataSource={materialBaseSource.list}
                            rowKey={"id"}
                        />
                    </div>
                </Spin>
            </div>

        )
    }
}
export default SalePriceDetailComp;