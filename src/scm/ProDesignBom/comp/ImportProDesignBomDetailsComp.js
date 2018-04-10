import { Button,Form, Select,Row,Col, Input, Popconfirm, Spin , Dropdown,Menu,Icon, Modal,message} from 'antd';
import React, { Component } from 'react';
import FormComp from '../../../base/mobxComps/FormComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import { formatNullStr } from "../../../base/consts/Utils";
import {editProDesignBomTableStore,addProDesignBomStore,designTypeStore,importAddTypeStore,productCategoryStore} from "../store/AddProDesignBomStore";
import UploadProDesignBomComp from './UploadProDesignBomComp';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import DetailsEditTableComp from './DetailsEditTableComp';
import { productTableStore } from '../store/ProDesignBomStore';
import { proDesignBomDetailsInfoStore, deignTypeDetailsStore, importTypeDetailsStore, detailsEditTable} from '../store/ProDesignBomDetailsStore';
import { measurestore} from '../store/EditProDesignStore';
let { observable, action, computed, runInAction, toJS } = mobx,
    { observer } = mobxReact,
    FormItem = Form.Item,
    formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 18},
    },
    editFormItemLayout = {
        labelCol: {span: 4},
        wrapperCol: {span: 20},
    };

@observer
class ImportProDesignBomDetails extends FormComp {
    constructor(props, context) {
        super(props, context);
        this.state={
            show:false,
            isMergeModal:false,
            isMerge:false,
        };
    };

    componentWillReceiveProps(nextProps){
        if(this.props.tag.Ids) {
            if (nextProps.tag.Ids.bomTypeId !== this.props.tag.Ids.bomTypeId
                || nextProps.tag.Ids.productId !== this.props.tag.Ids.productId
                || nextProps.tag.Ids.bomLogIds !== this.props.tag.Ids.bomLogIds) {
                Object.assign(proDesignBomDetailsInfoStore.Ids, this.props.tag.Ids);
            }
        }
    };

    componentDidMount (){
        if(this.props.tag.Ids){
            Object.assign(proDesignBomDetailsInfoStore.Ids,this.props.tag.Ids);
        }
    };

    onMouseOver = () => {
        this.setState({show:true})
    };

    onMouseOut = () => {
        this.setState({show:false})
    };

    uploadModal = () => {
        detailsEditTable.detailOrProduct=false;
        addProDesignBomStore.addVisible = true;
        let {init,getBomPictureList}=proDesignBomDetailsInfoStore;
        getBomPictureList({productCode:init.productCode}).then(json=>{
            if(json.status===2000){
                proDesignBomDetailsInfoStore.fileList=json.data.list;
            }
        })
    };

    search = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['designTypeCode', 'importTypeCode'], (err, values) => {
            //区分详情、编辑、新建的编辑表格的查询参数，1代表新建，2代表编辑，3代表详情
            detailsEditTable.fetchTableList(Object.assign({productId:proDesignBomDetailsInfoStore.init.id},values),3)
        })
    };

    editProDesignBom=()=>{
        //addProDesignBomStore.stdUnitStore.fetchSelectList({status:1});
        designTypeStore.fetchDesignType({subCode: ["C022"]});//设计类型
        productCategoryStore.fetchCombBoxList({orderStatus:1});//导入类型--产品分类
        importAddTypeStore.fetchSelectList({orderStatus:1});//导入类型一级
        
       
        addProDesignBomStore.getBomDetail({id:proDesignBomDetailsInfoStore.init.id}).then(json=>{
            if(json.status===2000){
                measurestore.initData();
                store.dispatch(TabsAct.TabRemove("importProDesignBomDetails", "editProDesignBom"));
                store.dispatch(TabsAct.TabAdd({
                    title: "编辑产品设计BOM",
                    key: "editProDesignBom"
                }));
            }else if(json.status===6001){
                store.dispatch(TabsAct.TabRemove("importProDesignBomDetails", "proDesignBom"));
                store.dispatch(TabsAct.TabAdd({
                    title: "产品设计BOM",
                    key: "proDesignBom"
                }));
            }
        });
        editProDesignBomTableStore.fetchTableList({productId:proDesignBomDetailsInfoStore.init.id,
            designTypeCode: '',
            importTypeCode: '',});

        //addProDesignBomStore.fetchMaterial();

    };

    ableProDesignBom = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['productCode'],(err, values) => {
            if(!err){
                values.isMerge=this.state.isMerge;
                let pm = {}, bm = {};
                if(this.props.tag.Ids){
                     Object.assign(pm,
                        proDesignBomDetailsInfoStore.init,
                        proDesignBomDetailsInfoStore.Ids,
                        {productId:proDesignBomDetailsInfoStore.init.id},
                        values.productCode?values:'');
                    Object.assign(bm,proDesignBomDetailsInfoStore.Ids,{productId:proDesignBomDetailsInfoStore.init.id},
                        {designTypeCode:'', importTypeCode:''});
                } else {
                    Object.assign(pm,
                        proDesignBomDetailsInfoStore.init,
                        values.productCode?values:'');
                    Object.assign(bm,{designTypeCode:'', importTypeCode:''});
                }
                proDesignBomDetailsInfoStore.enableProDesignBom(pm)
                    .then(json => {
                        if (json.status === 2000) {
                            if(json.data.returnFlag === 0) {
                                //完全成功
                                runInAction(() => {
                                    proDesignBomDetailsInfoStore.displayProCode = false;
                                });
                                store.dispatch(TabsAct.TabRemove("importProDesignBomDetails", "proDesignBom"));
                                store.dispatch(TabsAct.TabAdd({
                                    title: "产品设计BOM",
                                    key: "proDesignBom"
                                }));
                                productTableStore.fetchTableList();
                                message.success('启用成功');
                            } else if(json.data.returnFlag === 1 || json.data.returnFlag === 2) {
                                //弹大弹窗
                                proDesignBomDetailsInfoStore.compareErrorMessage = json.data.compareErrorMessage;
                                this.setState({isMergeModal: true});
                                let startJson = json;
                                runInAction(() => {
                                    proDesignBomDetailsInfoStore.returnFlag = json.data.returnFlag;
                                    detailsEditTable.displayBtn = true;
                                    proDesignBomDetailsInfoStore.errorPage = true;
                                });
                                detailsEditTable.fetchTableList(bm);
                                    // .then((json) => {
                                    // if (json.status === 2000){
                                    //     runInAction(() => {
                                    //         detailsEditTable.displayBtn = true;
                                    //         proDesignBomDetailsInfoStore.returnFlag = startJson.data.returnFlag;
                                    //         proDesignBomDetailsInfoStore.displayProCode = startJson.data.returnFlag == 1 ? true : false;
                                    //     });
                                    // }
                                    // });
                                // if(json.data.list){
                                //     runInAction(() => {
                                //         detailsEditTable.dataSource=json.data.list;
                                //         detailsEditTable.displayBtn = true;
                                //         proDesignBomDetailsInfoStore.returnFlag = json.data.returnFlag;
                                //         proDesignBomDetailsInfoStore.displayProCode =  json.data.returnFlag == 1 ? true : false;
                                //     });
                                // }
                                proDesignBomDetailsInfoStore.detailsLoading = false;
                                // } else if(json.data.list){
                                //物料表有冲突
                            } else if(json.data.returnFlag === 3){
                                let startJson = json;
                                runInAction(() => {
                                    proDesignBomDetailsInfoStore.returnFlag = json.data.returnFlag;
                                    detailsEditTable.displayBtn = true;
                                    proDesignBomDetailsInfoStore.errorPage = true;
                                });
                                detailsEditTable.fetchTableList(bm);
                                    // .then((json) => {
                                    //     if (json.status === 2000) {
                                    //         runInAction(() => {
                                    //             console.log('1---' + detailsEditTable.displayBtn);
                                    //             detailsEditTable.displayBtn = true;
                                    //             console.log('2---' + detailsEditTable.displayBtn);
                                    //             proDesignBomDetailsInfoStore.returnFlag = startJson.data.returnFlag;
                                    //             proDesignBomDetailsInfoStore.displayProCode = startJson.data.returnFlag == 1 ? true : false;
                                    //             proDesignBomDetailsInfoStore.detailsLoading = false;
                                    //             console.log('3---' + detailsEditTable.displayBtn);
                                    //         });
                                    //     }
                                    // });
                                // runInAction(() => {
                                //     detailsEditTable.dataSource=json.data.list;
                                //     detailsEditTable.displayBtn = true;
                                //     proDesignBomDetailsInfoStore.returnFlag = json.data.returnFlag;
                                //     proDesignBomDetailsInfoStore.displayProCode =  json.data.returnFlag == 1 ? true : false;
                                //     proDesignBomDetailsInfoStore.detailsLoading = false;
                                // });
                            }
                        } else {
                            detailsEditTable.fetchTableList(bm);
                            runInAction(() => {
                                proDesignBomDetailsInfoStore.detailsLoading = false;
                            });
                        }
                    });
            }
        })
    };

    render() {
        let { init, detailsLoading, ableProDesignBom, displayProCode, compareErrorMessage, returnFlag } = proDesignBomDetailsInfoStore;
        return (
            <div className="import-bom-details">
                <Spin spinning={detailsLoading}>
                    {/*header*/}
                    <div className="top">
                        <div className="left">产品设计BOM详情</div>
                        <div className="right">
                            {
                                init.status == 0 ?
                                <Button className="edit" onClick={this.editProDesignBom}><i className="c2mfont c2m-bianji1"></i>编辑</Button>
                                    :
                                    null
                            }
                            <Dropdown overlay={
                                <Menu className="pro-design-bom-details">
                                    <Menu.Item key="1">
                                        <Popconfirm title={init.status == 1 ? "确定要禁用吗？" : "是确定要启用吗？"}
                                                    onConfirm={init.status == 1? () => ableProDesignBom(init.id,2) : this.ableProDesignBom}
                                        >{
                                            init.status == 1 ?
                                                <Button className="btn">禁用</Button>
                                                :
                                                <Button className="btn">启用</Button>
                                        }
                                        </Popconfirm>
                                    </Menu.Item>
                                    {/*<Menu.Item key="2">*/}
                                            {/*<Button className="btn"><a href="#">导出</a></Button>*/}
                                    {/*</Menu.Item>*/}
                                </Menu>
                            }>
                                <Button className="more">
                                    更多操作<Icon type="down" />
                                </Button>
                            </Dropdown>
                        </div>
                    </div>
                    {/*product infomation*/}
                    <div className="product-info">
                        <div className="title">
                            <div className="left">
                                产品信息
                            </div>
                            {
                                init.status == 0? '':
                                    <div className="right" onMouseOver={() => { this.onMouseOver() }} onMouseOut={() => { this.onMouseOut() }}>
                                        <a href="javascript:;">已上传图纸<span className="number"> {formatNullStr(init.totalNumberOfFiles)} </span>张</a>
                                        <div onClick={this.uploadModal} style={{width:91,height:24,border:'1px solid #E2E2E2',background:"#fff",zIndex:'2',textAlign:'center',lineHeight:'24px',position:'absolute',top:'25px',right:'0px',cursor:'pointer', display:this.state.show?"block":"none"}}>查看产品图片</div>
                                    </div>
                            }
                        </div>
                        <Row className="content" id="content">
                            <Col span={8}>
                                <div className="per-row">
                                    {
                                        // displayProCode ?
                                        returnFlag == 1 ?
                                            <Form>
                                                <FormItem className="edit-name" {...editFormItemLayout}
                                                          label="产品编码">
                                                    {this.getFD('productCode',{
                                                        initialValue: init.productCode,
                                                        rules:[
                                                                {required: true,message:'产品编码必填'},
                                                                {max: 20,message: '产品编码不能超过20字符'},
                                                                {type:'numLetterList',label:'产品编码'}
                                                            ]
                                                        }
                                                    )(
                                                        <Input className="width" style={{'borderColor':returnFlag == 1?'#F04134':''}} />
                                                    )
                                                    }
                                                </FormItem>
                                            </Form>
                                            :
                                            <span><span className="name">产品编码：</span>{formatNullStr(init.productCode)}</span>
                                    }
                                </div>
                                <div className="per-row">
                                    <span className="name">规格：</span>
                                    <div className="details"><TooltipComp attr={{text:formatNullStr(init.productSpec), wid: 186}}/></div>
                                </div>
                                <div className="per-row">
                                    <span className="name">材料：</span>
                                    <div className="details"><TooltipComp attr={{text:formatNullStr(init.productTexture), wid: 186}}/></div>
                                </div>
                                <div className="per-row" >
                                    <span className="name">品牌：</span>
                                    <div className="details"><TooltipComp attr={{text:formatNullStr(init.productBrand), wid: 186}}/></div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="per-row">
                                    <span className="name">产品名称：</span>
                                    <div className="details"><TooltipComp attr={{text:formatNullStr(init.productName), wid: 186}}/></div>
                                </div>
                                <div className="per-row">
                                    <span className="name">型号：</span>
                                    <div className="details"><TooltipComp attr={{text:formatNullStr(init.productModel), wid: 186}}/></div>
                                </div>
                                <div className="per-row">
                                    <span className="name">代号：</span>
                                    <div className="details"><TooltipComp attr={{text:formatNullStr(init.gbCode), wid: 186}}/></div>
                                </div>
                                <div className="per-row">
                                    <span className="name">标准数量：</span>{formatNullStr(init.stdQty)}
                                    <div className="details"><TooltipComp attr={{text:formatNullStr(init.stdUnitName), wid: 186}}/></div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="per-row">
                                    <span className="name">产品分类：</span>
                                    <div className="details"><TooltipComp attr={{text:formatNullStr(init.productCategoryName), wid: 186}}/></div>
                                </div>
                                <div className="per-row">
                                    <span className="name">来源单号：</span>
                                    <div className="details"><TooltipComp attr={{text:formatNullStr(init.sourceCode), wid: 186}}/></div>
                                </div>
                                <div className="per-row">
                                    <span className="name name-description">产品描述：</span>
                                    <div className="details details-description" ><TooltipComp attr={{text:formatNullStr(init.remarks), wid: 186}}/></div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    {/*table*/}
                    <div className="table">
                        <div className="table-title">
                            <div className="intro">物料明细</div>
                            <div>
                                <Form>
                                    <FormItem className="form-item" {...formItemLayout}
                                              label="设计类型">
                                        {this.getFD('designTypeCode',{
                                                initialValue: deignTypeDetailsStore.designLabel
                                            }
                                        )(
                                            <Select className="width">
                                                {deignTypeDetailsStore.options}
                                            </Select>
                                        )
                                        }
                                    </FormItem>
                                    <FormItem className="form-item" {...formItemLayout}
                                              label="导入类型">
                                        {this.getFD('importTypeCode',{
                                                initialValue: importTypeDetailsStore.importLabel,
                                            }
                                        )(
                                            <Select className="width">
                                                {importTypeDetailsStore.options}
                                            </Select>
                                        )
                                        }
                                    </FormItem>
                                    <FormItem className="form-item">
                                        <Button className="btn" onClick={this.search}><i className="c2mfont c2m-search1"></i>查询</Button>
                                    </FormItem>
                                </Form>
                            </div>
                            {/*<Table {...proDesignBomDetailsTableStore.Props}*/}
                                   {/*rowKey='id'*/}
                                   {/*scroll={{ x: 1680 }}*/}
                                   {/*columns={this.columns}*/}
                            {/*/>*/}
                            <UploadProDesignBomComp visible={addProDesignBomStore.addVisible}/>
                            <Modal title="提示" visible={this.state.isMergeModal}
                                   onCancel={() => this.setState({ isMerge: false, isMergeModal:false })}
                                   footer={[
                                       <Button key="submit" type="primary" size="large"
                                               onClick={()=>this.setState({ isMerge: true,isMergeModal:false })}>
                                           确定
                                       </Button>,
                                       <Button key="cancel" type="primary" size="large"
                                               onClick={() => this.setState({ isMerge: false, isMergeModal:false })}>
                                           取消
                                       </Button>,
                                   ]}>
                                <p>{compareErrorMessage}</p>
                            </Modal>
                        </div>
                        <DetailsEditTableComp/>
                    </div>
                </Spin>
            </div>
        )
    }
}


let ImportProDesignBomDetailsComp = Form.create()(ImportProDesignBomDetails);

export default ImportProDesignBomDetailsComp

