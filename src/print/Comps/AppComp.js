import React, { Component } from "react";
import { Button, message } from '../../base/components/AntdComp';
import { prefixScm } from '../../base/consts/UrlsConfig';
import { ReqApi, setJsonHead } from '../../base/services/ReqApi';
import ReactDom from "react-dom";
import PrintTemplate from 'react-print';
import PlanDeskComp from '../Temps/PlanDeskComp';

class PrintComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            disabled: true,
            TempComp: this.getTemp() ,
        };
        setJsonHead();        
    }

    componentWillMount() {
        let { temp, data } = this.props.location.query;
        ReqApi.get({
            url: this.getUrl(temp),
            pm: {ids:data}
        }).then(json => {
            if (json.status == 2000) {
                window.document.title = json.data.companyName;
                this.setState({
                    disabled: false,
                    TempComp: this.getTemp(temp,json.data.list),
                });
            } else {
                this.setState({
                    disabled: true,
                });
                message.warn("获取数据失败！")
            }
        })
    }
    getUrl = (temp) => {
        switch (temp) {
            case "plan":
                return `${prefixScm}/plan/dispatchingConsole/printList`;
            default:
                return "";
        }
    }
    getTemp = (temp,data=[]) => {
        switch (temp) {
            case "plan":
                return () => <PlanDeskComp data={data} />
                break
            default:
                return ()=><div></div> 
        }
    }
    onPrint = () =>{
        let { TempComp } = this.state;
        let renderComp = (
            <PrintTemplate>
                <TempComp />
            </PrintTemplate>
        );
        ReactDom.render(
            renderComp,
            document.getElementById('print-mount')
        );
        window.print();
    }
    onSavePdf = () => {
        // 将 id 为 content 的 div 渲染成 canvas
        html2canvas(document.getElementById("temp"), {
            // 渲染完成时调用，获得 canvas
            onrendered: function (canvas) {
                // 从 canvas 提取图片数据
                var imgData = canvas.toDataURL('image/jpeg');
                var doc = new jsPDF("p", "mm", "a4");   
                doc.addImage(imgData, 'JPEG', -150, 10, 0, 0);
                doc.save(`${window.document.title}.pdf`);
            },
            background:'#FFFFFF',
        });
    }
    render() {
        let { TempComp, disabled } = this.state;
        return (
            <div>
                {disabled ? null :
                    <div>
                        <Button type="primary" onClick={this.onPrint} style={{ width: "50%" }} >打印</Button>
                        <Button type="ghost" onClick={this.onSavePdf} style={{ width: "50%" }} >下载PDF文件</Button>
                    </div>
                }    
                <div id="temp">
                    <TempComp />
                </div>    
            </div>
        )
    }

}


export default PrintComp;