import React, { Component, PropTypes } from "react";
import { Row, Col } from '../../../base/components/AntdComp';
import ModalComp from '../../../base/mobxComps/ModalComp';
import TooltipComp from "../../../base/mobxComps/TooltipComp";
import { formatNullStr } from '../../../base/consts/Utils';

let { observer } = mobxReact;
import { supGoodsViewStore } from '../stores/SupGoodsViewStore';
import { measureStore } from '../../data/DropDownStore';
import { enumStore } from '../../../base/stores/EnumStore';


@observer
class SupGoodsViewComp extends ModalComp {
    constructor(props, context) {
        super(props, context);
        this.store = supGoodsViewStore;
    }
    getFooter=()=>{}
    handleCancel = () => {
        if (!this.store.loading) {
            this.store.setVisible(false);
        }
    }
    getConvertInfo = () => {
        let {
            convertFactor,
            materialQty,
            materialUnitName,
            materialCode,
            materialName,
            goodsQty,
            goodsUnitName,
            goodsCode,
            goodsName
        } = this.store.detail;
        return (
            <div>
                <div>转换因子：{formatNullStr(convertFactor)}</div>
                {
                    convertFactor ?
                        <div className="info">
                            <span>{materialQty + materialUnitName}</span>
                            <TooltipComp attr={{ text: '[' + materialCode + ']' + materialName, wid: 202 }} />
                            <span className="eq"><span>=</span></span>
                            <span>{goodsQty + goodsUnitName}</span>
                            <TooltipComp attr={{ text: '[' + goodsCode + ']' + goodsName, wid: 228 }} />
                        </div>
                        : null
                }
            </div>
        )
    }
    getComp = () => {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        let { detail } = this.store;
        let supplierTitle = detail.supplierCode ? `[${detail.supplierCode}]${detail.supplierFull}`:'';
        return (
            <div className="supGoodsView">
                <div className="head">
                    <span className="label">供应商：</span>
                    <span>{formatNullStr(supplierTitle)}</span>
                    <span className="status">{formatNullStr(enumStore.getEnum('dataStatus', detail.status))}</span>
                </div>
                <Row>
                    <Col span={11}>
                        <div className="title">
                            <div className="line"></div>
                            <div className="text">物料信息</div>
                            <div className="line"></div>
                        </div>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={12}>
                        <div className="title">
                            <div className="line"></div>
                            <div className="text2">供应商商品信息</div>
                            <div className="line"></div>
                        </div>
                    </Col>
                </Row>  
                <Row className="main-info">
                    <Col span={12}>
                        <ul className="colone">
                            <li><span>物料编码：</span>{formatNullStr(detail.materialCode)}</li>
                            <li><span>物料名称：</span><TooltipComp attr={{ text: formatNullStr(detail.materialName), wid: 204 }} /></li>
                            <li><span>型号：</span>{formatNullStr(detail.materialModel)}</li>
                            <li><span>规格：</span>{formatNullStr(detail.materialSpec)}</li>
                            <li><span>材料：</span>{formatNullStr(detail.materialTexture)}</li>
                            <li><span>数量：</span>{formatNullStr(detail.materialQty)}</li>
                            <li><span>单位：</span>{formatNullStr(detail.materialUnitName)}</li>
                        </ul>
                    </Col>
                    <Col span={12}>
                        <ul className="coltwo">
                            <li><span>商品编码：</span>{formatNullStr(detail.goodsCode)}</li>
                            <li><span>商品名称：</span><TooltipComp attr={{ text: formatNullStr(detail.goodsName), wid: 180 }} /></li>
                            <li><span>型号：</span>{formatNullStr(detail.goodsModel)}</li>
                            <li><span>规格：</span>{formatNullStr(detail.goodsSpec)}</li>
                            <li><span>材料：</span>{formatNullStr(detail.goodsTexture)}</li>
                            <li><span>商品数量：</span>{formatNullStr(detail.goodsQty)}</li>
                            <li><span>商品单位：</span>{formatNullStr(detail.goodsUnitName)}</li>
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div className="convertInfo">{this.getConvertInfo()}</div>
                    </Col>
                </Row>
            </div>    
        )
    }

}
export default SupGoodsViewComp;