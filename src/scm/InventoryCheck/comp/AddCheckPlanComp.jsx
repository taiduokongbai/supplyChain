/**
 *  新建盘点方案
 */
import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message, Form, Checkbox, TreeSelect, Row, Col, Select } from '../../../base/components/AntdComp';
import FormModalComp from "../../../base/mobxComps/FormModalComp";
import { checkplan_store } from "../store/CheckPlanStore";
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

@observer
class AddCheckPlanComp extends FormModalComp {
    constructor(props, context) {
        super(props, context)
        this.store = this.props.store;
        this.state = {
            corning_start: 0,
            corning_end: 0,
            warehouseVal: '',
            stockCode: '' // 仓库 code
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.store.loading) {
            this.validateFds((err, data) => {
                const isBlindPlate = ['isBlindStocktake'];
                for (var i = 0; i < isBlindPlate.length; i++) {
                    if (data.isBlindStocktake && data.isBlindStocktake.includes(isBlindPlate[i])) {
                        data[isBlindPlate[i]] = 1;
                    } else {
                        data[isBlindPlate[i]] = 0;
                    }
                }
                data.warehouseCode = this.state.stockCode;

                if (data.locationCodeStart && !data.locationCodeEnd) {
                    this.setState({ corning_end: 1 })
                } else if (data.locationCodeEnd && !data.locationCodeStart) {
                    this.setState({ corning_start: 1 })
                } else {
                    this.setState({
                        corning_end: 0,
                        corning_start: 0,
                    })
                    if (!err) {
                        data.id = data.id ? data.id : null;
                        this.store.save(data).then(json => {
                            if (json.status === 2000) {
                                this.store.setLoading(false)
                                this.handleCancel();
                                message.success("新建方案成功！")
                                checkplan_store.fetchTableList();
                            }
                        })
                    }
                }

            });
        }
    }
    handleCancel = () => {
        this.store.setVisible(false);
        this.setState({ warehouseVal: '', stockCode: '' })
    }

    wareHouseChange = (value, node, extra) => {
        this.setState({
            warehouseVal: value,
            stockCode: this.store._warehouseStore.getItem(extra.triggerNode.props.pos).attribute.stockCode
        })
        if (value) {
            this.props.form.setFieldsValue({ locationCodeStart: '', locationCodeEnd: '' })
            this.store._positionFromStore.fetchSelectList({ stockId: value });
        }
    }

    materialCategoryChange = (value) => { // 物料分类
        if (value) {
            this.props.form.setFieldsValue({ materialCode: '' })
            this.store._materialStore.fetchSelectList({ categoryCode: value })
        }
    }

    locationStartHandler = (value) => {
        let a = this.props.form.getFieldValue('locationCodeEnd');
        if (value && a) {
            this.setState({ corning_start: 0 })
        }
    }

    locationEndHandler = (value) => {
        let a = this.props.form.getFieldValue('locationCodeStart');
        if (value && a) {
            this.setState({ corning_end: 0 })
        }
    }

    getComp = () => {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        let { details } = this.store;
        let isBlindPlate = [
            { label: '是否盲盘', value: 'isBlindStocktake' }
        ];
        return (
            <Form className='check-plan-modal'>
                <Row>
                    <Col span={12}>
                        <FormItem label="方案编码" {...formItemLayout} className='solution-code'>
                            {this.getFD('solutionCode', {
                                initialValue: this.store.curModal == 'add' ? '( 系统自动生成 )' : details.solutionCode,
                            })(
                                <Input readOnly />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}></Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="方案名称" {...formItemLayout}>
                            {this.getFD('solutionName', {
                                initialValue: details.solutionName || '',
                                rules: [
                                    { whitespace: true, required: true, message: '必填！' },
                                    { max: 50, message: '最多50个字符' }
                                ]
                            })(
                                <Input style={{ width: 200 }} />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem >
                            {this.getFD('isBlindStocktake', {
                                initialValue: details.isBlindStocktake ? ['isBlindStocktake'] : [],
                            })(
                                <CheckboxGroup options={isBlindPlate} style={{ paddingLeft: 50 }} />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="所属仓库" {...formItemLayout}>
                            {this.getFD('warehouseCode', {
                                initialValue:  details.warehouseId + "" || "",
                                rules: [
                                    {
                                        required: true, message: '必填！',
                                    }
                                ]
                            })(
                                <TreeSelect
                                    {...this.store._warehouseStore}
                                    treeData={this.store._warehouseStore.treeData.slice() || []}
                                    onChange={(value, node, extra) => this.wareHouseChange(value, node, extra)}
                                />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="仓位"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                        >
                            {this.getFD('locationCodeStart', {
                                initialValue: details.locationCodeStart || '',
                            })(
                                <Select
                                    onChange={this.locationStartHandler}
                                    disabled={this.state.warehouseVal || this.store.details.warehouseCode ? false : true}
                                >
                                    {this.store._positionFromStore.options}
                                </Select>
                                )}<div className="ant-form-explain" style={{ display: this.state.corning_start ? 'block' : 'none', color: '#f04134' }}>必填！</div>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="-"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16 }}
                        >
                            {this.getFD('locationCodeEnd', {
                                initialValue: details.locationCodeEnd || '',
                            })(
                                <Select
                                    onChange={this.locationEndHandler}
                                    disabled={this.state.warehouseVal || this.store.details.warehouseCode ? false : true}
                                >
                                    {this.store._positionFromStore.options}
                                </Select>
                                )}<div className="ant-form-explain" style={{ display: this.state.corning_end ? 'block' : 'none', color: '#f04134' }}>必填！</div>
                        </FormItem>
                    </Col>
                </Row>


                <Row>
                    <Col span={12}>
                        <FormItem label="物料分类" {...formItemLayout}>
                            {this.getFD('materialCategoryCode', {
                                initialValue: details.materialCategoryCode || '',
                            })(
                                <TreeSelect
                                    {...this.store._materialclassifyStore}
                                    treeData={this.store._materialclassifyStore.treeData.slice() || []}
                                    onChange={this.materialCategoryChange}
                                />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="物料" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} >
                            {this.getFD('materialCode', {
                                initialValue: details.materialCode || '',
                            })(
                                <Select style={{ width: 200 }}>
                                    {this.store._materialStore.options}
                                </Select>
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="备注" labelCol={{ span: 3 }} wrapperCol={{ span: 19 }}>
                    {this.getFD('remarks', {
                        initialValue: details.remarks || '',
                        rules: [
                            { max: 200, message: '备注最多200个字符' }
                        ]
                    })(
                        <Input type='textarea' />
                        )}
                </FormItem>
                <FormItem label="ID" {...formItemLayout} style={{ display: 'none' }}>
                    {this.getFD('id', {
                        initialValue: details.id || '',
                    })(
                        <Input />
                        )}
                </FormItem>
            </Form>
        )
    }

}


export default Form.create()(AddCheckPlanComp);
export { AddCheckPlanComp };