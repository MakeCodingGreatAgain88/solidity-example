// 锁定期
export const LOCK_TIME = 180

// datafeed eth / usd 币对精度
export const DECIMALS = 8

// datafeed eth / usd 币对价格
export const INITIAL_ANSWER = 370000000000

// development 环境
export const DEVELOPMENT_CHAINS = ["hardhat", "localhost"]

// network 环境
export const NETWORK_CONFIG = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
}
