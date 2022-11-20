<h1 align="center">
<img src="https://avatars.githubusercontent.com/u/118668024?s=200&v=4" width="150">
</h1><br>

NFT platform in Kazakhstan

## Development

Build frontend image  

```
cd frontend ; docker build -f ./docker/Dockerfile  -t nftkz-ft .
```

Build ipfs image

```
cd ipfs ; docker build --platform linux/amd64  -f Dockerfile -t ipfs .
```

Up all containers

```
docker-compose up -d
```
