FROM ubuntu
RUN mkdir -p /usr/local/bin && apt update && apt install wget tar -y && \
    wget https://dist.ipfs.tech/kubo/v0.16.0/kubo_v0.16.0_linux-amd64.tar.gz
RUN tar xzvf kubo_v0.16.0_linux-amd64.tar.gz
WORKDIR kubo
RUN bash install.sh ; ipfs init ; \
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]" ; \
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]" ; \
    ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
CMD ["/usr/local/bin/ipfs", "daemon"]

