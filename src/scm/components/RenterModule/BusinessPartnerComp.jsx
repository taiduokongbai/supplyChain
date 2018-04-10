import React, { Component } from "react";
import { Row, Col, Spin, Table, Input, Icon, Button, Tabs, Popconfirm, Checkbox, Radio } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import { formatNullStr } from '../../../base/consts/Utils';
import TooltipComp from '../../../base/components/TooltipComp';
const CheckboxGroup = Checkbox.Group;
const { TabPane } = Tabs;
class BussinessPartnerComp extends Component{
    constructor(props, context) {
        super(props, context);
        this.state = {
            show: true
        }
    this.columns1 = [{
        title: '行号',
        dataIndex: 'rowKey',
        key: 'rowKey',
        width: 105,
        className: "firstColCenter",
        hidden: true
    },{
      title: '联系人编码',
      dataIndex: 'contactsCode',
      key:'contactsCode',
      hidden: true,
    },{
      title: '默认',
      dataIndex: 'contactsDefault',
      key:'contactsDefault',
      width: 200,
      className: "textAlignCenter",
      render: (txt, record, index) => {
            return <div style={{ textAlign: 'center' }}><Checkbox checked={txt ? true : false} disabled={true}></Checkbox></div>
      },
      hidden: true,
    }, {
      title: '姓名',
      dataIndex: 'contactsName',
      key: 'contactsName',
    }, {
        title: '性别',
        dataIndex: 'sexCode',
        key: 'sexCode',
        // width: 100,
        render: (txt, record, index) => {
            if (txt != "") {
                return window.ENUM.getEnum("sex", txt + '')
            }
        },
    },{
      title: '职务',
      dataIndex: 'post',
      key: 'post',
    },{
      title: '移动电话',
      dataIndex: 'phone',
      key: 'phone',
    },{
      title: '邮箱',
      dataIndex: 'email',
      key:'email',
    },{
        title: '状态',
        dataIndex: 'status',
        key:'status',
        render: (txt, record, index) => {
               return window.ENUM.getEnum("status",txt+'')},
      }];

    this.columns2 = [{
        title: '行号',
        dataIndex: 'rowKey',
        key: 'rowKey',
        width: 105,
        className: "firstColCenter",
        hidden: true
    },{
      title: '地址编码',
      dataIndex: 'addressCode',
      key:'addressCode',
      hidden: true,
    },{
      title: '默认收货地址',
      dataIndex: 'repDefault',
      key:'repDefault',
      width: 160,
      className: "textAlignCenter",
      render: (txt, record, index) => {
            return <div style={{ textAlign: 'center' }}><Checkbox checked={txt ? true : false} disabled={true}></Checkbox></div>
      },
      hidden: true,
    }, {
      title: '默认发货地址',
      dataIndex: 'sogDefault',
      key: 'sogDefault',
      className: "textAlignCenter",
      width: 160,
      render: (txt, record, index) => {
            return <div style={{ textAlign: 'center' }}><Checkbox checked={txt ? true : false} disabled={true}></Checkbox></div>
      },
      hidden: true,
    }, {
      title: '默认发票地址',
      dataIndex: 'bilDefault',
      key: 'bilDefault',
      className: "textAlignCenter",
      width: 160,
      render: (txt, record, index) => {
            return <div style={{ textAlign: 'center' }}><Checkbox checked={txt ? true : false} disabled={true}></Checkbox></div>
      },
      hidden: true,
    }, {
      title: '地址类型',
      dataIndex: 'addressType',
      key:'addressType',
      render:(txt,record,index)=>{
         let addressType=[];
         if(record.isRep)
            addressType.push(0)
         if(record.isSog)
            addressType.push(1)
         if(record.isBil)
            addressType.push(2)
        return addressType.map(item=>window.ENUM.getEnum("supplierAddress",item+'')).join(',')
      },
    }, {
      title: '地址信息',
      dataIndex: 'addressInfo',
      key:'addressInfo',
      render:(txt,record,index)=>{
        //   return <TooltipComp attr={{ text: `${record.provinceName}${record.cityName}${record.countyName}${record.addressDetl}`, wid: 150, placement: 'top' }} />
          return `${record.provinceName}${record.cityName}${record.countyName}${record.addressDetl}`
      }
    }, {
        title: '状态',
        dataIndex: 'status',
        key:'status',
        width: '10%',
         render: (txt, record, index) => {
               return window.ENUM.getEnum("status",txt+'')},
      }];
  }
   componentDidMount(){
        this.props.contactTablePaging(1);
        this.props.addressTablePaging(1);
    }
   onEdit = (id) => {
        let { EditModul, BusinessDetail, BusinessId } = this.props;
        EditModul();
        BusinessId(id);
        BusinessDetail(id);
    }
    render(){
        const { businessBase, dataContactSource, dataAddressSource, contactTablePaging, addressTablePaging, contactTabLoading, businessPartnerTabLoading, addressTabLoading, ...props } = this.props;
        const columnsContact = this.columns1;
        const columnsAddress=this.columns2;
        const plainOptions = [
            { label: '供应商', value: 'isSupplier' },
            { label: '客户', value: 'isCustomer' },
            { label: '银行', value: 'isBank' },
        ];
        let RoleName=[];
        let RoleNameEn=[];
        if(businessBase.isSupplier){
            RoleName.push('供应商');
            RoleNameEn.push('isSupplier');
        }
        if(businessBase.isCustomer){
            RoleName.push('客户');
            RoleNameEn.push('isCustomer');
        }
        if(businessBase.isBank){
            RoleName.push('银行');
            RoleNameEn.push('isBank');
        }
        return(
            <div className="Bussiness-PartnerComp">
                <Spin spinning={businessPartnerTabLoading}>
                    <div className="Business-Title">  
                        <Row>
                            <Col span={22} style={{padding:'18px 0 0 20px'}}>
                                <h4>商业伙伴：{businessBase.bpCode} | {businessBase.bpFull}</h4>
                                <p style={{fontSize:'12px',color:'#999'}}>角色：{RoleName.join(';')}</p>
                            </Col>
                            <Col span={2} style={{lineHeight:'80px',textAlign:'right',paddingRight:'20px'}}>
                                <Button type='primary' onClick={()=>this.onEdit(businessBase.id)} className="editBtn"><i className="c2mfont c2m-bianji1"></i>编辑</Button>
                            </Col>
                        </Row>
                        <a className='form-showOrhide' onClick={() => { this.setState({ show: !this.state.show }) } }>
                            {this.state.show?'收起':'展开'}
                        </a>
                    </div>
                    <div className="Bussiness-conventional" style={{display:this.state.show?`block`:`none`}}>
                        <div className="business-conventionalBase">
                            <Row>
                                <Col span={8} >
                                    <ul>
                                        <li className="conventional-right"><span>常规</span></li>
                                        <li><b>统一社会信用代码：</b><span>{businessBase.uscc}</span></li>
                                        <li><b>商业伙伴编码：</b><span>{businessBase.bpCode}</span></li>
                                        <li><b>商业伙伴全称：</b><span>{businessBase.bpFull && <TooltipComp attr={{ text: `${businessBase.bpFull}`, wid: 180, placement: 'top' }} /> || '--'}</span></li>
                                        <li><b style={{float:'left'}}>商业伙伴角色：</b><CheckboxGroup options={plainOptions} value={RoleNameEn}  disabled/></li>
                                    </ul>
                                </Col>
                                <Col span={8} style={{borderLeft:'1px solid #e2e2e2'}}>
                                    <ul className='companyInfo-title'>
                                        <li className="conventional-right"><span>公司</span></li>
                                        <li><b>法人代表：</b><span>{businessBase.corporation&&businessBase.corporation!=''?<TooltipComp attr={{ text: `${businessBase.corporation}`, wid: 180, placement: 'top' }} />:'--'}</span></li>
                                        <li><b>创立日期：</b><span>{formatNullStr(businessBase.creationDate)}</span></li>
                                        {/*<li><b>行业：</b>{formatNullStr(businessBase.tradeTypeName)}</li>*/}
                                        <li><b>行业：</b><span>{businessBase.tradeType&&businessBase.tradeType.length>0?businessBase.tradeType.map(item=>item.tradeTypeName).join('; '):'--'}</span></li>
                                        <li><b>公司性质：</b><span>{formatNullStr(businessBase.companyTypeName)}</span></li>
                                        <li><b>公司规模：</b><span>{formatNullStr(businessBase.companyScaleName)}</span></li>
                                    </ul>
                                </Col>
                                <Col span={8}>
                                    <ul className='companyInfo-title'>
                                        <li className="conventional-right" style={{height:'24px'}}></li>        
                                        <li><b>经营类型：</b>{formatNullStr(businessBase.businessTypeName)}</li>
                                        <li><b>公司网址：</b>{formatNullStr(businessBase.website)}</li>
                                        <li><b>公司邮箱：</b>{formatNullStr(businessBase.email)}</li>
                                        <li><b>公司电话：</b>{formatNullStr(businessBase.tel)}</li>
                                        <li><b>公司传真：</b>{formatNullStr(businessBase.fax)}</li>
                                    </ul>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Spin>
                <div>
                    <Tabs className="business-table" animated={false}>
                        <TabPane tab="联系人" key="1">
                            <MTable 
                                    {...props}
                                    loading={contactTabLoading}
                                    cols={columnsContact} 
                                    dataSource={dataContactSource}
                                    pageOnChange={contactTablePaging}
                                    rowKey={"id"}
                                    paging={this.props.contactPaging}
                                    />
                        </TabPane>
                        <TabPane tab="地址" key="2">
                            <MTable
                                    {...props}
                                    loading={addressTabLoading}
                                    dataSource={dataAddressSource} 
                                    cols={columnsAddress}
                                    pageOnChange={addressTablePaging}
                                    rowKey={"id"}
                                    paging={this.props.addressPaging}
                                    />
                            </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
export default BussinessPartnerComp;