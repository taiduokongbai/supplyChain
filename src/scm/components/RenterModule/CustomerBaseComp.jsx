import React, { Component } from "react";
import { Row, Modal, Col, Spin, Table, Input, Icon, Button, Tabs, Popconfirm, Checkbox, Radio } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import ModalComp from '../../../base/components/ModalComp';
import TXT from '../../languages';
import {IndexLink} from "react-router";
import { formatNullStr } from '../../../base/consts/Utils';
import TooltipComp from '../../../base/components/TooltipComp';
const T = TXT.SUPPLIER;
const CheckboxGroup = Checkbox.Group;
const { TabPane } = Tabs;

/*class DetailModal extends ModalComp {

    getComp = () => {
        let { company } = this.props;
        return <div style={{ width: '93%' }}>
            <Row>
                <Col span={7} style={{ textAlign: 'right'}} className="conventional-right">公司全称：</Col>
                <Col span={5}>{company.companyName}</Col>
                <Col span={4} offset={3} className="conventional-right">经营类型：</Col>
                <Col span={5}>{company.businessTypeName}</Col>
            </Row>
            <Row>
                <Col span={7} style={{ textAlign: 'right'}} className="conventional-right">公司简称：</Col>
                <Col span={5}>{company.companyAbbr}</Col>
                <Col span={4} offset={3} className="conventional-right">公司性质：</Col>
                <Col span={5}>{company.companyTypeName}</Col>
            </Row>
            <Row>
                <Col span={7} style={{ textAlign: 'right'}} className="conventional-right">法人代表：</Col>
                <Col span={5}>{company.corporation}</Col>
                <Col span={4} offset={3} className="conventional-right">公司规模：</Col>
                <Col span={5}>{company.companyScaleName}</Col>
            </Row>
            <Row>
                <Col span={7} style={{ textAlign: 'right'}} className="conventional-right">行业：</Col>
                <Col span={5}>{company.tradeTypeName}</Col>
                <Col span={4} offset={3} className="conventional-right">公司邮箱：</Col>
                <Col span={5}>{company.email}</Col>
            </Row>
            <Row>
                <Col span={7} style={{ textAlign: 'right'}} className="conventional-right">创立日期：</Col>
                <Col span={5}>{company.creationDate}</Col>
                <Col span={4} offset={3} className="conventional-right">公司电话：</Col>
                <Col span={5}>{company.tel}</Col>
            </Row>
            <Row>
                <Col span={7} style={{ textAlign: 'right'}} className="conventional-right">公司网址：</Col>
                <Col span={5}>{company.website}</Col>
                <Col span={4} offset={3} className="conventional-right">公司传真：</Col>
                <Col span={5}>{company.fax}</Col>
            </Row>
            <Row>
                <Col span={7} style={{ textAlign: 'right'}} className="conventional-right">统一社会信用代码：</Col>
                <Col span={5}>{company.companyUscc}</Col>
            </Row>
        </div>
    }
}*/

class CustomerBaseComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.statusParam = {
            'customerCode': '',
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
    };

    editCustomer = (id,uscc,customerCode) => {
        this.props.EditModul();
        this.props.customerLoading(true);
        this.props.getEditData(id, 'edit',uscc,customerCode, "customerViewCont").then(data => {
            //结算方式 C014，付款条件 C013，行业 C015，经营类型 C019，公司性质 C018，公司规模 C016, 发票类型 C021
            let param = [
            { "subCode": "C013", "catCode": data.paymentOrgCode },
            { "subCode": "C015", "catCode": data.scmBp.tradeTypeCode },
            { "subCode": "C019", "catCode": data.scmBp.businessTypeCode },
            { "subCode": "C018", "catCode": data.scmBp.companyTypeCode },
            { "subCode": "C016", "catCode": data.scmBp.companyScaleCode },
            { "subCode": "C021", "catCode": data.invoiceTypeCode }
            ]
            this.props.settleList({settleCode:data.settlementCode,status:1,page:1,pageSize:10})
            param.map((item) => {
                this.props.getSubjectList({ ...item, "status": 1, "page": 1, "pageSize": 10 });
            });
            this.props.getDept({ "orgCode": data.deptCode, "orgType": 3, "status": 1, "page": 1, "pageSize": 10 });
            if(data.deptCode){
                this.props.getEmployeesList({ "deptCode": data.deptCode, "employeeCode": data.empCode, "page": 1, "pageSize": 10 });
            }
            
            this.props.getBusinessPartnerData({
                "page": "1",
                "pageSize": "10"
            });
            this.props.getCurrencyList({
                "page": "1",
                "pageSize": "10"
            })
            
        });
    }
    handleOk = () => {
        this.setState({ visible: false });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }

    changeStatus = (id, status,uscc,customerCode) => {
        this.statusParam = {
            id:id,
            status: status
        }
        this.props.customerStatus(this.statusParam)
            .then(json => {
                if (json.status == 2000) {
                    this.props.getEditData(id,'detail',uscc,customerCode)

                }
            })
    }
    render() {
        const { hiddenVisible, customerBaseSource, customerBaseLoading, ...props } = this.props;
        let scmBp = customerBaseSource.scmBp || {};
        return (
            <div className="Customer-BaseInfo">
                <Spin spinning={customerBaseLoading}>
                    <div className="Customer-Title" >
                        <div style={{width:'70%',float:'left'}}>
                            <div className="Customer-BigTitle">
                                <div>客户：{customerBaseSource.customerCode} | <span>{customerBaseSource.bpFull}</span>
                                    {/*<DetailModal
                                        visible={this.state.visible}
                                        title="公司详情"
                                        handleCancel={() => this.setState({ visible: false })}
                                        handleSubmit={() => this.setState({ visible: false })}
                                        company={customerBaseSource.company || ""}
                                    >
                                    </DetailModal>*/}
                                </div>
                            </div>
                            <div className="Customer-SmallTitle">
                                状态：<span>{customerBaseSource.status == 0 ? '已保存' : customerBaseSource.status == 1 ? '已启用' : '已禁用'} &nbsp;&nbsp;&nbsp;&nbsp;</span> 
                                类型：<span>{customerBaseSource.customerType == 0 ? '潜在' : '正式'} &nbsp;&nbsp;&nbsp;&nbsp;</span> 
                                已入驻平台：<span>{scmBp.isEnterPlatform == 0 ? '否' : '是'}</span> 
                            </div>
                            {/*<div className="Customer-SmallTitle">状态：{customerBaseSource.status == 0 ? '已保存' : customerBaseSource.status == 1 ? '已启用' : '已禁用'} &nbsp; 经营类型：{scmBp.businessTypeName} &nbsp;网址：<a href={scmBp.website} target="blank">{scmBp.website}</a> &nbsp;电话：{scmBp.tel} &nbsp;邮箱：<a href={'mailto:'+scmBp.email}>{scmBp.email}</a>
                            </div>*/}
                         </div>
                        <div style={{ height: '80px', lineHeight: '80px',textAlign:'right' ,marginRight:20}}>
                            <Button type="primary" style={{ marginRight: '10px',width:72,height:30 }} onClick={() => this.editCustomer(customerBaseSource.id,customerBaseSource.uscc,customerBaseSource.customerCode)} ><i className="c2mfont c2m-bianji1" style={{fontSize:14,marginRight:4}}></i>编辑</Button>
                            <Popconfirm title={
                                <div>
                                    <h5>确认要{customerBaseSource.status != 2 ? '启用' : '禁用'}当前客户吗？</h5>
                                    {/*<p>{T.DELSUPPLIER_OK}</p>*/}
                                </div>
                            }
                                onConfirm={() => this.changeStatus(customerBaseSource.id, customerBaseSource.status==1?2:1,customerBaseSource.uscc,customerBaseSource.customerCode)}
                            >
                                <Button type="primary" style={{width:72,height:30}}><i className={customerBaseSource.status != 1 ?"c2mfont c2m-qiyongcopy":"c2mfont c2m-jinyong2"} style={{fontSize:14,marginRight:4}}></i>{customerBaseSource.status != 1 ? '启用' : '禁用'}</Button>
                            </Popconfirm>

                        </div>
                        <div className="more-informations">
                            <a  href="#" onClick={() => {
                                this.setState({ bigShow: !this.state.bigShow })
                            }}>{this.state.bigShow ? '收起' : '展开'}
                                </a>
                        </div>
                    </div>
                    <div className="Customer-conventionalBase" style={{ display: this.state.bigShow ? `none` : `block` }}>
                        <div className="Customer-con">
                            <Row className="Customer_info">
                                <Col span={8} >常规</Col>
                                <Col span={8} >商务</Col>
                                <Col span={8} className="current">组织</Col>
                            </Row>
                            <Row>
                                {/*<Col span={2} offset={2} >客户编码：</Col>
                                <Col span={4}>{customerBaseSource.customerCode}</Col>*/}
                                <Col span={8}><i>统一社会信用代码：</i><span>{formatNullStr(scmBp.uscc)}</span></Col>
                                <Col span={8}><i className="spanLeft">结算币别：</i><span>{formatNullStr(customerBaseSource.currencyName)}</span></Col>
                                <Col span={8} className="current"><i className="i-Left">所属组织机构：</i><span>{customerBaseSource.deptName?customerBaseSource.deptName:formatNullStr(customerBaseSource.deptName)}</span></Col>
                               

                                {/*<Col span={2} offset={1} >状态：</Col>
                                <Col span={4}>{customerBaseSource.status == 0 ? '已保存' :customerBaseSource.status==1?'已启用':'已禁用'}</Col>*/}
                            </Row>
                            <Row>
                                <Col span={8}><i style={{verticalAlign:'top'}}>客户全称：</i><span style={{display:'inline-block'}}>{customerBaseSource.bpFull?<TooltipComp attr={{ text: `${customerBaseSource.bpFull}`, wid: 180, placement: 'top' }} />:"--"}</span></Col>
                               
                                <Col span={8}><i className="spanLeft">结算方式：</i><span>{customerBaseSource.settlementName?customerBaseSource.settlementName:formatNullStr(customerBaseSource.settlementName)}</span></Col>
                                <Col span={8} className="current"><i className="i-Left">负责人：</i><span>{customerBaseSource.empName?customerBaseSource.empName:formatNullStr(customerBaseSource.empName)}</span></Col>
                            </Row>
                            <Row>
                                 <Col span={8}><i>客户简码：</i><span>{formatNullStr(customerBaseSource.briefCode)}</span></Col>
                                <Col span={8}><i className="spanLeft">发票类型：</i><span >{customerBaseSource.invoiceTypeName?customerBaseSource.invoiceTypeName:formatNullStr(customerBaseSource.invoiceTypeName)}</span></Col>
                                <Col span={8} className="current"><i className="i-Left" style={{verticalAlign:'top'}}>备注：</i><span className="Customer-describe"style={{display:'inline-block'}} >{customerBaseSource.customerDesc?<TooltipComp attr={{ text: `${customerBaseSource.customerDesc}`, wid: 180, placement: 'top' }} />:"--"}</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><i style={{verticalAlign:'top'}}>客户简称：</i><span style={{display:'inline-block'}}>{customerBaseSource.customerAbt?<TooltipComp attr={{ text: `${customerBaseSource.customerAbt}`, wid: 180, placement: 'top' }} />:"--"}</span></Col>
                                {/*<Col span={8}><i>主语言：</i><span>{scmBp.langCode?window.ENUM.getEnum("language",scmBp.langCode):formatNullStr(scmBp.langCode)}</span></Col>*/}
                                <Col span={8}><i className="spanLeft">收款条件：</i><span >{customerBaseSource.payeeName?customerBaseSource.payeeName:formatNullStr(customerBaseSource.payeeName)}</span></Col>
                                <Col span={8} className="current"></Col>
                            </Row>
                            <Row className="Customer_current">
                                <Col span={8}><i>来源渠道：</i><span>{customerBaseSource.sourceChannel?window.ENUM.getEnum("sourceChannel",customerBaseSource.sourceChannel):formatNullStr(customerBaseSource.sourceChannel)}</span></Col>
                                <Col span={8}><i className="spanLeft" style={{verticalAlign:'top'}}>付款方：</i><span style={{display:'inline-block'}}>{customerBaseSource.paymentOrgName?<TooltipComp attr={{ text: `${customerBaseSource.paymentOrgName}`, wid: 180, placement: 'top' }} />:formatNullStr(customerBaseSource.paymentOrgName)}</span></Col>
                                <Col span={8} className="current"></Col>
                            </Row>
                            <div className="more-remark">
                                <a  href="#" onClick={() => {
                                    this.setState({ show: !this.state.show })
                                }}>{this.state.show ? '收起更多隐藏信息' : '展开更多隐藏信息'}
                                </a>
                            </div>
                            
                        </div>
                        <div className="Customer-companyCon" style={{ display: this.state.show ? `block` : `none` }}>
                            <Row className="Customer-companyTitle">
                                <Col span={8} >公司</Col>
                                <Col span={8} ></Col>
                                <Col span={8} ></Col>
                            </Row>
                            <Row>
                                <Col span={8}><i style={{verticalAlign:'top'}}>法人代表：</i><span style={{display:'inline-block'}}>{scmBp.corporation?<TooltipComp attr={{ text: `${scmBp.corporation}`, wid: 180, placement: 'top' }} />:"--"}</span></Col>
                                <Col span={8}><i>公司性质：</i><span>{scmBp.companyTypeName?scmBp.companyTypeName:formatNullStr(scmBp.companyTypeName)}</span></Col>
                                <Col span={8}><i>公司电话：</i><span>{formatNullStr(scmBp.tel)}</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><i>创立日期：</i><span>{formatNullStr(scmBp.creationDate)}</span></Col>
                                <Col span={8}><i>公司规模：</i><span>{scmBp.companyScaleName?scmBp.companyScaleName:formatNullStr(scmBp.companyScaleName)}</span></Col>
                                <Col span={8}><i>公司传真：</i><span>{formatNullStr(scmBp.fax)}</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><i>行业：</i><span>{scmBp.tradeType&&scmBp.tradeType.length>0?scmBp.tradeType.map(key=>key.tradeTypeName+" ; "):'--'}</span></Col>
                                <Col span={8}><i>公司网址：</i><span>{formatNullStr(scmBp.website)}</span></Col>
                                <Col span={8}></Col>
                            </Row>
                            <Row>
                                <Col span={8}><i>经营类型：</i><span>{scmBp.businessTypeName?scmBp.businessTypeName:formatNullStr(scmBp.businessTypeName)}</span></Col>
                                <Col span={8}><i>公司邮箱：</i><span>{formatNullStr(scmBp.email)}</span></Col>
                                <Col span={8}></Col>
                                
                            </Row>
                        </div>
                    </div>
                </Spin>
            </div>
        )
    }
}
export default CustomerBaseComp;