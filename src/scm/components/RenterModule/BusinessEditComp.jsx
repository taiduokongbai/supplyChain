import React, { Component, PropTypes } from "react";
import moment from "moment";
import { Form, Input, Spin, Button, message, Row, Col,Select, DatePicker, Checkbox, Modal } from '../../../base/components/AntdComp';
import FormComp from '../../../base/components/FormComp';
import AutoSelectComp from '../../../base/components/AutoSelectComp'; 

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const page = { 'page': 1, 'pageSize': 10 };


class BusinessEditComp extends FormComp {
    constructor(props, context) {
        super(props, context);
    }
    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.edit.current != this.props.edit.current) {
            this.resetFds();
        }
    }
    //保存
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.props.loading) {
            this.validateFds((err, data) => {
                data.creationDate = data.creationDate?moment(data.creationDate).format('YYYY-MM-DD'):"";
                const rolePlain = ['isSupplier', 'isCustomer', 'isBank'];
                for (var i = 0; i < rolePlain.length; i++){
                    if (data.bpRole && data.bpRole.includes(rolePlain[i])) {
                        data[rolePlain[i]] = 1;
                    } else {
                        data[rolePlain[i]] = 0;
                    }
                }
                if(data.tradeType.length>0){
                    let tradeTypeAttr=data.tradeType;
                    data.tradeType=[];
                    for(var i of tradeTypeAttr){
                         data.tradeType.push({"tradeTypeCode":i,"tradeTypeName":''})
                    }
                }
                delete data.bpRole
                // console.log(data);
                if (!err) {
                    this.props.onOk && this.props.onOk(data);
                }
            });
        }
    }
    onSearch = (value,subCode,list) => {
        return this.props.EditInitData({ subCode: subCode, catCode: value, catName: value },list);
    }
    render() {
        let formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 10 },
        };
        const roleOptions = [
            { label: '供应商', value: 'isSupplier' },
            { label: '客户', value: 'isCustomer' },
            { label: '银行', value: 'isBank' },
        ];
        //redux数据
        let { loading, detail, current, tradeTypeList, businessTypeList, companyScaleList, companyTypeList } = this.props.edit;
        return (
            <div className='editBusiness-cont'>
                <Spin spinning={loading}>
                        <div className='editBusiness-title'>
                            <Row style={{ height: '80px', lineHeight: '80px', border: '1px solid #e2e2e2' }}>
                                <Col span={3} style={{ paddingLeft: '30px', fontSize: '14px', fontWeight: 'bold' }} >编辑商业伙伴</Col>
                                <Col span={19}></Col>
                                <Col span={2} style={{textAlign:'right',paddingRight:'20px'}}>
                                    <Button type='primary' onClick={this.handleSubmit} className="saveBtn"><i className="c2mfont c2m-baocun"></i>保存</Button>
                                </Col>
                            </Row>
                        </div>
                    <Form>    
                        <div className='editBusiness-form' >
                            <Row>
                                <Col span={1}> </Col>       
                                <Col span={23} className='businessItemTitle'>常规</Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label="统一社会信用代码" {...formItemLayout}>
                                        {this.getFD('uscc', {
                                            initialValue: detail.uscc,
                                            rules: [
                                                { required: true, message: '统一社会信用代码 必填！' }
                                            ],
                                        })(
                                            <Input disabled/>
                                            )}
                                    </FormItem>
                                    <FormItem label="商业伙伴编码" {...formItemLayout}>
                                        {this.getFD('bpCode', {
                                            initialValue: detail.bpCode,
                                            rules: [
                                                { required: true, message: '商业伙伴编码 必填！' },
                                            ],
                                        })(
                                            <Input disabled/>
                                            )}
                                </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="商业伙伴全称" {...formItemLayout}>
                                        {this.getFD('bpFull', {
                                            initialValue: detail.bpFull,
                                            rules: [
                                                { required: true, message: '商业伙伴全称 必填！' },
                                                { max: 100, message: "商业伙伴全称长度不能超过100" }
                                            ],
                                        })(
                                            <Input />
                                            )}
                                    </FormItem>
                                    <FormItem label="商业伙伴角色" {...formItemLayout}>
                                        {this.getFD('bpRole', {
                                            initialValue: detail.bpRole,
                                        })(
                                            <CheckboxGroup options={roleOptions} disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={1}> </Col>          
                                <Col span={23} className='businessItemTitle'>公司</Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label="法人代表" {...formItemLayout}>
                                        {this.getFD('corporation', {
                                            initialValue: detail.corporation || '',
                                            rules: [{ max: 100, message: "法人代表长度不能超过100" }],
                                        })(
                                            <Input />
                                            )}
                                    </FormItem>
                                    <FormItem label="创立日期" {...formItemLayout}>
                                        {this.getFD('creationDate', {
                                            initialValue: detail.creationDate ? moment(detail.creationDate, 'YYYY-MM-DD') : null,
                                        })(
                                            <DatePicker style={{ width: '100%' }}/>
                                            )}
                                    </FormItem>    
                                    <FormItem label="行业" {...formItemLayout}>
                                        {this.getFD('tradeType', {
                                            initialValue: detail.tradeType&&detail.tradeType.map(key=>key.tradeTypeCode)||[],
                                        })(
                                            <Select mode="multiple" style={{ width: '100%' }}>
                                                {
                                                    window.ENUM.getEnum("industry").map(industry => {
                                                    return <Select.Option
                                                        value={industry.catCode+""}
                                                        key={industry.catCode}>
                                                        {industry.catName}
                                                    </Select.Option>
                                                    })
                                                }
                                            </Select>
                                            )}
                                    </FormItem>
                                    <FormItem label="经营类型" {...formItemLayout}>
                                        {this.getFD('businessTypeCode', {
                                            initialValue: detail.businessTypeCode||'',
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: businessTypeList,
                                                    keyName: "catCode",
                                                },
                                            ],
                                        })(
                                            <AutoSelectComp
                                                selectedList={businessTypeList}
                                                onSearch={(value)=>this.onSearch(value,'C019','businessTypeList')}
                                                displayName={["catCode", "catName"]}
                                                keyName={"catCode"}
                                            />
                                            )}
                                    </FormItem>  
                                    <FormItem label="公司性质" {...formItemLayout}>
                                        {this.getFD('companyTypeCode', {
                                            initialValue: detail.companyTypeCode||'',
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: companyTypeList,
                                                    keyName: "catCode",
                                                },
                                            ],
                                        })(
                                            <AutoSelectComp
                                                selectedList={companyTypeList}
                                                onSearch={(value)=>this.onSearch(value,'C018','companyTypeList')}
                                                displayName={["catCode", "catName"]}
                                                keyName={"catCode"}
                                            />
                                            )}
                                    </FormItem>        
                                </Col>
                                <Col span={12}>
                                    <FormItem label="公司规模" {...formItemLayout}>
                                        {this.getFD('companyScaleCode', {
                                            initialValue: detail.companyScaleCode||'',
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: companyScaleList,
                                                    keyName: "catCode",
                                                },
                                            ],
                                        })(
                                            <AutoSelectComp
                                                selectedList={companyScaleList}
                                                onSearch={(value)=>this.onSearch(value,'C016','companyScaleList')}
                                                displayName={["catCode", "catName"]}
                                                keyName={"catCode"}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="公司网址" {...formItemLayout}>
                                        {this.getFD('website', {
                                            initialValue: detail.website || '',
                                            rules: [
                                                { type: 'url', message: '请输入 正确的网址类型' },
                                                { max: 50, message: '公司网址长度不能超过50' }
                                            ],
                                        })(
                                            <Input />
                                            )}
                                    </FormItem>        
                                    <FormItem label="公司邮箱" {...formItemLayout}>
                                        {this.getFD('email', {
                                            initialValue: detail.email || '',
                                            rules: [
                                                { type: 'email', message: '请输入 正确的邮箱类型' },
                                                { max: 50, message: '公司邮箱长度不能超过50' }
                                            ],
                                        })(
                                            <Input />
                                            )}
                                    </FormItem>   
                                    <FormItem label="公司电话" {...formItemLayout}>
                                        {this.getFD('tel', {
                                            initialValue: detail.tel || '',
                                            rules: [
                                                { max: 20, message: '公司电话不能超过20' }
                                            ],
                                        })(
                                            <Input />
                                            )}
                                    </FormItem>
                                    <FormItem label="公司传真" {...formItemLayout}>
                                        {this.getFD('fax', {
                                            initialValue: detail.fax || '',
                                            rules: [
                                                { max: 50, message: '公司传真长度不能超过50' }
                                            ],
                                        })(
                                            <Input />
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>    
                        </div>
                    </Form>
                </Spin>
            </div>
        )
    }

}
export default Form.create()(BusinessEditComp);

