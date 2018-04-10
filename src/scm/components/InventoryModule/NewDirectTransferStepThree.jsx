/**
 * Created by MW on 2017/9/5.
 */
import React, {Component} from 'react'
import MTable from '../../../base/components/TableComp'
class NewDirectTransferStepThree extends Component{
    constructor(props){
        super(props);
        this.columns = [
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
                title: '调出仓库',
                dataIndex: 'allotOutSiteCode',
                key: 'allotOutSiteCode'
            }, {
                title: '调出仓位',
                dataIndex: 'allotOutLocationCode',
                key: 'allotOutLocationCode'
            }, {
                title: '原批次号',
                dataIndex: 'allotOutBatchCode',
                key: 'allotOutBatchCode'
            }, {
                title: '调入仓库',
                dataIndex: 'allotInSiteCode',
                key: 'allotInSiteCode'
            }, {
                title: '调入仓位',
                dataIndex: 'allotInLocationCode',
                key: 'allotInLocationCode'
            }, {
                title: '现批次号',
                dataIndex: 'allotInBatchCode',
                key: 'allotInBatchCode'
            },{
                title: '调拨数量',
                dataIndex: 'allotInQty',
                key: 'allotInQty'
            }, {
                title: '基本单位',
                dataIndex: 'measureUnitName',
                key: 'measureUnitName'
            }
        ];
    }

    render(){
        return (
            <div>
                <MTable cols={this.columns} />
            </div>
        )
    }
}

export default NewDirectTransferStepThree