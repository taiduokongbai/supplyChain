/**
 * Created by MW on 2017/3/17.
 */

import { ReqApi } from '../../base/services/ReqApi'
import { Urls } from '../../base/consts/urls';
import { getNavs, getUrls } from '../../base/consts/MenusList';
import { prefixMsgPub } from '../../base/consts/UrlsConfig'

const actions = {
    childrenKey: "menuList",
    isChildren: (treeNode, childrenKey) => {
        return treeNode[childrenKey] && treeNode[childrenKey].length > 0 ? true : false;
    },
    treeIterator: (tree, level, childrenKey, fn, bool = true) => {
        tree.map((treeNode, index) => {
            let hasChildren = actions.isChildren(treeNode, childrenKey);
            if (hasChildren) {
                if (fn(treeNode, level, childrenKey, hasChildren)) {
                    actions.treeIterator(treeNode[childrenKey], level + 1, childrenKey, fn);
                }
            } else {
                fn(treeNode, level, childrenKey, hasChildren);
            }
        })
    },
    getNavBarMenusTree: () => {
        return ReqApi.get({
            // url: Urls.LOGIN_GET_SIDE_MENUES
            url: Urls.LOGIN_GETMENUES
        }).then((json) => {
            if (json.status === 2000) {
                let tree = [{
                    moduleCode: "work001",
                    moduleName: "工作",
                    url: `${prefixMsgPub}main.html`
                },
                {
                    moduleCode: "cloud001",
                    moduleName: "云产品",
                    url: "#",
                    menuList: getNavs(json.data.list).filter(t => t.hasAuth),
                }];

                tree.map((moduleItem, index) => {
                    if (moduleItem[actions.childrenKey] && moduleItem[actions.childrenKey].length > 0)
                        actions.formatNavbarMenus(moduleItem[actions.childrenKey]);
                });
                json.data.list = getUrls(tree);
            }
            return json;
        });
    },
    formatNavbarMenus: (resourceTree) => {
        let rooTreeNode = null;
        actions.treeIterator(resourceTree, 0, actions.childrenKey, function (treeNode, level, childrenKey, hasChildren) {
            treeNode["level"] = level;
            if (treeNode["level"] == 0) {
                rooTreeNode = treeNode;
                rooTreeNode["maxDep"] = 0;
            }

            if (!hasChildren) {
                rooTreeNode["maxDep"] = treeNode.level > rooTreeNode["maxDep"] ? treeNode.level : rooTreeNode["maxDep"];
            }
            let newNode = [];
            if (treeNode.menuList && treeNode.menuList.length > 0) {
                treeNode.menuList.forEach(item => {
                    if (item.hasAuth && !item.hidden) {
                        if (item.menuList && item.menuList.length > 0) {
                            item.menuList = item.menuList.filter(m => !m.hidden);
                        };
                        newNode.push(item);
                    }
                });
                treeNode.menuList = newNode;
            }
            return true;
        });
        return resourceTree;
    }




}

export default actions