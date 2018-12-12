const RecruitInfos = {
    Info_1: {
        title: '工资说明',
        structure: {
            RecruitInfo_1: {
                titleLabel: '基本情况',
                structure: {
                    Basic_1: {label: '发薪日', maxLength: '300'},
                    Basic_2: {label: '底薪', maxLength: '300'},
                    Basic_3: {label: '薪资结构', type: 'area', maxLength: '300'}
                }
            },
            RecruitInfo_2: {
                titleLabel: '食宿介绍',
                structure: {
                    RoomBoardInfo_1: {label: '伙食', maxLength: '300'},
                    RoomBoardInfo_2: {label: '住宿', maxLength: '300'},
                    RoomBoardInfo_3: {label: '交通', maxLength: '300'}
                }
            },
            RecruitInfo_3: {
                titleLabel: '合同介绍',
                structure: {
                    contract_1: {label: '合同说明', maxLength: '300'},
                    contract_2: {label: '工资发放', maxLength: '300'},
                    contract_3: {label: '保险说明', maxLength: '300'}
                }
            }
        }
    },
    Info_2: {
        title: '岗位状态',
        structure: {
            JobRequire_1: {label: '工作内容', maxLength: '300'},
            JobRequire_2: {label: '工时说明', maxLength: '300'},
            JobRequire_3: {label: '工作环境', maxLength: '300'}
        }
    }
};

function expansion(infoObj) {
    return Object.entries(infoObj).reduce((pre, cur) => {
        let key = cur[0];
        let value = cur[1];

        if (value.structure) {
            let expansions = expansion(value.structure);
            pre = {...pre, ...expansions};
        } else {
            pre[value.label] = key;
        }
        return pre;
    }, {});
}

const RecruitInfoMap = expansion(RecruitInfos);
export {RecruitInfos, RecruitInfoMap};

