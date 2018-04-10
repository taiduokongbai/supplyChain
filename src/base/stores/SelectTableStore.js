let { observable, action, computed, runInAction, toJS } = mobx;
import SearchBarStore from './SearchBarStore';
import TableStore from './TableStore';

export default class SelectTableStore extends TableStore {
    constructor() {
        super();
        this.searchBarStore = new SearchBarStore();
    }
    pages = {
        page: 1,
        pageSize: 5,
    }
    paging = {
        total: 0,
        current: 1,
        pageSize: 5,
    };

    get Props() {
        let p = super.Props;
        p.pagination.pageSizeOptions = ['5', '10', '20', '30'];
        return p;
    }
};
