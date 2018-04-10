import React, { Component, PropTypes } from "react";
import update from 'react/lib/update';
import moment from "moment";
import { Form, Input, Spin, Button, Modal, Row, Col, Select, Icon, DatePicker } from '../../../base/components/AntdComp';
import FormComp from '../../../base/components/FormComp';
import AutoSelectComp from '../../../base/components/AutoSelectComp';
moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;

class AddSupplierComp extends FormComp {
    constructor(props, context) {
        super(props, context);
        this.state={
            customerName: "",
            show: false,
            isDisabled:false,
            isEnterPlatform:null,
        };
        this.editable = {
            //name: false,
            uscc: false,
            receiveOrgCode:false,
        };
        this.param = {
            supplierCode : "",
            bpFull : "",
            supplierAbt : "",
            supplierDesc : "",
            deptCode : "",
            empCode : "",
            currencyCode : "",
            settlementCode : "",
            invoiceTypeCode : "",
            paymentCode : "",
            receiveOrgCode : "",
            supplierType:"",
            briefCode:"",
            sourceChannel:null,
            scmBp : {
                uscc : "",
                bpFull : "",
                bpAbt : "",
                bpCode: "",
                businessTypeCode : "",
                corporation : "",
                creationDate : "",
                tradeType : [],
                companyTypeCode : "",
                companyScaleCode : "",
                website : "",
                email : "",
                tel : "",
                fax : "",
                langCode : "" ,
                isEnterPlatform:null
            }
        };
    }

    componentWillMount() {
        // this.props.getdeptMgr();
        //this.props.getSelectData(this.param);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            if(this.props.title=='新建供应商'){
                    data.receiveOrgCode="";
                }
            data.creationDate=data.creationDate?moment(data.creationDate).format('YYYY-MM-DD'):'';
            let newData = this.param;
            for(let [key,val] of Object.entries(data)){
                if(key in newData.scmBp&&val){
                    newData = update(newData, {
                        scmBp: {
                            [key]: {
                                $set: val
                            }
                        }
                    });
                }
                
                if(key in newData&&val){
                    newData = update(newData, {
                        [key]: {
                            $set: val
                        }
                    });
                }
            };
            newData.scmBp.bpFull=data.bpFull||'';
            newData.scmBp.bpAbt=data.supplierAbt||'';
            if(newData.scmBp.tradeType.length>0){
                let tradeTypeAttr=newData.scmBp.tradeType;
                newData.scmBp.tradeType=[];
                for(var i of tradeTypeAttr){
                        newData.scmBp.tradeType.push({"tradeTypeCode":i,"tradeTypeName":''})
                }
                
            }
            if (!err) {
                if(this.props.title=='编辑供应商'){
                    newData.scmBp.bpCode=this.props.Record.scmBp.bpCode;
                    newData.scmBp.isEnterPlatform=this.props.Record.scmBp.isEnterPlatform;
                    newData.id=this.props.Record.id;
                    console.log(this.props.Record.id);
                }else{
                    newData.scmBp.isEnterPlatform=this.state.isEnterPlatform;
                }
                newData.uscc=newData.scmBp.uscc;
                this.props.onOk && this.props.onOk(newData);
            } else { 
                this.setState({ show: true });
            }
        });
    }

    //自动搜索人员
    EmployeesSelectSearch = (val) => {
        if (this.getFdv("deptCode")) {
            this.props.getEmployeesList({ "deptCode": this.getFdv("deptCode"), "employeeName": val, "employeeCode": val, "page": 1, "pageSize": 10 });
        }
    }

    //自动搜索所属组织机构
    deptSelectSearch = (val) => {
        this.setFdv({
            empCode: "",
        })
        this.props.getDeptList({ "orgName": val, "orgCode": val, "orgType": 2, "status": 1, "page": 1, "pageSize": 10 });
    }

    //根据部门code获取人员列表
    selectChange = (deptCode) => {
        this.setFdv({
            empCode:"",
        })
        this.props.getEmployeesList({ "deptCode": deptCode.orgCode,"page":1,"pageSize":10});
    }
    //自动搜索结算币种
    currencySelectSearch=(val)=>{
        this.props.getCurrencyList({"curName":val,"page":1,"pageSize":10});
    }
    //自动搜索结算方式
    settleListSearch=(val)=>{
        this.props.settleList({settleCode:val,settleName:val,status:1,page:1,pageSize:10})
    }

    //零级数据自动搜索（付款条件 C013，行业 C015，经营类型 C019，公司性质 C018，公司规模 C016, 发票类型 C021）
    subjectSelectSearch=(val,subCode)=>{
        this.props.getSubjectList({"subCode":subCode,"status":1,"catCode":val,"catName":val,"page":1,"pageSize":10});
    }
    //自动搜索商业伙伴
    receiveOrgSelectSearch=(val)=>{
        this.props.getBusinessPartnerData({"bpFull":val,"page":1,"pageSize":10});
    }
    //根据社会统一信用代码获取信息
    getUscc = (e) => {
        let val = e.target.value;
        val = val.replace(/\s/g,"");
        if(val!=""){
            this.props.getBusinessPartnerDetail({ "uscc": val }).then(json => { 
                if (json.status == "2000" && json.data!=null) {
                    let data = json.data;
                    this.setState({isEnterPlatform:data.isEnterPlatform})
                    if(data.id==null){
                         this.setState({isDisabled:false})  
                    }else{
                         this.setState({isDisabled:true})
                    }
                    this.setFdv({
                        bpFull: data.bpFull,
                        supplierAbt: data.bpAbt,
                        corporation: data.corporation,
                        companyScaleCode: data.companyScaleCode,
                        creationDate: data.creationDate ? moment(data.creationDate, 'YYYY-MM-DD') : null,
                        website: data.website,
                        tradeTypeCode: data.tradeTypeCode,
                        email: data.email,
                        businessTypeCode: data.businessTypeCode,
                        tel: data.tel,
                        companyTypeCode: data.companyTypeCode,
                        fax: data.fax,
                        isEnterPlatform:data.isEnterPlatform
                    });
                    //结算方式 C014，付款条件 C013，行业 C015，经营类型 C019，公司性质 C018，公司规模 C016, 发票类型 C021
                    let subCode = ["C014", "C013", "C015", "C019", "C018", "C016", "C021"]
                    subCode.map((item) => {
                        this.props.getSubjectList({ "subCode": item, "status": 1, "page": 1, "pageSize": 10 });
                    });
                } else { 
                    this.setFdv({
                        bpFull: "",
                        supplierAbt: "",
                        corporation: "",
                        companyScaleCode: "",
                        creationDate: "",
                        website: "",
                        tradeTypeCode: "",
                        email: "",
                        businessTypeCode: "",
                        tel: "",
                        companyTypeCode: "",
                        fax: "",
                        isEnterPlatform:null
                    });
                }
            });
        }
    };
    //回填供应商全称
    getCustomerFull=(e)=>{
        let val = e.target.value;
        if (this.props.type === 'add') {
            this.setFdv({
                receiveOrgCode: val
            })
        }
    }
    supplierOnchange=(value)=>{
        this.param.supplierType=value;
    }
    componentWillUnmount() {
        this.resetFds();
        this.props.bpSearchData({});
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.Record.supplierCode != this.props.Record.supplierCode && this.props.type == 'edit') {
            this.resetFds();
        }
    }
    
    render() {
        let formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        },
            mgrSign = true,
            mgrName = '';
        let { Record, dept_Name, deptMgr, deptMgrName,settleData, showComponentMsg, componentMsg, businessPartner, empList, curList, supplierLoading, subjectData, bpData, userInfo } = this.props;
        if(this.props.title=='新建供应商'){
            Record=this.param;
        }else{
            this.param.scmBp.bpCode=Record.scmBp?Record.scmBp.bpCode:"";
            this.param.supplierCode=Record.supplierCode;
            this.state.isDisabled=true;
        }
        let bpDetail;
        if(this.props.type==='add'){
            bpDetail={};
            bpDetail.scmBp = bpData || {};
            this.editable.receiveOrgCode = true;
            if (!userInfo.deptCode) { 
                userInfo.empCode = "";
            }
        }
        if(this.props.type==='edit'){
            bpDetail=Record||{};
            bpDetail.scmBp = Record.scmBp || {};
            this.editable.uscc = true;
            // if (Record.status) { 
            //     this.editable.name = true;
            // }
        }
        return (
            <div className='supplier-add'>
                <Spin spinning={supplierLoading}>
                    <div>
                        <Row className='supplier-addHead'>
                            <Col span={2} className='headTitle'>{this.props.title}</Col>
                            <Col span={20}></Col>
                            <Col span={2}>
                                <Button type='primary' onClick={(e)=>this.handleSubmit(e)} >保存</Button>
                            </Col>
                        </Row>
                    </div>
                    <div className='supplier-addCenter'>
                        <Form>
                            <Row className='centerTop'>
                                <Row>
                                    <Col span={22} className='centerTitle' >常规</Col>
                                </Row>
                                <Col span={7}>
                                    <FormItem
                                        label="统一社会信用代码"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('uscc', {
                                            initialValue: bpDetail.scmBp.uscc,
                                            rules: [{ type: "socialCredit", label: "请输入", required: true }],
                                        })(
                                            <Input placeholder="请输入统一社会信用代码" onBlur={this.getUscc} disabled={this.editable.uscc} />
                                            )}
                                    </FormItem>
                                    {this.props.type == "add" ? <FormItem
                                        label="供应商全称"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('bpFull', {
                                            initialValue: bpDetail.scmBp.bpFull || "",
                                            rules: [{ required: true, message: '供应商全称必填' },
                                            { max: 100, message: "输入字符长度不能超过100" }],
                                        })(
                                            bpDetail.status === 0 || this.props.type === 'add' ?
                                                <Input placeholder="请输入供应商全称" onChange={this.getCustomerFull} /> :
                                                <Input disabled />
                                            )}
                                    </FormItem> : <FormItem
                                        label="供应商全称"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('bpFull', {
                                            initialValue: bpDetail.bpFull || "",
                                            rules: [{ required: true, message: '供应商全称必填' },
                                            { max: 100, message: "输入字符长度不能超过100" }],
                                        })(
                                            this.props.type === 'add' ?
                                                <Input placeholder="请输入供应商全称" onChange={this.getCustomerFull} /> :
                                                <Input disabled />
                                            )}
                                    </FormItem>}
                                    <FormItem
                                            label="供应商类型"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('supplierType', {
                                                initialValue: this.props.type === 'add' ?1:bpDetail.supplierType,
                                                rules: [
                                                    { required: true,message: '供应商类型 为必填' },
                                                ],
                                            })(
                                                <Select onChange={this.supplierOnchange}>
                                                    {
                                                        window.ENUM.getEnum("AddSupplierType").map(type => {
                                                            return <Select.Option value={type.catCode} key={type.catCode}>{type.catName}</Select.Option>
                                                        })
                                                    }
                                                </Select>
                                                )}
                                        </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem
                                        label="供应商简码"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('briefCode', {
                                            initialValue: bpDetail.briefCode,
                                            rules: [
                                                {type:"numOrLetter"},
                                                { max:10,message: '长度不能超过10' }
                                            ],
                                        })(
                                            <Input />
                                            )}
                                    </FormItem>
                                {this.props.type == "add" ?
                                    <FormItem
                                        label="供应商简称"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('supplierAbt', {
                                            initialValue: bpDetail.scmBp.bpAbt,
                                            rules: [{ max: 50, message: "输入字符长度不能超过50" }],
                                        })(
                                            <Input />
                                            )}
                                    </FormItem> :
                                    <FormItem
                                        label="供应商简称"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('supplierAbt', {
                                            initialValue: bpDetail.supplierAbt,
                                            rules: [{ max: 100, message: "输入字符长度不能超过100" }],
                                        })(
                                            <Input />
                                            )}
                                    </FormItem>
                                }
                                    {/*<FormItem
                                        label="主语言"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('langCode', {
                                            //rules: [{ required: true, message: 'Please select your gender!' }],
                                            initialValue: bpDetail.scmBp.langCode ? bpDetail.scmBp.langCode : "ZH",
                                            onChange: this.handleSelectChange,
                                        })(
                                            <Select>
                                                {
                                                    window.ENUM.getEnum("language").map((language, index) => {
                                                        return <Select.Option key={language.catCode.toString()} >{language.catCode + `[${language.catName}]`}</Select.Option>
                                                    })
                                                }
                                            </Select>
                                            )}
                                    </FormItem>*/}
                                    <FormItem
                                        label="来源渠道"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('sourceChannel', {
                                            initialValue: bpDetail.sourceChannel,
                                        })(
                                            <Select>
                                                {
                                                    window.ENUM.getEnum("sourceChannel").map(channel => {
                                                        return <Select.Option value={channel.catCode} key={channel.catCode}>{channel.catName}</Select.Option>
                                                    })
                                                }
                                            </Select>
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem
                                            label="已入驻平台"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('isEnterPlatform', {
                                                initialValue: bpDetail.scmBp.isEnterPlatform,
                                            })(
                                                <Select disabled>
                                                    {
                                                        window.ENUM.getEnum("isEnterPlatform").map(isEnterPlatform => {
                                                            return <Select.Option value={isEnterPlatform.catCode} key={isEnterPlatform.catCode}>{isEnterPlatform.catName}</Select.Option>
                                                        })
                                                    }
                                                </Select>
                                       
                                                )}
                                    </FormItem>
                                    <FormItem
                                        label="备注"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('supplierDesc', {
                                            rules: [{ max: 200, message: "输入字符长度不能超过200" }],
                                            initialValue: Record.supplierDesc || null,
                                            onChange: this.handleSelectChange,
                                        })(
                                            <Input type='textarea' style={{ height: '90px', resize: 'none' }} >
                                            </Input>
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row className='centerBody'>
                                <Row>
                                    <Col span={22} className='centerTitle' >组织</Col>
                                </Row>
                                <Col span={7}>
                                    <FormItem
                                        label="所属组织"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('deptCode', {
                                            initialValue: Record.deptCode || userInfo.deptCode || "",
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: dept_Name,
                                                    keyName: "orgCode",
                                                },
                                            ],
                                            //onChange: this.handleSelectChange,
                                        })(
                                            <AutoSelectComp
                                                selectedList={dept_Name}
                                                keyName='orgCode'
                                                displayName={["orgCode", "orgName"]}
                                                onSelect={this.selectChange}
                                                onSearch={this.deptSelectSearch}
                                            />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem
                                        label="负责人"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('empCode', {
                                            initialValue: Record.empCode || userInfo.empCode || "",
                                            rules: [
                                                {
                                                    validator: (rule, value, callback) => {
                                                        let result = true;
                                                        if (this.getFdv("deptCode")) {
                                                            if (value && Array.isArray(empList)) {
                                                                result = empList.map(item => String(item.empCode)).includes(String(value));
                                                            }
                                                            if (!result) callback("请从下拉列表中选择一项！");
                                                            else callback();
                                                        } else {
                                                            if (this.getFdv("empCode")) {
                                                                callback("请选择组织机构");
                                                            } else callback();
                                                        }
                                                    }
                                                },
                                            ],
                                            //onChange: this.handleSelectChange,
                                        })(
                                            <AutoSelectComp
                                                key="select"
                                                selectedList={empList}
                                                onSelect={this.props.handleChange}
                                                onSearch={this.EmployeesSelectSearch}
                                                displayName={["empCode", "empName"]}
                                                keyName={"empCode"}
                                            />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    
                                </Col>
                            </Row>
                            <Row className='centerBody'>
                                <Row>
                                    <Col span={22} className='centerTitle' >商务</Col>
                                </Row>
                                <Col span={7}>
                                    <FormItem
                                        label="结算币别"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('currencyCode', {
                                            initialValue: Record.currencyCode || "",
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: curList,
                                                    keyName: "curCode",
                                                },
                                            ],
                                            //onChange: this.handleSelectChange,
                                        })(
                                            <AutoSelectComp
                                                key="select"
                                                selectedList={curList}
                                                onSelect={this.props.handleChange}
                                                onSearch={this.currencySelectSearch}
                                                displayName={["curCode", "curName"]}
                                                keyName={"curCode"}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem
                                        label="结算方式"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('settlementCode', {
                                            initialValue: Record.settlementCode || "",
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: settleData,
                                                    keyName: "settleCode",
                                                },
                                            ],
                                           
                                        })(
                                            <AutoSelectComp
                                                key="select"
                                                selectedList={settleData}
                                                onSearch={this.settleListSearch}
                                                displayName={["settleCode","settleName"]}
                                                keyName={"settleCode"}
                                            />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem
                                        label="发票类型"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('invoiceTypeCode', {
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: subjectData.C021,
                                                    keyName: "catCode",
                                                },
                                            ],
                                            initialValue: Record.invoiceTypeCode || "",
                                        })(
                                            <AutoSelectComp
                                                key="select"
                                                selectedList={subjectData.C021}
                                                onSelect={this.props.handleChange}
                                                onSearch={(val) => this.subjectSelectSearch(val, 'C021')}
                                                displayName={["catCode", "catName"]}
                                                keyName={"catCode"}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem
                                        label="付款条件"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('paymentCode', {
                                            initialValue: Record.paymentCode || "",
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: subjectData.C013,
                                                    keyName: "catCode",
                                                },
                                            ],
                                            //onChange: this.handleSelectChange,
                                        })(
                                            <AutoSelectComp
                                                key="select"
                                                selectedList={subjectData.C013}
                                                onSelect={this.props.handleChange}
                                                onSearch={(val) => this.subjectSelectSearch(val, 'C013')}
                                                displayName={["catCode", "catName"]}
                                                keyName={"catCode"}
                                            />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem
                                        label="收款方"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('receiveOrgCode', {
                                            initialValue: bpDetail.receiveOrgCode || (bpDetail.scmBp.bpFull || ""),
                                            rules: [
                                                this.props.type == "edit" ?
                                                    {
                                                        type: "autoselect",
                                                        message: "请从下拉列表中选择一项！",
                                                        list: businessPartner,
                                                        keyName: "bpCode",
                                                    } : {}
                                            ],
                                            //onChange: this.handleSelectChange,
                                        })(
                                            <AutoSelectComp
                                                key="select"
                                                selectedList={businessPartner}
                                                onSelect={this.props.handleChange}
                                                onSearch={this.receiveOrgSelectSearch}
                                                displayName={["bpCode", "bpFull"]}
                                                keyName={"bpCode"}
                                                disabled={this.editable.receiveOrgCode}
                                            />
                                            )}
                                    </FormItem>
                                </Col>
                                <a className="show-or-hide" href="#" onClick={() => {
                                    this.setState({ show: !this.state.show })
                                }}>{this.state.show ? '收起更多隐藏信息' : '展示更多隐藏信息'}</a>
                            </Row>
                            <div style={{ display: this.state.show ? `block` : `none` }}>
                                <Row className='centerBotton'>
                                    <Row>
                                        <Col span={15} className='centerTitle' >公司</Col>
                                        <Col span={8} className='centerTitle' ></Col>
                                    </Row>
                                    <Col span={7}>
                                        <FormItem
                                            label="法人代表"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('corporation', {
                                                rules: [{ max: 100, message: "输入字符长度不能超过100" }],
                                                initialValue: bpDetail.scmBp ? bpDetail.scmBp.corporation : null,
                                                onChange: this.handleSelectChange,
                                            })(
                                                this.state.isDisabled?<Input disabled/>:<Input />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="创立日期"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('creationDate', {
                                                initialValue: bpDetail.scmBp.creationDate ? moment(bpDetail.scmBp.creationDate, 'YYYY-MM-DD') : null,
                                                //rules: [{ required: true, message: 'Please input your note!' }],
                                            })(
                                                this.state.isDisabled?<DatePicker style={{ width: '100%' }} disabled/>:<DatePicker style={{ width: '100%' }}/>
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="行业"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('tradeType', {
                                                initialValue: bpDetail.scmBp.tradeType&&bpDetail.scmBp.tradeType.map(key=>key.tradeTypeCode)||[],
                                                
                                            })(
                                                this.state.isDisabled?
                                                <Select mode="multiple" style={{ width: '100%' }} disabled>
                                                    {
                                                        window.ENUM.getEnum("industry").map(industry => {
                                                        return <Select.Option
                                                            value={industry.catCode.toString()}
                                                            key={industry.catCode}>
                                                            {industry.catName}
                                                        </Select.Option>
                                                        })
                                                    }
                                                </Select>:
                                                <Select mode="multiple" style={{ width: '100%' }}>
                                                    {
                                                        window.ENUM.getEnum("industry").map(industry => {
                                                        return <Select.Option
                                                            value={industry.catCode.toString()}
                                                            key={industry.catCode}>
                                                            {industry.catName}
                                                        </Select.Option>
                                                        })
                                                    }
                                                </Select>
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="经营类型"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('businessTypeCode', {
                                                initialValue: bpDetail.scmBp.businessTypeCode || "",
                                                rules: [
                                                    {
                                                        type: "autoselect",
                                                        message: "请从下拉列表中选择一项！",
                                                        list: subjectData.C019,
                                                        keyName: "catCode",
                                                    },
                                                ],
                                                //onChange: this.handleSelectChange,
                                            })(
                                                <AutoSelectComp
                                                    key="select"
                                                    selectedList={subjectData.C019}
                                                    onSelect={this.props.handleChange}
                                                    onSearch={(val) => this.subjectSelectSearch(val, 'C019')}
                                                    displayName={["catCode", "catName"]}
                                                    keyName={"catCode"}
                                                    disabled={this.state.isDisabled ? true : false}
                                                />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={7}>
                                        <FormItem
                                            label="公司性质"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('companyTypeCode', {
                                                initialValue: bpDetail.scmBp.companyTypeCode || "",
                                                rules: [
                                                    {
                                                        type: "autoselect",
                                                        message: "请从下拉列表中选择一项！",
                                                        list: subjectData.C018,
                                                        keyName: "catCode",
                                                    },
                                                ],
                                                //onChange: this.handleSelectChange,
                                            })(
                                                <AutoSelectComp
                                                    key="select"
                                                    selectedList={subjectData.C018}
                                                    onSelect={this.props.handleChange}
                                                    onSearch={(val) => this.subjectSelectSearch(val, 'C018')}
                                                    displayName={["catCode", "catName"]}
                                                    keyName={"catCode"}
                                                    disabled={this.state.isDisabled ? true : false}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="公司规模"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('companyScaleCode', {
                                                initialValue: bpDetail.scmBp.companyScaleCode || "",
                                                rules: [
                                                    {
                                                        type: "autoselect",
                                                        message: "请从下拉列表中选择一项！",
                                                        list: subjectData.C016,
                                                        keyName: "catCode",
                                                    },
                                                ],
                                                //onChange: this.handleSelectChange,
                                            })(
                                                <AutoSelectComp
                                                    key="select"
                                                    selectedList={subjectData.C016}
                                                    onSelect={this.props.handleChange}
                                                    onSearch={(val) => this.subjectSelectSearch(val, 'C016')}
                                                    displayName={["catCode", "catName"]}
                                                    keyName={"catCode"}
                                                    disabled={this.state.isDisabled ? true : false}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="公司网址"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('website', {
                                                initialValue: bpDetail.scmBp.website,
                                                rules: [
                                                    { type: 'url', message: '请输入 正确的网址' },
                                                    { max: 50, message: '长度不能超过50' }
                                                ],
                                            })(
                                                this.state.isDisabled?<Input disabled/>:<Input />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="公司邮箱"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('email', {
                                                initialValue: bpDetail.scmBp.email,
                                                rules: [
                                                    { type: 'email', message: '请输入 正确的邮箱' },
                                                    { max: 50, message: '长度不能超过50' }
                                                ],
                                            })(
                                                this.state.isDisabled?<Input disabled/>:<Input />
                                                )}
                                        </FormItem>
                                        
                                    </Col>
                                    <Col span={7}>
                                        <FormItem
                                            label="公司电话"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('tel', {
                                                initialValue: bpDetail.scmBp.tel,
                                                rules: [
                                                    { max: 20, message: '长度不能超过20' }
                                                ],
                                            })(
                                                this.state.isDisabled?<Input disabled/>:<Input />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="公司传真"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('fax', {
                                                initialValue: bpDetail.scmBp.fax,
                                                rules: [
                                                    { max: 50, message: '长度不能超过50' }
                                                ],
                                            })(
                                                this.state.isDisabled?<Input disabled/>:<Input />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </div>
                </Spin>
            </div>
        )
    }
}

AddSupplierComp.defaultProps = {
    EditData: {
         supplierCode : "",
         supplierFull : "",
         supplierAbt : "",
         supplierDesc : "",
         deptCode : "",
         empCode : "",
         currencyCode : "",
         settlementCode : "",
         invoiceType : "",
         paymentCode : "",
         receiveOrgCode : "",
         sourceChannel:null,
         scmBp : {
             uscc : "",
             bpFull : "",
             bpAbt : "",
             businessTypeCode : "",
             corporation : "",
             creationDate : "",
             tradeType :[],
             companyTypeCode : "",
             companyScaleCode : "",
             website : "",
             email : "",
             tel : "",
             fax : "",
             langCode : "" 
        }
    },
    selectedList: [
        {
            id: 1,
            name: "AAAA",
        },
        {
            id: 2,
            name: "BBBB",
        },
        {
            id: 3,
            name: "CCCC",
        },
        {
            id: 4,
            name: "DDDD",
        },
    ]
}
AddSupplierComp.propTypes = {
    Record: PropTypes.object,
    selectedList: PropTypes.array,
}

export default Form.create()(AddSupplierComp);