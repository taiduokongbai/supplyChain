import React, { Component, PropTypes } from "react";
import { Form, Input, Spin, Button, Modal, Row, Col, message, Select, AutoComplete } from '../../../base/components/AntdComp';
import FormModalComp from '../../../base/mobxComps/FormModalComp';
import TooltipComp from "../../../base/mobxComps/TooltipComp";
import { formatNullStr } from '../../../base/consts/Utils';

const FormItem = Form.Item;
let { observer } = mobxReact;
import { addSupGoodsStore, supplierStore, materialStore } from '../stores/AddSupGoodsStore';
import { measureStore } from '../../data/DropDownStore';
import { supGoodsListStore } from '../stores/SupGoodsStore';
import { debounce } from '../../../base/consts/Utils';

@observer
class AddSupGoodsComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        this.store = addSupGoodsStore;
        this.supplierStore = supplierStore;
        this.materialStore = materialStore;
        this.listStore = supGoodsListStore;
        this.onSupplierSearch = debounce(this.onSupplierSearch, 500);
        this.onMaterialSearch = debounce(this.onMaterialSearch, 500);
    }
    
    handleCancel = () => {
        if (!this.store.loading) {
            this.store.setVisible(false);
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.store.loading) {
            this.validateFds((err, data) => {
                if (!err) {
                    data = Object.assign({}, this.store.detail, data);
                    data.materialQty = Number(data.materialQty);
                    data.goodsQty = Number(data.goodsQty);
                    data.convertFactor = Number(data.convertFactor);
                    if (!data.id) {
                        delete data.id;
                    };
                    this.store.fetchSubmit(data).then(json => {
                        if (json.status == 2000) {
                            this.onMessage();
                            this.handleCancel();
                            this.listStore.fetchTableList();
                        }
                        return json;
                    });
                }
            });
        }
    }
    onMessage = () => {
        message.success("新增成功！")
    }
    componentWillReact() {
        if (this.store.loading) {
            this.resetFds();
        }
    }
    //供应商下拉
    onSupplierSelect = (value, option) => {
        let {
            supplierFull,
        } = option.props.data;
        this.setFdv({
            supplierFull,
        });
    }

    //供应商搜索
    onSupplierSearch = (value) => {
        this.setFdv({
            supplierFull: "",
        });
        this.supplierStore.fetchSelectList(value);
    }
    //物料下拉
    onMaterialSelect = (value, option) => {
        let {
            materialName,
            model,
            materialSpec,
            measureUnit,
            // materialTexture,
            // brand,
            // materialCodeName,
        } = option.props.data;
        this.setFdv({
            materialName,
            materialModel: model,
            materialSpec,
            materialUnitCode: measureUnit,
            // materialTexture,
            // brand,
            // materialCodeName,
        });
    }

    //物料搜索
    onMaterialSearch = (value) => {
        this.setFdv({
            materialName: "",
            materialModel: "",
            materialSpec: "",
            materialUnitCode: "",
            materialTexture: "",
            // brand: "",
            // materialCodeName: "",
        });
        this.materialStore.fetchSelectList(value);
    }
    getConvertInfo = () => {
        let {
            convertFactor,
            materialQty,
            materialUnitCode,
            materialCode,
            materialName,
            goodsQty,
            goodsUnitName,
            goodsCode,
            goodsName
        } = this.store.detail;

        return (
            <div>
                <div>转换因子：{convertFactor}</div>
                {
                    convertFactor ?
                        <div className="info">
                            <span>{materialQty + measureStore.getLabelName(materialUnitCode) }</span>
                            <TooltipComp attr={{ text: '[' + materialCode + ']'+ materialName, wid: 202 }} />
                            <span className="eq"><span>=</span></span>
                            <span>{goodsQty + goodsUnitName }</span>
                            <TooltipComp attr={{ text: '[' + goodsCode + ']'+goodsName, wid: 228 }} />
                        </div>
                        :null
                }
            </div>    
        )
    }
    getComp = () => {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        let { visible, detail } = this.store;
        return (
            <div className="supGoodsForm">
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem label="供应商编码" {...formItemLayout}>
                                {this.getFD('supplierCode', {
                                    initialValue: detail.supplierCode,
                                    rules: [
                                        {
                                            type: "autoselect",
                                            list: this.supplierStore.selectList.slice(),
                                            keyName: "supplierCode",
                                            message: "请从下拉列表中选择一项！",
                                        },
                                        { required: true, message: '供应商编码 必填！' }
                                    ],
                                })(
                                    <AutoComplete
                                    {...this.supplierStore.Props}
                                    onSelect={this.onSupplierSelect}
                                    onSearch={this.onSupplierSearch}
                                    optionLabelProp="value"
                                    />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="供应商名称" {...formItemLayout}>
                                {this.getFD('supplierFull', {
                                    initialValue: detail.supplierFull,
                                })(
                                    <Input disabled/>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <div className="title">
                                <div className="line"></div>
                                <div className="text">物料信息</div>
                                <div className="line"></div>
                            </div>  
                        </Col>
                        <Col span={1}></Col>
                        <Col span={12}>
                            <div className="title">
                                <div className="line"></div>
                                <div className="text2">供应商商品信息</div>
                                <div className="line"></div>
                            </div>  
                        </Col>
                    </Row>  
                    <Row>
                        <Col span={12}>
                            <FormItem label="物料编码" {...formItemLayout}>
                                {this.getFD('materialCode', {
                                    initialValue: detail.materialCode,
                                    rules: [
                                        {
                                            type: "autoselect",
                                            list: this.materialStore.selectList.slice(),
                                            keyName: "materialCode",
                                            message: "请从下拉列表中选择一项！",
                                        },
                                        { required: true, message: '物料编码 必填！' }
                                    ],
                                })(
                                <AutoComplete
                                    {...this.materialStore.Props}
                                    onSelect={this.onMaterialSelect}
                                    onSearch={this.onMaterialSearch}
                                    optionLabelProp="value"
                                    />
                                )}
                            </FormItem>
                            <FormItem label="物料名称" {...formItemLayout}>
                                {this.getFD('materialName', {
                                    initialValue: detail.materialName,
                                })(<Input disabled/>)}
                            </FormItem>
                            <FormItem label="型号" {...formItemLayout}>
                                {this.getFD('materialModel', {
                                    initialValue: detail.materialModel,
                                })(<Input disabled/>)}
                            </FormItem>
                            <FormItem label="规格" {...formItemLayout}>
                                {this.getFD('materialSpec', {
                                    initialValue: detail.materialSpec,
                                })(<Input disabled/>)}
                            </FormItem>
                            <FormItem label="材料" {...formItemLayout}>
                                {this.getFD('materialTexture', {
                                    initialValue: detail.materialTexture,
                                })(<Input disabled/>)}
                            </FormItem>
                            {/* <FormItem label="品牌" {...formItemLayout}>
                                {this.getFD('brand', {
                                    initialValue: detail.brand,
                                })(<Input disabled/>)}
                            </FormItem>
                            <FormItem label="代号" {...formItemLayout}>
                                {this.getFD('materialCodeName', {
                                    initialValue: detail.materialCodeName,
                                })(<Input disabled/>)}
                            </FormItem> */}
                            <FormItem label="数量" {...formItemLayout}>
                                {this.getFD('materialQty', {
                                    initialValue: detail.materialQty,
                                    rules: [{ type: 'gtEqZero', label: '数量', decimal: 2, maxLen: 16 }]
                                })(<Input />)}
                            </FormItem>
                            <FormItem label="单位" {...formItemLayout} >
                                {this.getFD('materialUnitCode', {
                                    initialValue: detail.materialUnitCode+'',
                                })(
                                    <Select>
                                        {measureStore.options}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="商品编码" {...formItemLayout}>
                                {this.getFD('goodsCode', {
                                    initialValue: detail.goodsCode,
                                    rules: [{ max: 20, message: '商品编码长度不能超过20!' }]
                                })(<Input />)}
                            </FormItem>
                            <FormItem label="商品名称" {...formItemLayout}>
                                {this.getFD('goodsName', {
                                    initialValue: detail.goodsName,
                                    rules: [{ max: 50, message: '商品名称长度不能超过50!' }]
                                })(<Input />)}
                            </FormItem>
                            <FormItem label="型号" {...formItemLayout}>
                                {this.getFD('goodsModel', {
                                    initialValue: detail.goodsModel,
                                    rules: [{ max: 50, message: '型号长度不能超过50!' }]
                                })(<Input />)}
                            </FormItem>
                            <FormItem label="规格" {...formItemLayout}>
                                {this.getFD('goodsSpec', {
                                    initialValue: detail.goodsSpec,
                                    rules: [{ max: 50, message: '规格长度不能超过50!' }]
                                })(<Input />)}
                            </FormItem>
                            <FormItem label="材料" {...formItemLayout}>
                                {this.getFD('goodsTexture', {
                                    initialValue: detail.goodsTexture,
                                    rules: [{ max: 50, message: '材料长度不能超过50!' }]
                                })(<Input />)}
                            </FormItem>
                            {/* <FormItem label="品牌" {...formItemLayout}>
                                {this.getFD('goodsBrand', {
                                    initialValue: detail.goodsBrand,
                                })(<Input />)}
                            </FormItem>
                            <FormItem label="代号" {...formItemLayout}>
                                {this.getFD('goodsCodeName', {
                                    initialValue: detail.goodsCodeName,
                                })(<Input />)}
                            </FormItem> */}
                            <FormItem label="商品数量" {...formItemLayout}>
                                {this.getFD('goodsQty', {
                                    initialValue: detail.goodsQty,
                                    rules: [{ type: 'gtEqZero', label: '商品数量', decimal: 2, maxLen: 16 }]
                                })(<Input />)}
                            </FormItem>
                            <FormItem label="商品单位" {...formItemLayout} >
                                {this.getFD('goodsUnitName', {
                                    initialValue: detail.goodsUnitName,
                                    rules: [{ max: 20, message:'最大长度为20'}]
                                })(<Input />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}> 
                            <div className="convertInfo">{this.getConvertInfo()}</div>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }

}

const options = {
    onValuesChange(props, values) {
        addSupGoodsStore.setDetail(values)
    }
}
export default Form.create(options)(AddSupGoodsComp);
export { AddSupGoodsComp }