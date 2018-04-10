/**
 * Created by MW on 2017/9/5.
 */
import React, {Component} from 'react'
import MTable from '../../../base/components/TableComp'
import {Menu, Dropdown, Button, Popconfirm, Input, Spin,Form, Row, Col, Icon,Tabs} from '../../../base/components/AntdComp'

let TabPane = Tabs.TabPane;

class NewDirectTransferStepTwo extends Component {
    constructor (props) {
        super(props)

        this.columnsOne = [
            {
                title: '行号',
                dataIndex: 'lineNum',
                key: 'lineNum'
            }, {
                title: '物料编号',
                dataIndex: 'materialCode',
                key: 'materialCode'
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName'
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec'
            },{
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel'
            }, {
                title: '调出仓位',
                dataIndex: 'allotOutLocationCode',
                key: 'allotOutLocationCode'
            }, {
                title: '原批次号',
                dataIndex: 'allotOutBatchCode',
                key: 'allotOutBatchCode'
            }, {
                title: '调出数量',
                dataIndex: 'allotOutQty',
                key: 'allotOutQty'
            },{
                title: '预收货数量',
                dataIndex: 'allotInQty',
                key: 'allotInQty'
            }, {
                title: '未清数量',
                dataIndex: 'allotQty',
                key: 'allotQty',
                render: (text, record, index) => record.allotOutQty - record.allotInQty
            }, {
                title: '基本单位',
                dataIndex: 'measureUnitName',
                key: 'measureUnitName'
            }, {
                title: '操作',
                dataIndex: '',
                key: '',
                render: (text,record, index) => record.allotOutQty == record.allotInQty ? '' :
                    <a href="#" onClick={() => this.props.advance(record)}>预收货</a>
            }
        ];

        this.columnsTwo = [
            {
                title: '行号',
                dataIndex: 'lineNum',
                key: 'lineNum'
            }, {
                title: '物料编号',
                dataIndex: 'materialCode',
                key: 'materialCode'
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName'
            }, {
                title: '仓位',
                dataIndex: 'allotInLocationCode',
                key: 'allotInLocationCode'
            },{
                title: '批次号',
                dataIndex: 'allotInBatchCode',
                key: 'allotInBatchCode'
            },{
                title: '数量',
                dataIndex: 'allotInQty',
                key: 'allotInQty'
            },  {
                title: '基本单位',
                dataIndex: 'measureUnitName',
                key: 'measureUnitName'
            },  {
                title: '创建人',
                dataIndex: 'createByName',
                key: 'createByName'
            },  {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'createDate'
            }, {
                title: '操作',
                dataIndex: '',
                key: ''
            }
        ]
    }

    render(){

        console.log(this.props.inData);

        return(
            <div>
                <Tabs defaultActiveKey="1" animated={false} onChange={this.tabChange}>
                    <TabPane className="tab" tab="调入信息" key="1">
                        <MTable cols={this.columnsOne} rowKey={"materialCode"} dataSource={this.props.inData}/>
                    </TabPane>
                    <TabPane className="tab" tab="预收货信息" key="2">
                        <MTable cols={this.columnsTwo}/>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default NewDirectTransferStepTwo