## test

### firstly deploy Tournament Factory on hardhat network

```sh
npm hardhat run srcs/scripts/deploy.ts
```

### run chai tests
```sh
npm hardhat test
```

## deploy smart contract on blochain

### on avalanche testnet
```sh
npm hardhat run srcs/scripts/deploy.ts --network fuji
```

### on avalanche main
```sh
npm hardhat run srcs/scripts/deploy.ts --network avalanche
```

