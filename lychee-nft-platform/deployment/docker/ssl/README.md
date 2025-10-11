# SSL 证书目录

## 开发环境

开发环境可以使用自签名证书：

```bash
# 生成自签名证书
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout key.pem \
  -out cert.pem \
  -subj "/C=CN/ST=Guangdong/L=Guangzhou/O=Lychee NFT/CN=localhost"
```

## 生产环境

生产环境建议使用 Let's Encrypt 证书：

```bash
# 使用 certbot 获取证书
certbot certonly --standalone -d yourdomain.com
```

然后将证书复制到此目录：
- `cert.pem` - SSL 证书
- `key.pem` - 私钥文件

## 注意事项

- 不要将私钥文件提交到版本控制系统
- 定期更新证书（Let's Encrypt 证书有效期为 90 天）
- 确保私钥文件权限设置正确（600）
