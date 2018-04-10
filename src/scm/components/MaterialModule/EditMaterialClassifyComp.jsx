import React, { Component, PropTypes } from "react";
import { Form, Input, Row, Col, Checkbox } from '../../../base/components/AntdComp';
import FormModalComp from '../../../base/components/FormModalComp';
import TreeSelectComp from '../../../base/components/TreeSelectComp';
import { formatNullStr, shouldComponentUpdate } from "../../../base/consts/Utils";


class EditMaterialClassifyComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        this.state = {
            parentCode: props.details.parentCode || ''
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.props.loading) {
            this.validateFds((err, data) => {
                data.isUse = this.props.isUse;
                data.orderStatus = this.props.details.orderStatus;
                data.parentCode = this.state.parentCode;
                if (!err) {
                    this.props.onOk && this.props.onOk(data);
                }
            });
        }
    }
    componentDidMount() {
        this.props.actions.getCombBoxList({ isNode: 1 });
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.details != this.props.details) {
            this.setState({
                parentCode: nextProps.details.parentCode
            })
        }
        return nextProps;
    }

    orderStatus = (status) => {
        switch (status) {
            case 0:
                return '已保存';
                break;
            case 1:
                return '已启用';
                break;
            case 2:
                return '已禁用';
                break;
            default:
                break;
        }
    }

    checkIsUse = (e) => {
        let categoryCode = this.props.details.categoryCode;
        this.props.isUse ? this.props.actions.checkIsUse(e.target.checked, { categoryCode: categoryCode }) : this.props.actions.isUse(1);
    }

    parentChange = (val, label, extra) => {
        this.setState({
            parentCode: val
        })
        let { comboboxList } = this.props;
        let data = [comboboxList];
        let level = 0;
        let loop = (data) => data.map((item, index) => {
            if (item.categoryCode == val) {
                this.props.actions.nodeLevel(item.categoryLevel * 1 + 1)
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
        let { details, comboboxList, isUse, nodeLevel } = this.props;
        return (
            <Form>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            {...formItemLayout}
                            label="分类名称"
                        >
                            {this.getFD('categoryName', {
                                initialValue: details.categoryName || '',
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
                                initialValue: formatNullStr(details.categoryCode),
                            })(
                                <Input className='edit-dialog-disable-input' readOnly/>
                                )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        {
                            details.orderStatus == 0 ? <Form.Item
                                {...formItemLayout}
                                label="上级分类"
                            >
                                {this.getFD('parentCode', {
                                    initialValue: formatNullStr(details.parentName),
                                    rules: [{ required: true, message: '上级分类必填！' }]
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
                            </Form.Item> :
                                <Form.Item
                                    {...formItemLayout}
                                    label="上级分类"
                                >
                                    {this.getFD('parentName', {
                                        initialValue: formatNullStr(details.parentName),
                                    })(
                                        <Input className='edit-dialog-disable-input' readOnly />
                                        )}
                                </Form.Item>
                        }
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            {...formItemLayout}
                            label="分类层级"
                        >
                            {this.getFD('categoryLevel', {
                                initialValue: nodeLevel,
                            })(
                                <Input className='edit-dialog-disable-input' readOnly/>
                                )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            {...formItemLayout}
                            label="状态"
                        >
                            {this.getFD('orderStatus', {
                                initialValue: this.orderStatus(details.orderStatus * 1)
                            })(
                                <Input className='edit-dialog-disable-input' readOnly/>
                                )}
                        </Form.Item>
                    </Col>
                    <Col span={12} className='forbidden-checkbox' style={{ paddingLeft: 18 }}>
                        <Form.Item
                            {...formItemLayout}
                        >
                            {this.getFD('isUse', {
                                initialValue: '',
                            })(
                                <Checkbox checked={isUse ? true : false} onChange={(e) => this.checkIsUse(e)}>允许物料使用</Checkbox>
                                )}
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    {...textareaLayout}
                    label='备注'
                >
                    {this.getFD('remarks', {
                        initialValue: details.remarks || '',
                        rules: [{ max: 200, message: '备注不能超过200字符！' }]
                    })(
                        <Input type='textarea' />
                        )}
                </Form.Item>
            </Form>
        )
    }
}
export default Form.create()(EditMaterialClassifyComp);

