import React from 'react';
import { Popconfirm } from '../../../base/components/AntdComp';

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
                                        <i className={icon} style={{ marginRight: '10px',fontSize:'16px',height:'18px',lineHeight:'18px',width:'18px' }} />
                                        :
                                        item.title
                                }
                            </span>
                        </Popconfirm>
                    } else {
                        return <span onClick={item.fun} key={index} title={item.title}>
                            {
                                icon ?
                                    <i className={icon} style={{ marginRight: '10px',fontSize:'16px',height:'18px',lineHeight:'18px',width:'18px'}} />
                                    :
                                    item.title
                            }
                        </span>
                    }
                } else{
                    return <span key={index} style={{marginRight:'10px',display:'inline-block',width:'18px',height:'18px',textAlign:'center',lineHeight:'17px'}}>--</span>
                } ;
            }):null
        }
    </div>
}