/**
 * Created by aurum on 2018/4/10.
 */
const crypto = require('crypto');
const config = require('./config');
const requestPromise = require('request-promise');

class IM {
    constructor(appKey, appSecret, options) {
        if (!appKey || !appSecret) {
            throw new Error('appKey与secret不能为空');
        }

        this.appKey = appKey;
        this.appSecret = appSecret;
    }

    getAuthHeaders({nonce = Math.random().toFixed(15) * Math.pow(10, 15), curTime = Math.floor(Date.now() / 1000)} = {}) {
        const checkSum = crypto.createHash('sha1').update(this.appSecret + nonce + curTime).digest('hex');

        return {
            AppKey: this.appKey,
            Nonce: nonce,
            CurTime: `${curTime}`,
            CheckSum: checkSum,
        };
    }

    /**
     * 验证服务器推送过来的消息
     * @param md5 header的Md5
     * @param checkSum header的Checksum
     * @param curTime header中的Curtime
     * @param bodyStr 服务器推送过来的body
     * @returns {boolean}
     */
    verifyPushMessage({md5, checkSum, curTime, bodyStr}) {
        // verify md5
        const calcMd5 = crypto.createHash('md5').update(bodyStr).digest('hex');
        const calcCheckSum = crypto.createHash('sha1').update(this.appSecret + calcMd5 + curTime).digest('hex');

        return calcMd5 === md5 && calcCheckSum === checkSum;
    }

    /**
     * 创建云信账号
     * @param account {Object} 字段名：（具体见文档）
     *              accid  String  是  网易云通信ID，最大长度32字符，必须保证一个
     *              APP内唯一（只允许字母、数字、半角下划线_、
     *              @、半角点以及半角-组成，不区分大小写，
     *              会统一小写处理，请注意以此接口返回结果中的accid为准）。
     *              name  String  否  网易云通信ID昵称，最大长度64字符，用来PUSH推送
     *              时显示的昵称
     *              props  String  否  json属性，第三方可选填，最大长度1024字符
     *              icon  String  否  网易云通信ID头像URL，第三方可选填，最大长度1024
     *              token  String  否  网易云通信ID可以指定登录token值，最大长度128字符，
     *              并更新，如果未指定，会自动生成token，并在
     *              创建成功后返回
     *              sign  String  否  用户签名，最大长度256字符
     *              email  String  否  用户email，最大长度64字符
     *              birth  String  否  用户生日，最大长度16字符
     *              mobile  String  否  用户mobile，最大长度32字符
     *              gender  int  否  用户性别，0表示未知，1表示男，2女表示女，其它会报参数错误
     *              ex  String  否  用户名片扩展字段，最大长度1024字符，用户可自行扩展，建议封装成JSON字符串
     * @param headers
     * @returns {Promise.<*>}
     *
     * { token: '7e986f16f5ea8b5c3f11c1093021cccd',
     *   accid: '1',
     *   name: '' }
     */
    async createAccount(params, headers = this.getAuthHeaders()) {
        const res = await this._request({uri: config.URL_CREATE_ACCOUNT, params, headers});
        return res.info;
    }

    /**
     * 网易云通信ID基本信息更新
     * @param params
     *      accid  String  是  网易云通信ID，最大长度32字符，必须保证一个
     *      APP内唯一
     *      props  String  否  json属性，第三方可选填，最大长度1024字符
     *      token  String  否  网易云通信ID可以指定登录token值，最大长度128字符
     * @param headers
     * @returns {Promise.<void>}
     */
    async updateAccount(params, headers = this.getAuthHeaders()) {
        await this._request({uri: config.URL_UPDATE_ACCOUNT, params, headers});
    }

    /**
     * 刷新token
     * @param params
     *          accid  String  是  网易云通信ID，最大长度32字符，必须保证一个APP内唯一
     * @param headers
     * @returns {Promise.<*>}
     * { token: '78dcd31a0351a708f7d06169bd221601', accid: '1' }
     */
    async refreshToken(params, headers = this.getAuthHeaders()) {
        const res = await this._request({uri: config.URL_REFRESH_TOKEN, params, headers});
        return res.info;
    }

    /**
     * 封禁账号
     * @param params
     *          accid  String  是  网易云通信ID，最大长度32字符，必须保证一个APP内唯一
     *          needkick  String  否  是否踢掉被禁用户，true或false，默认false
     * @param headers
     * @returns {Promise.<void>}
     */
    async blockAccount(params, headers = this.getAuthHeaders()) {
        await this._request({uri: config.URL_BLOCK_ACCOUNT, params, headers});
    }

    /**
     * 解封账号
     * @param params
     *              accid  String  是  网易云通信ID，最大长度32字符，必须保证一个APP内唯一
     * @param headers
     * @returns {Promise.<void>}
     */
    async unblockAccount(params, headers = this.getAuthHeaders()) {
        await this._request({uri: config.URL_UNBLOCK_ACCOUNT, params, headers});
    }

    async _request({uri, params, headers}) {
        const res = await requestPromise.post({
            uri,
            headers,
            form: params,
            json: true
        });

        this._checkError(res);

        return res;
    }

    _checkError(resJson) {
        if (resJson.code !== 200) {
            const err = new Error(`code:${resJson.code}- ${resJson.desc}`);
            err.code = resJson.code;
            throw err;
        }
    }
}

module.exports = IM;