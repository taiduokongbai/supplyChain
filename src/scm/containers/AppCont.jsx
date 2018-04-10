import React, {Component} from "react";
import LayoutTop from '../../main/components/LayoutTopComp';
import LayoutSider from '../components/LayoutSiderComp';
import TabsCont from './TabsCont';
import PageLoadingCont from './PageLoadingCont';
import {Layout, Menu, Breadcrumb, Icon} from '../../base/components/AntdComp';
import actions from '../../main/actions/LayoutTopAct'
import TabsAct from '../actions/TabsAct';
import {store} from '../data/StoreConfig';
const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

class AppCont extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            pageLoading: true,
            collapsed: false,
            mode: 'inline'
        }
    }
    componentDidMount() {
        let { tab } = this.props.location.query;
        setTimeout(() => {
            this.setState({
                pageLoading: false
            })
        }, 10);
        if (tab != undefined){
            store.dispatch(TabsAct.getMenus()).then(json => {
                store.dispatch(TabsAct.TabInsert(tab));
            })
        }    
    }
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    }
    render() {
        return (
            <div className="ew-layout">
                <Layout style={{ height: '100vh'}}>
                    <Header className="ew-layout-header" style={{ position: 'fixed', width: '100%' }}>
                        <LayoutTop {...this.props}/>
                    </Header>
                    <Layout style={{ marginTop: 38 }}>
                        <Sider
                            width={160}
                            collapsible
                            collapsed={this.state.collapsed}
                            onCollapse={this.onCollapse}
                            className="ew-layout-sider"
                        >
                            <LayoutSider mode={this.state.mode}/>
                        </Sider>

                            <Content id="ew-content" className="ew-layout-content" style={{ overflow: 'initial' }}>
                                <TabsCont />
                            </Content>

                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default AppCont;

