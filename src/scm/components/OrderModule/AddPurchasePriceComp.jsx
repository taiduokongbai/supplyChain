import React, { Component, PropTypes } from "react";
import moment from "moment";
import { Form, Input, Spin, Button, message, Row, Col,Select, DatePicker, Checkbox, Modal,Upload,Icon  } from '../../../base/components/AntdComp';
import FormComp from '../../../base/components/FormComp';
import AutoSelectComp from '../../../base/components/AutoSelectComp'; 

import AddPurPriceDetailDialogCont from '../../dialogconts/OrderModule/AddPurPriceDetailDialogCont';
import AddPurPriceDetailForEditCont from '../../dialogconts/OrderModule/AddPurPriceDetailForEditCont';
import { disabledBeforeDate, disabledAfterDate, converByte } from '../../../base/consts/Utils';
import ImportViewCont from '../../dialogconts/OrderModule/ImportViewCont';
import { Urls } from '../../../base/consts/Urls';
import { jsonHead } from '../../../base/services/ReqApi';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const page = { 'page': 1, 'pageSize': 10 };


class AddPurchasePriceComp extends FormComp {
    constructor(props, context) {
        super(props, context);
        const addType = props.addType;
        this.state = {
            showform: true,
            showdetail: false,
            tax: 17,
            symbol: '￥',
            visible: false,
            importFile: {
                fileUrl: "",
            },
            fileList: (addType=='fromList'||props.type=='edit')?[]:this.setFileList(props[props.type].detail.fileList),
            beginUpDisabled: true,
            uploadDialogButton: "upload-dialog-button",
        };
        this.files = {
            name: 'file',
            action: Urls.COMMON_UPLOAD_FILE,//'http://10.99.2.70:9098/pub/common/uploadfile',//Urls.COMMON_UPLOAD_FILE,
            onChange: this.handleChange,
            onRemove: this.onRemove,
            beforeUpload: this.beforeUpload,
            showUploadList: { showPreviewIcon: false, showRemoveIcon: true },
            accept: ".xls,.xlsx,.pdf,.doc,.docx,.jpg,.png,.zip,.rar",
            headers: {
                authorization: 'authorization-text',
                tokenId: jsonHead.tokenId,
            },
            data: {
                module: "importexcle"
            }
        }
    }
    setFileList(fileList) {
        const mb = new RegExp('MB\\)$');
        const kb = new RegExp('KB\\)$');
        fileList.length > 0 && fileList.map((item, index) => {
            item.uid = index;
            item.name = item.name ? item.name : item.fileName;
            item.size = item.size ? item.size : item.fileSize;
            if (item.response) {
                // item.url = item.response.data.fileURL
            }
            if (!mb.test(item.name)||!kb.test(item.name)) {
                let a = item.fileSize;
                item.name += ' (' + converByte(Number(a)) + ')';
            }
            // item.url = item.url ? item.url : item.fileURL;
            return item;
        });
        return fileList
    }
    beforeUpload = (file, fileList) => {
        const isFile = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (isFile == '.exe' || isFile == '.bat') {
            message.error('选择的文件格式不正确!');
            return false;
        }
        if (this.state.fileList.length+fileList.length > 5) {
            message.error('最多上传五个！')
            return false;
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('上传的单个文件请不要超过10M')
            return isLt10M;
        }
    }
    onRemove = (file) => {
        let id = file.id ? file.id : file.response.data.id;
        let index = this.state.fileList.indexOf(file);
        let newFileList = [...this.state.fileList];
        newFileList.splice(index, 1);
        this.setState({
            fileList: newFileList
        })
    }
    handleChange = (info) => {
        if (info.file.status == "done") {
            let fileIds = info.file.response.data.id;
            this.setState({
                importFile: {
                    ...this.state.importFile,
                    fileUrl: info.file.response.data.fileURL,
                },
                beginUpDisabled: false,
                uploadDialogButton: "",
            })
        }
        if(info.fileList[info.fileList.length-1].status == 'done'){
            info.fileList.length > 0 ? info.fileList.map((item, index) => {
                const mb = new RegExp('MB\\)$');
                const kb = new RegExp('KB\\)$');
                if (!mb.test(item.name) || !kb.test(item.name)) {
                    let a;
                    if (item.size / 1024 >= 1024 && !mb.test(item.name)) {
                        a = Number(item.size / 1024.0 / 1024.0).toFixed(2);
                        item.name += ' (' + a + 'MB)';
                    } else if (item.size / 1024 < 1024 && !kb.test(item.name)) {
                        a = Number(item.size / 1024.0).toFixed(2);
                        item.name += ' (' + a + 'KB)';
                    }
                }else {
                }
            }) : '';
        }
        if (info.file.status) {
            let fileList = info.fileList;
            fileList = fileList.slice(-5);
            this.setState({ fileList });
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.type == 'edit') {
            if (nextProps.edit.current != this.props.edit.current) {
                this.resetFds();
            }
            if (nextProps.edit.detail != this.props.edit.detail) {
                this.setState({
                    symbol: nextProps.edit.detail.currencySymbol,
                    tax: nextProps.edit.detail.includeTaxFlag ? 17 : 0,
                    fileList: Object.keys(nextProps.edit.detail).length>0?this.setFileList(nextProps.edit.detail.fileList):[],
                })
            }
        }
        if (nextProps.type == 'add') {
            if (nextProps.add.detail != this.props.add.detail) {
                this.resetFds();
                this.setState({
                    fileList: []
                })
            }
            if (nextProps.addType == 'fromView') {
                if (this.props.add.detail != nextProps.add.detail) {
                    this.setState({
                        fileList: this.setFileList(nextProps.add.detail.fileList),
                    })
                }    
            }
            if (nextProps.add.curList != this.props.add.curList) {
                if (nextProps.add.detail.currencyCode == "") {
                    let curList = nextProps.add.curList;
                    curList = curList.filter(item => item.curName == 'RMB');
                    curList.length>0&&this.setFdv({currencyCode:curList[0].curCode})
                }
                if (nextProps.add.detail.currencySymbol) {
                    this.setState({symbol: nextProps.add.detail.currencySymbol})
                } else {
                    this.setState({symbol: '￥'})
                }
            }
        }
    }
    //保存
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.props.loading) {
            this.validateFds((err, data) => {
                data.startTime = moment(data.startTime).format('YYYY-MM-DD');
                data.endTime = moment(data.endTime).format('YYYY-MM-DD');
                if (data.includeTaxFlag.length > 0) {
                    data.includeTaxFlag = 1;
                } else {
                    data.includeTaxFlag = 0;
                }
                data.taxRate = 17;
                let ids = [];
                let fileList = [];
                Array.isArray(this.state.fileList) && this.state.fileList.map(item => {
                    if (item.status == 'done'||item.fileURL) {
                        fileList.push(item)
                    }
                })
                if (fileList && fileList.length>0) {
                    fileList.map((item, index) => {
                        item.response ? ids.push(item.response.data.id) : ids.push(item.id)
                    })
                }
                data.fileIds = ids.join(',');
                data.orderStatus = this.props[this.props.type].detail.orderStatus;
                if (data.list.length === 0) {
                    message.warn('明细项不能为空');
                    return
                }
                if (!err) {
                    this.props.PurchasePriceCheckStatus(data.supplierCode).then(json => {
                        if (json.status === 2000) {
                            this.props.onOk && this.props.onOk(data);
                        } else if (json.status === 6000) {
                            this.setState({visible:true})
                        } else {
                            message.error(json.message[0].msg);
                        }
                    })
                    
                }
            });
        }
    }
    //弹窗确认
    submitOk = () => {
        this.setState({ visible: false });
        if (!this.props.loading) {
            this.validateFds((err, data) => {
                data.startTime = moment(data.startTime).format('YYYY-MM-DD');
                data.endTime = moment(data.endTime).format('YYYY-MM-DD');
                if (data.includeTaxFlag.length > 0) {
                    data.includeTaxFlag = 1;
                } else {
                    data.includeTaxFlag = 0;
                }
                data.taxRate = 17;
                let ids = [];
                let fileList = [];
                Array.isArray(this.state.fileList) && this.state.fileList.map(item => {
                    if (item.status == 'done'||item.fileURL) {
                        fileList.push(item)
                    }
                })
                if (fileList && fileList.length>0) {
                    fileList.map((item, index) => {
                        item.response ? ids.push(item.response.data.id) : ids.push(item.id)
                    })
                }
                data.fileIds = ids.join(',');
                data.orderStatus = this.props[this.props.type].detail.orderStatus;
                this.props.onOk && this.props.onOk(data);
            })
        }   
    }
    //供应商下拉
    supplierSelect = (value) => {
        this.setFdv({
            supplierName: value.supplierFull
        });
    }
    importCallback = (data) => {
        let list = this.getFdv('list');
        list = data.list.concat(list);
        this.setFdv({
            list:list
        });
    }
    //供应商搜索
    supplierSearch = (val) => {
        this.setFdv({
            supplierName: ''
        });
        return this.props.SupplierList({ supplierCode: val, supplierFull: val, status:1, ...page });
    }

    //币种选择
    curSelect = (val) => {
        this.props.CurDetail(val).then(json => {
            if (json.status === 2000) {
                this.setState({ symbol: json.data.list[0].symbol }, () => {
                    let list = this.getFdv('list');
                    list.length > 0 && list.map(item => {
                        item.currencySymbol = this.state.symbol;
                        return item;
                    })
                    this.setFdv({list})
                })
            }
        })
    }
    
    //是否含锐
    handleChangeTax = (val) => {
        let list = this.getFdv("list");
        let tax = 0, totalAmount=0, batchPrice=0;
        if (val.length>0) {
            tax = 17;
        };
        // list.map(item => {
        //     item.taxRate = tax;
        //     item.totalAmount = (item.batchPrice * (1+tax/ 100)).toFixed(2);
        //     // item.batchPrice = (item.totalAmount / (1+tax/ 100)).toFixed(2);
        //     return item
        // });
        this.setState({ tax });
        // this.setFdv({ list })
    }
    //添加物料弹框
    handleSubmitDialog = (data) => {
        let list = this.getFdv('list');
        list.splice(0, 0, data);
        this.setFdv({
            list
        })
    }
    
    render() {
        let formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 13 },
        };
        let isTaxOptions = [
            { label: '是  （默认17%）', value: 'includeTaxFlag' },
        ];
        //cont中传过来的act方法
        let { SupplierList, MeasureList } = this.props;
        //redux数据
        let { loading, detail, supplierList, curList, addPurPriceDetail_visible, editPurPriceDetail_visible, list } = this.props[this.props.type];
        let DetailTableComp = this.props.DetailTableComp;
        let { fileList } = this.state;
        return (
            <div className='addPurchasePrice-cont'>
                <Spin spinning={loading}>
                        <div className='addPurchasePrice-title'>
                            <Row style={{ height: '80px', lineHeight: '80px', border: '1px solid #e2e2e2' }}>
                                <Col span={3} style={{ paddingLeft: '20px', fontSize: '14px', fontWeight: 'bold' }} >{this.props.type=='add'?'新建采购价格清单':'编辑采购价格清单'}</Col>
                                <Col span={19}></Col>
                                <Col span={2} style={{textAlign:'right',paddingRight:'20px'}}>
                                    <Button type='primary' onClick={this.handleSubmit} className="saveBtn"><i className="c2mfont c2m-baocun"></i>保存</Button>
                                </Col>
                            </Row>
                            <a className='form-showOrhide' onClick={() => { this.setState({ showform: !this.state.showform }) } }>
                                {this.state.showform?'收起':'展开'}
                            </a>
                        </div>
                        
                    <Form>
                    <div style={{ display: this.state.showform ? `block` : `none` }}>    
                        <div className='addPurchasePrice-form' >
                            <Row type='flex'>
                                <Col span={8}>
                                        <div className='priceItemTitle' style={{paddingLeft:20}}>基本信息</div>        
                                    <FormItem label="价格清单名称" {...formItemLayout}>
                                        {this.getFD('priceName', {
                                            initialValue: detail.priceName || '',
                                            rules: [
                                                {type: 'numOrCnEn' },
                                                { max: 50, message: '价格清单名称不能超过50字符！'},
                                                { required: true, message: '价格清单名称 必填！' }
                                            ],
                                        })(
                                            <Input />
                                            )}
                                    </FormItem>
                                    <FormItem label="生效日期" {...formItemLayout}>
                                        {this.getFD('startTime', {
                                            initialValue: detail.startTime ? moment(detail.startTime, 'YYYY-MM-DD') : null,
                                            rules: [{ type: 'object', required: true, message: '生效日期 必填！' }],
                                        })(
                                            <DatePicker style={{ width: '100%' }}                                            
                                                disabledDate={(c) => disabledBeforeDate(c, moment())} 
                                                onChange={(date, dateString) => { 
                                                let endTime = this.getFdv('endTime');
                                                    if (endTime && date && date.valueOf() > endTime.valueOf()) {
                                                        this.setFdv({endTime:null})
                                                    }
                                                }}
                                            />
                                            )}
                                    </FormItem>
                                     <FormItem label="失效日期" {...formItemLayout}>
                                        {this.getFD('endTime', {
                                            initialValue: detail.endTime ? moment(detail.endTime, 'YYYY-MM-DD') : null,
                                            rules: [{ type: 'object', required: true, message: '失效日期 必填！' }],
                                        })(
                                            <DatePicker style={{ width: '100%' }}                                            
                                                disabledDate={(c) => {
                                                let compareDate = this.getFdv('startTime')&&this.getFdv('startTime').format('YYYY-MM-DD');
                                                let d= moment(compareDate,'YYYY-MM-DD').add(1, 'day');
                                                return disabledBeforeDate(c,d,true)
                                                } }
                                            />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={8} style={{borderRight:'1px solid #e2e2e2',borderLeft:'1px solid #e2e2e2'}}>
                                    <div className='priceItemTitle' style={{paddingLeft:'25px'}}>供应商信息</div>
                                    <FormItem label="供应商编码" {...formItemLayout}>
                                        {this.getFD('supplierCode', {
                                            initialValue: detail.supplierCode || '',
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: supplierList,
                                                    keyName: "supplierCode",
                                                },
                                                { required: true, message: '供应商 必填！' }
                                            ],
                                        })(
                                            <AutoSelectComp
                                                selectedList={supplierList}
                                                onSelect={this.supplierSelect}
                                                onSearch={this.supplierSearch}
                                                displayName={["supplierCode", "supplierFull"]}
                                                keyName={"supplierCode"}
                                                optionLabelProp={`value`}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="供应商名称" {...formItemLayout}>
                                        {this.getFD('supplierName', {
                                            initialValue: detail.supplierName||'',
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                    <div style={{height:'50px'}}></div>    
                                </Col>
                                <Col span={8}>
                                    <div className='priceItemTitle' style={{paddingLeft:'30px'}}>其他信息</div>       
                                    <FormItem label="币种" {...formItemLayout}>
                                        {this.getFD('currencyCode', {
                                            initialValue: detail.currencyCode || '',
                                            rules: [                               
                                                { required: true, message: '币种 必填！' }
                                            ],
                                        })(
                                                <Select notFoundContent={""} onSelect={this.curSelect} disabled>
                                                {
                                                    Array.isArray(curList) ?
                                                        curList.map(item => {
                                                            return <Select.Option value={item.curCode} key={item.curCode}>{item.curName}</Select.Option>
                                                        }) : null
                                                }
                                            </Select>
                                            )}
                                    </FormItem>
                                    <FormItem label="含税" {...formItemLayout}>
                                        {this.getFD('includeTaxFlag', {
                                            initialValue: detail.isTaxValue,
                                            onChange:this.handleChangeTax    
                                        })(
                                            <CheckboxGroup options={isTaxOptions} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <a className='detail-showOrhide' onClick={() => { this.setState({ showdetail: !this.state.showdetail }) } }>
                                {this.state.showdetail?'收起更多隐藏信息':'显示更多隐藏信息'}
                            </a>
                        </div>
                        <div style={{display:this.state.showdetail?`block`:`none`}} className='addPurchasePrice-remark'>
                            <Row type='flex'>
                                <Col span={16}>        
                                    <FormItem label='合同附件' labelCol={{ span: 3 }} wrapperCol={{ span: 13 }}className='announce-file-upload'>
                                    {this.getFD('fileIds', {
                                        initialValue: '',
                                    })(
                                        <Upload {...this.files} fileList={fileList}>
                                            <Button type="upload" className="upload-through"><Icon type="upload" />上传合同附件</Button>
                                            <div className='corning' >支持PDF、word、excel、JPG、PNG、RAR、ZIP等压缩格式文件，最多上传5个，多个文件建议打包上传。</div>
                                        </Upload>
                                        )}
                                    </FormItem>    
                                </Col>            
                                <Col span={8}>
                                    <FormItem label="备注" labelCol={{ span: 6 }} wrapperCol={{ span: 13 }}>
                                        {this.getFD('remark', {
                                            initialValue: detail.remark || '',
                                            rules:[{max:200, message:'备注不能超过200字符！'}]
                                        })(
                                            <Input type='textarea' style={{ height: '60px' }} >
                                            </Input>
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                        </div>
                        <div style={{ marginTop:'20px'}}>
                            <Row>
                                <Col span={2} className='priceItemTitle' style={{lineHeight:'30px'}}>明细信息</Col>
                                <Col span={22} style={{ textAlign: 'right',lineHeight:'30px' }}>  
                                    <a href='#' onClick={() => this.props.PurPriceDialogVisiable(this.props.type, 'addPurPriceDetail_visible')}><i className='c2mfont c2m-tianjia' style={{ paddingRight: '5px' }} />添加行</a>
                                    <a href='#' onClick={()=>this.props.ImportViewVisiable()}><i className='c2mfont c2m-daoru_nor' style={{ paddingRight: '2px',marginLeft:'20px'}}/>导入</a>
                                </Col>
                            </Row>
                            <FormItem wrapperCol={{ span: 24 }}>
                               {this.getFD('list', {
                                    initialValue: detail.list||[],
                                })(
                                    <DetailTableComp
                                        type={this.props.type} 
                                        PurPriceDialogVisiable={this.props.PurPriceDialogVisiable}
                                        symbol={this.state.symbol}
                                        MaterialAllUnit={this.props.MaterialAllUnit}
                                        measureAll={this.props.measureAll}
                                        taxRate={this.state.tax}
                                        editPurPriceDetail_visible={editPurPriceDetail_visible}
                                    />
                                    )}
                            </FormItem>
                        </div>
                    </Form>
                </Spin>
                {
                    addPurPriceDetail_visible&&this.props.type=='add'?
                        <AddPurPriceDetailDialogCont
                            symbol={this.state.symbol}
                            taxRate={this.state.tax}
                            list={this.getFdv('list')}
                            handleSubmit={this.handleSubmitDialog}
                            MaterialAllUnit={this.props.MaterialAllUnit}
                            measureAll={this.props.measureAll}
                        /> : null
                }
                
                {
                    addPurPriceDetail_visible&&this.props.type=='edit'?
                        <AddPurPriceDetailForEditCont
                            symbol={this.state.symbol}
                            taxRate={this.state.tax}
                            list={this.getFdv('list')}
                            handleSubmit={this.handleSubmitDialog}
                            MaterialAllUnit={this.props.MaterialAllUnit}
                            measureAll={this.props.measureAll}
                        />: null
                }
                {this.state.visible?<Modal
                    title=""
                    visible={this.state.visible}
                    onOk={this.submitOk}
                    onCancel={() => { this.setState({visible:false}) } }
                >
                当前供应商存在已生效的价格清单，当前价格清单提交审批后会替代原价格清单
                </Modal>:null}
                <ImportViewCont importCallback={this.importCallback}/>
            </div>
        )
    }

}
export default Form.create()(AddPurchasePriceComp);

