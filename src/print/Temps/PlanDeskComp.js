import React, { Component } from "react";
import JsBarcode from 'jsbarcode';

export default class PlanDeskComp extends Component {
    componentDidMount() {
        this.setJsBarcode();
    }

    setJsBarcode = () => {
        this.props.data.map((item, index) => {
            JsBarcode(this['_barcodeSVG' + index], item.workOrderCode,
                {
                    format: "CODE128",//选择要使用的条形码类型
                    width: 2,//设置条之间的宽度
                    height: 30,//高度
                    displayValue: true,//是否在条形码下方显示文字
                    //text: "456",//覆盖显示的文本
                    //fontOptions: "bold italic",//使文字加粗体或变斜体
                    //font: "fantasy",//设置文本的字体
                    textAlign: "center",//设置文本的水平对齐方式
                    textPosition: "bottom",//设置文本的垂直位置
                    textMargin: 0,//设置条形码和文本之间的间距
                    fontSize: 12,//设置文本的大小
                    background: "#fff",//设置条形码的背景
                    lineColor: "#000",//设置条和文本的颜色。
                    margin: 0//设置条形码周围的空白边距
                }
            );
        })
    }

    render() {
        return (
            <div className="temp">
                <div>
                    {
                        this.props.data.map((item, index) => {
                            return (
                                <div key={index} className='item'>
                                    <h1>生产工单</h1>
                                    <div className='text-info'>
                                        <div className='left'>
                                            <div className='txt'>
                                                <div>订单编号：<strong>{item.orderCode}</strong></div>
                                                <div>客户名称：{item.customerName}</div>
                                            </div>
                                            <div className='txt'>
                                                <div>产品编号：<strong>{item.productCode}</strong></div>
                                                <div className='pro'>
                                                    <div>产品名称：{item.productName}</div>
                                                    <div>套数：<strong>{item.count.toFixed(2)}</strong></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='right'>工单单号：<svg ref={(ref) => this['_barcodeSVG' + index] = ref}></svg></div>
                                    </div>
                                    <table>
                                        <tr>
                                            <th>物料编码</th>
                                            <th>物料名称</th>
                                            <th>规格代号</th>
                                            <th>数量</th>
                                            <th>工时</th>
                                            <th>计划完工日期</th>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '120px' }}>{item.materialCode}</td>
                                            <td style={{ width: '120px' }}>{item.materialName}</td>
                                            <td style={{ width: '140px' }}>{item.materialSymbol}</td>
                                            <td style={{ width: '50px' }}>{item.qty}</td>
                                            <td style={{ width: '50px' }}>{item.predictWorkhours}</td>
                                            <td style={{ width: '120px' }}>{item.predictReceiveDate}</td>
                                        </tr>
                                    </table>
                                    <div className='footer'>
                                        <span>制 单 人：{item.originator}</span>
                                        <span>打印日期：{item.printTime}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}