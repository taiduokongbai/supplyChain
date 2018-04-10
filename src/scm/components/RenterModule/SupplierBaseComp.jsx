import React, { Component } from "react";
import { Row, Modal, Col, Spin, Table, Input, Icon, Button, Tabs, Popconfirm, Checkbox, Radio } from '../../../base/components/AntdComp';
import ModalComp from '../../../base/components/ModalComp';
import { formatNullStr } from '../../../base/consts/Utils';
import TooltipComp from '../../../base/components/TooltipComp';
const CheckboxGroup = Checkbox.Group;
const { TabPane } = Tabs;

class DetailModal extends ModalComp {

    getComp = () => {
        let { company } = this.props;
        return <div style={{ width: '93%' }}>
            <Row>
                <Col span={7} style={{ textAlign: 'right' }} className="conventional-right">公司全称：</Col>
                <Col span={5}>{company.companyName}</Col>
                <Col span={4} offset={3} className="conventional-right">经营类型：</Col>
                <Col span={5}>{company.businessTypeName}</Col>
            </Row>
            <Row>
                <Col span={7} style={{ textAlign: 'right' }} className="conventional-right">公司简称：</Col>
                <Col span={5}>{company.companyAbbr}</Col>
                <Col span={4} offset={3} className="conventional-right">公司性质：</Col>
                <Col span={5}>{company.companyTypeName}</Col>
            </Row>
            <Row>
                <Col span={7} style={{ textAlign: 'right' }} className="conventional-right">法人代表：</Col>
                <Col span={5}>{company.corporation}</Col>
                <Col span={4} offset={3} className="conventional-right">公司规模：</Col>
                <Col span={5}>{company.companyScaleName}</Col>
            </Row>
            <Row>
                <Col span={7} style={{ textAlign: 'right' }} className="conventional-right">行业：</Col>
                <Col span={5}>{company.tradeTypeName}</Col>
                <Col span={4} offset={3} className="conventional-right">公司邮箱：</Col>
                <Col span={5}>{company.email}</Col>
            </Row>
            <Row>
                <Col span={7} style={{ textAlign: 'right' }} className="conventional-right">创立日期：</Col>
                <Col span={5}>{company.creationDate}</Col>
                <Col span={4} offset={3} className="conventional-right">公司电话：</Col>
                <Col span={5}>{company.tel}</Col>
            </Row>
            <Row>
                <Col span={7} style={{ textAlign: 'right' }} className="conventional-right">公司网址：</Col>
                <Col span={5}>{company.website}</Col>
                <Col span={4} offset={3} className="conventional-right">公司传真：</Col>
                <Col span={5}>{company.fax}</Col>
            </Row>
            <Row>
                <Col span={7} style={{ textAlign: 'right' }} className="conventional-right">统一社会信用代码：</Col>
                <Col span={5}>{company.companyUscc}</Col>
            </Row>
        </div>
    }
}
const statusColor = ['#4C80CF', '#417505', '#D0011B']
class SupplierBaseComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.statusParam = {
            'supplierCode': '',
            'langCode': '',
            'status': '',
            show: false,
            bigShow:true,
        }
    }
    state = { visible: false, }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    hidden_visible = (value) => {
        this.props.hidden_visible(!value);
    }

    changeStatus = (id, status,uscc,supplierCode) => {
        if (status == 2 || status == 0) {
            status = 1
        } else {
            status = 2
        }
        this.statusParam = {
            id: id,
            status: status
        }
        this.props.supplierStatus(this.statusParam)
            .then(json => {
                if (json.status == 2000) {
                    this.props.SupplierBaseLoading(true);
                    this.props.getEditData(id,'detail',uscc,supplierCode);
                }
            })
    }

    editSupplier = (id,uscc,supplierCode) => {
        this.props.EditModul();
        this.props.getEditData(id, 'edit',uscc,supplierCode, "supplierViewCont").then(data => {
            //结算方式 C014，付款条件 C013，行业 C015，经营类型 C019，公司性质 C018，公司规模 C016, 发票类型 C021
            let param = [
            { "subCode": "C013", "catCode": data.paymentCode },
            { "subCode": "C015", "catCode": data.scmBp.tradeTypeCode },
            { "subCode": "C019", "catCode": data.scmBp.businessTypeCode },
            { "subCode": "C018", "catCode": data.scmBp.companyTypeCode },
            { "subCode": "C016", "catCode": data.scmBp.companyScaleCode },
            { "subCode": "C021", "catCode": data.invoiceTypeCode }
            ]
            param.map((item) => {
                this.props.getSubjectList({ ...item, "status": 1, "page": 1, "pageSize": 10 });
            });
            this.props.settleList({settleCode:data.settlementCode,status:1,page:1,pageSize:10})
            this.props.getDept({ "orgCode": data.deptCode, "orgType": 2, "status": 1, "page": 1, "pageSize": 10 });
            if (data.deptCode) {
                this.props.getEmployeesList({ "deptCode": data.deptCode, "employeeCode": data.empCode, "page": 1, "pageSize": 10 });
            }
            this.props.getBusinessPartnerData({
                "bpCode": data.receiveOrgCode,
                "page": "1",
                "pageSize": "10"
            });
            this.props.getCurrencyList({
                "curCode": data.currencyCode,
                "page": "1",
                "pageSize": "10"
            })
        });
    }

    isNullObject = (obj) => {
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                return true;  //有自有属性或方法，返回false
            }
        }
        return false;  //没有自有属性或方法，返回true，该对象是空对象
    }

    render() {
        const { hiddenVisible, supplierBaseSource, supplierBaseLoading, ...props } = this.props;
        let scmBp = supplierBaseSource.scmBp || {};
        let supplierStauts = this.isNullObject(supplierBaseSource) ? window.ENUM.getEnum("supplierStauts", supplierBaseSource.status + '') : '';
        return (
            <div className="Supplier-BaseInfo">
                <Spin spinning={supplierBaseLoading}>
                    <div className="Supplier-Title">
                        <div style={{ width: '70%', float: 'left' }}>
                            <div className="Supplier-BigTitle">
                                <span>供应商：{supplierBaseSource.supplierCode} | {supplierBaseSource.bpFull}
                                    {/*{supplierBaseSource.company?
                                    <a onClick={this.showModal}>{supplierBaseSource.supplierFull}</a> : <span>{supplierBaseSource.supplierFull}</span>}
                                    <DetailModal
                                        visible={this.state.visible}
                                        title="公司详情"
                                        handleCancel={() => this.setState({ visible: false })}
                                        handleSubmit={() => this.setState({ visible: false })}
                                        company={supplierBaseSource.company || ""}
                                    >
                                        
                                    </DetailModal>*/}
                                </span>
                            </div>
                            <div className="Supplier-SmallTitle">
                                状态：<span style={{ color: `${statusColor[Number(supplierStauts)]}` }}>{supplierStauts} &nbsp;&nbsp;&nbsp;&nbsp;</span>
                                类型：<span>{supplierBaseSource.supplierType == 0 ? '潜在' : '正式'} &nbsp;&nbsp;&nbsp;&nbsp;</span> 
                                已入驻平台：<span>{scmBp.isEnterPlatform == 0 ? '否' : '是'}</span> 
                                {/*经营类型：{scmBp.tradeTypeName} &nbsp;网址：<a href={scmBp.website} target="blank">{scmBp.website}</a> &nbsp;电话：{scmBp.tel} &nbsp;邮箱：<a href={'mailto:' + scmBp.email}>{scmBp.email}</a>*/}
                            </div>
                        </div>
                        <div style={{ height: '80px', lineHeight: '80px',textAlign:'right' ,marginRight:20}}>
                            <Button type="primary" style={{ marginRight: '10px', width: 72, height: 30 }} onClick={() => this.editSupplier(supplierBaseSource.id,supplierBaseSource.uscc,supplierBaseSource.supplierCode)} ><i className='c2mfont c2m-bianji1' style={{ fontSize: 10, marginRight: 6 }} />编辑</Button>
                            <Popconfirm title={
                                <div>
                                    <h5>确认要{supplierBaseSource.status == 2 || supplierBaseSource.status == 0 ? '启用' : '禁用'}当前供应商吗？</h5>
                                    {/*<p>{T.DELSUPPLIER_OK}</p>*/}
                                </div>
                            }
                                onConfirm={() => this.changeStatus(supplierBaseSource.id, supplierBaseSource.status,supplierBaseSource.uscc,supplierBaseSource.supplierCode)}
                            >
                                <Button type="primary" style={{ width: 72, height: 30 }}>{supplierBaseSource.status == 2 || supplierBaseSource.status == 0 ? <i className='c2mfont c2m-qiyongcopy' style={{ fontSize: 10, marginRight: 6 }} /> : <i className='c2mfont c2m-jinyong2' style={{ fontSize: 10, marginRight: 6 }} />}
                                    {supplierBaseSource.status == 2 || supplierBaseSource.status == 0 ? '启用' : '禁用'}</Button>
                            </Popconfirm>

                        </div>
                        <div className="more-informations">
                            <a  href="#" onClick={() => {
                                this.setState({ bigShow: !this.state.bigShow })
                            }}>{this.state.bigShow ? '收起' : '展开'}
                                </a>
                        </div>
                    </div>
                    <div className="Supplier-conventionalBase" style={{ display: this.state.bigShow ? `none` : `block` }}>
                        <Row>
                            <Col span={8} className='conventional-part'>
                                <Row>
                                    <Col className="conventional-title">常规</Col>
                                </Row>
                                <Row>
                                    <Col span={5} className="conventional-right">统一社会信用代码：</Col>
                                    <Col span={8}><span>{formatNullStr(scmBp.uscc)}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={5} className="conventional-right">供应商全称：</Col>
                                    <Col span={8}><span>{supplierBaseSource.bpFull?<TooltipComp attr={{ text: `${supplierBaseSource.bpFull}`, wid: 180, placement: 'top' }} />:"--"}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={5} className="conventional-right">供应商简码：</Col>
                                    <Col span={8}><span>{formatNullStr(supplierBaseSource.briefCode)}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={5} className="conventional-right">供应商简称：</Col>
                                    <Col span={8}><span>{supplierBaseSource.supplierAbt?<TooltipComp attr={{ text: `${supplierBaseSource.supplierAbt}`, wid: 180, placement: 'top' }} />:"--"}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={5} className="conventional-right">来源渠道：</Col>
                                    <Col span={8}><span>{supplierBaseSource.sourceChannel?window.ENUM.getEnum("sourceChannel",""+supplierBaseSource.sourceChannel):formatNullStr(supplierBaseSource.sourceChannel)}</span></Col>
                                </Row>
                                
                            </Col>
                            <Col span={8} className='conventional-part'>
                                <Row>
                                    <Col className="conventional-title">商务</Col>
                                </Row>
                                <Row>
                                    <Col span={3} className="conventional-right">结算货币：</Col>
                                    <Col span={8}><span>{formatNullStr(supplierBaseSource.currencyName)}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={3} className="conventional-right">结算方式：</Col>
                                    <Col span={8}><span>{formatNullStr(supplierBaseSource.settlementName)}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={3} className="conventional-right">发票类型：</Col>
                                    <Col span={8}><span>{formatNullStr(supplierBaseSource.invoiceTypeName)}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={3} className="conventional-right">付款条件：</Col>
                                    <Col span={8}><span>{formatNullStr(supplierBaseSource.paymentName)}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={3} className="conventional-right">收款方：</Col>
                                    <Col span={8}><span >{supplierBaseSource.receiveOrgName?<TooltipComp attr={{ text: `${supplierBaseSource.receiveOrgName}`, wid: 180, placement: 'top' }} />:"--"}</span></Col>
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col className="conventional-title">组织</Col>
                                </Row>
                                <Row>
                                    <Col span={4} className="conventional-right">所属组织机构：</Col>
                                    <Col span={8}><span>{formatNullStr(supplierBaseSource.deptName)}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={4} className="conventional-right">负责人：</Col>
                                    <Col span={8}><span>{formatNullStr(supplierBaseSource.empName)}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={4} className="conventional-right">备注：</Col>
                                    <Col span={8}><span >{supplierBaseSource.supplierDesc?<TooltipComp attr={{ text: `${supplierBaseSource.supplierDesc}`, wid: 180, placement: 'top' }} />:"--"}</span></Col>
                                </Row>
                            </Col>
                        </Row>
                        <a className="show-or-hide" href="#" onClick={() => {
                            this.setState({ show: !this.state.show })
                        }}>{this.state.show ? '收起更多隐藏信息' : '展示更多隐藏信息'}
                            <Icon type={this.state.show ? "up" : "down"} /></a>
                    </div>
                    <div style={{ display: this.state.show ? `block` : `none` }} className='Supplier-company'>
                        <Row>
                            <Row><Col className="conventional-title">公司</Col></Row>
                            <Col span={8}>
                                <Row>
                                    <Col span={3} className="conventional-right">法人代表：</Col>
                                    <Col span={8}><span >{scmBp.corporation?<TooltipComp attr={{ text: `${scmBp.corporation}`, wid: 180, placement: 'top' }} />:"--"}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={3} className="conventional-right">创业日期：</Col>
                                    <Col span={8}><span>{formatNullStr(scmBp.creationDate)}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={3} className="conventional-right">行业：</Col>
                                    <Col span={8}><span>{scmBp.tradeType&&scmBp.tradeType.length>0?scmBp.tradeType.map(key=>key.tradeTypeName+" ; "):'--'}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={3} className="conventional-right">经营类型：</Col>
                                    <Col span={8}><span>{formatNullStr(scmBp.businessTypeName)}</span></Col>
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col span={3} className="conventional-right">公司性质：</Col>
                                    <Col span={8}><span>{formatNullStr(scmBp.companyTypeName)}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={3} className="conventional-right">公司规模：</Col>
                                    <Col span={8}><span>{formatNullStr(scmBp.companyScaleName)}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={3} className="conventional-right">公司网站：</Col>
                                    <Col span={8}><span>{formatNullStr(scmBp.website)}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={3} className="conventional-right">公司邮箱：</Col>
                                    <Col span={8}><span>{formatNullStr(scmBp.email)}</span></Col>
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col span={3} className="conventional-right">公司电话：</Col>
                                    <Col span={8}><span>{formatNullStr(scmBp.tel)}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={3} className="conventional-right">公司传真：</Col>
                                    <Col span={8}><span>{formatNullStr(scmBp.fax)}</span></Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Spin>
            </div>
        )
    }
}
export default SupplierBaseComp;