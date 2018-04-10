import React, { Component } from 'react'
import MTable from '../../../base/components/TableComp';
import { store } from "../../data/StoreConfig";
import AdjustmentListAct from '../../actions/InventoryModule/AdjustmentListAct';
let columns = [{
    title: '物料编码',
    dataIndex: 'materialCode',
    key: 'materialCode',
    width:159,
}, {
    title: '物料名称',
    dataIndex: 'materialName',
    key: 'materialName',
}, {
    title: '仓库',
    dataIndex: 'warehouseName',
    key: 'warehouseName',
 }, {
    title: '批次号',
    dataIndex: 'oldBatchCode',
    key: 'oldBatchCode',
}, {
    title: '库存状态',
    dataIndex: 'oldStatusName',
    key: 'oldStatusName',
}, {
    title: '基本单位',
    dataIndex: 'materialUnitName',
    key: 'materialUnitName',
}, {
     title: '原仓位',
     dataIndex: 'oldLocationName',
     key: 'oldLocationName',
 }, {
    title: '新仓位',
    dataIndex: 'newLocationName',
    key: 'newLocationName',
}, {
    title: '库存数量',
    dataIndex: 'oldInventoryQty',
    key: 'oldInventoryQty',
},{
    title: '移动数量',
    dataIndex: 'newInventoryQty',
    key: 'newInventoryQty',
}];

class AdjustmentMoveDetailsComp extends Component {
    constructor(props, context) {
        super(props, context);
    }
    tablePaging = (current) => {
        store.dispatch(AdjustmentListAct.takeOrderDetailsMaterialPm(typeof current == 'number'? Object.assign(this.props.newState.search,{pageSize:this.props.newState.search.pageSize==undefined?this.props.newState.paging.pageSize:this.props.newState.search.pageSize},{page: current }) : Object.assign(this.props.newState.search, current)));
    }
    render() {
        let {newState, tablePaging, materialLoading, ...props} = this.props;
        return (
                    <div className="adjust-receipt-materiel-list">
                        <MTable
                            cols={columns}
                            rowKey={"id"}
                            dataSource={newState.dataSource}
                            loading={newState.materialLoading}
                            paging={newState.paging}
                            pageOnChange={this.tablePaging}
                            pagination={false}
                            {...props}
                        />
                    </div>
        )
    }
}

export default AdjustmentMoveDetailsComp



