import React from 'react';
import { Row, Col, Form, Input, Card } from 'antd';
const FormItem = Form.Item;
import Mapping_MAMS_Recruitment, {
    getEnum,
    Mapping_MAMS_Recruit_User
} from 'CONFIG/EnumerateLib/Mapping_MAMS_Recruitment';
class BlockTag extends React.PureComponent {
    constructor(props) {
        super(props);
        this.euIDCardTypeList = Mapping_MAMS_Recruit_User.euIDCardTypeList;
        this.euEducationList = Mapping_MAMS_Recruit_User.euEducationList;
        this.euClothesList = Mapping_MAMS_Recruit_User.euClothesList;
        this.euCharactersList = Mapping_MAMS_Recruit_User.euCharactersList;
        this.euForeignBodiesList = Mapping_MAMS_Recruit_User.euForeignBodiesList;
        this.euMathList = Mapping_MAMS_Recruit_User.euMathList;
        this.euCriminalList = Mapping_MAMS_Recruit_User.euCriminalList;
        this.euSmokeScarList = Mapping_MAMS_Recruit_User.euSmokeScarList;
        this.euTattooList = Mapping_MAMS_Recruit_User.euTattooList;
    }
    getTagText(key, mapList) {
        if (!key || !key.length) {
            return '-';
        }
        if (typeof key === 'number' || typeof key === 'string') {
            for (let i = 0; i < mapList.length; i++) {
                let c = mapList[i];
                if (c.key === key) {
                    return c.value;
                }
            }
        }
        if (typeof key === 'object') {
            let res = '';
            for (let j = 0; j < key.length; j++) {
                let sk = key[j];
                for (let i = 0; i < mapList.length; i++) {
                    let c = mapList[i];
                    if (c.key === sk) {
                        res = res + (res.length ? ',' : '') + c.value;
                    }
                }
            }
            return res ? res : '-';
        }
        return '-';
    }
    render() {
        const fLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const fLayout2 = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
        let tag = this.props.memberTags;
        return (
            <Card bordered={false} bodyStyle={{ padding: '10px' }}>
                <Row className="mt-8">
                    <Col span={12}>
                        <FormItem {...fLayout} label="身份证类型">
                            {this.getTagText(tag.IDCardType, this.euIDCardTypeList)}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...fLayout} label="毕业证">
                            {this.getTagText(tag.Education, this.euEducationList)}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...fLayout} label="听说读写（英文）">
                            {this.getTagText(tag.Characters, this.euCharactersList)}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...fLayout} label="简单算数">
                            {this.getTagText(tag.Math, this.euMathList)}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...fLayout} label="体内异物">
                            {this.getTagText(tag.ForeignBodies, this.euForeignBodiesList)}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...fLayout} label="犯罪记录">
                            {this.getTagText(tag.Criminal, this.euCriminalList)}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...fLayout} label="无尘服">
                            {this.getTagText(tag.Clothes, this.euClothesList)}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...fLayout2} label="纹身">
                            {this.getTagText(tag.Tattoo, this.euTattooList)}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...fLayout2} label="烟疤">
                            {this.getTagText(tag.SmokeScar, this.euSmokeScarList)}
                        </FormItem>
                    </Col>
                </Row>
            </Card>
        );
    }
}
export default BlockTag;