import React from 'react';
import { Popconfirm } from '../components/AntdComp';

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
        '费用明细': 'c2mfont c2m-feiyongmingxi2 columns-distribute',
        '导入': 'c2mfont c2m-daoru columns-distribute',
        '图片上传': 'c2mfont c2m-daorutupian columns-distribute',
        '查看物料图片': 'c2mfont c2m-wuliaotupian columns-distribute',
    }
    return <div className="base-operations">
        {
            Array.isArray(operations)? operations.map((item, index) => {
                let icon = item.icon || defaultIcon[item.title];
                if (item.show) {
                    if (item.titleText && item.titleText.length > 0) {
                        return <Popconfirm
                            key={index}
                            onConfirm={item.fun}
                            placement="topRight"
                            title={
                                item.titleText.length > 1 ?
                                    <div>
                                        <h5>{item.titleText[0]}</h5>
                                        <p>{item.titleText[1]}</p>
                                    </div>
                                    : <h5>{item.titleText[0]}</h5>
                            }
                        >
                            <span title={item.title}>
                                {
                                    icon ?
                                        <i className={icon} style={{
                                            heigth:'18px',
                                            lineHeight:'18px',
                                            width:'18px',
                                            marginRight: '10px' }} />
                                        :
                                        item.title
                                }
                            </span>
                        </Popconfirm>
                    } else {
                        return <span onClick={item.fun} key={index} title={item.title != '--' ? item.title : null} style={item.title == '--' ? { display: 'inline-block', width: '28px', textAlign: 'left', paddingLeft: '4px' } : {}}>
                            {
                                icon ?
                                    <i className={icon} style={{
                                        heigth:'18px',
                                        lineHeight:'18px',
                                        width:'18px',
                                        marginRight: '10px' }} />
                                    :
                                    item.title
                            }
                        </span>
                    }
                } else if (item.default) {
                    return <div key={index} style={{
                        //marginRight: '10px',
                        width: '18px',
                        display: 'inline-block',
                        textAlign: 'center',
                        marginRight: '10px',
                    }} >{item.default}</div>
                } else return ;
            }):null
        }
    </div>
}