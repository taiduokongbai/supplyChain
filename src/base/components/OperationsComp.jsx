import React from 'react';
import { Popconfirm } from './AntdComp';

export default ({ operations }) => {
    let defaultIcon = {
        '编辑': 'c2mfont c2m-bianji columns-distribute',
        '删除': 'c2mfont c2m-shanchu columns-distribute',
        '启用': 'c2mfont c2m-qiyong columns-distribute',
        '禁用': 'c2mfont c2m-jinyong columns-distribute',
        '确定': 'c2mfont c2m-queren columns-distribute',
        '取消': 'c2mfont c2m-quxiao1 columns-distribute',
        '执行': 'c2mfont c2m-zhihang columns-distribute',
        '预收货': 'c2mfont c2m-yushouhuo columns-distribute',
        '分配': 'c2mfont c2m-fenpei columns-distribute',
        '导入': 'c2mfont c2m-daoru_nor columns-distribute',
        '图片上传': 'c2mfont c2m-daorutupian columns-distribute',
        '查看物料图片': 'c2mfont c2m-wuliaotupian columns-distribute',
    }
    return <div>
        {
            operations.map((item, index) => {
                let icon = item.icon || defaultIcon[item.title];
                if (item.show) {
                    if (item.titleText && item.titleText.length > 0) {
                        return <Popconfirm placement="topRight" title={
                            item.titleText.length > 1 ?
                                <div>
                                    <h5>{item.titleText[0]}</h5>
                                    <p>{item.titleText[1]}</p>
                                </div>
                                : <h5>{item.titleText[0]}</h5>
                        }
                            onConfirm={item.fun}
                            key={index}
                        >
                            <a href="#" title={item.title}>{icon ? <i className={icon} style={{
                                heigth:'18px',
                                lineHeight:'18px',
                                width:'18px',
                                marginRight: '10px' }} /> : item.title}</a>
                        </Popconfirm>
                    } else {
                        return <a href="#" title={item.title} onClick={item.fun} key={index}>
                            {icon ? <i className={icon} style={{
                                heigth:'18px',
                                lineHeight:'18px',
                                width:'18px',
                                marginRight: '10px' }} /> : item.title}
                        </a>
                    }
                } else if (item.default) {
                    return <div key={index} style={{
                        marginRight: '10px',
                        width: '18px',
                        display: 'inline-block',
                        textAlign: 'center'
                    }} >{item.default}</div>
                }  else return
            })
        }
    </div>
}

//example:
// columns[columns.length - 1].render = (txt, record, index) => {
//     let opts = [
//         {
//             title: '编辑',
//             titleText: [],
//             icon: '',
//             fun: () => this.editProduction(record.orderCode),
//             show: true,//record.orderStatus == "0" || record.orderStatus == "4",
//         },
//         {
//             title: "删除",
//             titleText: ['确定删除该条订单吗？', '删除后，该条订单记录将不可恢复！'],
//             icon: '',
//             show: true,//record.orderStatus == "0",
//             fun: () => this.delProduction(record.orderCode),
//         },
//         {
//             title: record.orderStatus == "0" ? '启用' : '禁用',
//             titleText: record.orderStatus == "0" ? ['确认启用该数据吗？'] : ['确认禁用该数据吗？'],
//             icon: '',
//             show: true,
//             fun: record.orderStatus == "0" ? () => this.delProduction(record.orderCode) : () => this.delProduction(record.orderCode)
//         }
//     ];
//     return <OperationsComp operations={opts} />;
// };