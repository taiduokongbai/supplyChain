import React, { Component } from 'react';
import { Table, message, Tabs } from '../../../base/components/AntdComp';
import StorageOperationsComp from '../../StorageBin/comp/StorageOperationsComp';
let { observable, action, computed, runInAction, toJS } = mobx;
import { advancePopStore, allotLocationStore, advancePopTableStore,
    addOutInfoStore, allotInListStore, advanceTableInfoStore, addAllotStore} from '../store/AddAllotStore';
let { observer } = mobxReact;

let TabPane = Tabs.TabPane;

@observer
class AddAllotStepTwoComp extends Component{
    constructor(props) {
        super(props);
        this.columns1 = [
            {
                title: '行号',
                dataIndex: 'lineNo',
                key: 'lineNo',
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
            }, {
                title: '调出仓位',
                dataIndex: 'allotOutLocationCode',
                key: 'allotOutLocationCode',
            }, {
                title: '原批次号',
                dataIndex: 'allotOutBatchCode',
                key: 'allotOutBatchCode',
            }, {
                title: '调出数量',
                dataIndex: 'allotOutQty',
                key: 'allotOutQty',
            }, {
                title: '预收货数量',
                dataIndex: 'allotInQty',
                key: 'allotInQty',
            }, {
                title: '未清数量',
                dataIndex: 'untreatedQty',
                key: 'untreatedQty',
            }, {
                title: '库存单位',
                dataIndex: 'unitName',
                key: 'unitName',
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (txt, record, index) => {
                    let opts = [
                        {
                            title: "预收货",
                            fun: () => this.openPop(record,index),
                            show:  record.untreatedQty != 0,
                        },
                    ];
                    return <StorageOperationsComp operations={opts}/>;
                }
            },
        ];
        this.columns2 = [
            {
                title: '行号',
                dataIndex: 'lineNo',
                key: 'lineNo',
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
            }, {
                title: '仓位',
                dataIndex: 'allotInLocationCode',
                key: 'allotInLocationCode',
            }, {
                title: '批次号',
                dataIndex: 'allotInBatchCode',
                key: 'allotInBatchCode',
            }, {
                title: '数量',
                dataIndex: 'allotInQty',
                key: 'allotInQty',
            }, {
                title: '库存单位',
                dataIndex: 'unitName',
                key: 'unitName',
            }, {
                title: '创建人',
                dataIndex: 'createByName',
                key: 'createByName',
            }, {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'createDate',
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (txt, record, index) => {
                    let opts = [
                        {
                            title: "删除",
                            titleText: ['确定要删除该数据吗？'],
                            fun: () => advanceTableInfoStore.delAdvanceList(record.id),
                            show:  true
                        },
                    ];
                    return <StorageOperationsComp operations={opts}/>;
                }
            },
        ]
    };

    tabChange = (key) => {
        if(key == '1') {
            allotInListStore.fetchTableList();
        } else if(key == '2'){
            advanceTableInfoStore.fetchTableList();
        }
    };

    openPop = (record,index) => {
        if(addAllotStore.allotInSiteCode){
            Promise.all([
                advancePopStore.setAdvanceInfo({
                    id: record.id,
                    materialCode: record.materialCode,
                    materialName: record.materialName,
                    allotOutQty: record.allotOutQty,
                    unitName: record.unitName,
                    unitCode: record.unitCode,
                    allotOutBatchCode: record.allotOutBatchCode,
                    allotInQty: record.allotInQty,

                }),
                advancePopTableStore.clear(),
                advancePopTableStore.setEditRecord(),
                allotLocationStore.fetchSelectList({stockId:addAllotStore.allotInSiteId}),
                addAllotStore.getDetail({id:addAllotStore.id}),
                advancePopStore.setVisible(true,record.id)
            ]).then(values => {
                addOutInfoStore.setIndex(index);
            }, reason => {
                addOutInfoStore.setIndex(index);
            });
        } else {
            message.warn('请先选择调入仓库！')
        }

    }

    render (){
        return(
            <div>
                <Tabs className="allot-tab" defaultActiveKey="1" animated={false} onChange={this.tabChange}>
                    <TabPane className="tab" tab="调入信息" key="1">
                        <Table {...allotInListStore.Props}
                               columns={this.columns1} rowKey={"id"} />
                    </TabPane>
                    <TabPane className="tab" tab="预收货信息" key="2">
                        <Table {...advanceTableInfoStore.Props}
                            columns={this.columns2} rowKey={"id"} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default AddAllotStepTwoComp