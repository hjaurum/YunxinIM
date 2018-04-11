# YunxinIM
网易云信IM模块的node.js SDK

## Installation
```
npm install yunxinim
```

## Usage
```javascript
const IM = require('yunxinim');
const im = new IM(appKey,appSecret);
```

### 1. 获取鉴权Header
```javascript
await im.getAuthHeaders({
    nonce: 随机数,// optional
    curTime: 当前时间戳，// optional
})

/** return:
{
            AppKey: this.appKey,
            Nonce: nonce,
            CurTime: `${curTime}`,
            CheckSum: checkSum,
        }
**/
```
### 2. 验证服务器推送过来的消息
```javascript
const isLegal = await im.verifyPushMessage({
    md5: // header中的Md5
    checkSum: // header中
    curTime: // header中
    bodyStr: // 请求体string
})
```