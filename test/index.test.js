/**
 * Created by aurum on 2018/4/10.
 */
const assert = require('assert');
const IM = require('../index');
const im = new IM('key', 'secret');
describe('IM', function () {
    it('获取鉴权header，Ok', async () => {
        const result = im.getAuthHeaders();
        console.log(result);
    });

    it('创建账号,ok', async () => {
        const result = await im.createAccount({accid: 1});
        console.log(result);
    });

    it('更新账号,ok', async () => {
        const result = await im.updateAccount({accid: 1});
    });

    it('刷新token,ok', async () => {
        const result = await im.refreshToken({accid: 1});
        console.log(result);
    });

    it('封禁账号,ok', async () => {
        await im.blockAccount({accid: 1});
    });

    it('刷新token,ok', async () => {
        await im.unblockAccount({accid: 1});
    });

    it('验证推送消息,ok', async () => {
        const result = await im.verifyPushMessage({
            md5: 'd4262973f27df1e4a6438493a20360f4',
            checkSum: 'a59e49497e7b7b0f1b4b8b38ef4d958522542b65',
            curTime: '1523362388617',
            bodyStr: '{"ext":"","msgTimestamp":"1523362388713","msgType":"TEXT","msgidServer":"13608728302","fromAccount":"1","fromClientType":"REST","to":"ceshi","eventType":"1","body":"这是测试消息","convType":"PERSON","msgidClient":"93a28e7d-051e-44bc-b668-37eb87f1b25d","resendFlag":"0"}'
        });
        assert.ok(result);
    });
});