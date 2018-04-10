/**
 * Created by MW on 2017/4/20.
 */
import React, {Component} from 'react'
import {Select, Input, Button, Form} from '../../../base/components/AntdComp'

let Option = Select.Option,
    FormItem = Form.Item;

class SalesStoreHouseSearch extends Component{
    constructor(props) {
        super(props)
        this.state = {
            selectCode: '',
        }
    }
    ;

    search = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.props.loading('searchLoading',true);
            this.props.getList({page:1, pageSize:this.props.paging.pageSize,sourceOrderType:10, [values.searchType]:values.searchType != 'status' ?values.searchContent:Number(values.searchStatus)});
        })
    };

    cleanSearch = (e) => {
        this.props.form.resetFields(['searchContent']);
        this.setState({selectCode:e == 'status'?'select':'input'});
        this.searchInput();
    }
    newTab = () => {
        let {GetCodeRule, newTab} = this.props;
        GetCodeRule().then(json => {
            if (json.status === 2000) {
                newTab('newBuilt')
            }
        })
    }
    searchInput = () => {
        let {getFieldDecorator} = this.props.form;
        switch (this.state.selectCode) {
            case 'input':
                return <FormItem className="form-item">
                            {getFieldDecorator('searchContent',{
                                    initialValue: "",
                                }
                            )(
                                <Input className="search-content" placeholder="请输入关键字搜索" onPressEnter={this.search} />
                            )
                            }
                        </FormItem>;
            case 'select':
                return <FormItem className="form-item">
                            {getFieldDecorator('searchStatus',{
                                initialValue: '1',
                            }
                        )(
                            <Select className="search-type">
                                <Option value='-1'>全部</Option>
                                <Option value='1'>已保存</Option>
                                <Option value='2'>部分分配</Option>
                                <Option value='3'>分配完成</Option>
                                <Option value='4'>部分发货</Option>
                                <Option value='5'>发货完成</Option>
                                <Option value='6'>已关闭</Option>
                            </Select>
                        )
                        }
                    </FormItem>;
            default :
                return <FormItem className="form-item">
                            {getFieldDecorator('searchContent',{
                                initialValue: "",
                                }
                            )(
                                <Input className="search-content" placeholder="请输入关键字搜索" onPressEnter={this.search} />
                            )
                            }
                        </FormItem>;
        }
    }

    render() {

        let { getFieldDecorator } = this.props.form;

        return (
            <div className="search">
                <Form className="search-left">
                    <FormItem className="form-item">
                        {getFieldDecorator('searchType',{
                            initialValue: "orderCode",
                            }
                        )(
                            <Select className="search-type" onChange={this.cleanSearch}>
                                <Option value="orderCode">单据号</Option>
                                <Option value="sourceOrderCode">源单据号</Option>
                                <Option value="bpFull">客户</Option>
                                <Option value="deliveryAddressDetl">收货地址</Option>
                                <Option value="status">状态</Option>
                            </Select>
                        )
                        }
                    </FormItem>
                    {this.searchInput()}
                    <FormItem className="form-item">
                        <Button className="submit" onClick={this.search} loading={this.props.searchLoading}><i className="c2mfont c2m-search1"></i>查询</Button>
                    </FormItem>
                </Form>
                <div className="search-right">
                    <Button className="new-built" onClick={this.newTab}><i className="c2mfont c2m-jia"></i>新建</Button>
                </div>
            </div>
        )
    }

}

let SalesStoreHouseSearchComp = Form.create()(SalesStoreHouseSearch)

export default SalesStoreHouseSearchComp

