import React, { Component, PropTypes } from "react";
import { Form, Input, Row, Col, Checkbox } from '../../../base/components/AntdComp';
import FormModalComp from '../../../base/components/FormModalComp';
import TreeSelectComp from '../../../base/components/TreeSelectComp';

class AddMaterialClassifyComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isUse: 1,
            nodeLevel: 1,
        }
    }
    handleSubmit = (e) => {  // change
        e.preventDefault();
        if (!this.props.loading) {
            this.validateFds((err, data) => {
                data.isUse = this.state.isUse;
                data.orderStatus = 0;
                data.parentCode = data.parentCode == '/' ? '0' : data.parentCode;
                if (!err) {
                    this.props.onOk && this.props.onOk(data);
                }
            });
        }
    }
    componentDidMount() {
        this.props.actions.getCombBoxList({ isNode: 1 })
    }

    checkIsUse = (e) => {
        this.setState({
            isUse: e.target.checked ? 1 : 0
        })
    }

    parentChange = (val, label, extra) => {
        let { comboboxList } = this.props;
        let data = [comboboxList];
        let level = 0;

        let loop = (data) => data.map((item, index) => {
            if (item.categoryCode == val) {
                this.setState({ nodeLevel: item.categoryLevel * 1 + 1 })
                return;
            }
            if (item.children) loop(item.children)
        })
        return loop(data);

    }

    getComp = () => {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const textareaLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 19 },
        }
        let { comboboxList } = this.props;
        return (
            <Form>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            {...formItemLayout}
                            label="分类名称"
                        >
                            {this.getFD('categoryName', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: '必填!' },
                                    {
                                        validator: (rule, val, callback) => {
                                            let valide = /^[0-9a-zA-Z\u4e00-\u9fa5]{0,20}$/;
                                            if (val.length > 20) {
                                                callback('不能超过20个字符!')
                                            } else if (!valide.test(val)) {
                                                callback('只能输入数字、字母或汉字!')
                                            } else {
                                                callback()
                                            }
                                        }
                                    }
                                ]
                            })(
                                <Input />
                                )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            {...formItemLayout}
                            label="分类编码"
                        >
                            {this.getFD('categoryCode', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: '必填!', },
                                    {
                                        validator: (rule, val, callback) => {
                                            let vali = /^[\w\d-_]{0,20}$/;
                                            if (val.length > 20) {
                                                callback('不能超过20个字符')
                                            } else if (!vali.test(val)) {
                                                callback('只能输入字母、数字、_ 或 - ')
                                            } else {
                                                callback();
                                            }
                                        }
                                    }
                                ],
                            })(
                                <Input />
                                )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            {...formItemLayout}
                            label="上级分类"
                        >
                            {this.getFD('parentCode', {
                                initialValue: comboboxList.categoryName,
                                rules: [
                                    { required: true, message: '上级分类必填!', }
                                ],
                            })(
                                <TreeSelectComp
                                    treeData={[comboboxList]}
                                    keyName='categoryCode'
                                    name='categoryName'
                                    width={183}
                                    onChange={this.parentChange}
                                >
                                </TreeSelectComp>
                                )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            {...formItemLayout}
                            label="分类层级"
                        >
                            {this.getFD('categoryLevel', {
                                initialValue: this.state.nodeLevel,
                            })(
                                <Input className='edit-dialog-disable-input' readOnly />
                                )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12} className='forbidden-checkbox' style={{ marginLeft: 78 }}>
                        <Form.Item
                            {...formItemLayout}
                        >
                            {this.getFD('isUse', {
                                initialValue: '',
                            })(
                                <Checkbox checked={this.state.isUse ? true : false} onChange={(e) => this.checkIsUse(e)}>允许物料使用</Checkbox>
                                )}
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    {...textareaLayout}
                    label='备注'
                >
                    {this.getFD('remarks', {
                        initialValue: '',
                        rules: [{ max: 200, message: '备注不能超过200字符！' }]
                    })(
                        <Input type='textarea' />
                        )}
                </Form.Item>
            </Form>
        )
    }
}
export default Form.create()(AddMaterialClassifyComp);

