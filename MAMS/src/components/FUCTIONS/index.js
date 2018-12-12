export default {
    chooseType: (e, ChooseArr, TypeArr, setParams, STATE_NAME, chooseAll) => { // 分别为循环体loopBody，当前循环的某个参数key，循环条件term，回调函数
        if (TypeArr.trim() === "") {
            TypeArr = [];
        } else {
            TypeArr = TypeArr.split(",").map((item)=>{return Number(item);});
        }
        if (e.target.checked && e.target.value) { // 选择单个
            TypeArr.push(e.target.value);
            ChooseArr[+e.target.value - 1].chooseType = true;
            setParams(STATE_NAME, {
                chooseTypes: ChooseArr
            });
            if (TypeArr.length === ChooseArr.length) {
                setParams(STATE_NAME, {
                    chooseAll: false
                });
            }
        } else if (e.target.value === "") { // 选择全部
            if (chooseAll) {
                for (let i = 0; i < ChooseArr.length; i++) {
                    ChooseArr[i].chooseType = true;
                }
                setParams(STATE_NAME, {
                    chooseTypes: ChooseArr,
                    chooseAll: false
                });
                TypeArr = ChooseArr.map((item, index) => {
                    return (index + 1);
                });
            } else { // 全部取消
                for (let i = 0; i < ChooseArr.length; i++) {
                    ChooseArr[i].chooseType = false;
                }
                setParams(STATE_NAME, {
                    chooseTypes: ChooseArr,
                    chooseAll: true
                });
                TypeArr = [];
            }
        } else if (!e.target.checked) { // 取消单个
            ChooseArr[+e.target.value - 1].chooseType = false;
            setParams(STATE_NAME, {
                chooseTypes: ChooseArr
            });
            for (let i = 0; i < TypeArr.length; i++) {
                if (TypeArr[i] === e.target.value) {
                    TypeArr.splice(i, 1);
                    i--;
                }
            }
            setParams(STATE_NAME, {
                chooseAll: true
            });
        }
        return{
            TypeArr: TypeArr,
            ChooseArr: ChooseArr
        };
    }
};