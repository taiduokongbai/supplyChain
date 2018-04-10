import React, { Component } from "react";
import { Button, Popconfirm, message, Select, Radio } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import OperationsComp from '../../../base/components/OperationsComp';

class SupplierAddressComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.columns = [
            {
                title: 'addressCode',
                dataIndex: 'addressCode',
                key: 'addressCode',
                hidden: true,
            }, {
                title: '行号',
                dataIndex: 'rowKey',
                key: 'rowKey',
                hidden: true,
            }, {
                title: '默认收货地址',
                dataIndex: 'repDefault',
                key: 'repDefault',
                className: 'alignCenter',
                render: (txt, record, index) => {
                    return <Radio checked={txt ? true : false} disabled={true}></Radio>
                },
                width: '10%'
            }, {
                title: '默认发货地址',
                dataIndex: 'sogDefault',
                key: 'sogDefault',
                className: 'alignCenter',
                render: (txt, record, index) => {
                    return <Radio checked={txt ? true : false} disabled={true}></Radio>
                },
                width: '10%'
            }, {
                title: '默认开票地址',
                dataIndex: 'bilDefault',
                key: 'bilDefault',
                className: 'alignCenter',
                render: (txt, record, index) => {
                    return <Radio checked={txt ? true : false} disabled={true}></Radio>
                },
                width: '10%'
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (txt, record, index) => {
                    return window.ENUM.getEnum("dataStatus", txt + '')
                },
            }, {
                title: '地址类型',
                dataIndex: 'addressType',
                key: 'addressType',
                render: (txt, record, index) => {
                    let addressType = [];
                    if (record.isRep)
                        addressType.push(0)
                    if (record.isSog)
                        addressType.push(1)
                    if (record.isBil)
                        addressType.push(2)
                    return addressType.map(item => window.ENUM.getEnum("supplierAddress", item + '')).join('，')
                },

            }, {
                title: '地址信息',
                dataIndex: 'addressInfo',
                key: 'addressInfo',
                width: '30%',
                render: (txt, record, index) => {
                    return `${record.countryName}${record.provinceName}${record.cityName}${record.countyName}${record.addressDetl}`;
                }

            }, {
                dataIndex: 'operation',
                title: '操作',
                className: 'alignCenter',
                width: 120,
            }];
        this.columns[this.columns.length - 1].render = (txt, record, index) =>
            {
                let opts = [
                    {
                        title: '编辑',
                        titleText: [],
                        icon: '',
                        fun: () => props.EditAddressVisiable(record.id),
                        show: true,
                        default:'--'
                    },
                    record.status == 1 ? {
                        title: "禁用",
                        titleText: ['确定要禁用该地址吗？'],
                        icon: '',
                        show: true,
                        fun: () => this.onDisable(record),
                        default:'--'
                    } : {
                            title: "启用",
                            titleText: ['确定要启用该地址吗？'],
                            icon: '',
                            show: true,
                            fun: () => this.onDisable(record),    
                            default:'--'
                    },
                    {
                        title: '删除',
                        titleText: ['确定删除该条订单吗？', '删除后，该条订单记录将不可恢复！'],
                        icon: '',
                        fun: () => this.onDelete(record.id),
                        show: record.status == 0,
                        default:'--'
                    },
                ];
                return <OperationsComp operations={opts} />;
            };    
    }
    onDelete = (id) => {
        let { onClear, AddressDelete } = this.props;
        AddressDelete(id).then(json => {
            if (json.status === 2000) {
                message.success('删除成功')
                onClear();
            }
        })
    }
    onDisable = (record) => {
        let { id, status } = record;
        let { onClear, AddressDisable } = this.props;
        if (status == 2 || status == 0) {
            status = 1
        } else {
            status = 2
        }
        if (record.addressName == '') {
            message.warn('地址名称必填！')
            return;
        }
        AddressDisable(id, status).then(json => {
            if (json.status === 2000) {
                message.success('操作成功')
                onClear();
            }
        })
    }

    //表格头
    title = () => {
        let { addBtn } = this.props;
        return addBtn ?
            <div style={{ textAlign: 'right' }}>
                <a href='#' onClick={this.props.AddAddressVisiable}><i className='c2mfont c2m-tianjia' style={{ paddingRight: '5px' }} />{addBtn}</a>
            </div>
            :
            null;
    }

    render() {
        let { AddAddressVisiable, addressTabLoading, tablePaging, addressDataSource, ...props } = this.props;
        let data = [];
        if (addressDataSource.size != 0) {
            data = addressDataSource;
        }
        return (
            <div>
                {/*<div className="supplierAddress-head">
                    
                </div>*/}
                {/*<Button type="default" className="ant-btn ant-btn-primary" onClick={AddAddressVisiable}>新建地址</Button>*/}
                <div className="supplierAddress-body">
                    <MTable
                        {...props}
                        dataSource={data}
                        loading={addressTabLoading}
                        cols={this.columns}
                        rowKey={'id'}
                        pageOnChange={tablePaging}
                        title={this.title}
                    />
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.props.tablePaging(1);
    }
}

SupplierAddressComp.defaultProps = {
    addBtn: '添加行'
}

export default SupplierAddressComp;
