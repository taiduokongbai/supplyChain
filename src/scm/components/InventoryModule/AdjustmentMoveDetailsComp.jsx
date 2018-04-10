import React, { Component } from 'react'
import AdjustmentDetailsMoveTableComp from './AdjustmentDetailsMoveTableComp'
import AdjustmentDetailsMountTableComp from './AdjustmentDetailsMountTableComp'
import AdjustmentDetailsBatchTableComp from './AdjustmentDetailsBatchTableComp'
import AdjustmentDetailsStateTableComp from './AdjustmentDetailsStateTableComp'
import { Spin, Row, Col } from '../../../base/components/AntdComp'
import { formatNullStr } from "../../../base/consts/Utils";

class AdjustmentMoveDetailsComp extends Component {
    constructor(props, context) {
        super(props, context);
    }
    getTableComp=(tablePm)=>{
        switch(tablePm){
            case "114":return  <AdjustmentDetailsMoveTableComp {...this.props} />;
            case "115":return  <AdjustmentDetailsMountTableComp {...this.props} />;
            case "116":return  <AdjustmentDetailsBatchTableComp {...this.props} />;
            case "117":return  <AdjustmentDetailsStateTableComp {...this.props} />;
            default :return false;
        }
    }
    render() {
        let info =  this.props.newState.takeOrderDetailsPm|| '';
        return (
            <div className="adjust-receipt-details-box">
                <Spin spinning={this.props.newState.DetailsPmLoading}>
                    <div className="adjust-receipt-info">
                        <p className="adjust-receipt-choose-order">调整单号：<span>{formatNullStr(info.adjustCode)}</span></p>
                        <div className="adjust-receipt-info-list">
                            <p className="adjust-belong-warehouse">所属仓库：<span> {
                                formatNullStr(info.warehouseName)
                            }</span></p>
                            <p>调整类型：<span>{formatNullStr(info.adjustTypeName)}</span></p>
                        </div>
                    </div>
                    <div className="adjust-receipt-details-info-list">
                            <p><span className="adjust-receipt-size-lable">创建人：</span><span>{formatNullStr(info.createByName)}</span></p>
                            <p><span className="adjust-receipt-size-lable">创建时间：</span><span>{formatNullStr(info.createDate)}</span></p>
                            <p><span className="adjust-receipt-size-lable">调整原因：</span><span className="adjust-choose-reason">{formatNullStr(info.adjustReason)}</span></p>
                    </div>
                       {
                         this.getTableComp(info.adjustTypeCode)
                       }
                </Spin>
            </div>

        )
    }
}

export default AdjustmentMoveDetailsComp



