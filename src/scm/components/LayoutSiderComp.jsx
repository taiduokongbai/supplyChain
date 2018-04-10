import React, { Component } from "react";
import { connect } from "react-redux";
import TabsAct from '../actions/TabsAct';
import { Menu, Icon } from '../../base/components/AntdComp';
import { getMenusComp } from '../../base/consts/MenusList';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class LayoutSider extends Component {
    constructor(prop) {
        super(prop);
    }
    handleClick = (e) => {
        this.props.tabAdd(e);
    }
    render() {
        const { mode, menusData } = this.props;
        if (this.props.openKeys.length > 0)
            return (
                <div className="sider-content">
                    <Menu
                        defaultOpenKeys={this.props.openKeys}
                        selectedKeys={[this.props.activeKey]}
                        inlineIndent={18}
                        onClick={this.handleClick}
                        mode={mode}>
                        {getMenusComp(menusData)}
                    </Menu>
                </div>
            )
        else return (<span></span>);
    }
}
const mapStateToProps = (state) => {
    return state.TabsRedu.toJS();
}
const mapDispatchToProps = (dispatch) => ({
    tabAdd: (e) => {
        dispatch(TabsAct.TabAdd({
            title: e.item.props.title,
            key: e.key
        }));
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(LayoutSider);