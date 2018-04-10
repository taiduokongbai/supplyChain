import { message } from 'antd';
import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import { ProDesignBomFetch } from '../../consts/ProDesignBomUrls';

let { observable, action, computed, runInAction, toJS } = mobx;

export class ProductTableStore extends TableStore {
    pages = {
        page: 1,
        pageSize: 15
    };

    paging = {
        total: 0,
        current: 1,
        pageSize: 15,
    };
    pageSizeOptions = ['10', '15','20', '30', '50'];

    //改变状态
    @action
    fetchTableList(params) {
        this.loading = true;
        searchBarStore.setLoading(true);
        let pm = searchBarStore.Pm.productName? {productCode:searchBarStore.Pm.productName}:
            (searchBarStore.Pm.productCategoryName?{productCategoryCode:searchBarStore.Pm.productCategoryName}:'');
        pm = { ...this.pages, ...searchBarStore.Pm,...pm, ...params };
        if(pm.status=='-1'){
            delete pm.status;
        }
        return ProDesignBomFetch.getProductDesignBomList(pm)
            .then(this.updateTableList)
            .then(json => {
                searchBarStore.setLoading(false);
                return json
            });
    }

    //删除
    @action
    fetchProductDesignBomDelete(id) {
        this.loading = true;
        let pm = { id: id };
        return ProDesignBomFetch.delProductDesignBomList(pm).then(json => {
            if (json.status === 2000) {
                runInAction(() => {
                    this.fetchTableList();
                });
                message.success('删除成功');
            } else {
                runInAction(()=>{
                    this.loading=false;
                });
            }
            return json;
        })
    }
}

let searchBarStore = new SearchBarStore(),
    productTableStore = new ProductTableStore();

export { searchBarStore, productTableStore }