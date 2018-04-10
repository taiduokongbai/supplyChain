/**
 * Created by MW on 2017/8/30.
 * 新建直接调拨单
 */

import React, {Component} from 'react'
import FormComp from '../../../base/components/FormComp';
import { Row, Col, Button, Input, Spin,Form, Select, DatePicker} from '../../../base/components/AntdComp';
import AutoSelectComp from '../../../base/components/AutoSelectComp'


let FormItem = Form.Item,
    Option = Select.Option,
    { MonthPicker, RangePicker } = DatePicker,
    formItemLayout = {
        labelCol: {span: 5},
        wrapperCol: {span: 19},
    };

class NewDirectTransferTop extends FormComp {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    takeOrderSave = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
            }
        })
    }




    onSelectOut = (value) => {
        this.props.onSelectOut(value.allotOutSiteCode);
    };

    onSearchOut = (value) => {
        this.props.onSearchOut(value);
    }


    render() {


        return(
            <div className="new-direct-transfer-top">
                <div className="top">
                    <Row>
                        <Col span={21}>
                            <span className="title active">1.调拨出库</span> >
                            <span className="title">2.调拨入库</span> >
                            <span className="title">3.检查</span>
                        </Col>
                        <Col className="right" span={3}>
                            {
                                this.props.tableOne ? <Button className="btn" onClick={() => this.props.tableChange(2)}>下一步</Button> :
                                    (this.props.tableTwo ?
                                        <div>
                                            <Button className="btn" onClick={() => this.props.tableChange(1)}>上一步</Button>
                                            <Button className="btn" onClick={() => this.props.tableChange(3)}>下一步</Button>)
                                        </div>
                                            : (
                                                this.props.tableThree ?
                                                    <div>
                                                        <Button className="btn" onClick={() => this.props.tableChange(2)}>上一步</Button>
                                                        <Button className="btn" onClick={() => this.props.tableChange(4)}>保存</Button>)
                                                    </div>
                                                    : null
                                        )
                                    )
                            }
                        </Col>
                    </Row>
                </div>
                <div className="info">
                    <Form>
                    <div className="info-first">
                        <Row className="row-first">
                            <Col span={16}>
                                <Row className="title">
                                    <Col>
                                        <h3>基本信息</h3>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="col-left" span={12}>
                                        <Row className="per-col">
                                            <FormItem className="form-itme"
                                                  {...formItemLayout}
                                                  label="单据类型：">
                                                {this.props.form.getFieldDecorator('allotOrderTypeCode',{
                                                    initialValue: '1',
                                                    rules: [
                                                        {
                                                            required:true,
                                                            message: '请选择单据类型',
                                                        }
                                                    ],
                                                    }
                                                )(
                                                    <Select>
                                                        <Option value="1">质检调拨</Option>
                                                        <Option value="2">报废调拨</Option>
                                                        <Option value="3">生产调拨</Option>
                                                        <Option value="4">其他调拨</Option>
                                                    </Select>
                                                )
                                                }
                                            </FormItem>
                                        </Row>
                                        <Row className="per-col">
                                            <FormItem className="form-itme"
                                                  {...formItemLayout}
                                                  label="调拨申请人：">
                                                {this.props.form.getFieldDecorator('allotProposerCode',{
                                                        initialValue: '1',
                                                        rules: [
                                                            {
                                                                required:true,
                                                                message: '请选择单据类型',
                                                            }
                                                        ],
                                                    }
                                                )(
                                                    <Select>
                                                        <Option value="1">质检调拨</Option>
                                                        <Option value="2">报废调拨</Option>
                                                        <Option value="3">生产调拨</Option>
                                                        <Option value="4">其他调拨</Option>
                                                    </Select>
                                                )
                                                }
                                            </FormItem>
                                        </Row>
                                        <Row className="per-col">
                                            <FormItem className="form-itme"
                                                  {...formItemLayout}
                                                  label="调拨时间：">
                                                {this.props.form.getFieldDecorator('allotDate'
                                                )(
                                                    <DatePicker />
                                                )}
                                            </FormItem>
                                        </Row>
                                    </Col>
                                    <Col className="col-center" span={12}>
                                        <Row>
                                            <Col>
                                                <Row className="per-col">
                                                    <FormItem className="form-itme"
                                                          {...formItemLayout}
                                                          label="调出仓库：">
                                                        {this.getFD('allotOutSiteCode',{
                                                            initialValue:  this.props.allotOutSiteCode,
                                                            rules: [
                                                                {
                                                                    required:true,
                                                                    message: '请从下拉列表中选择一项',
                                                                    type:"autoselect",
                                                                    list: this.props.outSiteList,
                                                                    keyName: "siteCode",
                                                                },
                                                                {
                                                                    required:true,
                                                                    message: '请选择调出仓库',
                                                                }
                                                            ],
                                                        })(
                                                            <AutoSelectComp
                                                                disabled={this.props.disOutSiteCode}
                                                                className="input"
                                                                selectedList = { this.props.outSiteList }
                                                                onSelect = {this.onSelectOut}
                                                                onSearch = {(val) => {this.onSearchOut(val);}}
                                                                optionLabelProp="value"
                                                                labelName="siteCode"
                                                                keyName = {"siteCode"}
                                                                format={(item)=><div><div className="option-code">{item.siteCode}</div><div className="option-name">{item.siteName}</div></div>}

                                                            />,
                                                        )
                                                        }
                                                    </FormItem>
                                                </Row>
                                                <Row className="per-col">
                                                    <FormItem className="form-itme"
                                                          {...formItemLayout}
                                                          label="调入仓库：">
                                                        {this.getFD('allotInSiteCode',{
                                                            initialValue: '',
                                                            rules: [
                                                                {
                                                                    required:true,
                                                                    message: '请选择源单据号',
                                                                }
                                                            ],
                                                        })(
                                                            <AutoSelectComp
                                                                className="input"
                                                               />,
                                                        )
                                                        }
                                                    </FormItem>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className="col-right" span={8}>
                                    <Row  className="title">
                                        <Col>
                                            <h3>其他信息</h3>
                                        </Col>
                                    </Row>
                                    <Row className="per-col-remarks">
                                        <FormItem className="form-itme"
                                              {...formItemLayout}
                                              label="备注：">
                                            {this.props.form.getFieldDecorator('remarks',{
                                                    initialValue: '',//this.props.orderInfoData.remarks,
                                                    rules: [
                                                        { max: 200, message: '备注内容要在200字以内',}
                                                    ]
                                                }
                                            )(
                                                <Input type="textarea" rows={4} className="textarea"/>
                                            )}
                                        </FormItem>

                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}

let NewDirectTransferTopComp = Form.create()(NewDirectTransferTop);

export default NewDirectTransferTopComp
