import { ReqApi } from '../services/ReqApi'
import AddressUrls from '../consts/AddressUrls';
let { observable, action, computed, runInAction, createTransformer } = mobx;
export default class LinkAgeStore {
    Level = [{
        valueName: 'countryCode',
        labelName: 'countryName',
        isLeaf: false,
        fetchFunc: () => ReqApi.get({
            url: AddressUrls.COUNTRY_SELECTED,
            pm: {},
        }),
        addressName:''
    }, {
        valueName: 'provinceCode',
        labelName: 'provinceName',
        isLeaf: false,
        fetchFunc: (countryCode) => ReqApi.get({
            url: AddressUrls.PROVINCE_SELECTED,
            pm: { countryCode }
        }),
        addressName:''
    }, {
        valueName: 'cityCode',
        labelName: 'cityName',
        isLeaf: false,
        fetchFunc: (provinceCode) => ReqApi.get({
            url: AddressUrls.CITY_SELECTED,
            pm: { provinceCode }
        }),
        addressName:''
    }, {
        valueName: 'countyCode',
        labelName: 'countyName',
        isLeaf: true,
        fetchFunc: (cityCode) => ReqApi.get({
            url: AddressUrls.COUNTY_SELECTED,
            pm: { cityCode }
        }),
        addressName:''
    }]


    @observable loading = false;
    @observable options = [];
    @observable value = [];
    changeOnSelect = true;
    placeholder = '请选择';
    notFoundContent = '暂无数据';
    detailAddress='';
    @computed
    get DetailAddress(){
        if(!this.detailAddress){
            this.detailAddress=this.Level.map(item=>item.addressName).join('');
        }
        return this.detailAddress;
    }
    @action
    setValue(value) {
        if (value[0] == '' || value[0] == undefined) {
            this.value = [];
        } else {
            this.value = value;
        }
    }
    @action
    changeData(value) {
        let obj = {};
        this.Level.forEach(item => {
            obj[item.valueName] = ''
        });
        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                obj[this.Level[index].valueName] = item;
            })
        }
        return obj;
    }

    @observable init = false;
    @action.bound
    initData() {
        this.getCountrys(this.value);
    }
    @action.bound
    getCountrys(value) {
        let countryIndex;
        let countrys = this.options;

        countrys = countrys ? countrys.slice() : [];
        if (countrys.length < 1) {
            ReqApi.get({
                url: AddressUrls.COUNTRY_SELECTED,
                pm: {},
            }).then(json => {
                if (json.status === 2000) {
                    json.data.list.map(item => {
                        item.label = item.countryName;
                        item.value = item.countryCode;
                        item.isLeaf = false;
                        return item;
                    });
                    this.options = json.data.list;
                }
                return json.data.list;
            }).then((list) => {
                if (value[0]) {
                    countryIndex = list.map(i => i.countryCode).indexOf(value[0]);
                    this.Level.slice()[0].addressName=list[countryIndex].countryName;
                    this.getProvinces(value, countryIndex);
                }
            });
        } else {
            if (value[0]) {
                countryIndex = countrys.map(i => i.countryCode).indexOf(value[0]);
                this.Level.slice()[0].addressName=countrys[countryIndex].countryName;
                this.getProvinces(value, countryIndex);
            }
        }
    }
    @action.bound
    getProvinces(value, countryIndex) {
        let provinceIndex;
        let provinces = this.options[countryIndex].children;
        provinces = provinces ? provinces.slice() : [];
        if (provinces.length < 1) {
            ReqApi.get({
                url: AddressUrls.PROVINCE_SELECTED,
                pm: { countryCode: value[0] }
            }).then(json => {
                if (json.status === 2000) {
                    json.data.list.map(item => {
                        item.label = item.provinceName;
                        item.value = item.provinceCode;
                        item.isLeaf = false;
                        return item;
                    });
                    provinceIndex = json.data.list.map(i => i.provinceCode).indexOf(value[1]);
                    this.options[countryIndex].children = json.data.list;
                    this.options = [...this.options.slice()];//刷新页面
                }
                return json.data.list;
                }).then(list => {
                if (value[1]) {
                    provinceIndex = list.map(i => i.provinceCode).indexOf(value[1]);
                    this.Level.slice()[1].addressName=list[provinceIndex].provinceName;
                    this.getCitys(value, countryIndex, provinceIndex);
                }
            })
        } else {
            if (value[1]) {
                provinceIndex = provinces.map(i => i.provinceCode).indexOf(value[1]);
                this.Level.slice()[1].addressName=provinces[provinceIndex].provinceName;
                this.getCitys(value, countryIndex, provinceIndex);
            }
        }
    }
    @action.bound
    getCitys(value, countryIndex, provinceIndex) {
        let cityIndex;
        let citys = this.options[countryIndex].children[provinceIndex].children;
        citys = citys ? citys.slice() : [];
        if (citys.length < 1) {
            ReqApi.get({
                url: AddressUrls.CITY_SELECTED,
                pm: { provinceCode: value[1] }
            }).then(json => {
                if (json.status === 2000) {
                    json.data.list.map(item => {
                        item.label = item.cityName;
                        item.value = item.cityCode;
                        item.isLeaf = false;
                        return item;
                    });
                    cityIndex = json.data.list.map(i => i.cityCode).indexOf(value[2]);
                    this.options[countryIndex].children[provinceIndex].children = json.data.list;
                    this.options = [...this.options.slice()];//刷新页面
                }
                return json.data.list;
            }).then(list => {
                if (value[2]) {
                    cityIndex = list.map(i => i.cityCode).indexOf(value[2]);
                    this.Level.slice()[2].addressName=list[cityIndex].cityName;
                    this.getCountys(value, countryIndex, provinceIndex, cityIndex);
                }
            })
        } else {
            if (value[2]) {
                cityIndex = citys.map(i => i.cityCode).indexOf(value[2]);
                this.Level.slice()[2].addressName=citys[cityIndex].cityName;
                this.getCountys(value, countryIndex, provinceIndex, cityIndex);
            }
        }
    }
    @action.bound
    getCountys(value, countryIndex, provinceIndex, cityIndex) {
        let countyIndex;
        let countys = this.options[countryIndex].children[provinceIndex].children[cityIndex].children;
        countys = countys ? countys.slice() : [];
        if (countys.length < 1) {
            ReqApi.get({
                url: AddressUrls.COUNTY_SELECTED,
                pm: { cityCode: value[2] }
            }).then(json => {
                if (json.status === 2000) {
                    json.data.list.map(item => {
                        item.label = item.countyName;
                        item.value = item.countyCode;
                        item.isLeaf = true;
                        return item;
                    });
                    this.options[countryIndex].children[provinceIndex].children[cityIndex].children = json.data.list;
                    this.options = [...this.options.slice()];//刷新页面
                }
                return json.data.list;
            }).then(list => {
                if (value[3]) {
                    countyIndex = list.map(i => i.countyCode).indexOf(value[3]);
                    this.Level.slice()[3].addressName=list[countyIndex].countyName;
                }
            })
        } else {
            if (value[3]) {
                countyIndex = countys.map(i => i.countyCode).indexOf(value[3]);
                this.Level.slice()[3].addressName=countys[countyIndex].countyName;
            }
        }
    }
    @action.bound
    loadData(selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        if (targetOption.countyCode && targetOption.countyCode != '') {
            return;
        } else if (targetOption.cityCode && targetOption.cityCode != '') {
            this.setOptions(targetOption, 2);
            return;
        } else if (targetOption.provinceCode && targetOption.provinceCode != '') {
            this.setOptions(targetOption, 1);
            return;
        } else if (targetOption.countryCode && targetOption.countryCode != '') {
            this.setOptions(targetOption, 0);
            return;
        }
    }

    @action.bound
    setOptions(targetOption, index) {
        targetOption.loading = true;
        let item = this.Level.slice()[index];
        let nextItem = this.Level.slice()[index + 1];
        nextItem.fetchFunc(targetOption[item.valueName]).then(json => {
            if (json.status === 2000) {
                json.data.list.map(i => {
                    i.label = i[nextItem.labelName];
                    i.value = i[nextItem.valueName];
                    i.isLeaf = nextItem.isLeaf;
                    return i;
                });
                targetOption.children = json.data.list;
            }
            targetOption.loading = false;
            this.options = [...this.options.slice()];//刷新页面
        });
    }
    constructor() {
        this.transformer = createTransformer((store) => ({
            value: store.value.slice(),
            options: store.options.slice(),
            loadData: store.loadData,
            changeOnSelect: store.changeOnSelect,
            placeholder: store.placeholder,
            notFoundContent: store.notFoundContent,
        }));
    }

    get Props() {
        return this.transformer(this);
    }
};

