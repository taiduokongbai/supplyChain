import React, { Component } from 'react';
import { Tree } from '../../../base/components/AntdComp';
import { storageBinListTreeStore } from '../store/StorageBinListTreeStore';
import { searchBarStore, storageBinListStore } from '../store/StorageBinListStore'
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
let TreeNode = Tree.TreeNode;

export default class StorageBinListTreeComp extends Component {
    constructor(props) {
        super(props);
        this.store = storageBinListTreeStore;
        this.state={
            treeNodeColor: true,
            changeBgColor:"storage-tree-all"
        }
    }

    componentDidMount() {
        this.store.fetchTreeList()
    }
    drawMapTreeTreeNode = (data) => data.map((item) => {
        if (item.children) {
            if (item.children.length > 0) {
                return (
                    <TreeNode {...item} key={item.id} className={this.state.treeNodeColor? '':'change-color'} title={
                        <div>
                            <p className="storage-text">{item.text}</p>
                        </div>
                    } >
                        {
                            this.drawMapTreeTreeNode(item.children)
                        }
                    </TreeNode>
                );
            } else {
                delete item.children;
            }
        }
        return (
            <TreeNode {...item} key={item.id} title={
                <div>
                    <p className="storage-text">{item.text}</p>
                </div>
            } >

            </TreeNode>
        );

    })
    onSelect=(selectedKeys, e)=>{
        this.setState({treeNodeColor:true})
        storageBinListTreeStore.stockIds = [e.node.props.attribute.stockIds];
        storageBinListStore.fetchTableList({ page: 1, pageSize: 15, status: "", stockIds: storageBinListTreeStore.stockIds }, 1)
        let item = {
            key: "status",
            label: "状态",
            type: "enumSelect",
            enumCode: "storageType",
            style: { width: 200 },
            defaultValue: ""
        }
        searchBarStore.setSearchKey('status', item);
        this.setState({changeBgColor:"storage-tree-all"})
    }
    selectAll = () => {
        this.setState({treeNodeColor:false})
        storageBinListTreeStore.stockIds = "";
        storageBinListStore.fetchTableList({ page: 1, pageSize: 15, status: "", stockIds:storageBinListTreeStore.stockIds }, 1)
        let item = {
            key: "status",
            label: "状态",
            type: "enumSelect",
            enumCode: "storageType",
            style: { width: 200 },
            defaultValue: ""
        }
        searchBarStore.setSearchKey('status', item);
        this.setState({changeBgColor:"storage-tree-all storage-tree-all-changeBgcolor "})
    }
    render() {
        let renderTree;
        {
            this.store.treeData.map((item) => {
                if (item.length > 0) {
                    renderTree = <Tree defaultExpandAll={true} onSelect={this.onSelect}>
                        {this.drawMapTreeTreeNode(item)}
                    </Tree>
                }
            })
        }
        return (
            <div className="storage-tree">
                <div className={this.state.changeBgColor} onClick={this.selectAll}>所有仓位</div>
                {renderTree}
            </div>
        )
    }
}